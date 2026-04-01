export const IDEMPOTENCY_STORE_PORT = Symbol('IDEMPOTENCY_STORE_PORT');

/**
 * Contract for idempotency persistence used to avoid duplicate processing.
 */
export interface IdempotencyStorePort {
  /**
   * Returns whether a key is already registered and still valid.
   */
  exists(key: string): Promise<boolean>;

  /**
   * Persists a key with TTL in seconds.
   */
  save(key: string, ttlSeconds: number): Promise<void>;
}
