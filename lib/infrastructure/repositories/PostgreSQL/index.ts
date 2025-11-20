/**
 * PostgreSQL Repositories Index
 * Exports all repository implementations
 */

import { Repositories } from '@/lib/infrastructure/types/IRepositories';
import { UserRepository } from './UserRepository';
import { CampaignRepository } from './CampaignRepository';
import { DonationRepository } from './DonationRepository';

/**
 * Create and export all repository instances
 */
export const repositories: Repositories = {
  userRepository: new UserRepository(),
  campaignRepository: new CampaignRepository(),
  donationRepository: new DonationRepository(),
};

export default repositories;


