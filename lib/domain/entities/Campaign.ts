/**
 * Campaign Status Enum
 */
export enum CampaignStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

/**
 * Campaign Entity - Domain Model
 */
export class Campaign {
  constructor(
    public readonly id: string,
    public title: string,
    public description: string,
    public goalAmount: number,
    public goalToken: string,
    public currentAmount: number,
    public status: CampaignStatus,
    public imageUrl: string | null,
    public startDate: Date | null,
    public endDate: Date | null,
    public createdBy: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  /**
   * Business logic: Check if campaign goal is reached
   */
  isGoalReached(): boolean {
    return this.currentAmount >= this.goalAmount;
  }

  /**
   * Business logic: Calculate progress percentage
   */
  getProgress(): number {
    if (this.goalAmount === 0) return 0;
    return Math.min((this.currentAmount / this.goalAmount) * 100, 100);
  }

  /**
   * Business logic: Check if campaign is active
   */
  isActive(): boolean {
    return this.status === CampaignStatus.ACTIVE;
  }

  /**
   * Business logic: Check if campaign has started
   */
  hasStarted(): boolean {
    if (!this.startDate) return true;
    return new Date() >= this.startDate;
  }

  /**
   * Business logic: Check if campaign has ended
   */
  hasEnded(): boolean {
    if (!this.endDate) return false;
    return new Date() > this.endDate;
  }

  /**
   * Business logic: Add funds to campaign
   */
  addFunds(amount: number): void {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }
    if (!this.isActive()) {
      throw new Error('Cannot add funds to inactive campaign');
    }
    this.currentAmount += amount;
    
    if (this.isGoalReached()) {
      this.status = CampaignStatus.COMPLETED;
    }
  }

  /**
   * Business logic: Activate campaign
   */
  activate(): void {
    if (this.status !== CampaignStatus.DRAFT) {
      throw new Error('Only draft campaigns can be activated');
    }
    this.status = CampaignStatus.ACTIVE;
  }

  /**
   * Business logic: Cancel campaign
   */
  cancel(): void {
    if (this.status === CampaignStatus.COMPLETED) {
      throw new Error('Cannot cancel completed campaign');
    }
    this.status = CampaignStatus.CANCELLED;
  }

  /**
   * Business logic: Validate campaign data
   */
  validate(): void {
    if (!this.title || this.title.trim().length === 0) {
      throw new Error('Campaign title is required');
    }
    if (!this.description || this.description.trim().length === 0) {
      throw new Error('Campaign description is required');
    }
    if (this.goalAmount <= 0) {
      throw new Error('Goal amount must be positive');
    }
    if (this.currentAmount < 0) {
      throw new Error('Current amount cannot be negative');
    }
    if (this.startDate && this.endDate && this.startDate > this.endDate) {
      throw new Error('Start date must be before end date');
    }
  }

  /**
   * Create a plain object representation
   */
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      goalAmount: this.goalAmount,
      goalToken: this.goalToken,
      currentAmount: this.currentAmount,
      status: this.status,
      imageUrl: this.imageUrl,
      startDate: this.startDate,
      endDate: this.endDate,
      createdBy: this.createdBy,
      progress: this.getProgress(),
      isGoalReached: this.isGoalReached(),
      isActive: this.isActive(),
      hasStarted: this.hasStarted(),
      hasEnded: this.hasEnded(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

