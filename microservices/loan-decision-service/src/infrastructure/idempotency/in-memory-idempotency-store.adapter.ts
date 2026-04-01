import { Injectable } from '@nestjs/common';
import { IdempotencyStorePort } from '../../application/ports/idempotency-store.port';

@Injectable()
export class InMemoryIdempotencyStoreAdapter implements IdempotencyStorePort {
  private readonly records = new Map<string, number>();

  /**
   * Checks if key exists and has not expired.
   */
  async exists(key: string): Promise<boolean> {
    const expiration = this.records.get(key);
    if (!expiration) {
      return false;
    }

    // Remove expired records eagerly to keep memory bounded.
    if (Date.now() > expiration) {
      this.records.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Stores idempotency key with expiration timestamp.
   */
  async save(key: string, ttlSeconds: number): Promise<void> {
    const expiration = Date.now() + ttlSeconds * 1000;
    this.records.set(key, expiration);
  }
}
