import * as z from "zod";

const reqString = z.string().trim();

export const RegisterSchema = z.object({
  name: reqString.min(2, {
    message: "Name must be at least 2 characters long.",
  }),
  email: reqString.email({ message: "Please enter a valid email." }),
  password: reqString
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, {
      message: "Contain at least one letter.",
    })
    .regex(/[0-9]/, {
      message: "Contain at least one number.",
    })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    }),
});

export type TRegisterSchema = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: reqString.email({ message: "Please enter a valid email." }),
  password: reqString.min(1),
});

export type TLoginSchema = z.infer<typeof LoginSchema>;
