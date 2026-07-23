import { prisma } from "@/lib/prisma";
import {
  createWorkspaceSchema,
  type CreateWorkspaceInput,
} from "@/lib/validations/workspace";

type CreateWorkspaceResult =
  | {
      success: true;
      workspace: {
        id: string;
        name: string;
        description: string | null;
      };
    }
  | {
      success: false;
      error: string;
      fieldErrors?: {
        name?: string[];
        description?: string[];
      };
    };

type CreateWorkspaceOptions = {
  userId: string;
  input: CreateWorkspaceInput;
};

export async function createWorkspace({
  userId,
  input,
}: CreateWorkspaceOptions): Promise<CreateWorkspaceResult> {
  const validationResult = createWorkspaceSchema.safeParse(input);

  if (!validationResult.success) {
    return {
      success: false,
      error: "Please correct the highlighted fields.",
      fieldErrors:
        validationResult.error.flatten().fieldErrors,
    };
  }

  const { name, description } = validationResult.data;

  const workspace = await prisma.workspace.create({
    data: {
      name,
      description: description || null,
      slug: name.toLowerCase().replace(/\s+/g, "-"),

      members: {
        create: {
          userId,
          role: "OWNER",
        },
      },
    },

    select: {
      id: true,
      name: true,
      description: true,
    },
  });

  return {
    success: true,
    workspace,
  };
}