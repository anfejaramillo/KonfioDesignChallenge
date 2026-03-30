export class Currency {
  constructor(public readonly code: string, public readonly name: string) {
    if (!code || code.length < 3) {
      throw new Error('Currency code is invalid');
    }
  }
}
