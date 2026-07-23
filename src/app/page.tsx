import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <section className="mx-auto max-w-3xl text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-400">
          ProjectFlow
        </p>

        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Organize projects without losing sight of the work.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          Plan projects, assign tasks, collaborate with your team, and track
          progress from one organized workspace.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/register"
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500"
          >
            Start for free
          </Link>

          <Link
            href="/login"
            className="rounded-lg border border-slate-700 px-6 py-3 font-semibold transition hover:bg-slate-800"
          >
            Log in
          </Link>
        </div>
      </section>
    </main>
  );
}