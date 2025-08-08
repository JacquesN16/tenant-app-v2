import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/axios';
import { type Unit } from '@tenant-lib/model';

const createUnit = async (newUnit: Partial<Unit>): Promise<Unit> => {
  const { data } = await apiClient.post<Unit>('/units', newUnit);
  return data;
};

export const useCreateUnit = () => {
  const queryClient = useQueryClient();
  return useMutation<Unit, Error, Partial<Unit>>({
    mutationFn: createUnit,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
      queryClient.invalidateQueries({ queryKey: ['property', data.property?.id] });
    },
  });
};
