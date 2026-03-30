"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryIdempotencyStoreAdapter = void 0;
const common_1 = require("@nestjs/common");
let InMemoryIdempotencyStoreAdapter = class InMemoryIdempotencyStoreAdapter {
    constructor() {
        this.records = new Map();
    }
    async exists(key) {
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
    async save(key, ttlSeconds) {
        const expiration = Date.now() + ttlSeconds * 1000;
        this.records.set(key, expiration);
    }
};
exports.InMemoryIdempotencyStoreAdapter = InMemoryIdempotencyStoreAdapter;
exports.InMemoryIdempotencyStoreAdapter = InMemoryIdempotencyStoreAdapter = __decorate([
    (0, common_1.Injectable)()
], InMemoryIdempotencyStoreAdapter);
