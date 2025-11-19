import { DataTypes, Model, Optional } from 'sequelize';
import { getSequelizeInstance } from '../config';

/**
 * User Model Attributes Interface
 */
export interface UserAttributes {
  id: string;
  wallet: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User Creation Attributes (id, createdAt, updatedAt are optional during creation)
 */
export interface UserCreationAttributes
  extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

/**
 * Sequelize User Model
 */
export class UserModel
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare id: string;
  declare wallet: string;
  declare username: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

const sequelize = getSequelizeInstance();

UserModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    wallet: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 50],
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
    tableName: 'users',
    timestamps: true,
    underscored: true,
  }
);

export default UserModel;


