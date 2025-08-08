import api from './axios';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
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