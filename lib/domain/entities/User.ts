/**
 * User Entity - Domain Model
 */
export class User {
  constructor(
    public readonly id: string,
    public wallet: string,
    public username: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  /**
   * Business logic: Validate user data
   */
  validate(): void {
    if (!this.wallet || this.wallet.trim().length === 0) {
      throw new Error('Wallet address is required');
    }
    if (!this.username || this.username.trim().length < 3) {
      throw new Error('Username must be at least 3 characters long');
    }
    if (this.username.length > 50) {
      throw new Error('Username must not exceed 50 characters');
    }
  }

  /**
   * Create a plain object representation
   */
  toJSON() {
    return {
      id: this.id,
      wallet: this.wallet,
      username: this.username,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}


