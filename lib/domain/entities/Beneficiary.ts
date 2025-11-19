/**
 * Beneficiary Entity - Domain Model
 */
export class Beneficiary {
  constructor(
    public readonly id: string,
    public name: string,
    public wallet: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  /**
   * Business logic: Validate beneficiary data
   */
  validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Beneficiary name is required');
    }
    if (!this.wallet || this.wallet.trim().length === 0) {
      throw new Error('Wallet address is required');
    }
  }

  /**
   * Create a plain object representation
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      wallet: this.wallet,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}


