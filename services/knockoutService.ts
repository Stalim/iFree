import axios from 'axios';
import { API_ENDPOINTS } from '@/config';

export interface Competitor {
  id: string;
  name: string;
  flag?: string;
  imageUrl?: string;
}

export interface Match {
  id: string;
  date: string;
  competitor1: Competitor;
  competitor2: Competitor;
  winner: string | null;
  score1: number;
  score2: number;
}

export interface Round {
  name: string;
  matches: Match[];
}

export interface KnockoutStage {
  _id?: string;
  leagueId: string;
  title: string;
  rounds: Round[];
  currentRound: number;
  createdAt?: string;
  updatedAt?: string;
}

// Get knockout stage for a specific league
export const getKnockoutStage = async (leagueId: string): Promise<KnockoutStage> => {
  try {
    const response = await axios.get(`${API_ENDPOINTS.KNOCKOUT}/${leagueId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching knockout stage for league ${leagueId}:`, error);
    throw error;
  }
};

// Create or replace knockout stage for a league
export const createKnockoutStage = async (leagueId: string, knockoutData: Omit<KnockoutStage, '_id' | 'createdAt' | 'updatedAt'>): Promise<KnockoutStage> => {
  try {
    const response = await axios.post(`${API_ENDPOINTS.KNOCKOUT}/${leagueId}`, knockoutData);
    return response.data;
  } catch (error) {
    console.error(`Error creating knockout stage for league ${leagueId}:`, error);
    throw error;
  }
};

// Update match result and advance winners
export const updateMatchResult = async (leagueId: string, matchId: string, winnerId: string, score1?: number, score2?: number): Promise<KnockoutStage> => {
  try {
    const response = await axios.patch(`${API_ENDPOINTS.KNOCKOUT}/${leagueId}/match/${matchId}`, {
      winnerId,
      score1,
      score2
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating match result for league ${leagueId}, match ${matchId}:`, error);
    throw error;
  }
};

// Reset a round (for admin purposes)
export const resetRound = async (leagueId: string, roundIndex: number): Promise<KnockoutStage> => {
  try {
    const response = await axios.patch(`${API_ENDPOINTS.KNOCKOUT}/${leagueId}/reset/${roundIndex}`);
    return response.data;
  } catch (error) {
    console.error(`Error resetting round ${roundIndex} for league ${leagueId}:`, error);
    throw error;
  }
}; 