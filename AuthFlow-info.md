# Authentication Flow Overview

### 1. When the webpage is loaded or reloaded

- All memory state in Redux is cleared
- PersistLogin component triggers
- Attempts to obtain new tokens using token rotation
- If last rotaiton was before last 10 seconds, only access token is generated

### 2. Token renewal

If the refresh token cookie is valid:
- New access and refresh tokens are generated

If the refresh token is invalid:
- Send the user to "/" and reload the app
- User will be logged out

**Only the last refresh token issued and stored in the DB is valid (refresh token is replaced in every rotation)**
**Any other one (old, stolen or reused) will automatically be invalid because it no longer matches the saved one in database**

### 3. During active session

When accessing protected routes:
- RequireAuth triggers only if access token is invalid, or it's expiration time (15m) has ended
- If expired, try to request new tokens
- Uses refresh token cookie to keep session
- If refresh token is expired, RequireAuth component redirects to sign-in

This setup ensures:
- Secure refresh storage and encrypted
- Prevents rotation with cooldown when multiple request are triggered
- Automatic session recovery after page refreshes or accessing protected route
- Seamless token renewal for an uninterrupted user experience

Notes:
- Access token expires every 15mins and refresh token every 30d
- Refresh cookie expiration time is calculated from the database to be fixed, so it will always have a static lifetime