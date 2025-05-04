export interface RefreshTokenRepository {
    saveRefreshToDB(userId: number, token: string, expiresAt: Date): Promise<void>;
}