import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/axios';
import { type Property } from '@tenant-lib/model';

const createProperty = async (newProperty: Partial<Property>): Promise<Property> => {
  const { data } = await apiClient.post<Property>('/properties', newProperty);
  return data;
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();
  return useMutation<Property, Error, Partial<Property>>({
    mutationFn: createProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};
