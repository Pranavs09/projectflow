"use server";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { createProject } from "@/features/projects/services/create-project";

export type CreateProjectActionState = {
  success: boolean;
  error?: string;
  fieldErrors?: {
    workspaceId?: string[];
    name?: string[];
    description?: string[];
    color?: string[];
  };
};

export async function createProjectAction(
  previousState: CreateProjectActionState,
  formData: FormData,
): Promise<CreateProjectActionState> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      error: "You must be logged in to create a project.",
    };
  }

  const result = await createProject({
    userId: session.user.id,

    input: {
      workspaceId: String(
        formData.get("workspaceId") ?? "",
      ),

      name: String(formData.get("name") ?? ""),

      description: String(
        formData.get("description") ?? "",
      ),

      color: String(
        formData.get("color") ?? "#2563EB",
      ),
    },
  });

  if (!result.success) {
    return result;
  }

  redirect(
    `/workspaces/${result.project.workspaceId}/projects/${result.project.id}`,
  );
}