export interface UserData {
  name: string;
  role: string;
  id: number;
}

export interface UserDataWithToken {
  accessToken: string;
  userData: {
    name: string;
    role: string;
    id: number;
  };
}