"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type WorkspaceSwitcherItem = {
  id: string;
  name: string;
};

type WorkspaceSwitcherProps = {
  workspaces: WorkspaceSwitcherItem[];
  activeWorkspaceId?: string;
};

export function WorkspaceSwitcher({
  workspaces,
  activeWorkspaceId,
}: WorkspaceSwitcherProps) {
  const router = useRouter();

  const initialWorkspaceId =
    activeWorkspaceId ?? workspaces[0]?.id ?? "";

  const [selectedWorkspaceId, setSelectedWorkspaceId] =
    useState(initialWorkspaceId);

  function handleWorkspaceChange(
    event: React.ChangeEvent<HTMLSelectElement>,
  ) {
    const workspaceId = event.target.value;

    setSelectedWorkspaceId(workspaceId);

    if (workspaceId) {
      router.push(`/workspaces/${workspaceId}`);
    }
  }

  if (workspaces.length === 0) {
    return null;
  }

  return (
    <div>
      <label
        htmlFor="workspace-switcher"
        className="sr-only"
      >
        Select workspace
      </label>

      <select
        id="workspace-switcher"
        value={selectedWorkspaceId}
        onChange={handleWorkspaceChange}
        className="min-w-48 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-medium text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      >
        {workspaces.map((workspace) => (
          <option
            key={workspace.id}
            value={workspace.id}
          >
            {workspace.name}
          </option>
        ))}
      </select>
    </div>
  );
}