import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useTranslation } from 'react-i18next';
import PropertyForm from './PropertyForm';
import { useCreateProperty } from '../hooks/useCreateProperty';
import { type Property } from '@tenant-lib/model';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {  Home, AlertCircle } from 'lucide-react';


const CreatePropertyModal = NiceModal.create(() => {
  const modal = useModal();
  const { t } = useTranslation();
  const { mutate: createProperty, isError, error, isPending } = useCreateProperty();

  const handleSubmit = (values: Partial<Property>) => {
    createProperty(values, {
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
              {t('property.createProperty')}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="py-4 sm:py-6 overflow-y-auto max-h-[calc(95vh-140px)] sm:max-h-[calc(90vh-140px)]">
          {isError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-red-900">{t('property.errorCreating')}</h4>
                  <p className="text-sm text-red-800 mt-1">
                    {error?.message || t('common.unexpectedError')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {isPending && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="flex flex-col items-center space-y-3">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-sm text-gray-600 font-medium">{t('property.creating')}</p>
              </div>
            </div>
          )}

          <div className={isPending ? 'opacity-50 pointer-events-none' : ''}>
            <PropertyForm onSubmit={handleSubmit} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

export default CreatePropertyModal;
