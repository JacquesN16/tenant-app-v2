import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/axios';
import { type Property } from '@tenant-lib/model';

const updateProperty = async (id: string, property: Partial<Property>): Promise<Property> => {
  const { data } = await apiClient.put<Property>(`/properties/${id}`, property);
  return data;
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation<Property, Error, { id: string; property: Partial<Property> }>({
    mutationFn: ({ id, property }) => updateProperty(id, property),
    onSuccess: (data) => {
      // Invalidate and refetch property queries
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['property', data.id] });
    },
  });
};