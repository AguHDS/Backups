# Authentication Flow Overview

## Architecture

### State Management
- **Redux**: Manages authentication state (accessToken, userData, isAuthenticated) stored in memory
- **TanStack Query**: Handles all remote data fetching, caching, and mutations
- **Axios**: HTTP client with interceptors for auth headers and error handling

### Token Storage
- **Access Token**: Stored in Redux state (memory only, not persisted)
- **Refresh Token**: Stored in secure HTTP-only cookie (managed by backend)

## Flow

### 1. When the webpage is loaded or reloaded

- All memory state in Redux is cleared
- PersistLogin component triggers using `useRefreshToken` mutation
- Attempts to obtain new tokens using token rotation
- If last rotation was before last 20 seconds, only access token is generated. This prevents multiple requests from triggering multiple rotations in a short time.

### 2. Token renewal

If the refresh token cookie is valid:
- New access and refresh tokens are generated
- Redux state is updated with new accessToken and userData

If the refresh token is invalid:
- Send the user to "/" and reload the app
- User will be logged out

**Only the last refresh token issued and stored in the DB is valid (refresh token is replaced in every rotation)**
**Any other one (old, stolen or reused) will automatically be invalid because it no longer matches the saved one in database**

### 3. During active session

When accessing protected routes:
- PersistLogin checks access token validity and persist login across sessions
- Axios auth interceptor automatically adds `Authorization: Bearer <token>` header to all requests
- If expired, try to request new tokens
- Uses refresh token cookie to keep session

### 4. Data Fetching

- **TanStack Query** handles all data fetching with automatic caching and invalidation
- Mutations automatically invalidate related queries to keep data synchronized
- No manual cache management needed

This setup ensures:
- Secure token storage (access in memory, refresh in HTTP-only cookie)
- Automatic auth headers via axios interceptor
- Prevents rotation with cooldown when multiple requests are triggered
- Automatic session recovery after page refreshes or accessing protected route
- Seamless token renewal for an uninterrupted user experience
- Efficient data caching and synchronization

## Technical Details

- Access token expires every 15min and refresh token every 30d
- Refresh cookie expiration time is calculated from the database to be fixed, so it will always have a static lifetime
- Axios baseURL: Configured from `VITE_API_BASE_URL` environment variable
- All authenticated requests use `withCredentials: true` to include cookies