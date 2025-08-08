import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useTranslation } from 'react-i18next';
import UnitForm from './UnitForm';
import { useCreateUnit } from '../hooks/useCreateUnit';
import { type Unit, type Property } from '@tenant-lib/model';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CreateUnitModalProps {
  propertyId: string;
}

const CreateUnitModal = NiceModal.create<CreateUnitModalProps>(({ propertyId }) => {
  const modal = useModal();
  const { t } = useTranslation();
  const { mutate: createUnit, isError, error } = useCreateUnit();

  const handleSubmit = (values: Partial<Unit>) => {
    createUnit({ ...values, property: { id: propertyId } as Property }, {
      onSuccess: () => {
        modal.hide();
      },
    });
  };

  return (
    <Dialog open={modal.visible} onOpenChange={modal.hide}>
      <DialogContent className="bg-card text-foreground border border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">{t('unit.createUnit')}</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <UnitForm onSubmit={handleSubmit} />
          {isError && <p className="text-destructive mt-2">{t('common.error')}: {error?.message}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
});

export default CreateUnitModal;
