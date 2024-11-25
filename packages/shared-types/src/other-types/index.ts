import { Role } from "@prisma/client";

export type RequestUser = {
  id: number;
  name: string;
  email: string;
  role: Role;
};

export type Session = {
  user: RequestUser;
  accessToken: string;
  refreshToken: string;
};
