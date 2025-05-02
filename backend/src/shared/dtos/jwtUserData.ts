export interface JwtUserData {
    name: string;
    role: 'user' | 'admin';
    id: number;
}