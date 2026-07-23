"use server";

import { AuthError } from "next-auth";

import { signIn, signOut } from "@/auth";
import { registerUser } from "@/features/auth/services/register-user";
import {
  loginSchema,
  registerSchema,
} from "@/lib/validations/auth";

export type AuthActionState = {
  success: boolean;
  message?: string;
  fieldErrors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
};

const initialErrorState: AuthActionState = {
  success: false,
};

export async function registerAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const validationResult = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validationResult.success) {
    return {
      ...initialErrorState,
      message: "Please correct the highlighted fields.",
      fieldErrors: validationResult.error.flatten().fieldErrors,
    };
  }

  const result = await registerUser(validationResult.data);

  if (!result.success) {
    return {
      ...initialErrorState,
      message: result.error,
    };
  }

  try {
    await signIn("credentials", {
      email: validationResult.data.email,
      password: validationResult.data.password,
      redirectTo: "/dashboard",
    });

    return {
      success: true,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        ...initialErrorState,
        message:
          "Your account was created, but automatic login failed. Please log in.",
      };
    }

    throw error;
  }
}

export async function loginAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const validationResult = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validationResult.success) {
    return {
      ...initialErrorState,
      message: "Please correct the highlighted fields.",
      fieldErrors: validationResult.error.flatten().fieldErrors,
    };
  }

  try {
    await signIn("credentials", {
      email: validationResult.data.email,
      password: validationResult.data.password,
      redirectTo: "/dashboard",
    });

    return {
      success: true,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            ...initialErrorState,
            message: "The email address or password is incorrect.",
          };

        default:
          return {
            ...initialErrorState,
            message: "Unable to log in. Please try again.",
          };
      }
    }

    throw error;
  }
}

export async function logoutAction(): Promise<void> {
  await signOut({
    redirectTo: "/login",
  });
}