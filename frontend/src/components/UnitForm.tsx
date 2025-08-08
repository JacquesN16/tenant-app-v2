import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { type Unit } from '@tenant-lib/model';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField } from '@/components/ui/form-field';
import { Hash } from 'lucide-react';

interface UnitFormProps {
  onSubmit: (values: Partial<Unit>) => void;
  initialValues?: Partial<Unit>;
}


const UnitForm: React.FC<UnitFormProps> = ({ onSubmit, initialValues }) => {
  const { t } = useTranslation();

  const validationSchema = Yup.object({
    unitNumber: Yup.string().required(t('form.required')),
    bedrooms: Yup.number().min(0).max(20).optional(),
    bathrooms: Yup.number().min(0).max(10).optional(),
    squareFootage: Yup.number().min(10).max(200).optional(), // Floor area in m² (10-200 m²)
    isOccupied: Yup.boolean().required(t('form.required')),
  });

  const formik = useFormik({
    initialValues: initialValues || {
      unitNumber: '',
      bedrooms: 0,
      bathrooms: 0,
      squareFootage: 0, // Default floor area in m²
      isOccupied: false,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      {/* Unit Details Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
          <Hash className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">{t('unit.information')}</h3>
        </div>

        {/* Unit Number */}
        <FormField
          label={t('unit.unitNumber')}
          name="unitNumber"
          value={formik.values.unitNumber || 0}
          onChange={(value) => formik.setFieldValue('unitNumber', value)}
          onBlur={formik.handleBlur}
          error={formik.touched.unitNumber && formik.errors.unitNumber ? formik.errors.unitNumber as string : undefined}
          placeholder="101"
        />

        {/* Bedrooms and Bathrooms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label={t('unit.bedrooms')}
            name="bedrooms"
            type="number"
            value={formik.values.bedrooms || ''}
            onChange={(value) => formik.setFieldValue('bedrooms', value ? parseInt(value) : undefined)}
            onBlur={formik.handleBlur}
            error={formik.touched.bedrooms && formik.errors.bedrooms ? formik.errors.bedrooms as string : undefined}
            placeholder="2"
          />
          <FormField
            label={t('unit.bathrooms')}
            name="bathrooms"
            type="number"
            value={formik.values.bathrooms || ''}
            onChange={(value) => formik.setFieldValue('bathrooms', value ? parseInt(value) : undefined)}
            onBlur={formik.handleBlur}
            error={formik.touched.bathrooms && formik.errors.bathrooms ? formik.errors.bathrooms as string : undefined}
            placeholder="1"
          />
        </div>

        {/* Floor Area */}
        <FormField
          label={t('unit.squareFootage')}
          name="squareFootage"
          type="number"
          value={formik.values.squareFootage || ''}
          onChange={(value) => formik.setFieldValue('squareFootage', value ? parseInt(value) : undefined)}
          onBlur={formik.handleBlur}
          error={formik.touched.squareFootage && formik.errors.squareFootage ? formik.errors.squareFootage as string : undefined}
          placeholder="75"
        />

        {/* Occupancy Status */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">{t('unit.status')}</Label>
          <div className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg">
            <Checkbox
              id="isOccupied"
              checked={formik.values.isOccupied}
              onCheckedChange={(checked) => formik.setFieldValue('isOccupied', checked)}
              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
            />
            <Label htmlFor="isOccupied" className="text-sm font-medium text-gray-700 cursor-pointer">
              {t('unit.isOccupied')}
            </Label>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4 m-1">
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
        >
          {t('form.submit')}
        </Button>
      </div>
    </form>
  );
};

export default UnitForm;
