import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useTranslation } from 'react-i18next';
import TenantForm from './TenantForm';
import { useCreateTenant } from '../hooks/useCreateTenant';
import { type Tenant } from '@tenant-lib/model';
import { useUnits, useProperties } from '../hooks/useData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CreateTenantModalProps {
  preSelectedUnitId?: string;
}

const CreateTenantModal = NiceModal.create<CreateTenantModalProps>(({ preSelectedUnitId }) => {
  const modal = useModal();
  const { t } = useTranslation();
  const { mutate: createTenant, isError, error } = useCreateTenant();
  const { data: units, isLoading: isLoadingUnits } = useUnits();
  const { data: properties, isLoading: isLoadingProperties } = useProperties();

  const handleSubmit = (values: Partial<Tenant>) => {
    createTenant(values, {
      onSuccess: () => {
        modal.hide();
      },
    });
  };

  const availableUnits = preSelectedUnitId 
    ? units?.filter(unit => unit.id === preSelectedUnitId || !unit.isOccupied) || []
    : units?.filter(unit => !unit.isOccupied) || [];

  const initialValues = preSelectedUnitId 
    ? { unitId: preSelectedUnitId }
    : undefined;

  return (
    <Dialog open={modal.visible} onOpenChange={modal.hide} modal={true} className='w-80'>
      <DialogContent className="bg-card text-foreground border border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">{t('tenant.createTenant')}</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          {isLoadingUnits || isLoadingProperties ? (
            <p className="text-muted-foreground">{t('common.loading')}</p>
          ) : (
            <TenantForm 
              onSubmit={handleSubmit} 
              vacantUnits={availableUnits} 
              properties={properties || []}
              initialValues={initialValues}
            />
          )}
          {isError && <p className="text-destructive mt-2">{t('common.error')}: {error?.message}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
});

export default CreateTenantModal;
