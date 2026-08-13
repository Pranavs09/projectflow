import { z } from "zod";

export const createTaskSchema = z.object({
  projectId: z.string().min(1, "Project is required."),

  title: z
    .string()
    .trim()
    .min(2, "Task title must be at least 2 characters.")
    .max(120, "Task title cannot exceed 120 characters."),

  description: z
    .string()
    .trim()
    .max(1000, "Description cannot exceed 1000 characters.")
    .optional()
    .or(z.literal("")),

  status: z.enum([
    "TODO",
    "IN_PROGRESS",
    "IN_REVIEW",
    "DONE",
  ]),

  priority: z.enum([
    "LOW",
    "MEDIUM",
    "HIGH",
    "URGENT",
  ]),

  assigneeId: z
    .string()
    .optional()
    .or(z.literal("")),

  dueDate: z
    .string()
    .optional()
    .or(z.literal("")),
});

export type CreateTaskInput = z.infer<
  typeof createTaskSchema
>;