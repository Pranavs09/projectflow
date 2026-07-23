"use client";

import { useFormStatus } from "react-dom";

export function CreateWorkspaceButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Creating workspace..." : "Create workspace"}
    </button>
  );
}