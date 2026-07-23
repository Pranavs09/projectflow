import Link from "next/link";
import type { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({
  children,
}: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-md">
        <Link
          href="/"
          className="mb-10 inline-block text-xl font-bold tracking-tight text-white"
        >
          ProjectFlow
        </Link>

        {children}
      </div>
    </main>
  );
}