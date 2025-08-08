import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/axios';
import { type Tenant } from '@tenant-lib/model';

const updateTenant = async (id: string, tenant: Partial<Tenant>): Promise<Tenant> => {
  const { data } = await apiClient.put<Tenant>(`/tenants/${id}`, tenant);
  return data;
};

export const useUpdateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation<Tenant, Error, { id: string; tenant: Partial<Tenant> }>({
    mutationFn: ({ id, tenant }) => updateTenant(id, tenant),
    onSuccess: (data) => {
      // Invalidate and refetch tenant queries
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      queryClient.invalidateQueries({ queryKey: ['tenant', data.id] });
      // Also invalidate units and properties to update occupancy status
      queryClient.invalidateQueries({ queryKey: ['units'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      if (data.unitId) {
        queryClient.invalidateQueries({ queryKey: ['unit', data.unitId] });
      }
    },
  });
};