import { useQuery } from '@tanstack/react-query';
import { getUserProfile, type User } from '../api/user';

export const useUser = () => {
  return useQuery<User>({
    queryKey: ['user', 'profile'],
    queryFn: getUserProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};