import { clsx, type ClassValue } from "clsx";
import { HTTPError } from "ky";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { isRedirectError } from "next/dist/client/components/redirect";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function rethrowIfRedirectError(error: unknown) {
  if (isRedirectError(error)) throw error;
}

export async function handleError(error: unknown, client: boolean = true) {
  console.log({ error });
  rethrowIfRedirectError(error);
  let errorMessage: string = "Something went wrong";
  if (error instanceof HTTPError) {
    const response = await error.response.json();
    errorMessage = response.message ?? errorMessage;
  } else if (error instanceof Error) {
    errorMessage = error.message ?? errorMessage;
  }

  if (client) toast.error(errorMessage);
  return errorMessage;
}

type FetchOptions = Omit<RequestInit, "body"> & {
  body?: Record<string, unknown>;
};

export async function cf<T>(
  input: RequestInfo | URL,
  { body, ...options }: FetchOptions | undefined = {},
  baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || ""
): Promise<T> {
  const url =
    typeof input === "string" ? new URL(`${baseUrl}${input}`).href : input;
  console.log({ url, body, options });
  const resp = await fetch(url, {
    ...options,
    body: !!body ? JSON.stringify(body) : undefined,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!resp.ok) {
    throw new Error((await resp.text()) || "An error occurred");
  }

  console.log(resp);
  const data = (await resp.json()) as T;
  return data;
}
