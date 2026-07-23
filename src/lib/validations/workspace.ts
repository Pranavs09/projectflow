import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Workspace name must contain at least 2 characters.")
    .max(60, "Workspace name cannot exceed 60 characters."),

  description: z
    .string()
    .trim()
    .max(300, "Description cannot exceed 300 characters.")
    .optional()
    .or(z.literal("")),
});

export type CreateWorkspaceInput = z.infer<
  typeof createWorkspaceSchema
>;