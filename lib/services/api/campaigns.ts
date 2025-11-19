/**
 * Frontend API Service for Campaigns
 */

import { CampaignStatus } from '@/lib/domain/entities/Campaign';

const API_BASE = '/api/campaigns';

export const campaignsApi = {
  /**
   * Get all campaigns
   */
  async getAll() {
    const response = await fetch(API_BASE);
    return response.json();
  },

  /**
   * Get campaign by ID
   */
  async getById(id: string) {
    const response = await fetch(`${API_BASE}/${id}`);
    return response.json();
  },

  /**
   * Create a new campaign
   */
  async create(data: {
    title: string;
    description: string;
    goalAmount: number;
    goalCurrency?: string;
    imageUrl?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  /**
   * Update a campaign
   */
  async update(
    id: string,
    data: {
      title?: string;
      description?: string;
      goalAmount?: number;
      goalCurrency?: string;
      imageUrl?: string;
      startDate?: Date;
      endDate?: Date;
      status?: CampaignStatus;
    }
  ) {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  /**
   * Delete a campaign
   */
  async delete(id: string) {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  /**
   * Activate a campaign
   */
  async activate(id: string) {
    const response = await fetch(`${API_BASE}/${id}/activate`, {
      method: 'POST',
    });
    return response.json();
  },

  /**
   * Cancel a campaign
   */
  async cancel(id: string) {
    const response = await fetch(`${API_BASE}/${id}/cancel`, {
      method: 'POST',
    });
    return response.json();
  },

  /**
   * Add funds to a campaign
   */
  async addFunds(id: string, amount: number) {
    const response = await fetch(`${API_BASE}/${id}/add-funds`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }),
    });
    return response.json();
  },
};

