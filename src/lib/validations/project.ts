import { z } from "zod";

export const createProjectSchema = z.object({
  workspaceId: z.string().min(1),

  name: z
    .string()
    .trim()
    .min(3, "Project name must be at least 3 characters.")
    .max(100, "Project name cannot exceed 100 characters."),

  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters.")
    .optional()
    .or(z.literal("")),

  color: z
    .string()
    .regex(
      /^#[0-9A-Fa-f]{6}$/,
      "Please choose a valid color."
    ),
});

export type CreateProjectInput = z.infer<
  typeof createProjectSchema
>;