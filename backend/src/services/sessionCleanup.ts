import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Automatic session cleanup service
 * Removes expired sessions from database periodically
 */

class SessionCleanupService {
  private intervalId: NodeJS.Timeout | null = null;

  // Start automatic cleanup service
  private readonly cleanupIntervalMs: number = 60 * 60 * 1000; // 60 minutes

  start(): void {
    if (this.intervalId) {
      console.log("Session cleanup service is already running");

      return;
    }

    console.log(
      "[Session Cleanup] Service started (runs every 30 seconds, make it 60mins for production)"
    );

    this.cleanup(); // Schedule periodic cleanup

    this.intervalId = setInterval(
      () => this.cleanup(),

      this.cleanupIntervalMs
    );
  } /**

   * Stop the cleanup service

   */

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);

      this.intervalId = null;

      console.log("[Session Cleanup] Service stopped");
    }
  } /**

   * Execute cleanup of expired sessions

   */

  private async cleanup(): Promise<void> {
    try {
      const result = await prisma.session.deleteMany({
        where: {
          expiresAt: {
            lt: new Date(), // Delete sessions with expiresAt < now
          },
        },
      });

      if (result.count > 0) {
        console.log(
          `[Session Cleanup] Removed ${result.count} expired session(s)`
        );
      }
    } catch (error) {
      console.error(
        "[Session Cleanup] Error removing expired sessions:",
        error
      );
    }
  }
}

export const sessionCleanupService = new SessionCleanupService();
