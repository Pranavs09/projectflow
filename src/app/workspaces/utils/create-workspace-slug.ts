export function createWorkspaceSlug(name: string): string {
  const normalizedName = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const uniqueSuffix = crypto.randomUUID().slice(0, 8);

  return `${normalizedName || "workspace"}-${uniqueSuffix}`;
}