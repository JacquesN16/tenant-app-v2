import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useTranslation } from 'react-i18next';
import PropertyForm from './PropertyForm';
import { useUpdateProperty } from '../hooks/useUpdateProperty';
import { type Property } from '@tenant-lib/model';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Home, AlertCircle } from 'lucide-react';

interface EditPropertyModalProps {
  property: Property;
}

const EditPropertyModal = NiceModal.create<EditPropertyModalProps>(({ property }) => {
  const modal = useModal();
  const { t } = useTranslation();
  const { mutate: updateProperty, isError, error } = useUpdateProperty();

  const handleSubmit = (values: Partial<Property>) => {
    updateProperty({ id: property.id, property: values }, {
      onSuccess: () => {
        modal.hide();
      },
    });
  };

  return (
    <Dialog open={modal.visible} onOpenChange={modal.hide}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden bg-white border-0 shadow-xl mx-4 sm:mx-auto">
        <DialogHeader className="relative pb-4 sm:pb-6 border-b border-gray-100">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Home className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-900 break-words">
              {t('property.editProperty')}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="py-4 sm:py-6 overflow-y-auto max-h-[calc(95vh-140px)] sm:max-h-[calc(90vh-140px)]">
          {isError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-red-900">Error updating property</h4>
                  <p className="text-sm text-red-800 mt-1">
                    {error?.message || 'An unexpected error occurred. Please try again.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          <PropertyForm onSubmit={handleSubmit} initialValues={property} />
        </div>
      </DialogContent>
    </Dialog>
  );
});

export default EditPropertyModal;