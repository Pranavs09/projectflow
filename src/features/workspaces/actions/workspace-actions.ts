"use server";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { createWorkspace } from "@/features/workspaces/services/create-workspace";
import { createWorkspaceSchema } from "@/lib/validations/workspace";

export type CreateWorkspaceActionState = {
  success: boolean;
  message?: string;
  fieldErrors?: {
    name?: string[];
    description?: string[];
  };
};

export async function createWorkspaceAction(
  _previousState: CreateWorkspaceActionState,
  formData: FormData,
): Promise<CreateWorkspaceActionState> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "You must be logged in to create a workspace.",
    };
  }

  const validationResult = createWorkspaceSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!validationResult.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      fieldErrors:
        validationResult.error.flatten().fieldErrors,
    };
  }

  const result = await createWorkspace({
    userId: session.user.id,
    input: validationResult.data,
  });

  if (!result.success) {
    return {
      success: false,
      message: result.error,
      fieldErrors: result.fieldErrors,
    };
  }

  redirect(`/workspaces/${result.workspace.id}`);
}