import { Session } from "@repo/shared-types";
import ky from "ky";
import { BACKEND_URL } from "./constants";

export const kyy = ky.create({
  prefixUrl: `${BACKEND_URL}/`,
});

export const kyyAuth = (session: Session) =>
  kyy.extend({
    hooks: {
      beforeRequest: [
        (request) => {
          request.headers.set("x-app-session", JSON.stringify(session));
        },
      ],
      afterResponse: [
        async (request, options, response) => {
          const requestSession = request.headers.get("x-app-session");
          const responseSession = response.headers.get("x-app-session");
          if (!requestSession || !responseSession) return;

          if (requestSession === responseSession) {
            console.log("They are same");
            return;
          }

          const resp = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/set-session`,
            {
              method: "POST",
              body: responseSession,
            }
          );

          if (!resp.ok) {
            console.log("Failed to set-session");
            return;
          }
        },
      ],
    },
    retry: 2,
  });
