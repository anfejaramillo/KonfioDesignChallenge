import { Injectable } from '@nestjs/common';
import { IdempotencyStorePort } from '../../application/ports/idempotency-store.port';

/**
 * In-memory idempotency store with expiration timestamps in milliseconds.
 */
@Injectable()
export class InMemoryIdempotencyStoreAdapter implements IdempotencyStorePort {
  private readonly records = new Map<string, number>();

  /**
   * Returns true only when key exists and has not expired.
   */
  async exists(key: string): Promise<boolean> {
    const expiration = this.records.get(key);
    if (!expiration) {
      return false;
    }

    // Performs lazy cleanup of expired records.
    if (Date.now() > expiration) {
      this.records.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Persists a key with TTL converted from seconds to milliseconds.
   */
  async save(key: string, ttlSeconds: number): Promise<void> {
    const expiration = Date.now() + ttlSeconds * 1000;
    this.records.set(key, expiration);
  }
}