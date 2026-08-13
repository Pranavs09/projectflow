"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type TaskStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "IN_REVIEW"
  | "DONE";

type UpdateTaskStatusInput = {
  taskId: string;
  status: TaskStatus;
};

export async function updateTaskStatus({
  taskId,
  status,
}: UpdateTaskStatusInput) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      error: "You must be logged in.",
    };
  }

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,

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

  if (!task) {
    return {
      success: false,
      error: "Task not found or access denied.",
    };
  }

  await prisma.task.update({
    where: {
      id: taskId,
    },

    data: {
      status,
    },
  });

  return {
    success: true,
  };
}