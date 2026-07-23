import {createWorkspaceSlug} from "@/app/workspaces/utils/create-workspace-slug";
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
        slug: string;
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
      fieldErrors: validationResult.error.flatten().fieldErrors,
    };
  }

  const { name, description } = validationResult.data;
  const slug = createWorkspaceSlug(name);

  const workspace = await prisma.workspace.create({
    data: {
      name,
      slug,
      description: description || null,

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
      slug: true,
      description: true,
    },
  });

  return {
    success: true,
    workspace,
  };
}