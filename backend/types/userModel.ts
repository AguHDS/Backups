export interface UserModel {
    id: number;
    name: string;
    email: string;
    pass: string;
    role: 'user' | 'admin';
}