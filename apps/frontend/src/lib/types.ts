export type TRegisterFormState = {
  error?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string;
};

export type ActionResponse =
  | { success: true; data: unknown }
  | { success: false; error: string };
