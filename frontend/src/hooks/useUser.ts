import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserProfile, updateUserPreferences, type User } from '../api/user';
import type { UserPreferences } from '../api/user';

export const useUser = () => {
  return useQuery<User>({
    queryKey: ['user', 'profile'],
    queryFn: getUserProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

export const useUpdateUserPreferences = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateUserPreferences,
    onSuccess: (updatedUser) => {
      // Update the user profile cache
      queryClient.setQueryData(['user', 'profile'], updatedUser);
    },
    onError: (error) => {
      console.error('Failed to update user preferences:', error);
    },
  });
};