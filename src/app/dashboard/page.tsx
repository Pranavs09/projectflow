import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { logoutAction } from "@/features/auth/actions/auth-actions";
import { WorkspaceSwitcher } from "@/features/workspaces/components/workspace-switcher";
import { getUserWorkspaces } from "@/features/workspaces/services/get-user-workspaces";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const memberships = await getUserWorkspaces({
    userId: session.user.id,
  });

  const totalProjects = memberships.reduce(
    (total, membership) =>
      total + membership.workspace._count.projects,
    0,
  );

  const totalMembers = memberships.reduce(
    (total, membership) =>
      total + membership.workspace._count.members,
    0,
  );

  const switcherWorkspaces = memberships.map(
    ({ workspace }) => ({
      id: workspace.id,
      name: workspace.name,
    }),
  );

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-900/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <div>
            <Link
              href="/dashboard"
              className="text-lg font-bold"
            >
              ProjectFlow
            </Link>

            <p className="text-sm text-slate-400">
              Workspace dashboard
            </p>
          </div>

          <div className="flex items-center gap-4">
            <WorkspaceSwitcher
              workspaces={switcherWorkspaces}
            />

            <div className="hidden text-right md:block">
              <p className="text-sm font-medium">
                {session.user.name ?? "ProjectFlow user"}
              </p>

              <p className="text-xs text-slate-400">
                {session.user.email}
              </p>
            </div>

            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold transition hover:bg-slate-800"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
              Dashboard
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Welcome, {session.user.name ?? "there"}
            </h1>

            <p className="mt-2 text-slate-400">
              Manage your workspaces, projects, and tasks.
            </p>
          </div>

          <Link
            href="/workspaces/new"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500"
          >
            Create workspace
          </Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              Workspaces
            </p>

            <p className="mt-2 text-3xl font-bold">
              {memberships.length}
            </p>
          </article>

          <article className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              Projects
            </p>

            <p className="mt-2 text-3xl font-bold">
              {totalProjects}
            </p>
          </article>

          <article className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              Workspace memberships
            </p>

            <p className="mt-2 text-3xl font-bold">
              {totalMembers}
            </p>
          </article>
        </div>

        {memberships.length === 0 ? (
          <EmptyWorkspaceState />
        ) : (
          <WorkspaceList memberships={memberships} />
        )}
      </section>
    </main>
  );
}

function EmptyWorkspaceState() {
  return (
    <section className="mt-8 rounded-xl border border-dashed border-slate-700 bg-slate-900/40 px-6 py-12 text-center">
      <h2 className="text-lg font-semibold">
        Create your first workspace
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
        Workspaces keep projects, tasks, and members isolated
        from other organizations.
      </p>

      <Link
        href="/workspaces/new"
        className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500"
      >
        Create workspace
      </Link>
    </section>
  );
}

type WorkspaceListProps = {
  memberships: Awaited<
    ReturnType<typeof getUserWorkspaces>
  >;
};

function WorkspaceList({
  memberships,
}: WorkspaceListProps) {
  return (
    <section className="mt-10">
      <div className="mb-5">
        <h2 className="text-xl font-bold">
          Your workspaces
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Select a workspace to manage its projects and members.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {memberships.map(
          ({ workspace, role }) => (
            <Link
              key={workspace.id}
              href={`/workspaces/${workspace.id}`}
              className="group rounded-xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-900/80"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold group-hover:text-blue-300">
                    {workspace.name}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {workspace.slug}
                  </p>
                </div>

                <span className="rounded-full border border-blue-900 bg-blue-950/50 px-3 py-1 text-xs font-semibold text-blue-300">
                  {role}
                </span>
              </div>

              <p className="mt-4 line-clamp-2 min-h-12 text-sm leading-6 text-slate-400">
                {workspace.description ??
                  "No workspace description provided."}
              </p>

              <div className="mt-6 flex gap-5 border-t border-slate-800 pt-4 text-sm">
                <div>
                  <span className="font-semibold text-white">
                    {workspace._count.projects}
                  </span>{" "}
                  <span className="text-slate-400">
                    projects
                  </span>
                </div>

                <div>
                  <span className="font-semibold text-white">
                    {workspace._count.members}
                  </span>{" "}
                  <span className="text-slate-400">
                    members
                  </span>
                </div>
              </div>
            </Link>
          ),
        )}
      </div>
    </section>
  );
}