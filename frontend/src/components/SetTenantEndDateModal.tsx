import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, AlertCircle } from 'lucide-react';
import { useUpdateTenant } from '../hooks/useUpdateTenant';
import { type Tenant } from '@tenant-lib/model';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { toast } from 'react-toastify';

interface SetTenantEndDateModalProps {
  tenant: Tenant;
}

const SetTenantEndDateModal = NiceModal.create<SetTenantEndDateModalProps>(({ tenant }) => {
  const modal = useModal();
  const { t } = useTranslation();
  const [endDate, setEndDate] = useState<Date | undefined>(
    tenant.leaseEndDate ? new Date(tenant.leaseEndDate) : undefined
  );
  
  const { mutate: updateTenant, isPending: isUpdating, isError, error } = useUpdateTenant();

  const handleSubmit = () => {
    if (!endDate) return;
    
    updateTenant({ 
      id: tenant.id, 
      tenant: { leaseEndDate: endDate }
    }, {
      onSuccess: () => {
        toast.success(t('tenant.endDateUpdated'));
        modal.hide();
      },
      onError: (error) => {
        toast.error(error.message || t('common.unexpectedError'));
      }
    });
  };

  const handleCancel = () => {
    setEndDate(tenant.leaseEndDate ? new Date(tenant.leaseEndDate) : undefined);
    modal.hide();
  };

  return (
    <Dialog open={modal.visible} onOpenChange={modal.hide}>
      <DialogContent className="w-[95vw] max-w-md mx-4 sm:mx-auto">
        <DialogHeader className="relative pb-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold text-gray-900">
                {t('tenant.setEndDate')}
              </DialogTitle>
              <DialogDescription className="text-gray-600 mt-1">
                {t('tenant.setEndDateDescription')}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-6">
          {isError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-red-900">
                    {t('common.error')}
                  </h4>
                  <p className="text-sm text-red-800 mt-1">
                    {error?.message || t('common.unexpectedError')}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-sm font-medium text-gray-700">
                {t('tenant.leaseEndDate')}
              </Label>
              <DatePicker
                date={endDate}
                onSelect={setEndDate}
                placeholder={t('tenant.selectEndDate') || 'Select end date'}
                className="w-full"
              />
            </div>
            
            {tenant.firstName && tenant.lastName && (
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <strong>{t('tenant.tenant')}:</strong> {tenant.firstName} {tenant.lastName}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            disabled={isUpdating}
            className="flex-1"
          >
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!endDate || isUpdating}
            className="flex-1"
          >
            {isUpdating ? t('common.saving') : t('common.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

export default SetTenantEndDateModal;