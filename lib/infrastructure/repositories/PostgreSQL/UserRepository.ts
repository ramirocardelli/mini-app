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
      model.walletAddress,
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
      walletAddress: entity.walletAddress,
      username: entity.username,
    };
  }

  /**
   * Find user by wallet address
   */
  async findByWallet(walletAddress: string): Promise<User | null> {
    const model = await this.model.findOne({ where: { walletAddress } });
    return model ? this.toDomain(model) : null;
  }
}


