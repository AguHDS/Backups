export interface UserSessionData {
  name: string;
  email: string;
  role: "user" | "admin";
  id: number;
}

export interface UserDataWithToken {
  accessToken: string;
  userData: UserSessionData;
}