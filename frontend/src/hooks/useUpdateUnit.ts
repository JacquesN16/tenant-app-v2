import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/axios';
import { type Unit } from '@tenant-lib/model';

const updateUnit = async (id: string, unit: Partial<Unit>): Promise<Unit> => {
  const { data } = await apiClient.put<Unit>(`/units/${id}`, unit);
  return data;
};

export const useUpdateUnit = () => {
  const queryClient = useQueryClient();

  return useMutation<Unit, Error, { id: string; unit: Partial<Unit> }>({
    mutationFn: ({ id, unit }) => updateUnit(id, unit),
    onSuccess: (data) => {
      // Invalidate and refetch unit queries
      queryClient.invalidateQueries({ queryKey: ['units'] });
      queryClient.invalidateQueries({ queryKey: ['unit', data.id] });
      // Also invalidate properties to update unit count/status
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      if (data.property?.id) {
        queryClient.invalidateQueries({ queryKey: ['property', data.property.id] });
      }
    },
  });
};