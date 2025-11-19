import { Beneficiary } from '@/lib/domain/entities/Beneficiary';
import { IBeneficiaryRepository } from '@/lib/infrastructure/types/IRepositories';
import {
  BeneficiaryModel,
  BeneficiaryAttributes,
  BeneficiaryCreationAttributes,
} from '@/lib/infrastructure/orm/sequelize/models/BeneficiaryModel';
import { BaseRepository } from './BaseRepository';

/**
 * PostgreSQL Implementation of Beneficiary Repository
 */
export class BeneficiaryRepository
  extends BaseRepository<
    Beneficiary,
    BeneficiaryModel,
    BeneficiaryAttributes,
    BeneficiaryCreationAttributes
  >
  implements IBeneficiaryRepository
{
  constructor() {
    super(BeneficiaryModel);
  }

  /**
   * Map BeneficiaryModel to Beneficiary Domain Entity
   */
  protected toDomain(model: BeneficiaryModel): Beneficiary {
    return new Beneficiary(
      model.id,
      model.name,
      model.wallet,
      model.createdAt,
      model.updatedAt
    );
  }

  /**
   * Map Beneficiary Domain Entity to BeneficiaryModel attributes
   */
  protected toModel(entity: Partial<Beneficiary>): Partial<BeneficiaryAttributes> {
    return {
      name: entity.name,
      wallet: entity.wallet,
    };
  }

  /**
   * Find beneficiary by wallet address
   */
  async findByWallet(wallet: string): Promise<Beneficiary | null> {
    const model = await this.model.findOne({ where: { wallet } });
    return model ? this.toDomain(model) : null;
  }
}


