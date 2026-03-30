import { Injectable } from '@nestjs/common';
import { IdempotencyStorePort } from '../../application/ports/idempotency-store.port';

@Injectable()
export class InMemoryIdempotencyStoreAdapter implements IdempotencyStorePort {
  private readonly records = new Map<string, number>();

  async exists(key: string): Promise<boolean> {
    const expiration = this.records.get(key);
    if (!expiration) {
      return false;
    }

    if (Date.now() > expiration) {
      this.records.delete(key);
      return false;
    }

    return true;
  }

  async save(key: string, ttlSeconds: number): Promise<void> {
    const expiration = Date.now() + ttlSeconds * 1000;
    this.records.set(key, expiration);
  }
}
