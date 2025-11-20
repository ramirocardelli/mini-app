import { DataTypes, Model, Optional } from 'sequelize';
import { getSequelizeInstance } from '../config';
import CampaignModel from './CampaignModel';

/**
 * DonorDAO Model Attributes Interface
 */
export interface DonorDAOAttributes {
  id: string;
  campaignId: string;
  createdAt: Date;
}

/**
 * DonorDAO Creation Attributes
 */
export interface DonorDAOCreationAttributes
  extends Optional<DonorDAOAttributes, 'id' | 'createdAt'> {}

/**
 * Sequelize DonorDAO Model
 */
export class DonorDAOModel
  extends Model<DonorDAOAttributes, DonorDAOCreationAttributes>
  implements DonorDAOAttributes
{
  declare id: string;
  declare campaignId: string;
  declare createdAt: Date;
}

const sequelize = getSequelizeInstance();

DonorDAOModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    campaignId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'campaigns',
        key: 'id',
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'donor_daos',
    timestamps: false,
    underscored: true,
  }
);

// Define associations
DonorDAOModel.belongsTo(CampaignModel, {
  foreignKey: 'campaignId',
  as: 'campaign',
});

export default DonorDAOModel;

