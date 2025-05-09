//user session data
export interface UserSession {
  name: string;
  email: string;
  password: string;
}

//user session data with tokens
export interface UserSessionWithTokens {
  accessToken: string;
  refreshToken: string;
  userData: {
    name: string;
    email?: string; //email is not necessary for refresh token renewal, but is included for convenience
    role: string;
    id: number;
  };
}
