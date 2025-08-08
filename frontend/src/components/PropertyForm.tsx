import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { PropertyType, type Address, type Property } from '@tenant-lib/model';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormField } from '@/components/ui/form-field';
import { MapPin } from 'lucide-react';

interface PropertyFormProps {
  onSubmit: (values: Partial<Property>) => void;
  initialValues?: Partial<Property>;
}

interface PropertyFormValues {
  address: Address;
  propertyType?: PropertyType;
}


const PropertyForm: React.FC<PropertyFormProps> = ({ onSubmit, initialValues }) => {
  const { t } = useTranslation();

  const validationSchema = Yup.object({
    address: Yup.object({
      street: Yup.string().required(t('form.required')),
      city: Yup.string().required(t('form.required')),
      state: Yup.string().when('country', {
        is: (country: string) => country && (country.toLowerCase() === 'us' || country.toLowerCase() === 'usa' || country.toLowerCase() === 'united states'),
        then: (schema) => schema.required(t('form.required')),
        otherwise: (schema) => schema.optional(),
      }),
      zipCode: Yup.string().required(t('form.required')),
      country: Yup.string().required(t('form.required')),
    }),
    propertyType: Yup.string().oneOf(Object.values(PropertyType)).optional(),
  });

  const formik = useFormik<PropertyFormValues>({
    initialValues: {
      address: initialValues?.address || {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
      propertyType: initialValues?.propertyType,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  // Helper function to check if address field has error
  const hasAddressError = (field: keyof Address): boolean => {
    return !!(
      formik.touched.address?.[field] && 
      (formik.errors.address as never)?.[field]
    );
  };

  // Helper function to get address field error message
  const getAddressError = (field: keyof Address): string | undefined => {
    return hasAddressError(field) ? (formik.errors.address as never)?.[field] : undefined;
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      {/* Address Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
          <MapPin className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">{t('property.form.address')}</h3>
        </div>

        {/* Street Address */}
        <FormField
          label={t('address.street')}
          name="address.street"
          value={formik.values.address.street}
          onChange={(value) => formik.setFieldValue('address.street', value)}
          onBlur={formik.handleBlur}
          error={getAddressError('street')}
          placeholder="123 Rue de la Paix"
        />

        {/* City and State */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label={t('address.city')}
            name="address.city"
            value={formik.values.address.city}
            onChange={(value) => formik.setFieldValue('address.city', value)}
            onBlur={formik.handleBlur}
            error={getAddressError('city')}
            placeholder="Paris"
          />
          <FormField
            label={t('address.state')}
            name="address.state"
            value={formik.values.address.state}
            onChange={(value) => formik.setFieldValue('address.state', value)}
            onBlur={formik.handleBlur}
            error={getAddressError('state')}
            placeholder="Île-de-France"
          />
        </div>

        {/* Zip Code and Country */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label={t('address.zipCode')}
            name="address.zipCode"
            value={formik.values.address.zipCode}
            onChange={(value) => formik.setFieldValue('address.zipCode', value)}
            onBlur={formik.handleBlur}
            error={getAddressError('zipCode')}
            placeholder="75001"
          />
          <FormField
            label={t('address.country')}
            name="address.country"
            value={formik.values.address.country}
            onChange={(value) => formik.setFieldValue('address.country', value)}
            onBlur={formik.handleBlur}
            error={getAddressError('country')}
            placeholder="France"
          />
        </div>
      </div>

      {/* Property Type Section */}
      <div className="space-y-2">
        <Label htmlFor="propertyType" className="text-sm font-medium text-gray-700">
          {t('property.form.propertyType')}
        </Label>
        <Select
          onValueChange={(value) => formik.setFieldValue('propertyType', value === '' ? undefined : value)}
          value={formik.values.propertyType || ''}
        >
          <SelectTrigger className={`w-full ${
            formik.touched.propertyType && formik.errors.propertyType 
              ? 'border-red-500 ring-2 ring-red-200' 
              : 'border-gray-300'
          }`}>
            <SelectValue placeholder={t('form.selectPropertyType')} />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg">
            {Object.values(PropertyType).map(type => (
              <SelectItem key={type} value={type} className="hover:bg-gray-50">
                {t(`property.type.${type}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formik.touched.propertyType && formik.errors.propertyType && (
          <div className="text-red-600 text-sm mt-1 flex items-center">
            <span className="w-4 h-4 mr-1">⚠</span>
            {formik.errors.propertyType as string}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-4 m-1">
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform shadow-lg hover:shadow-xl"
        >
          {t('form.submit')}
        </Button>
      </div>
    </form>
  );
};

export default PropertyForm;
