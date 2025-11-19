import { Model, ModelStatic } from 'sequelize';

/**
 * Base Repository Class
 * Provides common CRUD operations for all repositories
 */
export abstract class BaseRepository<
  TEntity,
  TModel extends Model,
  TAttributes,
  TCreationAttributes
> {
  constructor(protected model: ModelStatic<TModel>) {}

  /**
   * Map Sequelize model instance to domain entity
   */
  protected abstract toDomain(model: TModel): TEntity;

  /**
   * Map domain entity to Sequelize attributes
   */
  protected abstract toModel(entity: Partial<TEntity>): Partial<TAttributes>;

  /**
   * Find all records
   */
  async findAll(): Promise<TEntity[]> {
    const models = await this.model.findAll();
    return models.map((model) => this.toDomain(model));
  }

  /**
   * Find record by ID
   */
  async findById(id: string): Promise<TEntity | null> {
    const model = await this.model.findByPk(id);
    return model ? this.toDomain(model) : null;
  }

  /**
   * Create a new record
   */
  async create(data: any): Promise<TEntity> {
    const modelData = this.toModel(data);
    const model = await this.model.create(modelData as TCreationAttributes);
    return this.toDomain(model);
  }

  /**
   * Update a record
   */
  async update(id: string, data: Partial<TEntity>): Promise<TEntity | null> {
    const model = await this.model.findByPk(id);
    if (!model) return null;

    const modelData = this.toModel(data);
    await model.update(modelData);
    return this.toDomain(model);
  }

  /**
   * Delete a record
   */
  async delete(id: string): Promise<boolean> {
    const deleted = await this.model.destroy({ where: { id } as any });
    return deleted > 0;
  }
}


