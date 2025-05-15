//requirements to create JWT tokens
export interface JwtUserData {
  name: string;
  role: "user" | "admin";
  id: number;
}

export interface RefreshTokenId {
  id: string;
}
