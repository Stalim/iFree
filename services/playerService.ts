import axios from 'axios';
import { API_URL } from '@/config';
import { PlayerInfo } from '@/components/PlayerProfile';

// Get all players
export const getAllPlayers = async (): Promise<PlayerInfo[]> => {
  try {
    const response = await axios.get(`${API_URL}/players`);
    return response.data;
  } catch (error) {
    console.error('Error fetching players:', error);
    throw error;
  }
};

// Get a player by ID
export const getPlayerById = async (id: string): Promise<PlayerInfo> => {
  try {
    const response = await axios.get(`${API_URL}/players/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching player with ID ${id}:`, error);
    throw error;
  }
};

// Create a new player
export const createPlayer = async (playerData: Omit<PlayerInfo, '_id'>): Promise<PlayerInfo> => {
  try {
    const response = await axios.post(`${API_URL}/players`, playerData);
    return response.data;
  } catch (error) {
    console.error('Error creating player:', error);
    throw error;
  }
};

// Create a new player with image uploads
export const createPlayerWithImages = async (
  playerData: Omit<PlayerInfo, '_id' | 'imageUrl' | 'bannerUrl'>,
  profileImage?: File | Blob,
  bannerImage?: File | Blob
): Promise<PlayerInfo> => {
  try {
    const formData = new FormData();
    
    // Add player data as JSON string
    formData.append('playerData', JSON.stringify(playerData));
    
    // Add images if provided
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }
    
    if (bannerImage) {
      formData.append('bannerImage', bannerImage);
    }
    
    const response = await axios.post(`${API_URL}/players`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating player with images:', error);
    throw error;
  }
};

// Update a player
export const updatePlayer = async (id: string, playerData: Partial<PlayerInfo>): Promise<PlayerInfo> => {
  try {
    const response = await axios.put(`${API_URL}/players/${id}`, playerData);
    return response.data;
  } catch (error) {
    console.error(`Error updating player with ID ${id}:`, error);
    throw error;
  }
};

// Update a player with image uploads
export const updatePlayerWithImages = async (
  id: string,
  playerData: Partial<Omit<PlayerInfo, 'imageUrl' | 'bannerUrl'>>,
  profileImage?: File | Blob,
  bannerImage?: File | Blob
): Promise<PlayerInfo> => {
  try {
    const formData = new FormData();
    
    // Add player data as JSON string
    formData.append('playerData', JSON.stringify(playerData));
    
    // Add images if provided
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }
    
    if (bannerImage) {
      formData.append('bannerImage', bannerImage);
    }
    
    const response = await axios.put(`${API_URL}/players/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error updating player with ID ${id} with images:`, error);
    throw error;
  }
};

// Delete a player
export const deletePlayer = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/players/${id}`);
  } catch (error) {
    console.error(`Error deleting player with ID ${id}:`, error);
    throw error;
  }
}; 