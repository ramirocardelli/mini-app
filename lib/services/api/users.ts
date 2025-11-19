/**
 * Frontend API Service for Users
 */

const API_BASE = '/api/users';

export const usersApi = {
  /**
   * Get all users
   */
  async getAll() {
    const response = await fetch(API_BASE);
    return response.json();
  },

  /**
   * Get user by ID
   */
  async getById(id: string) {
    const response = await fetch(`${API_BASE}/${id}`);
    return response.json();
  },

  /**
   * Get user by wallet address
   */
  async getByWallet(wallet: string) {
    const response = await fetch(`${API_BASE}?wallet=${wallet}`);
    return response.json();
  },

  /**
   * Create a new user
   */
  async create(data: { wallet: string; username: string }) {
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
   * Update a user
   */
  async update(id: string, data: { username?: string }) {
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
   * Delete a user
   */
  async delete(id: string) {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};

