export interface StorageUsageRepository {
  /**
   * Increases the user's storage usage for files uploaded
   * 
   * @param userId - Id of current user, usually taken from refresh token
   * @param delta - The number of bytes to add to the user's usage
   */
  addToUsedStorage(userId: number | string, delta: number): Promise<void>;

  /**
   * Decreases the user's storage usage for files by a specified number of bytes
   * Ensures the result does not go below zero
   * 
   * @param userId - Id of current user, usually taken from refresh token
   * @param delta - The number of bytes to decrease from the user's usage
   */
  decreaseFromUsedStorage (userId: number | string, delta: number): Promise<void>;

  /**
   * Retrieves the total number of bytes used by the user with files
   * 
   * @param userId - Id of current user, usually taken from refresh token
   * @returns The total bytes used by the user
   */
  getUsedStorage(userId: number | string): Promise<number>;
}
