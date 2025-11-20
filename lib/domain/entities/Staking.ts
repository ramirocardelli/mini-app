/**
 * Staking Entity - Domain Model
 */
export class Staking {
  constructor(
    public readonly id: string,
    public campaignId: string,
    public totalStaked: number,
    public yieldGenerated: number,
    public startDate: Date,
    public endDate: Date | null,
    public readonly createdAt: Date
  ) {}

  /**
   * Business logic: Check if staking is active
   */
  isActive(): boolean {
    if (!this.endDate) return true;
    return new Date() <= this.endDate;
  }

  /**
   * Business logic: Calculate APY (Annual Percentage Yield)
   */
  calculateAPY(): number {
    if (this.totalStaked === 0) return 0;
    
    const now = new Date();
    const start = this.startDate;
    const daysStaked = Math.max(
      1,
      (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    const yearlyYield = (this.yieldGenerated / daysStaked) * 365;
    return (yearlyYield / this.totalStaked) * 100;
  }

  /**
   * Business logic: Add yield to staking
   */
  addYield(amount: number): void {
    if (amount <= 0) {
      throw new Error('Yield amount must be positive');
    }
    this.yieldGenerated += amount;
  }

  /**
   * Business logic: Validate staking data
   */
  validate(): void {
    if (!this.campaignId || this.campaignId.trim().length === 0) {
      throw new Error('Campaign ID is required');
    }
    if (this.totalStaked < 0) {
      throw new Error('Total staked cannot be negative');
    }
    if (this.yieldGenerated < 0) {
      throw new Error('Yield generated cannot be negative');
    }
    if (this.endDate && this.startDate > this.endDate) {
      throw new Error('Start date must be before end date');
    }
  }

  /**
   * Create a plain object representation
   */
  toJSON() {
    return {
      id: this.id,
      campaignId: this.campaignId,
      totalStaked: this.totalStaked,
      yieldGenerated: this.yieldGenerated,
      startDate: this.startDate,
      endDate: this.endDate,
      isActive: this.isActive(),
      apy: this.calculateAPY(),
      createdAt: this.createdAt,
    };
  }
}

