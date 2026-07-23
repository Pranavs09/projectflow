import Link from "next/link";

type NewTaskPageProps = {
  params: Promise<{
    workspaceId: string;
    projectId: string;
  }>;
};

export default async function NewTaskPage({
  params,
}: NewTaskPageProps) {
  const { workspaceId, projectId } = await params;

  return (
    <main className="min-h-screen bg-slate-950 p-10 text-white">
      <Link
        href={`/workspaces/${workspaceId}/projects/${projectId}`}
        className="text-sm text-slate-400 hover:text-white"
      >
        ← Back to project
      </Link>

      <h1 className="mt-10 text-3xl font-bold">
        Create task
      </h1>

      <p className="mt-3 text-slate-400">
        The task form will be implemented in the next milestone.
      </p>
    </main>
  );
}