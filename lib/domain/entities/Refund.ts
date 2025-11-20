/**
 * Refund Reason Enum
 */
export enum RefundReason {
  EXPIRATION = 'expiration',
  REVERSAL = 'reversal',
  APPROVED_CLAIM = 'approved_claim',
}

/**
 * Refund Entity - Domain Model
 */
export class Refund {
  constructor(
    public readonly id: string,
    public donationId: string,
    public userId: string,
    public amount: number,
    public date: Date,
    public txHash: string | null,
    public reason: RefundReason,
    public readonly createdAt: Date
  ) {}

  /**
   * Business logic: Check if refund has transaction hash
   */
  isProcessed(): boolean {
    return this.txHash !== null;
  }

  /**
   * Business logic: Mark refund as processed
   */
  markAsProcessed(txHash: string): void {
    if (this.isProcessed()) {
      throw new Error('Refund already processed');
    }
    this.txHash = txHash;
  }

  /**
   * Business logic: Validate refund data
   */
  validate(): void {
    if (!this.donationId || this.donationId.trim().length === 0) {
      throw new Error('Donation ID is required');
    }
    if (!this.userId || this.userId.trim().length === 0) {
      throw new Error('User ID is required');
    }
    if (this.amount <= 0) {
      throw new Error('Refund amount must be positive');
    }
    if (!this.reason) {
      throw new Error('Refund reason is required');
    }
  }

  /**
   * Create a plain object representation
   */
  toJSON() {
    return {
      id: this.id,
      donationId: this.donationId,
      userId: this.userId,
      amount: this.amount,
      date: this.date,
      txHash: this.txHash,
      reason: this.reason,
      isProcessed: this.isProcessed(),
      createdAt: this.createdAt,
    };
  }
}

