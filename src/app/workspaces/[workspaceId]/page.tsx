import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { WorkspaceSwitcher } from "@/features/workspaces/components/workspace-switcher";
import { getUserWorkspaces } from "@/features/workspaces/services/get-user-workspaces";
import { prisma } from "@/lib/prisma";

type WorkspacePageProps = {
  params: Promise<{
    workspaceId: string;
  }>;
};

export default async function WorkspacePage({
  params,
}: WorkspacePageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { workspaceId } = await params;

  const [workspace, memberships] = await Promise.all([
    prisma.workspace.findFirst({
      where: {
        id: workspaceId,

        members: {
          some: {
            userId: session.user.id,
          },
        },
      },

      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        createdAt: true,

        members: {
          where: {
            userId: session.user.id,
          },
          select: {
            role: true,
          },
          take: 1,
        },

        projects: {
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,

            _count: {
              select: {
                tasks: true,
              },
            },
          },
        },

        _count: {
          select: {
            members: true,
            projects: true,
          },
        },
      },
    }),

    getUserWorkspaces({
      userId: session.user.id,
    }),
  ]);

  if (!workspace) {
    notFound();
  }

  const currentMembership = workspace.members[0];

  if (!currentMembership) {
    notFound();
  }

  const switcherWorkspaces = memberships.map(
    ({ workspace: item }) => ({
      id: item.id,
      name: item.name,
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
              {workspace.name}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <WorkspaceSwitcher
              workspaces={switcherWorkspaces}
              activeWorkspaceId={workspace.id}
            />

            <span className="rounded-full border border-blue-900 bg-blue-950/50 px-3 py-1 text-xs font-semibold text-blue-300">
              {currentMembership.role}
            </span>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
              Workspace
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              {workspace.name}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {workspace.slug}
            </p>

            <p className="mt-4 max-w-2xl text-slate-400">
              {workspace.description ??
                "This workspace does not have a description yet."}
            </p>
          </div>

          <Link
            href={`/workspaces/${workspace.id}/projects/new`}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500"
          >
            Create project
          </Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              Your role
            </p>

            <p className="mt-2 text-2xl font-bold">
              {currentMembership.role}
            </p>
          </article>

          <article className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              Projects
            </p>

            <p className="mt-2 text-2xl font-bold">
              {workspace._count.projects}
            </p>
          </article>

          <article className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              Members
            </p>

            <p className="mt-2 text-2xl font-bold">
              {workspace._count.members}
            </p>
          </article>
        </div>

        {workspace.projects.length === 0 ? (
          <section className="mt-8 rounded-xl border border-dashed border-slate-700 bg-slate-900/40 px-6 py-12 text-center">
            <h2 className="text-lg font-semibold">
              No projects yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
              Create your first project to start organizing tasks.
            </p>

            <Link
              href={`/workspaces/${workspace.id}/projects/new`}
              className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500"
            >
              Create project
            </Link>
          </section>
        ) : (
          <section className="mt-10">
            <h2 className="text-xl font-bold">
              Projects
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {workspace.projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/workspaces/${workspace.id}/projects/${project.id}`}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-6 transition hover:border-slate-700"
                >

                    <h3 className="font-semibold">
                      {project.name}
                    </h3>

                  <p className="mt-3 line-clamp-2 text-sm text-slate-400">
                    {project.description ??
                      "No project description."}
                  </p>

                  <p className="mt-5 text-sm text-slate-500">
                    {project._count.tasks} tasks
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}