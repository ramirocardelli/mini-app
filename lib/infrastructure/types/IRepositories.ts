import { User } from '@/lib/domain/entities/User';
import { Beneficiary } from '@/lib/domain/entities/Beneficiary';
import { Campaign } from '@/lib/domain/entities/Campaign';
import { Project } from '@/lib/domain/entities/Project';
import { Donation } from '@/lib/domain/entities/Donation';
import { DonationProject } from '@/lib/domain/entities/DonationProject';

/**
 * Repository Interface for User Entity
 */
export interface IUserRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByWallet(wallet: string): Promise<User | null>;
  create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
  update(id: string, data: Partial<User>): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}

/**
 * Repository Interface for Beneficiary Entity
 */
export interface IBeneficiaryRepository {
  findAll(): Promise<Beneficiary[]>;
  findById(id: string): Promise<Beneficiary | null>;
  findByWallet(wallet: string): Promise<Beneficiary | null>;
  create(data: Omit<Beneficiary, 'id' | 'createdAt' | 'updatedAt'>): Promise<Beneficiary>;
  update(id: string, data: Partial<Beneficiary>): Promise<Beneficiary | null>;
  delete(id: string): Promise<boolean>;
}

/**
 * Repository Interface for Campaign Entity
 */
export interface ICampaignRepository {
  findAll(): Promise<Campaign[]>;
  findById(id: string): Promise<Campaign | null>;
  create(data: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>): Promise<Campaign>;
  update(id: string, data: Partial<Campaign>): Promise<Campaign | null>;
  delete(id: string): Promise<boolean>;
}

/**
 * Repository Interface for Project Entity
 */
export interface IProjectRepository {
  findAll(): Promise<Project[]>;
  findById(id: string): Promise<Project | null>;
  findByCreatorId(creatorId: string): Promise<Project[]>;
  findByStatus(status: string): Promise<Project[]>;
  create(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project>;
  update(id: string, data: Partial<Project>): Promise<Project | null>;
  delete(id: string): Promise<boolean>;
}

/**
 * Repository Interface for Donation Entity
 */
export interface IDonationRepository {
  findAll(): Promise<Donation[]>;
  findById(id: string): Promise<Donation | null>;
  findByUserId(userId: string): Promise<Donation[]>;
  findByCampaignId(campaignId: string): Promise<Donation[]>;
  findByPaymentId(paymentId: string): Promise<Donation | null>;
  create(data: Omit<Donation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Donation>;
  update(id: string, data: Partial<Donation>): Promise<Donation | null>;
  delete(id: string): Promise<boolean>;
}

/**
 * Repository Interface for DonationProject Entity
 */
export interface IDonationProjectRepository {
  findAll(): Promise<DonationProject[]>;
  findById(id: string): Promise<DonationProject | null>;
  findByDonationId(donationId: string): Promise<DonationProject[]>;
  findByProjectId(projectId: string): Promise<DonationProject[]>;
  create(data: Omit<DonationProject, 'id' | 'createdAt'>): Promise<DonationProject>;
  delete(id: string): Promise<boolean>;
}

/**
 * Main Repositories Interface
 * Aggregates all repository interfaces
 */
export interface Repositories {
  userRepository: IUserRepository;
  beneficiaryRepository: IBeneficiaryRepository;
  campaignRepository: ICampaignRepository;
  projectRepository: IProjectRepository;
  donationRepository: IDonationRepository;
  donationProjectRepository: IDonationProjectRepository;
}

