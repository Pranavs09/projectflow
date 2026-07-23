"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  loginAction,
  type AuthActionState,
} from "@/features/auth/actions/auth-actions";
import { SubmitButton } from "@/features/auth/components/submit-button";

const initialState: AuthActionState = {
  success: false,
};

export function LoginForm() {
  const [state, formAction] = useActionState(
    loginAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-slate-200"
        >
          Email address
        </label>

        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={Boolean(state.fieldErrors?.email)}
          aria-describedby={
            state.fieldErrors?.email ? "login-email-error" : undefined
          }
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          placeholder="you@example.com"
        />

        {state.fieldErrors?.email && (
          <p
            id="login-email-error"
            className="mt-2 text-sm text-red-400"
          >
            {state.fieldErrors.email[0]}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-slate-200"
        >
          Password
        </label>

        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={Boolean(state.fieldErrors?.password)}
          aria-describedby={
            state.fieldErrors?.password
              ? "login-password-error"
              : undefined
          }
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          placeholder="Your password"
        />

        {state.fieldErrors?.password && (
          <p
            id="login-password-error"
            className="mt-2 text-sm text-red-400"
          >
            {state.fieldErrors.password[0]}
          </p>
        )}
      </div>

      {state.message && (
        <div
          role="alert"
          className="rounded-lg border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-300"
        >
          {state.message}
        </div>
      )}

      <SubmitButton idleText="Log in" pendingText="Logging in..." />

      <p className="text-center text-sm text-slate-400">
        Need an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-blue-400 hover:text-blue-300"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}