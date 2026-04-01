/** Dependency-injection token for idempotency-store adapters. */
export const IDEMPOTENCY_STORE_PORT = Symbol('IDEMPOTENCY_STORE_PORT');

/**
 * Application port for idempotency state lookup and persistence.
 */
export interface IdempotencyStorePort {
  /** Returns true when the key already exists and has not expired. */
  exists(key: string): Promise<boolean>;
  /** Persists a key with a finite time-to-live in seconds. */
  save(key: string, ttlSeconds: number): Promise<void>;
}