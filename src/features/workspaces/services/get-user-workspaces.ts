import { prisma } from "@/lib/prisma";

type GetUserWorkspacesOptions = {
  userId: string;
};

export async function getUserWorkspaces({
  userId,
}: GetUserWorkspacesOptions) {
  return prisma.workspaceMember.findMany({
    where: {
      userId,
    },

    orderBy: {
      workspace: {
        createdAt: "asc",
      },
    },

    select: {
      role: true,
      joinedAt: true,

      workspace: {
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          createdAt: true,

          _count: {
            select: {
              members: true,
              projects: true,
            },
          },
        },
      },
    },
  });
}

export type UserWorkspaceMembership = Awaited<
  ReturnType<typeof getUserWorkspaces>
>[number];