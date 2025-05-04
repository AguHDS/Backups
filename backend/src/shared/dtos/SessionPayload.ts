//user session data
export interface SessionPayload {
  accessToken: string;
  refreshToken: string;
  userData: {
    name: string;
    email: string;
    role: string;
    id: number;
  };
}
