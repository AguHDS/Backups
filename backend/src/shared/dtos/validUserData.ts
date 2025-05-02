export interface ValidUserData {
  accessToken: string;
  refreshToken: string;
  userData: {
    name: string;
    role: string;
    id: number;
  };
}
