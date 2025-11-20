import { DataTypes, Model, Optional } from 'sequelize';
import { getSequelizeInstance } from '../config';
import DonorDAOModel from './DonorDAOModel';
import UserModel from './UserModel';

/**
 * Vote Value Enum
 */
export enum VoteValue {
  YES = 'yes',
  NO = 'no',
  ABSTAIN = 'abstain',
}

/**
 * DAOVote Model Attributes Interface
 */
export interface DAOVoteAttributes {
  id: string;
  daoId: string;
  userId: string;
  proposalId: string | null;
  voteValue: VoteValue;
  createdAt: Date;
}

/**
 * DAOVote Creation Attributes
 */
export interface DAOVoteCreationAttributes
  extends Optional<DAOVoteAttributes, 'id' | 'proposalId' | 'createdAt'> {}

/**
 * Sequelize DAOVote Model
 */
export class DAOVoteModel
  extends Model<DAOVoteAttributes, DAOVoteCreationAttributes>
  implements DAOVoteAttributes
{
  declare id: string;
  declare daoId: string;
  declare userId: string;
  declare proposalId: string | null;
  declare voteValue: VoteValue;
  declare createdAt: Date;
}

const sequelize = getSequelizeInstance();

DAOVoteModel.init(
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
    proposalId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    voteValue: {
      type: DataTypes.ENUM(...Object.values(VoteValue)),
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
    tableName: 'dao_votes',
    timestamps: false,
    underscored: true,
  }
);

// Define associations
DAOVoteModel.belongsTo(DonorDAOModel, {
  foreignKey: 'daoId',
  as: 'dao',
});

DAOVoteModel.belongsTo(UserModel, {
  foreignKey: 'userId',
  as: 'user',
});

export default DAOVoteModel;

