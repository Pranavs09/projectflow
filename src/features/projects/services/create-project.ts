import { prisma } from "@/lib/prisma";
import {
  createProjectSchema,
  type CreateProjectInput,
} from "@/lib/validations/project";

type CreateProjectOptions = {
  userId: string;
  input: CreateProjectInput;
};

type CreateProjectResult =
  | {
      success: true;
      project: {
        id: string;
        name: string;
        description: string | null;
        color: string;
        workspaceId: string;
      };
    }
  | {
      success: false;
      error: string;
      fieldErrors?: {
        workspaceId?: string[];
        name?: string[];
        description?: string[];
        color?: string[];
      };
    };

export async function createProject({
  userId,
  input,
}: CreateProjectOptions): Promise<CreateProjectResult> {
  const validationResult = createProjectSchema.safeParse(input);

  if (!validationResult.success) {
    return {
      success: false,
      error: "Please correct the highlighted fields.",
      fieldErrors: validationResult.error.flatten().fieldErrors,
    };
  }

  const {
    workspaceId,
    name,
    description,
    color,
  } = validationResult.data;

  const membership = await prisma.workspaceMember.findFirst({
    where: {
      userId,
      workspaceId,
    },

    select: {
      id: true,
      role: true,
    },
  });

  if (!membership) {
    return {
      success: false,
      error: "You do not have access to this workspace.",
    };
  }

  const project = await prisma.project.create({
    data: {
      workspaceId,
      name,
      description: description || null,
      color,
    },

    select: {
      id: true,
      name: true,
      description: true,
      color: true,
      workspaceId: true,
    },
  });

  return {
    success: true,
    project,
  };
}