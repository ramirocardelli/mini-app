import { Project, ProjectStatus } from '@/lib/domain/entities/Project';
import { IProjectRepository } from '@/lib/infrastructure/types/IRepositories';
import {
  ProjectModel,
  ProjectAttributes,
  ProjectCreationAttributes,
} from '@/lib/infrastructure/orm/sequelize/models/ProjectModel';
import { BaseRepository } from './BaseRepository';

/**
 * PostgreSQL Implementation of Project Repository
 */
export class ProjectRepository
  extends BaseRepository<Project, ProjectModel, ProjectAttributes, ProjectCreationAttributes>
  implements IProjectRepository
{
  constructor() {
    super(ProjectModel);
  }

  /**
   * Map ProjectModel to Project Domain Entity
   */
  protected toDomain(model: ProjectModel): Project {
    return new Project(
      model.id,
      model.title,
      model.description,
      Number(model.goalAmount),
      model.goalCurrency,
      model.vaultAddress,
      model.creatorId,
      model.status as ProjectStatus,
      model.deadline,
      model.createdAt,
      model.updatedAt
    );
  }

  /**
   * Map Project Domain Entity to ProjectModel attributes
   */
  protected toModel(entity: Partial<Project>): Partial<ProjectAttributes> {
    return {
      title: entity.title,
      description: entity.description,
      goalAmount: entity.goalAmount,
      goalCurrency: entity.goalCurrency,
      vaultAddress: entity.vaultAddress,
      creatorId: entity.creatorId,
      status: entity.status,
      deadline: entity.deadline,
    };
  }

  /**
   * Find projects by creator ID
   */
  async findByCreatorId(creatorId: string): Promise<Project[]> {
    const models = await this.model.findAll({ where: { creatorId } });
    return models.map((model) => this.toDomain(model));
  }

  /**
   * Find projects by status
   */
  async findByStatus(status: string): Promise<Project[]> {
    const models = await this.model.findAll({ where: { status } });
    return models.map((model) => this.toDomain(model));
  }
}


