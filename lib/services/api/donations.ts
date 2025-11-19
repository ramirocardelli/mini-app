/**
 * Frontend API Service for Donations
 */

const API_BASE = '/api/donations';

export const donationsApi = {
  /**
   * Get all donations
   */
  async getAll() {
    const response = await fetch(API_BASE);
    return response.json();
  },

  /**
   * Get donations by user ID
   */
  async getByUser(userId: string) {
    const response = await fetch(`${API_BASE}?userId=${userId}`);
    return response.json();
  },

  /**
   * Get donations by campaign ID
   */
  async getByCampaign(campaignId: string) {
    const response = await fetch(`${API_BASE}?campaignId=${campaignId}`);
    return response.json();
  },

  /**
   * Get donation by ID
   */
  async getById(id: string) {
    const response = await fetch(`${API_BASE}/${id}`);
    return response.json();
  },

  /**
   * Create a new donation
   */
  async create(data: {
    userId: string;
    campaignId: string;
    amountWei: string;
    paymentId: string;
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
   * Mark donation as completed
   */
  async markAsCompleted(id: string, txHash: string) {
    const response = await fetch(`${API_BASE}/${id}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ txHash }),
    });
    return response.json();
  },

  /**
   * Mark donation as failed
   */
  async markAsFailed(id: string) {
    const response = await fetch(`${API_BASE}/${id}/fail`, {
      method: 'POST',
    });
    return response.json();
  },

  /**
   * Refund a donation
   */
  async refund(id: string) {
    const response = await fetch(`${API_BASE}/${id}/refund`, {
      method: 'POST',
    });
    return response.json();
  },

  /**
   * Link donation to project
   */
  async linkToProject(donationId: string, projectId: string) {
    const response = await fetch(`${API_BASE}/link-project`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ donationId, projectId }),
    });
    return response.json();
  },
};

