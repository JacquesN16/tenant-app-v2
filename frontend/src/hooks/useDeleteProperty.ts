import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/axios';

const deleteProperty = async (id: string): Promise<void> => {
  await apiClient.delete(`/properties/${id}`);
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};
