"use client";

import { useActionState } from "react";

import {
  createWorkspaceAction,
  type CreateWorkspaceActionState,
} from "@/features/workspaces/actions/workspace-actions";
import { CreateWorkspaceButton } from "@/features/workspaces/components/create-workspace-button";

const initialState: CreateWorkspaceActionState = {
  success: false,
};

export function CreateWorkspaceForm() {
  const [state, formAction] = useActionState(
    createWorkspaceAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-medium text-slate-200"
        >
          Workspace name
        </label>

        <input
          id="name"
          name="name"
          type="text"
          required
          minLength={2}
          maxLength={60}
          placeholder="Acme Engineering"
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
        />

        {state.fieldErrors?.name && (
          <p className="mt-2 text-sm text-red-400">
            {state.fieldErrors.name[0]}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-2 block text-sm font-medium text-slate-200"
        >
          Description
        </label>

        <textarea
          id="description"
          name="description"
          rows={4}
          maxLength={300}
          placeholder="A shared workspace for our engineering projects."
          className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
        />

        {state.fieldErrors?.description && (
          <p className="mt-2 text-sm text-red-400">
            {state.fieldErrors.description[0]}
          </p>
        )}
      </div>

      {state.message && (
        <div className="rounded-lg border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {state.message}
        </div>
      )}

      <CreateWorkspaceButton />
    </form>
  );
}