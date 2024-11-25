import { Prisma } from "@prisma/client";

export function getUserDataSelect(
  loggedInUserId?: string,
  withPassword?: boolean
) {
  return {
    id: true,
    name: true,
    email: true,
    role: true,
    createdAt: true,
    hashedRefreshToken: true,
    ...(withPassword && { password: true }),
  } satisfies Prisma.UserSelect;
}

export type TGetUserDataSelect = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserDataSelect>;
}>;
