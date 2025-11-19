/**
 * Sequelize ORM Index
 * Exports all models and configuration
 */

import { getSequelizeInstance, testConnection, syncDatabase } from './config';

// Import models to ensure they are initialized
import UserModel from './models/UserModel';
import BeneficiaryModel from './models/BeneficiaryModel';
import CampaignModel from './models/CampaignModel';
import ProjectModel from './models/ProjectModel';
import DonationModel from './models/DonationModel';
import DonationProjectModel from './models/DonationProjectModel';

// Export models
export {
  UserModel,
  BeneficiaryModel,
  CampaignModel,
  ProjectModel,
  DonationModel,
  DonationProjectModel,
};

// Export configuration functions
export { getSequelizeInstance, testConnection, syncDatabase };

// Export all models as a single object
export const models = {
  User: UserModel,
  Beneficiary: BeneficiaryModel,
  Campaign: CampaignModel,
  Project: ProjectModel,
  Donation: DonationModel,
  DonationProject: DonationProjectModel,
};

export default models;


