/**
 * Currency value object.
 */
export class Currency {
  /**
   * Creates and validates currency information.
   */
  constructor(public readonly code: string, public readonly name: string) {
    // Currency code must be at least ISO-like length.
    if (!code || code.length < 3) {
      throw new Error('Currency code is invalid');
    }
  }
}
