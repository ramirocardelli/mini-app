/**
 * DonationProject Entity - Domain Model
 * Represents the relationship between a Donation and a Project
 */
export class DonationProject {
  constructor(
    public readonly id: string,
    public donationId: string,
    public projectId: string,
    public readonly createdAt: Date
  ) {}

  /**
   * Business logic: Validate donation-project relationship
   */
  validate(): void {
    if (!this.donationId || this.donationId.trim().length === 0) {
      throw new Error('Donation ID is required');
    }
    if (!this.projectId || this.projectId.trim().length === 0) {
      throw new Error('Project ID is required');
    }
  }

  /**
   * Create a plain object representation
   */
  toJSON() {
    return {
      id: this.id,
      donationId: this.donationId,
      projectId: this.projectId,
      createdAt: this.createdAt,
    };
  }
}


