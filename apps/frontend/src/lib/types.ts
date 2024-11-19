export type TRegisterFormState = {
  error?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string;
};
