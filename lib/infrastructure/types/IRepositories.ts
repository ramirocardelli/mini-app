import { User } from '@/lib/domain/entities/User';
import { Campaign } from '@/lib/domain/entities/Campaign';
import { Donation } from '@/lib/domain/entities/Donation';

/**
 * Repository Interface for User Entity
 */
export interface IUserRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByWallet(walletAddress: string): Promise<User | null>;
  create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
  update(id: string, data: Partial<User>): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}

/**
 * Repository Interface for Campaign Entity
 */
export interface ICampaignRepository {
  findAll(): Promise<Campaign[]>;
  findById(id: string): Promise<Campaign | null>;
  findByCreatorId(creatorId: string): Promise<Campaign[]>;
  findByStatus(status: string): Promise<Campaign[]>;
  create(data: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>): Promise<Campaign>;
  update(id: string, data: Partial<Campaign>): Promise<Campaign | null>;
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
 * Main Repositories Interface
 * Aggregates all repository interfaces
 */
export interface Repositories {
  userRepository: IUserRepository;
  campaignRepository: ICampaignRepository;
  donationRepository: IDonationRepository;
}

