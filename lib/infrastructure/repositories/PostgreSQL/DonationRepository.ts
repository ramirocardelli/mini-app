import { Donation, DonationStatus } from '@/lib/domain/entities/Donation';
import { IDonationRepository } from '@/lib/infrastructure/types/IRepositories';
import {
  DonationModel,
  DonationAttributes,
  DonationCreationAttributes,
} from '@/lib/infrastructure/orm/sequelize/models/DonationModel';
import { BaseRepository } from './BaseRepository';

/**
 * PostgreSQL Implementation of Donation Repository
 */
export class DonationRepository
  extends BaseRepository<Donation, DonationModel, DonationAttributes, DonationCreationAttributes>
  implements IDonationRepository
{
  constructor() {
    super(DonationModel);
  }

  /**
   * Map DonationModel to Donation Domain Entity
   */
  protected toDomain(model: DonationModel): Donation {
    return new Donation(
      model.id,
      model.userId,
      model.campaignId,
      model.amountWei,
      model.paymentId,
      model.status as DonationStatus,
      model.txHash,
      model.createdAt,
      model.updatedAt
    );
  }

  /**
   * Map Donation Domain Entity to DonationModel attributes
   */
  protected toModel(entity: Partial<Donation>): Partial<DonationAttributes> {
    return {
      userId: entity.userId,
      campaignId: entity.campaignId,
      amountWei: entity.amountWei,
      paymentId: entity.paymentId,
      status: entity.status,
      txHash: entity.txHash,
    };
  }

  /**
   * Find donations by user ID
   */
  async findByUserId(userId: string): Promise<Donation[]> {
    const models = await this.model.findAll({ where: { userId } });
    return models.map((model) => this.toDomain(model));
  }

  /**
   * Find donations by campaign ID
   */
  async findByCampaignId(campaignId: string): Promise<Donation[]> {
    const models = await this.model.findAll({ where: { campaignId } });
    return models.map((model) => this.toDomain(model));
  }

  /**
   * Find donation by payment ID
   */
  async findByPaymentId(paymentId: string): Promise<Donation | null> {
    const model = await this.model.findOne({ where: { paymentId } });
    return model ? this.toDomain(model) : null;
  }
}


