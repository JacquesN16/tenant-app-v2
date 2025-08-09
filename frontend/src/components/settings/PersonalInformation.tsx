import React from 'react';
import { useTranslation } from 'react-i18next';
import { User } from 'lucide-react';
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

interface PersonalInformationProps {
  formik: FormikProps<Partial<UserProfile>>;
}

const PersonalInformation: React.FC<PersonalInformationProps> = ({ formik }) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          {t('accountSettings.personalInformation')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label={t('auth.firstName')}
            name="firstName"
            value={formik.values.firstName || ''}
            onChange={(value) => formik.setFieldValue('firstName', value)}
            onBlur={formik.handleBlur}
            error={formik.touched.firstName && formik.errors.firstName ? String(formik.errors.firstName) : undefined}
            required
          />
          <FormField
            label={t('auth.lastName')}
            name="lastName"
            value={formik.values.lastName || ''}
            onChange={(value) => formik.setFieldValue('lastName', value)}
            onBlur={formik.handleBlur}
            error={formik.touched.lastName && formik.errors.lastName ? String(formik.errors.lastName) : undefined}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label={t('auth.email')}
            name="email"
            type="email"
            value={formik.values.email || ''}
            onChange={(value) => formik.setFieldValue('email', value)}
            onBlur={formik.handleBlur}
            error={formik.touched.email && formik.errors.email ? String(formik.errors.email) : undefined}
            required
          />
          <FormField
            label={t('tenant.phoneNumber')}
            name="phone"
            type="tel"
            value={formik.values.phone || ''}
            onChange={(value) => formik.setFieldValue('phone', value)}
            onBlur={formik.handleBlur}
            error={formik.touched.phone && formik.errors.phone ? String(formik.errors.phone) : undefined}
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInformation;