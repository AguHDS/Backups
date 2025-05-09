import { Connection, ResultSetHeader } from "mysql2/promise";

export interface RefreshTokenRepository {
    //save refreshToken to database
    saveRefreshToDB(userId: number, token: string, expiresAt: Date): Promise<void>;
    //verify existence and expiration time of this data in the database (user_id is a foreign key related to the real user id)
    findValidToken(refreshToken: string, userId: string): Promise<boolean>;
    //get expiration time of the first refresh token emited.
    getExpirationTime(userId: number, connection: Connection): Promise<Date | null>;
    //update refresh token in the database
    updateRefreshTokenFromDB(refreshToken: string, userId: number, connection: Connection): Promise<ResultSetHeader>;
}