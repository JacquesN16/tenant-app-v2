import { type Unit } from '@tenant-lib/model';
import axios from './axios';

export const getAllUnits = async (): Promise<Unit[]> => {
  const { data } = await axios.get('/unit');
  return data;
};
