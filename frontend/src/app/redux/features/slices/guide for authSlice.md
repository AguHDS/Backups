## Persistence of global state and user reauthentication when reloading the page

- In the backend, send the authenticated user a JWT token and a refresh token. (JWT token duration: 5–10 mins, refresh token: 1–2 hrs)
- The JWT token will be stored in memory, and the refresh token in a secure HTTP-only cookie.
- When the page reloads, the global state resets, but at the start of the application (using useEffect at a high level) a request will be made to the backend to verify whether the refresh token is valid, and then request a new JWT token.
- If the refresh token is valid, a new JWT token will be sent and stored in memory (Redux global state).
- The global state will store: username, role, and isAuthenticated.
- Logout should redirect the user to the main page and reload it, so that verifyToken is triggered.