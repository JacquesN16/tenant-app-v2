import React from 'react';
import { useTranslation } from 'react-i18next';
import { Home } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { FormField } from '../ui/form-field';
import type { FormikProps } from 'formik';

interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  avatarUrl?: string;
}

interface AddressInformationProps {
  formik: FormikProps<Partial<UserProfile>>;
}

const AddressInformation: React.FC<AddressInformationProps> = ({ formik }) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5" />
          {t('property.form.address')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          label={t('address.street')}
          name="address.street"
          value={formik.values.address?.street || ''}
          onChange={(value) => formik.setFieldValue('address.street', value)}
          onBlur={formik.handleBlur}
          error={(formik.touched.address as any)?.street && (formik.errors.address as any)?.street ? String((formik.errors.address as any).street) : undefined}
          placeholder="123 Main Street"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label={t('address.city')}
            name="address.city"
            value={formik.values.address?.city || ''}
            onChange={(value) => formik.setFieldValue('address.city', value)}
            onBlur={formik.handleBlur}
            error={(formik.touched.address as any)?.city && (formik.errors.address as any)?.city ? String((formik.errors.address as any).city) : undefined}
            placeholder="New York"
          />
          <FormField
            label={t('address.zipCode')}
            name="address.zipCode"
            value={formik.values.address?.zipCode || ''}
            onChange={(value) => formik.setFieldValue('address.zipCode', value)}
            onBlur={formik.handleBlur}
            error={(formik.touched.address as any)?.zipCode && (formik.errors.address as any)?.zipCode ? String((formik.errors.address as any).zipCode) : undefined}
            placeholder="10001"
          />
          <FormField
            label={t('address.country')}
            name="address.country"
            value={formik.values.address?.country || ''}
            onChange={(value) => formik.setFieldValue('address.country', value)}
            onBlur={formik.handleBlur}
            error={(formik.touched.address as any)?.country && (formik.errors.address as any)?.country ? String((formik.errors.address as any).country) : undefined}
            placeholder="United States"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AddressInformation;