import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { type Unit, type Property, type Tenant } from '@tenant-lib/model';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField } from '@/components/ui/form-field';
import { User, DollarSign, Home } from 'lucide-react';

interface TenantFormProps {
  onSubmit: (values: Partial<Tenant>) => void;
  initialValues?: Partial<Tenant>;
  vacantUnits: Unit[];
  properties: Property[];
}


const TenantForm: React.FC<TenantFormProps> = ({ onSubmit, initialValues, vacantUnits, properties }) => {
  const { t } = useTranslation();

  const validationSchema = Yup.object({
    firstName: Yup.string().required(t('form.required')),
    lastName: Yup.string().required(t('form.required')),
    email: Yup.string().email(t('form.invalidEmail')).optional(),
    phoneNumber: Yup.string().optional(),
    monthlyRent: Yup.number().required(t('form.required')),
    monthlyCharge: Yup.number().required(t('form.required')),
    unitId: Yup.string().required(t('form.required')),
    entryDate: Yup.date().required(t('form.required')),
    isActive: Yup.boolean().required(t('form.required')),
  });

  const formik = useFormik<Partial<Tenant> & { title?: string }>({
    initialValues: initialValues || {
      title: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      monthlyRent: 0,
      monthlyCharge: 0,
      unitId: '',
      entryDate: new Date(),
      isActive: true,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      {/* Personal Information Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
          <User className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">{t('tenant.information')}</h3>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium text-gray-700">
            {t('tenant.title')}
          </Label>
          <Select
            onValueChange={(value) => formik.setFieldValue('title', value)}
            value={formik.values.title || ''}
          >
            <SelectTrigger className="w-full border-gray-300">
              <SelectValue placeholder="Select title" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg">
              <SelectItem value="monsieur" className="hover:bg-gray-50">
                {t('tenant.titleOptions.monsieur')}
              </SelectItem>
              <SelectItem value="madame" className="hover:bg-gray-50">
                {t('tenant.titleOptions.madame')}
              </SelectItem>
              <SelectItem value="mademoiselle" className="hover:bg-gray-50">
                {t('tenant.titleOptions.mademoiselle')}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* First Name and Last Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label={t('tenant.firstName')}
            name="firstName"
            value={formik.values.firstName || ''}
            onChange={(value) => formik.setFieldValue('firstName', value)}
            onBlur={formik.handleBlur}
            error={formik.touched.firstName && formik.errors.firstName ? formik.errors.firstName as string : undefined}
            placeholder="John"
          />
          <FormField
            label={t('tenant.lastName')}
            name="lastName"
            value={formik.values.lastName || ''}
            onChange={(value) => formik.setFieldValue('lastName', value)}
            onBlur={formik.handleBlur}
            error={formik.touched.lastName && formik.errors.lastName ? formik.errors.lastName as string : undefined}
            placeholder="Doe"
          />
        </div>

        {/* Email and Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label={t('tenant.email')}
            name="email"
            type="email"
            value={formik.values.email || ''}
            onChange={(value) => formik.setFieldValue('email', value)}
            onBlur={formik.handleBlur}
            error={formik.touched.email && formik.errors.email ? formik.errors.email as string : undefined}
            placeholder="john.doe@example.com"
          />
          <FormField
            label={t('tenant.phoneNumber')}
            name="phoneNumber"
            type="tel"
            value={formik.values.phoneNumber || ''}
            onChange={(value) => formik.setFieldValue('phoneNumber', value)}
            onBlur={formik.handleBlur}
            error={formik.touched.phoneNumber && formik.errors.phoneNumber ? formik.errors.phoneNumber as string : undefined}
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>

      {/* Financial Information Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
          <DollarSign className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">{t('tenant.financialDetails')}</h3>
        </div>

        {/* Monthly Rent and Charges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label={t('tenant.monthlyRent')}
            name="monthlyRent"
            type="number"
            value={formik.values.monthlyRent || ''}
            onChange={(value) => formik.setFieldValue('monthlyRent', value ? parseFloat(value) : undefined)}
            onBlur={formik.handleBlur}
            error={formik.touched.monthlyRent && formik.errors.monthlyRent ? formik.errors.monthlyRent as string : undefined}
            placeholder="1500"
          />
          <FormField
            label={t('tenant.monthlyCharge')}
            name="monthlyCharge"
            type="number"
            value={formik.values.monthlyCharge || ''}
            onChange={(value) => formik.setFieldValue('monthlyCharge', value ? parseFloat(value) : undefined)}
            onBlur={formik.handleBlur}
            error={formik.touched.monthlyCharge && formik.errors.monthlyCharge ? formik.errors.monthlyCharge as string : undefined}
            placeholder="150"
          />
        </div>
      </div>

      {/* Assignment Information Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
          <Home className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">{t('tenant.unitAssignment')}</h3>
        </div>

        {/* Unit Selection */}
        <div className="space-y-2">
          <Label htmlFor="unitId" className="text-sm font-medium text-gray-700">
            {t('tenant.unitId')}
          </Label>
          <Select
            onValueChange={(value) => formik.setFieldValue('unitId', value)}
            value={formik.values.unitId || ''}
          >
            <SelectTrigger className={`w-full ${
              formik.touched.unitId && formik.errors.unitId 
                ? 'border-red-500 ring-2 ring-red-200' 
                : 'border-gray-300'
            }`}>
              <SelectValue placeholder={t('form.selectUnit')} />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg">
              {vacantUnits.map(unit => {
                const property = properties.find(p => p.units.some(u => u.id === unit.id));
                return (
                  <SelectItem key={unit.id} value={unit.id} className="hover:bg-gray-50">
                    {unit.unitNumber} - {property ? `${property.address.street}, ${property.address.city}` : ''} - {unit.squareFootage ? `${unit.squareFootage} ${t('unit.squareMetersUnit')}` : ''}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
          {formik.touched.unitId && formik.errors.unitId && (
            <div className="text-red-600 text-sm mt-1 flex items-center">
              <span className="w-4 h-4 mr-1">⚠</span>
              {formik.errors.unitId as string}
            </div>
          )}
        </div>

        {/* Entry Date */}
        <FormField
          label={t('tenant.entryDate')}
          name="entryDate"
          type="date"
          value={formik.values.entryDate ? new Date(formik.values.entryDate).toISOString().split('T')[0] : ''}
          onChange={(value) => formik.setFieldValue('entryDate', new Date(value))}
          onBlur={formik.handleBlur}
          error={formik.touched.entryDate && formik.errors.entryDate ? formik.errors.entryDate as string : undefined}
        />

        {/* Active Status */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">{t('tenant.isActive')}</Label>
          <div className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg">
            <Checkbox
              id="isActive"
              checked={formik.values.isActive}
              onCheckedChange={(checked) => formik.setFieldValue('isActive', checked)}
              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
            />
            <Label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">
              {t('tenant.activeTenant')}
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

export default TenantForm;
