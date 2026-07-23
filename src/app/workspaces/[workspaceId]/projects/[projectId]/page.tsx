import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type ProjectPageProps = {
  params: Promise<{
    workspaceId: string;
    projectId: string;
  }>;
};

export default async function ProjectPage({
  params,
}: ProjectPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { workspaceId, projectId } = await params;

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      workspaceId,

      workspace: {
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
    },

    select: {
      id: true,
      name: true,
      description: true,
      color: true,
      workspaceId: true,
      createdAt: true,

      workspace: {
        select: {
          name: true,
        },
      },

      _count: {
        select: {
          tasks: true,
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-900/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <Link
              href={`/workspaces/${project.workspaceId}`}
              className="text-sm text-slate-400 transition hover:text-white"
            >
              ← Back to {project.workspace.name}
            </Link>
          </div>

          <Link
            href={`/workspaces/${project.workspaceId}/projects/${project.id}/tasks/new`}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold transition hover:bg-blue-500"
          >
            Create task
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex items-start gap-4">
          <div
            className="mt-2 h-5 w-5 shrink-0 rounded-full"
            style={{
              backgroundColor: project.color,
            }}
          />

          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
              Project
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              {project.name}
            </h1>

            <p className="mt-3 max-w-2xl text-slate-400">
              {project.description ??
                "This project does not have a description yet."}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              Tasks
            </p>

            <p className="mt-2 text-3xl font-bold">
              {project._count.tasks}
            </p>
          </article>

          <article className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              Created
            </p>

            <p className="mt-2 text-lg font-semibold">
              {project.createdAt.toLocaleDateString()}
            </p>
          </article>
        </div>

        <section className="mt-8 rounded-xl border border-dashed border-slate-700 bg-slate-900/40 px-6 py-12 text-center">
          <h2 className="text-lg font-semibold">
            No tasks yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
            Create the first task to begin tracking work for this project.
          </p>
        </section>
      </section>
    </main>
  );
}