import { type Property } from '@tenant-lib/model';
import axios from './axios';

export const getAllProperties = async (): Promise<Property[]> => {
  const { data } = await axios.get('/properties');
  return data;
};

export const deleteProperty = async (id: string): Promise<void> => {
  await axios.delete(`/properties/${id}`);
};

