import { Campaign, Donation, UserProfile } from './types';

const CAMPAIGNS_STORAGE_KEY = 'lemoncash_campaigns';
const DONATIONS_STORAGE_KEY = 'lemoncash_donations';

// Funciones para Campañas
export function getCampaigns(): Campaign[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(CAMPAIGNS_STORAGE_KEY);
  if (!stored) return [];
  
  try {
    const campaigns = JSON.parse(stored);
    return campaigns.map((c: any) => ({
      ...c,
      createdAt: new Date(c.createdAt),
    }));
  } catch {
    return [];
  }
}

export function saveCampaign(campaign: Campaign): void {
  const campaigns = getCampaigns();
  campaigns.push(campaign);
  localStorage.setItem(CAMPAIGNS_STORAGE_KEY, JSON.stringify(campaigns));
}

export function updateCampaign(campaignId: string, updates: Partial<Campaign>): void {
  const campaigns = getCampaigns();
  const index = campaigns.findIndex(c => c.id === campaignId);
  
  if (index !== -1) {
    campaigns[index] = { ...campaigns[index], ...updates };
    localStorage.setItem(CAMPAIGNS_STORAGE_KEY, JSON.stringify(campaigns));
  }
}

export function getCampaignById(id: string): Campaign | undefined {
  return getCampaigns().find(c => c.id === id);
}

// Funciones para Donaciones/Aportes
export function getDonations(): Donation[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(DONATIONS_STORAGE_KEY);
  if (!stored) return [];
  
  try {
    const donations = JSON.parse(stored);
    return donations.map((d: any) => ({
      ...d,
      timestamp: new Date(d.timestamp),
    }));
  } catch {
    return [];
  }
}

export function saveDonation(donation: Donation): void {
  const donations = getDonations();
  donations.push(donation);
  localStorage.setItem(DONATIONS_STORAGE_KEY, JSON.stringify(donations));
}

export function getDonationsByCampaignId(campaignId: string): Donation[] {
  return getDonations().filter(d => d.campaignId === campaignId);
}

// Funciones para Perfil de Usuario
const PROFILE_STORAGE_KEY = 'lemoncash_user_profile';

export function getUserProfile(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
  if (!stored) return null;
  
  try {
    const profile = JSON.parse(stored);
    return {
      ...profile,
      createdAt: new Date(profile.createdAt),
    };
  } catch {
    return null;
  }
}

export function updateUserProfile(updates: Partial<UserProfile>): void {
  const profile = getUserProfile();
  if (profile) {
    const updatedProfile = { ...profile, ...updates };
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updatedProfile));
  }
}
