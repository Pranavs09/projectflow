import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { CreateProjectForm } from "@/features/projects/components/create-project-form";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Create Project",
};

type NewProjectPageProps = {
  params: Promise<{
    workspaceId: string;
  }>;
};

export default async function NewProjectPage({
  params,
}: NewProjectPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { workspaceId } = await params;

  const workspace = await prisma.workspace.findFirst({
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
    },
  });

  if (!workspace) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-2xl">
        <Link
          href={`/workspaces/${workspace.id}`}
          className="text-sm text-slate-400 transition hover:text-white"
        >
          ← Back to {workspace.name}
        </Link>

        <div className="mt-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            New project
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Create a project
          </h1>

          <p className="mt-3 text-slate-400">
            Projects organize related tasks, deadlines, and team activity.
          </p>
        </div>

        <section className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
          <CreateProjectForm
            workspaceId={workspace.id}
          />
        </section>
      </div>
    </main>
  );
}