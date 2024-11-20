import ky, { HTTPError } from "ky";
import { Session } from "@repo/shared-types";
import { createSessionAction } from "@/actions/auth";

export const withBearerAuth = (accessToken: string) => {
  return { authorization: `Bearer ${accessToken}` };
};

export const kyy = ky.create({
  prefixUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/`,
});

export const kyAuth = (session: Session) => {
  return kyy.extend({
    hooks: {
      beforeRequest: [
        (request) => {
          request.headers.set("Authorization", `Bearer ${session.accessToken}`);
        },
      ],
      afterResponse: [
        async (request, options, response) => {
          // Handle 401 Unauthorized errors
          console.log({ response });
          if (response?.status === 401) {
            console.log("Refreshing token...");
            try {
              // const resp = await fetch(
              //   `${process.env.NEXT_PUBLIC_BASE_URL}/api/refresh`,
              //   {
              //     method: "POST",
              //     headers: { "Content-Type": "application/json" },
              //     body: JSON.stringify(session.refreshToken),
              //   }
              // );

              // if (!resp.ok) {
              //   throw new Error("Failed to refresh token");
              // }

              // const sessionData = (await resp.json()) as Session;
              const sessionData = await kyy(`auth/refresh`, {
                headers: {
                  ...withBearerAuth(session.refreshToken),
                  "Content-Type": "application/json",
                },
              }).json<Session>();

              if (!sessionData) throw new Error("Failed to refresh token");

              request.headers.set(
                "Authorization",
                `Bearer ${sessionData.accessToken}`
              );

              return kyy(request);
            } catch (refreshError) {
              console.error("Failed to refresh token or retry:", refreshError);
              // throw error; // Re-throw the original HTTPError if retry fails
            }
          }
        },
      ],
    },
  });
};
