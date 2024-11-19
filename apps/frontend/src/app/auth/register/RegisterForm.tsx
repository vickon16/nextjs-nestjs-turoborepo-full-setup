"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TRegisterSchema, RegisterSchema } from "@repo/zod-schemas";
import CustomButton from "@/components/CustomButton";
import { useMutation } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { TGetUserDataSelect } from "@repo/zod-schemas/prisma-types";

export default function RegisterForm() {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async (data: TRegisterSchema) =>
      await kyInstance
        .post("auth/register", { json: data })
        .json<TGetUserDataSelect>(),
  });
  const form = useForm<TRegisterSchema>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: TRegisterSchema) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    await mutation.mutateAsync(values, {
      onSuccess: (data) => {
        router.push("/");
        console.log(data);
      },
      onError: (error) => {
        toast.error(error.message || "Something went wrong");
        console.log(error);
      },
    });
  }

  return (
    <Card className="mx-auto max-w-md w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Register</CardTitle>
        <CardDescription>
          Enter your details below to register your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <CustomButton
              type="submit"
              loading={form.formState.isSubmitting}
              className="w-full !mt-8"
            >
              Submit
            </CustomButton>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/auth/login" className="underline">
            log In
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
