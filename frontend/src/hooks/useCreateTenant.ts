import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/axios';
import { type Tenant } from '@tenant-lib/model';

const createTenant = async (newTenant: Partial<Tenant>): Promise<Tenant> => {
  const { data } = await apiClient.post<Tenant>('/tenants', newTenant);
  return data;
};

export const useCreateTenant = () => {
  const queryClient = useQueryClient();
  return useMutation<Tenant, Error, Partial<Tenant>>({
    mutationFn: createTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  });
};
