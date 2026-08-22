"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type ReorderTask = {
  id: string;
  position: number;
};

type ReorderTasksInput = {
  tasks: ReorderTask[];
};

export async function reorderTasks({
  tasks,
}: ReorderTasksInput) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      error: "You must be logged in.",
    };
  }

  if (tasks.length === 0) {
    return {
      success: true,
    };
  }

  // Verify that every task being changed belongs to
  // a workspace the current user can access.
  const accessibleTasks = await prisma.task.findMany({
    where: {
      id: {
        in: tasks.map((task) => task.id),
      },

      project: {
        workspace: {
          members: {
            some: {
              userId: session.user.id,
            },
          },
        },
      },
    },

    select: {
      id: true,
    },
  });

  if (accessibleTasks.length !== tasks.length) {
    return {
      success: false,
      error: "You do not have access to one or more tasks.",
    };
  }

  await prisma.$transaction(
    tasks.map((task) =>
      prisma.task.update({
        where: {
          id: task.id,
        },

        data: {
          position: task.position,
        },
      }),
    ),
  );

  return {
    success: true,
  };
}