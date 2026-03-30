export const IDEMPOTENCY_STORE_PORT = Symbol('IDEMPOTENCY_STORE_PORT');

export interface IdempotencyStorePort {
  exists(key: string): Promise<boolean>;
  save(key: string, ttlSeconds: number): Promise<void>;
}