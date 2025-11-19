import { DataTypes, Model, Optional } from 'sequelize';
import { getSequelizeInstance } from '../config';

/**
 * Beneficiary Model Attributes Interface
 */
export interface BeneficiaryAttributes {
  id: string;
  name: string;
  wallet: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Beneficiary Creation Attributes
 */
export interface BeneficiaryCreationAttributes
  extends Optional<BeneficiaryAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

/**
 * Sequelize Beneficiary Model
 */
export class BeneficiaryModel
  extends Model<BeneficiaryAttributes, BeneficiaryCreationAttributes>
  implements BeneficiaryAttributes
{
  declare id: string;
  declare name: string;
  declare wallet: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

const sequelize = getSequelizeInstance();

BeneficiaryModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    wallet: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
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
    tableName: 'beneficiaries',
    timestamps: true,
    underscored: true,
  }
);

export default BeneficiaryModel;


