"use client";

import { useActionState } from "react";

import {
  createTaskAction,
  type CreateTaskActionState,
} from "@/features/tasks/actions/task-actions";

type WorkspaceMemberOption = {
  userId: string;
  name: string;
  email: string;
};

type CreateTaskFormProps = {
  workspaceId: string;
  projectId: string;
  members: WorkspaceMemberOption[];
};

const initialState: CreateTaskActionState = {
  success: false,
};

export function CreateTaskForm({
  workspaceId,
  projectId,
  members,
}: CreateTaskFormProps) {
  const [state, formAction, isPending] = useActionState(
    createTaskAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <input
        type="hidden"
        name="workspaceId"
        value={workspaceId}
      />

      <input
        type="hidden"
        name="projectId"
        value={projectId}
      />

      {state.error && (
        <div
          role="alert"
          className="rounded-lg border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300"
        >
          {state.error}
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-slate-200"
        >
          Task title
        </label>

        <input
          id="title"
          name="title"
          type="text"
          required
          minLength={2}
          maxLength={120}
          placeholder="Build login form"
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
        />

        {state.fieldErrors?.title && (
          <p className="mt-2 text-sm text-red-400">
            {state.fieldErrors.title[0]}
          </p>
        )}
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
          maxLength={1000}
          placeholder="Describe what needs to be done."
          className="mt-2 w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
        />

        {state.fieldErrors?.description && (
          <p className="mt-2 text-sm text-red-400">
            {state.fieldErrors.description[0]}
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-slate-200"
          >
            Status
          </label>

          <select
            id="status"
            name="status"
            defaultValue="TODO"
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          >
            <option value="TODO">To do</option>
            <option value="IN_PROGRESS">In progress</option>
            <option value="IN_REVIEW">In review</option>
            <option value="DONE">Done</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="priority"
            className="block text-sm font-medium text-slate-200"
          >
            Priority
          </label>

          <select
            id="priority"
            name="priority"
            defaultValue="MEDIUM"
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="assigneeId"
          className="block text-sm font-medium text-slate-200"
        >
          Assignee
        </label>

        <select
          id="assigneeId"
          name="assigneeId"
          defaultValue=""
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white"
        >
          <option value="">Unassigned</option>

          {members.map((member) => (
            <option
              key={member.userId}
              value={member.userId}
            >
              {member.name} ({member.email})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="dueDate"
          className="block text-sm font-medium text-slate-200"
        >
          Due date
        </label>

        <input
          id="dueDate"
          name="dueDate"
          type="date"
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Creating task..." : "Create task"}
      </button>
    </form>
  );
}