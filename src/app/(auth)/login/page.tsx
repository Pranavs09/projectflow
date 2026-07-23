import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Log in",
};

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl shadow-black/20 sm:p-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
          Welcome back
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight">
          Log in to ProjectFlow
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Enter your credentials to continue to your workspace.
        </p>
      </div>

      <LoginForm />
    </section>
  );
}