export interface ValidUserData {
  accessToken: string;
  userData: {
    name: string;
    role: string;
    id: number;
  };
}
