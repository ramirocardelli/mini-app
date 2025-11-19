/**
 * PostgreSQL Repositories Index
 * Exports all repository implementations
 */

import { Repositories } from '@/lib/infrastructure/types/IRepositories';
import { UserRepository } from './UserRepository';
import { BeneficiaryRepository } from './BeneficiaryRepository';
import { CampaignRepository } from './CampaignRepository';
import { ProjectRepository } from './ProjectRepository';
import { DonationRepository } from './DonationRepository';
import { DonationProjectRepository } from './DonationProjectRepository';

/**
 * Create and export all repository instances
 */
export const repositories: Repositories = {
  userRepository: new UserRepository(),
  beneficiaryRepository: new BeneficiaryRepository(),
  campaignRepository: new CampaignRepository(),
  projectRepository: new ProjectRepository(),
  donationRepository: new DonationRepository(),
  donationProjectRepository: new DonationProjectRepository(),
};

export default repositories;


