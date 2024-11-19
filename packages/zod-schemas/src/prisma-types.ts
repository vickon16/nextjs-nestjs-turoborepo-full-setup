import { Prisma } from "@prisma/client";

export function getUserDataSelect() {
  return {
    id: true,
    name: true,
    role: true,
    createdAt: true,
  } satisfies Prisma.UserSelect;
}

export type TGetUserDataSelect = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserDataSelect>;
}>;
