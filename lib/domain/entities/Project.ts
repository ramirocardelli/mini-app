/**
 * Project Status Enum
 */
export enum ProjectStatus {
  PENDING_REVIEW = 'PENDING_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  ACTIVE = 'ACTIVE',
  SUCCESSFUL = 'SUCCESSFUL',
  FAILED = 'FAILED',
}

/**
 * Project Entity - Domain Model
 * Represents the core business entity for a funding project
 */
export class Project {
  constructor(
    public readonly id: string,
    public title: string,
    public description: string,
    public goalAmount: number,
    public goalCurrency: string,
    public vaultAddress: string,
    public creatorId: string,
    public status: ProjectStatus,
    public deadline: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  /**
   * Business logic: Check if project is active
   */
  isActive(): boolean {
    return this.status === ProjectStatus.ACTIVE;
  }

  /**
   * Business logic: Check if project is approved
   */
  isApproved(): boolean {
    return this.status === ProjectStatus.APPROVED;
  }

  /**
   * Business logic: Check if deadline has passed
   */
  isExpired(): boolean {
    if (!this.deadline) return false;
    return new Date() > this.deadline;
  }

  /**
   * Business logic: Approve project
   */
  approve(): void {
    if (this.status !== ProjectStatus.PENDING_REVIEW) {
      throw new Error('Only projects pending review can be approved');
    }
    this.status = ProjectStatus.APPROVED;
  }

  /**
   * Business logic: Reject project
   */
  reject(): void {
    if (this.status !== ProjectStatus.PENDING_REVIEW) {
      throw new Error('Only projects pending review can be rejected');
    }
    this.status = ProjectStatus.REJECTED;
  }

  /**
   * Business logic: Activate project
   */
  activate(): void {
    if (this.status !== ProjectStatus.APPROVED) {
      throw new Error('Only approved projects can be activated');
    }
    this.status = ProjectStatus.ACTIVE;
  }

  /**
   * Business logic: Mark project as successful
   */
  markAsSuccessful(): void {
    if (this.status !== ProjectStatus.ACTIVE) {
      throw new Error('Only active projects can be marked as successful');
    }
    this.status = ProjectStatus.SUCCESSFUL;
  }

  /**
   * Business logic: Mark project as failed
   */
  markAsFailed(): void {
    if (this.status !== ProjectStatus.ACTIVE) {
      throw new Error('Only active projects can be marked as failed');
    }
    this.status = ProjectStatus.FAILED;
  }

  /**
   * Business logic: Validate project data
   */
  validate(): void {
    if (!this.title || this.title.trim().length === 0) {
      throw new Error('Project title is required');
    }
    if (!this.description || this.description.trim().length === 0) {
      throw new Error('Project description is required');
    }
    if (this.goalAmount <= 0) {
      throw new Error('Goal amount must be positive');
    }
    if (!this.vaultAddress || this.vaultAddress.trim().length === 0) {
      throw new Error('Vault address is required');
    }
    if (!this.creatorId || this.creatorId.trim().length === 0) {
      throw new Error('Creator ID is required');
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
      goalCurrency: this.goalCurrency,
      vaultAddress: this.vaultAddress,
      creatorId: this.creatorId,
      status: this.status,
      deadline: this.deadline,
      isActive: this.isActive(),
      isApproved: this.isApproved(),
      isExpired: this.isExpired(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

