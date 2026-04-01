import { Injectable } from '@nestjs/common';
import { IdempotencyStorePort } from '../../application/ports/idempotency-store.port';

@Injectable()
export class InMemoryIdempotencyStoreAdapter implements IdempotencyStorePort {
  private readonly records = new Map<string, number>();

  /**
   * Checks whether a key exists and is still inside TTL.
   */
  async exists(key: string): Promise<boolean> {
    // Retrieve expiration timestamp for the given key.
    const expiration = this.records.get(key);
    if (!expiration) {
      return false;
    }

    // Remove expired keys and report as not existing.
    if (Date.now() > expiration) {
      this.records.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Stores an idempotency key with expiration.
   */
  async save(key: string, ttlSeconds: number): Promise<void> {
    // Convert TTL seconds into unix milliseconds.
    const expiration = Date.now() + ttlSeconds * 1000;
    this.records.set(key, expiration);
  }
}
