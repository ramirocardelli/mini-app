/**
 * DonorDAOMember Entity - Domain Model
 */
export class DonorDAOMember {
  constructor(
    public readonly id: string,
    public daoId: string,
    public userId: string,
    public readonly createdAt: Date
  ) {}

  /**
   * Business logic: Validate DAO member data
   */
  validate(): void {
    if (!this.daoId || this.daoId.trim().length === 0) {
      throw new Error('DAO ID is required');
    }
    if (!this.userId || this.userId.trim().length === 0) {
      throw new Error('User ID is required');
    }
  }

  /**
   * Create a plain object representation
   */
  toJSON() {
    return {
      id: this.id,
      daoId: this.daoId,
      userId: this.userId,
      createdAt: this.createdAt,
    };
  }
}

