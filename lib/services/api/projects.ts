/**
 * Frontend API Service for Projects
 */

import { ProjectStatus } from '@/lib/domain/entities/Project';

const API_BASE = '/api/projects';

export const projectsApi = {
  /**
   * Get all projects
   */
  async getAll() {
    const response = await fetch(API_BASE);
    return response.json();
  },

  /**
   * Get projects by creator ID
   */
  async getByCreator(creatorId: string) {
    const response = await fetch(`${API_BASE}?creatorId=${creatorId}`);
    return response.json();
  },

  /**
   * Get projects by status
   */
  async getByStatus(status: ProjectStatus) {
    const response = await fetch(`${API_BASE}?status=${status}`);
    return response.json();
  },

  /**
   * Get project by ID
   */
  async getById(id: string) {
    const response = await fetch(`${API_BASE}/${id}`);
    return response.json();
  },

  /**
   * Create a new project
   */
  async create(data: {
    title: string;
    description: string;
    goalAmount: number;
    goalCurrency?: string;
    vaultAddress: string;
    creatorId: string;
    deadline?: Date;
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
   * Update a project
   */
  async update(
    id: string,
    data: {
      title?: string;
      description?: string;
      goalAmount?: number;
      goalCurrency?: string;
      status?: ProjectStatus;
      deadline?: Date;
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
   * Delete a project
   */
  async delete(id: string) {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  /**
   * Approve a project
   */
  async approve(id: string) {
    const response = await fetch(`${API_BASE}/${id}/approve`, {
      method: 'POST',
    });
    return response.json();
  },

  /**
   * Reject a project
   */
  async reject(id: string) {
    const response = await fetch(`${API_BASE}/${id}/reject`, {
      method: 'POST',
    });
    return response.json();
  },

  /**
   * Activate a project
   */
  async activate(id: string) {
    const response = await fetch(`${API_BASE}/${id}/activate`, {
      method: 'POST',
    });
    return response.json();
  },
};

