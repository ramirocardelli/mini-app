import { DataTypes, Model, Optional } from 'sequelize';
import { getSequelizeInstance } from '../config';
import UserModel from './UserModel';

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
 * Project Model Attributes Interface
 */
export interface ProjectAttributes {
  id: string;
  title: string;
  description: string;
  goalAmount: number;
  goalCurrency: string;
  vaultAddress: string;
  creatorId: string;
  status: ProjectStatus;
  deadline: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Project Creation Attributes
 */
export interface ProjectCreationAttributes
  extends Optional<
    ProjectAttributes,
    'id' | 'status' | 'deadline' | 'createdAt' | 'updatedAt'
  > {}

/**
 * Sequelize Project Model
 */
export class ProjectModel
  extends Model<ProjectAttributes, ProjectCreationAttributes>
  implements ProjectAttributes
{
  declare id: string;
  declare title: string;
  declare description: string;
  declare goalAmount: number;
  declare goalCurrency: string;
  declare vaultAddress: string;
  declare creatorId: string;
  declare status: ProjectStatus;
  declare deadline: Date | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

const sequelize = getSequelizeInstance();

ProjectModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    goalAmount: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    goalCurrency: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'USD',
      validate: {
        isIn: [['USD', 'ARS', 'BRL', 'ETH', 'USDC']],
      },
    },
    vaultAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    creatorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ProjectStatus)),
      allowNull: false,
      defaultValue: ProjectStatus.PENDING_REVIEW,
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'projects',
    timestamps: true,
    underscored: true,
  }
);

// Define associations
ProjectModel.belongsTo(UserModel, {
  foreignKey: 'creatorId',
  as: 'creator',
});

export default ProjectModel;


