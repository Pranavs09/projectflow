import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { CreateTaskForm } from "@/features/tasks/components/create-task-form";
import { prisma } from "@/lib/prisma";

type NewTaskPageProps = {
  params: Promise<{
    workspaceId: string;
    projectId: string;
  }>;
};

export default async function NewTaskPage({
  params,
}: NewTaskPageProps) {
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
      workspaceId: true,

      workspace: {
        select: {
          name: true,

          members: {
            select: {
              userId: true,

              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  const members = project.workspace.members.map((member) => ({
    userId: member.userId,
    name: member.user.name,
    email: member.user.email,
  }));

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-2xl">
        <Link
          href={`/workspaces/${workspaceId}/projects/${projectId}`}
          className="text-sm text-slate-400 transition hover:text-white"
        >
          ← Back to {project.name}
        </Link>

        <div className="mt-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            New task
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Create a task
          </h1>

          <p className="mt-3 text-slate-400">
            Add work to {project.name} and assign it to a workspace member.
          </p>
        </div>

        <section className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
          <CreateTaskForm
            workspaceId={workspaceId}
            projectId={projectId}
            members={members}
          />
        </section>
      </div>
    </main>
  );
}