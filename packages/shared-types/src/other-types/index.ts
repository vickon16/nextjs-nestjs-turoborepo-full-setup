export type RequestUser = {
  id: number;
  name: string;
  email: string;
};

export type Session = {
  user: RequestUser;
  accessToken: string;
  refreshToken: string;
};
