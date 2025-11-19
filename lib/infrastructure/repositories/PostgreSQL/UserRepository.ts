import { User } from '@/lib/domain/entities/User';
import { IUserRepository } from '@/lib/infrastructure/types/IRepositories';
import { UserModel, UserAttributes, UserCreationAttributes } from '@/lib/infrastructure/orm/sequelize/models/UserModel';
import { BaseRepository } from './BaseRepository';

/**
 * PostgreSQL Implementation of User Repository
 */
export class UserRepository
  extends BaseRepository<User, UserModel, UserAttributes, UserCreationAttributes>
  implements IUserRepository
{
  constructor() {
    super(UserModel);
  }

  /**
   * Map UserModel to User Domain Entity
   */
  protected toDomain(model: UserModel): User {
    return new User(
      model.id,
      model.wallet,
      model.username,
      model.createdAt,
      model.updatedAt
    );
  }

  /**
   * Map User Domain Entity to UserModel attributes
   */
  protected toModel(entity: Partial<User>): Partial<UserAttributes> {
    return {
      wallet: entity.wallet,
      username: entity.username,
    };
  }

  /**
   * Find user by wallet address
   */
  async findByWallet(wallet: string): Promise<User | null> {
    const model = await this.model.findOne({ where: { wallet } });
    return model ? this.toDomain(model) : null;
  }
}


