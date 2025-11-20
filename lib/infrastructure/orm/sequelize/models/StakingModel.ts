import { DataTypes, Model, Optional } from 'sequelize';
import { getSequelizeInstance } from '../config';
import CampaignModel from './CampaignModel';

/**
 * Staking Model Attributes Interface
 */
export interface StakingAttributes {
  id: string;
  campaignId: string;
  totalStaked: number;
  yieldGenerated: number;
  startDate: Date;
  endDate: Date | null;
  createdAt: Date;
}

/**
 * Staking Creation Attributes
 */
export interface StakingCreationAttributes
  extends Optional<StakingAttributes, 'id' | 'yieldGenerated' | 'endDate' | 'createdAt'> {}

/**
 * Sequelize Staking Model
 */
export class StakingModel
  extends Model<StakingAttributes, StakingCreationAttributes>
  implements StakingAttributes
{
  declare id: string;
  declare campaignId: string;
  declare totalStaked: number;
  declare yieldGenerated: number;
  declare startDate: Date;
  declare endDate: Date | null;
  declare createdAt: Date;
}

const sequelize = getSequelizeInstance();

StakingModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    campaignId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'campaigns',
        key: 'id',
      },
    },
    totalStaked: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    yieldGenerated: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'staking',
    timestamps: false,
    underscored: true,
  }
);

// Define associations
StakingModel.belongsTo(CampaignModel, {
  foreignKey: 'campaignId',
  as: 'campaign',
});

export default StakingModel;

