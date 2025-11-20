import { DataTypes, Model, Optional } from 'sequelize';
import { getSequelizeInstance } from '../config';
import DonationModel from './DonationModel';
import ProjectModel from './ProjectModel';

/**
 * DonationProject Model Attributes Interface
 * Junction table between Donations and Projects
 */
export interface DonationProjectAttributes {
  id: string;
  donationId: string;
  projectId: string;
  createdAt: Date;
}

/**
 * DonationProject Creation Attributes
 */
export interface DonationProjectCreationAttributes
  extends Optional<DonationProjectAttributes, 'id' | 'createdAt'> {}

/**
 * Sequelize DonationProject Model
 */
export class DonationProjectModel
  extends Model<DonationProjectAttributes, DonationProjectCreationAttributes>
  implements DonationProjectAttributes
{
  declare id: string;
  declare donationId: string;
  declare projectId: string;
  declare createdAt: Date;
}

const sequelize = getSequelizeInstance();

DonationProjectModel.init(
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
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'projects',
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
    tableName: 'donations_projects',
    timestamps: false,
    underscored: true,
  }
);

// Define associations
DonationProjectModel.belongsTo(DonationModel, {
  foreignKey: 'donationId',
  as: 'donation',
});

DonationProjectModel.belongsTo(ProjectModel, {
  foreignKey: 'projectId',
  as: 'project',
});

// Many-to-many relationship
DonationModel.belongsToMany(ProjectModel, {
  through: DonationProjectModel,
  foreignKey: 'donationId',
  as: 'projects',
});

ProjectModel.belongsToMany(DonationModel, {
  through: DonationProjectModel,
  foreignKey: 'projectId',
  as: 'donations',
});

export default DonationProjectModel;


