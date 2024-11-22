// Understanding the authentication flow

// 1. Register flow
// # on the Backend
// ---- The user registers on our app,
// ---- The request is sent to our backend "/api/auth/register" endpoint,
// ---- The endpoint first check if the user with the email exists in our database,
// ---- If the user exists, the userService is called to create the user with hashed password,
// ---- The endpoint calls our loginService to log the user in and send a session.

// # on the Frontend
// ---- Session is created on our server action.
// ---- User is redirected to the dashboard page.

// 2. Login flow
// # on the Backend
// ---- The user logs in,
// ---- The request is sent to our backend "/api/auth/login" endpoint,
// ---- The request first goes to the local strategy, which checks if the user exists in our database and also checks if the password is correct,
// ---- If the user does not exist, the request is aborted even before reaching the endpoint,
// ---- A request object is created as req.user and the user session is appended to it,
// ---- The login Service is called to log the user in and send a session.

// # on the Frontend
// ---- Session is created on our server action.
// ---- User is redirected to the dashboard page.

// 3. Refresh flow
// # on the Frontend
// ---- A request is sent using the kyyAuth extension to append the session to the request headers,
// ---- This request can be any request that is required to be authenticated,

// # on the Backend
// ---- The request is sent to the authenticated endpoint,
// ---- The JWTAuthGuard is called to check if the session is valid,
// ---- If the session is not valid, the JWTAuthGuard calls the handleRequest method,
// ---- If the error type is identified to be "TokenExpiredError", the JWTAuthGuard calls the refreshAccessToken method,
// ---- New Session is generated and appended back to the request headers, for the JWTAuthGuard to retry with the new session,
// ---- The JWTAuthGuard calls the canActivate method,
// ---- If the session is now valid, The response passes the JWTAuthGuard and enters the protected endpoint.
// ---- Note: We have set up a global Interceptor to set the session header on the response.

// # on the Frontend
// ---- The kyAuth receives the session header and resets the session by calling the /api/set-session endpoint on our nextjs Backend api.

// NOTE: For any request that requires authentication, we use the kyyAuth extension should be used and should be used on the client side for the cookies to be set. Calling the kyyAuth on the server side will not set the cookies.
