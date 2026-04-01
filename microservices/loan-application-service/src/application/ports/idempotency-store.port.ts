export const IDEMPOTENCY_STORE_PORT = Symbol('IDEMPOTENCY_STORE_PORT');

/**
 * Application port to manage processed request/event keys.
 */
export interface IdempotencyStorePort {
  /**
   * Checks whether the given idempotency key is still active.
   */
  exists(key: string): Promise<boolean>;
  /**
   * Persists a key with a TTL in seconds.
   */
  save(key: string, ttlSeconds: number): Promise<void>;
}
