import { DataTypes, Model, Optional } from 'sequelize';
import { getSequelizeInstance } from '../config';
import DonationModel from './DonationModel';
import UserModel from './UserModel';

/**
 * Refund Reason Enum
 */
export enum RefundReason {
  EXPIRATION = 'expiration',
  REVERSAL = 'reversal',
  APPROVED_CLAIM = 'approved_claim',
}

/**
 * Refund Model Attributes Interface
 */
export interface RefundAttributes {
  id: string;
  donationId: string;
  userId: string;
  amount: number;
  date: Date;
  txHash: string | null;
  reason: RefundReason;
  createdAt: Date;
}

/**
 * Refund Creation Attributes
 */
export interface RefundCreationAttributes
  extends Optional<RefundAttributes, 'id' | 'txHash' | 'createdAt'> {}

/**
 * Sequelize Refund Model
 */
export class RefundModel
  extends Model<RefundAttributes, RefundCreationAttributes>
  implements RefundAttributes
{
  declare id: string;
  declare donationId: string;
  declare userId: string;
  declare amount: number;
  declare date: Date;
  declare txHash: string | null;
  declare reason: RefundReason;
  declare createdAt: Date;
}

const sequelize = getSequelizeInstance();

RefundModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    donationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'donations',
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
    amount: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    txHash: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reason: {
      type: DataTypes.ENUM(...Object.values(RefundReason)),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'refunds',
    timestamps: false,
    underscored: true,
  }
);

// Define associations
RefundModel.belongsTo(DonationModel, {
  foreignKey: 'donationId',
  as: 'donation',
});

RefundModel.belongsTo(UserModel, {
  foreignKey: 'userId',
  as: 'user',
});

export default RefundModel;

