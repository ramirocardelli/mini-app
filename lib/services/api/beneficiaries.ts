/**
 * Frontend API Service for Beneficiaries
 */

const API_BASE = '/api/beneficiaries';

export const beneficiariesApi = {
  /**
   * Get all beneficiaries
   */
  async getAll() {
    const response = await fetch(API_BASE);
    return response.json();
  },

  /**
   * Get beneficiary by ID
   */
  async getById(id: string) {
    const response = await fetch(`${API_BASE}/${id}`);
    return response.json();
  },

  /**
   * Create a new beneficiary
   */
  async create(data: { name: string; wallet: string }) {
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
   * Update a beneficiary
   */
  async update(id: string, data: { name?: string; wallet?: string }) {
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
   * Delete a beneficiary
   */
  async delete(id: string) {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};

