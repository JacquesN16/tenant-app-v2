import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/axios';
import { type Property, type Unit, type Tenant } from '@tenant-lib/model';

const fetchProperties = async (): Promise<Property[]> => {
  const { data } = await apiClient.get<Property[]>('/properties');
  return data;
};

const fetchPropertyById = async (id: string): Promise<Property> => {
  const { data } = await apiClient.get<Property>(`/properties/${id}`);
  return data;
};

const fetchUnitById = async (id: string): Promise<Unit> => {
  const { data } = await apiClient.get<Unit>(`/units/${id}`);
  return data;
};

const fetchUnits = async (): Promise<Unit[]> => {
  const { data } = await apiClient.get<Unit[]>('/units');
  return data;
};

const fetchTenantById = async (id: string): Promise<Tenant> => {
  const { data } = await apiClient.get<Tenant>(`/tenants/${id}`);
  return data;
};

export const useProperties = () => {
  return useQuery<Property[], Error>({
    queryKey: ['properties'],
    queryFn: fetchProperties,
  });
};

export const useProperty = (id?: string) => {
  return useQuery<Property, Error>({
    queryKey: ['property', id],
    queryFn: () => fetchPropertyById(id as string),
    enabled: !!id,
  });
};

export const useUnit = (id?: string) => {
  return useQuery<Unit, Error>({
    queryKey: ['unit', id],
    queryFn: () => fetchUnitById(id as string),
    enabled: !!id,
  });
};

export const useTenant = (id?: string) => {
  return useQuery<Tenant, Error>({
    queryKey: ['tenant', id],
    queryFn: () => fetchTenantById(id as string),
    enabled: !!id,
  });
};

export const useUnits = () => {
  return useQuery<Unit[], Error>({
    queryKey: ['units'],
    queryFn: fetchUnits,
  });
};
