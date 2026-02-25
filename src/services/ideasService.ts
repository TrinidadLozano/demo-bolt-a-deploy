import { Idea, NewIdea } from '../types/idea';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const ideasService = {
  async getAll(): Promise<Idea[]> {
    const response = await fetch(`${API_URL}/ideas`, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch ideas');
    }
    return response.json();
  },

  async create(idea: NewIdea): Promise<Idea> {
    const response = await fetch(`${API_URL}/ideas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(idea),
    });
    if (!response.ok) {
      throw new Error('Failed to create idea');
    }
    return response.json();
  },
};
