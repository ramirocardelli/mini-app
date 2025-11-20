import { DataTypes, Model, Optional } from 'sequelize';
import { getSequelizeInstance } from '../config';
import DonorDAOModel from './DonorDAOModel';
import UserModel from './UserModel';

/**
 * DonorDAOMember Model Attributes Interface
 */
export interface DonorDAOMemberAttributes {
  id: string;
  daoId: string;
  userId: string;
  createdAt: Date;
}

/**
 * DonorDAOMember Creation Attributes
 */
export interface DonorDAOMemberCreationAttributes
  extends Optional<DonorDAOMemberAttributes, 'id' | 'createdAt'> {}

/**
 * Sequelize DonorDAOMember Model
 */
export class DonorDAOMemberModel
  extends Model<DonorDAOMemberAttributes, DonorDAOMemberCreationAttributes>
  implements DonorDAOMemberAttributes
{
  declare id: string;
  declare daoId: string;
  declare userId: string;
  declare createdAt: Date;
}

const sequelize = getSequelizeInstance();

DonorDAOMemberModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    daoId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'donor_daos',
        key: 'id',
      },
    },
    userId: {
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
  },
  {
    sequelize,
    tableName: 'donor_dao_members',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['dao_id', 'user_id'],
      },
    ],
  }
);

// Define associations
DonorDAOMemberModel.belongsTo(DonorDAOModel, {
  foreignKey: 'daoId',
  as: 'dao',
});

DonorDAOMemberModel.belongsTo(UserModel, {
  foreignKey: 'userId',
  as: 'user',
});

export default DonorDAOMemberModel;

