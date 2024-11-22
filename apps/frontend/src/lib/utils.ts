import { clsx, type ClassValue } from "clsx";
import { HTTPError, TimeoutError } from "ky";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { isRedirectError } from "next/dist/client/components/redirect";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function rethrowIfRedirectError(error: unknown) {
  if (isRedirectError(error)) throw error;
}

export async function handleError(err: unknown, client: boolean = true) {
  console.log({ err });
  rethrowIfRedirectError(err);
  let errorMessage: string;

  switch (true) {
    case err instanceof HTTPError:
      const response = await err.response.json();
      errorMessage = response.message;
      break;
    case err instanceof TimeoutError:
      errorMessage = "Request timed out";
      break;
    case err instanceof Error:
      errorMessage = err.message;
      break;
    case err instanceof TypeError:
      errorMessage = err.message;
      break;
    case err instanceof SyntaxError:
      errorMessage = err.message;
      break;
    default:
      errorMessage = "Something went wrong";
  }

  if (!errorMessage) errorMessage = "Something went wrong";

  if (client) toast.error(errorMessage);
  return errorMessage;
}
