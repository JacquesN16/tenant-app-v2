import { type Tenant } from '@tenant-lib/model';
import axios from './axios';

export const getAllTenants = async (): Promise<Tenant[]> => {
  const { data } = await axios.get('/tenant');
  return data;
};
