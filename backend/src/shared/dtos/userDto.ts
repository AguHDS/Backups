export interface UserId {
  id: number
}

export interface BaseUserData {
  id: number;
  name: string;
  role: string;
  email?: string;
}

export interface UserAndPassword {
  user: string;
  password: string;
}

export interface UserSession {
  user: string;
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
