import bcrypt from "bcryptjs";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import {
  registerSchema,
  type RegisterInput,
} from "@/lib/validations/auth";

type RegisterUserResult =
  | {
      success: true;
      user: {
        id: string;
        name: string;
        email: string;
      };
    }
  | {
      success: false;
      error: string;
    };

export async function registerUser(
  input: RegisterInput,
): Promise<RegisterUserResult> {
  const validationResult = registerSchema.safeParse(input);

  if (!validationResult.success) {
    return {
      success: false,
      error:
        validationResult.error.issues[0]?.message ??
        "Invalid registration information.",
    };
  }

  const { name, email, password } = validationResult.data;

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });

  if (existingUser) {
    return {
      success: false,
      error: "An account with this email already exists.",
    };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return {
      success: true,
      user,
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        error: "An account with this email already exists.",
      };
    }

    throw error;
  }
}