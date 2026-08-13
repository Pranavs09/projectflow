"use server";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { createTask } from "@/features/tasks/services/create-task";

export type CreateTaskActionState = {
  success: boolean;
  error?: string;
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

export async function createTaskAction(
  _previousState: CreateTaskActionState,
  formData: FormData,
): Promise<CreateTaskActionState> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      error: "You must be logged in to create a task.",
    };
  }

  const workspaceId = String(
    formData.get("workspaceId") ?? "",
  );

  const projectId = String(
    formData.get("projectId") ?? "",
  );

  const result = await createTask({
    userId: session.user.id,

    input: {
      projectId,
      title: String(formData.get("title") ?? ""),
      description: String(
        formData.get("description") ?? "",
      ),
      status: String(
        formData.get("status") ?? "TODO",
      ) as "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE",
      priority: String(
        formData.get("priority") ?? "MEDIUM",
      ) as "LOW" | "MEDIUM" | "HIGH" | "URGENT",
      assigneeId: String(
        formData.get("assigneeId") ?? "",
      ),
      dueDate: String(
        formData.get("dueDate") ?? "",
      ),
    },
  });

  if (!result.success) {
    return result;
  }

  redirect(
    `/workspaces/${workspaceId}/projects/${projectId}`,
  );
}