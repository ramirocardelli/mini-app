/**
 * Vote Value Enum
 */
export enum VoteValue {
  YES = 'yes',
  NO = 'no',
  ABSTAIN = 'abstain',
}

/**
 * DAOVote Entity - Domain Model
 */
export class DAOVote {
  constructor(
    public readonly id: string,
    public daoId: string,
    public userId: string,
    public proposalId: string | null,
    public voteValue: VoteValue,
    public readonly createdAt: Date
  ) {}

  /**
   * Business logic: Check if vote is in favor
   */
  isInFavor(): boolean {
    return this.voteValue === VoteValue.YES;
  }

  /**
   * Business logic: Check if vote is against
   */
  isAgainst(): boolean {
    return this.voteValue === VoteValue.NO;
  }

  /**
   * Business logic: Check if vote is abstention
   */
  isAbstention(): boolean {
    return this.voteValue === VoteValue.ABSTAIN;
  }

  /**
   * Business logic: Validate vote data
   */
  validate(): void {
    if (!this.daoId || this.daoId.trim().length === 0) {
      throw new Error('DAO ID is required');
    }
    if (!this.userId || this.userId.trim().length === 0) {
      throw new Error('User ID is required');
    }
    if (!this.voteValue) {
      throw new Error('Vote value is required');
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
      proposalId: this.proposalId,
      voteValue: this.voteValue,
      isInFavor: this.isInFavor(),
      isAgainst: this.isAgainst(),
      isAbstention: this.isAbstention(),
      createdAt: this.createdAt,
    };
  }
}

