"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  registerAction,
  type AuthActionState,
} from "@/features/auth/actions/auth-actions";
import { SubmitButton } from "@/features/auth/components/submit-button";

const initialState: AuthActionState = {
  success: false,
};

export function RegisterForm() {
  const [state, formAction] = useActionState(
    registerAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-medium text-slate-200"
        >
          Full name
        </label>

        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          minLength={2}
          maxLength={50}
          aria-invalid={Boolean(state.fieldErrors?.name)}
          aria-describedby={
            state.fieldErrors?.name ? "name-error" : undefined
          }
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          placeholder="Demo User"
        />

        {state.fieldErrors?.name && (
          <p id="name-error" className="mt-2 text-sm text-red-400">
            {state.fieldErrors.name[0]}
          </p>
        )}
      </div>

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
            state.fieldErrors?.email ? "register-email-error" : undefined
          }
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          placeholder="you@example.com"
        />

        {state.fieldErrors?.email && (
          <p
            id="register-email-error"
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
          autoComplete="new-password"
          required
          minLength={8}
          maxLength={72}
          aria-invalid={Boolean(state.fieldErrors?.password)}
          aria-describedby={
            state.fieldErrors?.password
              ? "register-password-error"
              : "password-help"
          }
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          placeholder="At least 8 characters"
        />

        {state.fieldErrors?.password ? (
          <p
            id="register-password-error"
            className="mt-2 text-sm text-red-400"
          >
            {state.fieldErrors.password[0]}
          </p>
        ) : (
          <p id="password-help" className="mt-2 text-sm text-slate-400">
            Use uppercase, lowercase, and at least one number.
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

      <SubmitButton
        idleText="Create account"
        pendingText="Creating account..."
      />

      <p className="text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-blue-400 hover:text-blue-300"
        >
          Log in
        </Link>
      </p>
    </form>
  );
}