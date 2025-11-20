import { DataTypes, Model, Optional } from 'sequelize';
import { getSequelizeInstance } from '../config';

/**
 * Campaign Status Enum
 */
export enum CampaignStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

/**
 * Campaign Model Attributes Interface
 */
export interface CampaignAttributes {
  id: string;
  title: string;
  description: string;
  goalAmount: number;
  goalToken: string;
  currentAmount: number;
  status: CampaignStatus;
  imageUrl: string | null;
  startDate: Date | null;
  endDate: Date | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Campaign Creation Attributes
 */
export interface CampaignCreationAttributes
  extends Optional<
    CampaignAttributes,
    'id' | 'currentAmount' | 'status' | 'imageUrl' | 'startDate' | 'endDate' | 'createdAt' | 'updatedAt'
  > {}

/**
 * Sequelize Campaign Model
 */
export class CampaignModel
  extends Model<CampaignAttributes, CampaignCreationAttributes>
  implements CampaignAttributes
{
  declare id: string;
  declare title: string;
  declare description: string;
  declare goalAmount: number;
  declare goalToken: string;
  declare currentAmount: number;
  declare status: CampaignStatus;
  declare imageUrl: string | null;
  declare startDate: Date | null;
  declare endDate: Date | null;
  declare createdBy: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

const sequelize = getSequelizeInstance();

CampaignModel.init(
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
    goalToken: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'USDC',
      validate: {
        isIn: [['USD', 'ARS', 'BRL', 'ETH', 'USDC', 'USDT', 'DAI']],
      },
    },
    currentAmount: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    status: {
      type: DataTypes.ENUM(...Object.values(CampaignStatus)),
      allowNull: false,
      defaultValue: CampaignStatus.DRAFT,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
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
    tableName: 'campaigns',
    timestamps: true,
    underscored: true,
  }
);

// Define associations
import UserModel from './UserModel';

CampaignModel.belongsTo(UserModel, {
  foreignKey: 'createdBy',
  as: 'creator',
});

export default CampaignModel;

