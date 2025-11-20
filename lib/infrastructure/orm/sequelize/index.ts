/**
 * Sequelize ORM Index
 * Exports all models and configuration
 */

import { getSequelizeInstance, testConnection, syncDatabase } from './config';

// Import models to ensure they are initialized
import UserModel from './models/UserModel';
import CampaignModel from './models/CampaignModel';
import DonationModel from './models/DonationModel';
import StakingModel from './models/StakingModel';
import RefundModel from './models/RefundModel';
import DonorDAOModel from './models/DonorDAOModel';
import DonorDAOMemberModel from './models/DonorDAOMemberModel';
import DAOVoteModel from './models/DAOVoteModel';

// Export models
export {
  UserModel,
  CampaignModel,
  DonationModel,
  StakingModel,
  RefundModel,
  DonorDAOModel,
  DonorDAOMemberModel,
  DAOVoteModel,
};

// Export configuration functions
export { getSequelizeInstance, testConnection, syncDatabase };

// Export all models as a single object
export const models = {
  User: UserModel,
  Campaign: CampaignModel,
  Donation: DonationModel,
  Staking: StakingModel,
  Refund: RefundModel,
  DonorDAO: DonorDAOModel,
  DonorDAOMember: DonorDAOMemberModel,
  DAOVote: DAOVoteModel,
};

export default models;


