import { prisma } from "@/lib/prisma";
import {
  createTaskSchema,
  type CreateTaskInput,
} from "@/lib/validations/task";

type CreateTaskOptions = {
  userId: string;
  input: CreateTaskInput;
};

type CreateTaskResult =
  | {
      success: true;
      task: {
        id: string;
        title: string;
        description: string | null;
        status: string;
        priority: string;
        projectId: string;
        assigneeId: string | null;
        dueDate: Date | null;
      };
    }
  | {
      success: false;
      error: string;
      fieldErrors?: {
        projectId?: string[];
        title?: string[];
        description?: string[];
        status?: string[];
        priority?: string[];
        assigneeId?: string[];
        dueDate?: string[];
      };
    };

export async function createTask({
  userId,
  input,
}: CreateTaskOptions): Promise<CreateTaskResult> {
  const validationResult = createTaskSchema.safeParse(input);

  if (!validationResult.success) {
    return {
      success: false,
      error: "Please correct the highlighted fields.",
      fieldErrors: validationResult.error.flatten().fieldErrors,
    };
  }

  const {
    projectId,
    title,
    description,
    status,
    priority,
    assigneeId,
    dueDate,
  } = validationResult.data;

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,

      workspace: {
        members: {
          some: {
            userId,
          },
        },
      },
    },

    select: {
      id: true,
      workspaceId: true,
    },
  });

  if (!project) {
    return {
      success: false,
      error: "You do not have access to this project.",
    };
  }

  let validAssigneeId: string | null = null;

  if (assigneeId) {
    const membership = await prisma.workspaceMember.findFirst({
      where: {
        userId: assigneeId,
        workspaceId: project.workspaceId,
      },

      select: {
        id: true,
      },
    });

    if (!membership) {
      return {
        success: false,
        error: "The selected assignee is not a member of this workspace.",
      };
    }

    validAssigneeId = assigneeId;
  }

  const task = await prisma.task.create({
    data: {
      title,
      description: description || null,
      status,
      priority,
      projectId,
      creatorId: userId,
      assigneeId: validAssigneeId,
      dueDate: dueDate ? new Date(dueDate) : null,
    },

    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      priority: true,
      projectId: true,
      assigneeId: true,
      dueDate: true,
    },
  });

  return {
    success: true,
    task,
  };
}