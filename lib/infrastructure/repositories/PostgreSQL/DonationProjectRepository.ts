import { DonationProject } from '@/lib/domain/entities/DonationProject';
import { IDonationProjectRepository } from '@/lib/infrastructure/types/IRepositories';
import {
  DonationProjectModel,
  DonationProjectAttributes,
  DonationProjectCreationAttributes,
} from '@/lib/infrastructure/orm/sequelize/models/DonationProjectModel';
import { BaseRepository } from './BaseRepository';

/**
 * PostgreSQL Implementation of DonationProject Repository
 */
export class DonationProjectRepository
  extends BaseRepository<
    DonationProject,
    DonationProjectModel,
    DonationProjectAttributes,
    DonationProjectCreationAttributes
  >
  implements IDonationProjectRepository
{
  constructor() {
    super(DonationProjectModel);
  }

  /**
   * Map DonationProjectModel to DonationProject Domain Entity
   */
  protected toDomain(model: DonationProjectModel): DonationProject {
    return new DonationProject(
      model.id,
      model.donationId,
      model.projectId,
      model.createdAt
    );
  }

  /**
   * Map DonationProject Domain Entity to DonationProjectModel attributes
   */
  protected toModel(entity: Partial<DonationProject>): Partial<DonationProjectAttributes> {
    return {
      donationId: entity.donationId,
      projectId: entity.projectId,
    };
  }

  /**
   * Find donation-project relationships by donation ID
   */
  async findByDonationId(donationId: string): Promise<DonationProject[]> {
    const models = await this.model.findAll({ where: { donationId } });
    return models.map((model) => this.toDomain(model));
  }

  /**
   * Find donation-project relationships by project ID
   */
  async findByProjectId(projectId: string): Promise<DonationProject[]> {
    const models = await this.model.findAll({ where: { projectId } });
    return models.map((model) => this.toDomain(model));
  }
}


