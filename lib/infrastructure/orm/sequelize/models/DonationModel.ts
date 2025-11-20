import { DataTypes, Model, Optional } from 'sequelize';
import { getSequelizeInstance } from '../config';
import UserModel from './UserModel';
import CampaignModel from './CampaignModel';

/**
 * Donation Status Enum
 */
export enum DonationStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

/**
 * Donation Model Attributes Interface
 */
export interface DonationAttributes {
  id: string;
  userId: string;
  campaignId: string;
  amount: number;
  token: string;
  paymentId: string;
  status: DonationStatus;
  txHash: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Donation Creation Attributes
 */
export interface DonationCreationAttributes
  extends Optional<
    DonationAttributes,
    'id' | 'status' | 'txHash' | 'createdAt' | 'updatedAt'
  > {}

/**
 * Sequelize Donation Model
 */
export class DonationModel
  extends Model<DonationAttributes, DonationCreationAttributes>
  implements DonationAttributes
{
  declare id: string;
  declare userId: string;
  declare campaignId: string;
  declare amount: number;
  declare token: string;
  declare paymentId: string;
  declare status: DonationStatus;
  declare txHash: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

const sequelize = getSequelizeInstance();

DonationModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    campaignId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'campaigns',
        key: 'id',
      },
    },
    amount: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    token: {
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    paymentId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(DonationStatus)),
      allowNull: false,
      defaultValue: DonationStatus.PENDING,
    },
    txHash: {
      type: DataTypes.STRING,
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
    tableName: 'donations',
    timestamps: true,
    underscored: true,
  }
);

// Define associations
DonationModel.belongsTo(UserModel, {
  foreignKey: 'userId',
  as: 'user',
});

DonationModel.belongsTo(CampaignModel, {
  foreignKey: 'campaignId',
  as: 'campaign',
});

export default DonationModel;


