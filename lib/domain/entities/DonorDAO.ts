/**
 * DonorDAO Entity - Domain Model
 */
export class DonorDAO {
  constructor(
    public readonly id: string,
    public campaignId: string,
    public readonly createdAt: Date
  ) {}

  /**
   * Business logic: Validate DAO data
   */
  validate(): void {
    if (!this.campaignId || this.campaignId.trim().length === 0) {
      throw new Error('Campaign ID is required');
    }
  }

  /**
   * Create a plain object representation
   */
  toJSON() {
    return {
      id: this.id,
      campaignId: this.campaignId,
      createdAt: this.createdAt,
    };
  }
}

