export interface StorageUsageRepository {
  /**
   * Increases the user's storage usage for files uploaded
   *
   * @param userId - Id of current user
   * @param delta - The number of bytes to add to the user's usage
   */
  addToUsedStorage(userId: string, delta: number): Promise<void>;
  /**
   * Sets or updates the maximum storage quota for the user
   *
   * @param userId - Id of current user
   * @param maxBytes - Maximum storage in bytes to set for the user
   */
  setMaxStorage(userId: string, maxBytes: number): Promise<void>;
  /**
   * Decreases the user's storage usage for files by a specified number of bytes
   * Ensures the result does not go below zero
   *
   * @param userId - Id of current user
   * @param delta - The number of bytes to decrease from the user's usage
   */
  decreaseFromUsedStorage(userId: string, delta: number): Promise<void>;

  /**
   * Retrieves the total number of bytes used by the user with files
   *
   * @param userId - Id of current user
   * @returns The total bytes used by the user
   */
  getUsedStorage(userId: string): Promise<number>;

  /**
   * Get total number of files uploaded by the user
   *
   * @param userId - Id of current user
   * @returns The total number of files uploaded by the user
   */
  getTotalFilesCount(userId: string): Promise<number>;

  /**
   * Retrieves the maximum storage quota allowed for the user
   *
   * @param userId - Id of current user
   * @returns The maximum storage in bytes available to the user
   */
  getMaxStorage(userId: string): Promise<number>;

  /**
   * Retrieves the remaining storage available for the user, calculated as maximum quota - currently used storage
   *
   * @param userId - Id of current user
   * @returns The number of free bytes left for the user
   */
  getRemainingStorage(userId: string): Promise<number>;

  /**
   * Gets the current profile picture size from storage usage
   *
   * @param userId - Id of current user
   * @returns The size in bytes of the current profile picture
   */
  getProfilePictureSize(userId: string): Promise<number>;

  /**
   * Updates the profile picture size and adjusts total storage accordingly
   *
   * @param userId - Id of current user
   * @param newSize - The new size of the profile picture in bytes
   * @param oldSize - The old size of the profile picture in bytes (default: 0)
   */
  updateProfilePictureSize(
    userId: string,
    newSize: number,
    oldSize?: number
  ): Promise<void>;

  /**
   * Attempts to atomically reserve additional storage for the user
   * Used for files in sections
   *
   * @param userId - Id of current user
   * @param delta - The number of bytes to attempt to reserve
   * @returns True if the reservation succeeded, false otherwise
   */
  tryReserveStorage(userId: string, delta: number): Promise<boolean>;
}
