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
  decreaseFromUsedStorage(
    userId: number | string,
    delta: number
  ): Promise<void>;

  /**
   * Retrieves the total number of bytes used by the user with files
   *
   * @param userId - Id of current user, usually taken from refresh token
   * @returns The total bytes used by the user
   */
  getUsedStorage(userId: number | string): Promise<number>;

  /**
   * Retrieves the maximum storage quota allowed for the user
   *
   * @param userId - Id of current user, usually taken from refresh token
   * @returns The maximum storage in bytes available to the user
   */
  getMaxStorage(userId: number | string): Promise<number>;

  /**
   * Retrieves the remaining storage available for the user, calculated as maximum quota - currently used storage
   *
   * @param userId - Id of current user, usually taken from refresh token
   * @returns The number of free bytes left for the user
   */
  getRemainingStorage(userId: number | string): Promise<number>;

  /**
   * Attempts to atomically reserve additional storage for the user
   * it should fail if the requested space exceeds the user's maximum allowed quota
   *
   * @param userId - Id of current user, usually taken from refresh token
   * @param delta - The number of bytes to attempt to reserve
   * @returns True if the reservation succeeded, false otherwise
   */
  tryReserveStorage(userId: number | string, delta: number): Promise<boolean>;
}
