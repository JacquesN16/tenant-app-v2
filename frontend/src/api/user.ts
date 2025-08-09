import api from './axios';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  language?: string;
  theme?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const getUserProfile = async (): Promise<User> => {
  const response = await api.get('/user/profile');
  return response.data;
};

export const updateUserProfile = async (userData: Partial<User>): Promise<User> => {
  const response = await api.put('/user/profile', userData);
  return response.data;
};

export interface UserPreferences {
  language?: string;
  theme?: string;
}

export const updateUserPreferences = async (preferences: UserPreferences): Promise<User> => {
  const response = await api.put('/user/preferences', preferences);
  return response.data;
};