export interface UserId {
  id: number
}

export interface BaseUserData {
  id: string;
  name: string;
  role: "user" | "admin";
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
    email?: string;
    role: "user" | "admin";
    id: number;
  };
}
