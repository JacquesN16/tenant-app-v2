import axios from './axios';

export const getDashboardStats = async () => {
  const { data } = await axios.get('/dashboard/stats');
  return data;
};
