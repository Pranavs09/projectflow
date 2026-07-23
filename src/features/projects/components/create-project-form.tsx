"use client";

import { useActionState } from "react";

import {
  createProjectAction,
  type CreateProjectActionState,
} from "@/features/projects/actions/project-actions";

type CreateProjectFormProps = {
  workspaceId: string;
};

const initialState: CreateProjectActionState = {
  success: false,
};

export function CreateProjectForm({
  workspaceId,
}: CreateProjectFormProps) {
  const [state, formAction, isPending] = useActionState(
    createProjectAction,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="space-y-6"
    >
      <input
        type="hidden"
        name="workspaceId"
        value={workspaceId}
      />

      {state.error ? (
        <div
          role="alert"
          className="rounded-lg border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300"
        >
          {state.error}
        </div>
      ) : null}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-slate-200"
        >
          Project name
        </label>

        <input
          id="name"
          name="name"
          type="text"
          required
          minLength={3}
          maxLength={100}
          autoComplete="off"
          placeholder="Website redesign"
          aria-invalid={
            state.fieldErrors?.name ? true : undefined
          }
          aria-describedby={
            state.fieldErrors?.name
              ? "project-name-error"
              : undefined
          }
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />

        {state.fieldErrors?.name ? (
          <p
            id="project-name-error"
            className="mt-2 text-sm text-red-400"
          >
            {state.fieldErrors.name[0]}
          </p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-slate-200"
        >
          Description
        </label>

        <textarea
          id="description"
          name="description"
          rows={5}
          maxLength={500}
          placeholder="Describe the purpose of this project."
          aria-invalid={
            state.fieldErrors?.description ? true : undefined
          }
          aria-describedby={
            state.fieldErrors?.description
              ? "project-description-error"
              : undefined
          }
          className="mt-2 w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />

        {state.fieldErrors?.description ? (
          <p
            id="project-description-error"
            className="mt-2 text-sm text-red-400"
          >
            {state.fieldErrors.description[0]}
          </p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="color"
          className="block text-sm font-medium text-slate-200"
        >
          Project color
        </label>

        <div className="mt-2 flex items-center gap-4">
          <input
            id="color"
            name="color"
            type="color"
            defaultValue="#2563EB"
            aria-invalid={
              state.fieldErrors?.color ? true : undefined
            }
            aria-describedby={
              state.fieldErrors?.color
                ? "project-color-error"
                : undefined
            }
            className="h-12 w-20 cursor-pointer rounded-lg border border-slate-700 bg-slate-950 p-1"
          />

          <p className="text-sm text-slate-400">
            Used to identify the project across the workspace.
          </p>
        </div>

        {state.fieldErrors?.color ? (
          <p
            id="project-color-error"
            className="mt-2 text-sm text-red-400"
          >
            {state.fieldErrors.color[0]}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Creating project..." : "Create project"}
      </button>
    </form>
  );
}