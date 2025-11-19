import { Campaign, CampaignStatus } from '@/lib/domain/entities/Campaign';
import { ICampaignRepository } from '@/lib/infrastructure/types/IRepositories';
import {
  CampaignModel,
  CampaignAttributes,
  CampaignCreationAttributes,
} from '@/lib/infrastructure/orm/sequelize/models/CampaignModel';
import { BaseRepository } from './BaseRepository';

/**
 * PostgreSQL Implementation of Campaign Repository
 */
export class CampaignRepository
  extends BaseRepository<
    Campaign,
    CampaignModel,
    CampaignAttributes,
    CampaignCreationAttributes
  >
  implements ICampaignRepository
{
  constructor() {
    super(CampaignModel);
  }

  /**
   * Map CampaignModel to Campaign Domain Entity
   */
  protected toDomain(model: CampaignModel): Campaign {
    return new Campaign(
      model.id,
      model.title,
      model.description,
      Number(model.goalAmount),
      model.goalCurrency,
      Number(model.currentAmount),
      model.status as CampaignStatus,
      model.imageUrl,
      model.startDate,
      model.endDate,
      model.createdAt,
      model.updatedAt
    );
  }

  /**
   * Map Campaign Domain Entity to CampaignModel attributes
   */
  protected toModel(entity: Partial<Campaign>): Partial<CampaignAttributes> {
    return {
      title: entity.title,
      description: entity.description,
      goalAmount: entity.goalAmount,
      goalCurrency: entity.goalCurrency,
      currentAmount: entity.currentAmount,
      status: entity.status,
      imageUrl: entity.imageUrl,
      startDate: entity.startDate,
      endDate: entity.endDate,
    };
  }
}

