# Authentication Flow Overview

### 1. User refreshes the page or visits for the first time:

- All memory state in Redux is cleared.
- PersistLogin component triggers.
- Attempts to obtain new tokens using the httpOnly refresh token cookie.

### 2. Token renewal:

If the refresh token cookie is valid:
- New access and refresh tokens are generated.
- New session is created.

If the refresh token is invalid:
- Send the user to "/" and reload the app.
- User will be logged out.

### 3. During active session:

When accessing protected routes:
- RequireAuth component validates the access token.
- If expired, it automatically requests new tokens.
- Uses the valid refresh token cookie to maintain the session.
- if the refresh token is expired, RequireAuth component redirects to sign-in

This setup ensures:
- Secure token storage (refresh token in httpOnly cookie).
- Automatic session recovery after page refreshes.
- Seamless token renewal for an uninterrupted user experience.


Notes:
- Access token expires every 5-10 minutes and refresh token every 7 days
- Refresh cookie expiration time is calculated from the database to be fixed, so it will always have a static lifetime.