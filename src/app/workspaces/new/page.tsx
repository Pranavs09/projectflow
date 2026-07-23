import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { CreateWorkspaceForm } from "@/features/workspaces/components/create-workspace-form";

export const metadata: Metadata = {
  title: "Create workspace",
};

export default async function NewWorkspacePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-xl">
        <Link
          href="/dashboard"
          className="mb-8 inline-flex text-sm font-medium text-slate-400 transition hover:text-white"
        >
          ← Back to dashboard
        </Link>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl shadow-black/20 sm:p-8">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
              New workspace
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight">
              Create a workspace
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              A workspace contains your members, projects, tasks,
              and activity history.
            </p>
          </div>

          <CreateWorkspaceForm />
        </section>
      </div>
    </main>
  );
}