export interface RefreshTokenRepository {
    save(userId: number, token: string, expiresAt: Date): Promise<void>;
}