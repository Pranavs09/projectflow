import { NextResponse } from "next/server";
import { registerUser } from "@/features/auth/services/register-user";
import { registerSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    const validationResult = registerSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid registration information.",
          fieldErrors: validationResult.error.flatten().fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    const result = await registerUser(validationResult.data);

    if (!result.success) {
      return NextResponse.json(result, {
        status: 409,
      });
    }

    return NextResponse.json(result, {
      status: 201,
    });
  } catch (error) {
    console.error("Registration failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to create the account.",
      },
      {
        status: 500,
      },
    );
  }
}