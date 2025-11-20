/**
 * Donation Status Enum
 */
export enum DonationStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

/**
 * Donation Entity - Domain Model
 */
export class Donation {
  constructor(
    public readonly id: string,
    public userId: string,
    public campaignId: string,
    public amount: number,
    public token: string,
    public paymentId: string,
    public status: DonationStatus,
    public txHash: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  /**
   * Business logic: Check if donation is completed
   */
  isCompleted(): boolean {
    return this.status === DonationStatus.COMPLETED;
  }

  /**
   * Business logic: Check if donation is pending
   */
  isPending(): boolean {
    return this.status === DonationStatus.PENDING;
  }

  /**
   * Business logic: Mark donation as completed
   */
  markAsCompleted(txHash: string): void {
    if (this.status !== DonationStatus.PENDING) {
      throw new Error('Only pending donations can be marked as completed');
    }
    this.status = DonationStatus.COMPLETED;
    this.txHash = txHash;
  }

  /**
   * Business logic: Mark donation as failed
   */
  markAsFailed(): void {
    if (this.status !== DonationStatus.PENDING) {
      throw new Error('Only pending donations can be marked as failed');
    }
    this.status = DonationStatus.FAILED;
  }

  /**
   * Business logic: Refund donation
   */
  refund(): void {
    if (this.status !== DonationStatus.COMPLETED) {
      throw new Error('Only completed donations can be refunded');
    }
    this.status = DonationStatus.REFUNDED;
  }

  /**
   * Business logic: Validate donation data
   */
  validate(): void {
    if (!this.userId || this.userId.trim().length === 0) {
      throw new Error('User ID is required');
    }
    if (!this.campaignId || this.campaignId.trim().length === 0) {
      throw new Error('Campaign ID is required');
    }
    if (!this.amount || this.amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }
    if (!this.token || this.token.trim().length === 0) {
      throw new Error('Token is required');
    }
    if (!this.paymentId || this.paymentId.trim().length === 0) {
      throw new Error('Payment ID is required');
    }
  }

  /**
   * Create a plain object representation
   */
  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      campaignId: this.campaignId,
      amount: this.amount,
      token: this.token,
      paymentId: this.paymentId,
      status: this.status,
      txHash: this.txHash,
      isCompleted: this.isCompleted(),
      isPending: this.isPending(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}


