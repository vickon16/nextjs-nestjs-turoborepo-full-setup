import ky from "ky";

const kyInstance = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_BACKEND_URL + "/api/",
  credentials: "include",
  // hooks: {
  //   beforeRequest: [
  //     (request) => {
  //       request.headers.set("X-Requested-With", "ky");
  //     },
  //   ],
  // },
  // parseJson(text) {
  //   // convert timestamps from string to Date
  //   return JSON.parse(text, (key, value) => {
  //     if (key.endsWith("At")) return new Date(value);
  //     return value;
  //   });
  // },
});

export default kyInstance;
