import axios from './axios';
import type { Bill } from '@tenant-lib/model';

export const getBillsByTenant = async (tenantId: string): Promise<Bill[]> => {
  const response = await axios.get(`/bills/tenant/${tenantId}`);
  return response.data;
};

export const getBillById = async (id: string): Promise<Bill> => {
  const response = await axios.get(`/bills/${id}`);
  return response.data;
};

export const markBillAsPaid = async (id: string): Promise<Bill> => {
  const response = await axios.put(`/bills/${id}/pay`);
  return response.data;
};

export const downloadReceipt = async (billId: string): Promise<void> => {
  const response = await axios.get(`/bills/${billId}/receipt`, {
    responseType: 'blob',
  });
  
  // Create blob link to download
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  
  // Get filename from response headers or use default
  const contentDisposition = response.headers['content-disposition'];
  const filename = contentDisposition
    ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
    : `quittance-${billId}.pdf`;
  
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
