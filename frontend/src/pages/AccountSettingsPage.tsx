import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { type User } from '@tenant-lib/model';
import { toast } from 'react-toastify';
import apiClient from '@/api/axios';

type UserProfile = Omit<User, 'password' | 'token' | 'resetPasswordToken' | 'resetPasswordExpires'>;

const fetchUserProfile = async (): Promise<UserProfile> => {
  const { data } = await apiClient.get<UserProfile>('/user/profile');
  return data;
};

const updateUserProfile = async (updatedUser: Partial<UserProfile>): Promise<UserProfile> => {
  const { data } = await apiClient.put<UserProfile>('/user/profile', updatedUser);
  return data;
};

const AccountSettingsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });


  const { data: userProfile, isLoading, isError, error } = useQuery<UserProfile, Error>({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
  });

  const updateUserMutation = useMutation<UserProfile, Error, Partial<UserProfile>>({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(['userProfile'], data);
      toast.success(t('accountSettings.profileUpdated'));
      formik.resetForm({ values: formik.values });
    },
    onError: (err) => {
      toast.error(err.message || t('accountSettings.updateFailed'));
    },
  });

  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const formik = useFormik<Partial<UserProfile>>({
    enableReinitialize: true,
    initialValues: {
      firstName: userProfile?.firstName || '',
      lastName: userProfile?.lastName || '',
      email: userProfile?.email || '',
      phone: userProfile?.phone || '',
      address: userProfile?.address || { street: '', city: '', state: '', zipCode: '', country: '' },
      avatarUrl: userProfile?.avatarUrl || '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required(t('form.required')),
      lastName: Yup.string().required(t('form.required')),
      email: Yup.string().email(t('form.invalidEmail')).required(t('form.required')),
      phone: Yup.string().optional(),
      address: Yup.object({
        street: Yup.string().optional(),
        city: Yup.string().optional(),
        zipCode: Yup.string().optional(),
        country: Yup.string().optional(),
      }).optional(),
      avatarUrl: Yup.string().url(t('form.invalidUrl')).optional(),
    }),
    onSubmit: (values) => {
      updateUserMutation.mutate(values);
    },
  });

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    localStorage.setItem('preferred-language', language);
    toast.success(t('accountSettings.languageUpdated'));
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    toast.success(t('accountSettings.themeUpdated'));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner message={t('accountSettings.loadingProfile')} size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="text-destructive text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-destructive mb-2">{t('common.error')}</h2>
            <p className="text-muted-foreground">{error?.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">{t('accountSettings.title')}</h1>
          <p className="text-muted-foreground mt-2">{t('accountSettings.subtitle')}</p>
        </div>

        {/* Profile Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <span className="text-2xl">📝</span>
              {t('accountSettings.personalInformation')}
            </CardTitle>
          </CardHeader>
          <CardContent>
              <form onSubmit={formik.handleSubmit} className="space-y-5">
                {/* Personal Information */}
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

                {/* Address Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 py-2 border-b border-border">
                    <span className="text-xl">🏠</span>
                    <h3 className="text-lg font-semibold text-foreground">{t('property.form.address')}</h3>
                  </div>
                  
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
                </div>

                {/* Preferences */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 py-2 border-b border-border">
                    <span className="text-xl">⚙️</span>
                    <h3 className="text-lg font-semibold text-foreground">{t('accountSettings.preferences')}</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                    {/* Language Selection */}
                    <div>
                      <Label htmlFor="language-select" className="text-sm font-medium text-gray-700 mb-2 block">
                        {t('accountSettings.selectLanguage')}
                      </Label>
                      <Select value={i18n.language} onValueChange={handleLanguageChange}>
                        <SelectTrigger id="language-select" className="w-full">
                          <SelectValue placeholder={t('accountSettings.selectLanguage')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">
                            <div className="flex items-center gap-2">
                              <span>🇺🇸</span>
                              <span>English</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="fr">
                            <div className="flex items-center gap-2">
                              <span>🇫🇷</span>
                              <span>Français</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Theme Selection */}
                    <div>
                      <Label htmlFor="theme-select" className="text-sm font-medium text-gray-700 mb-2 block">
                        {t('accountSettings.themePreference')}
                      </Label>
                      <Select value={theme} onValueChange={handleThemeChange}>
                        <SelectTrigger id="theme-select" className="w-full">
                          <SelectValue placeholder={t('accountSettings.themePreference')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">
                            <div className="flex items-center gap-2">
                              <span>☀️</span>
                              <span>{t('accountSettings.lightTheme')}</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="dark">
                            <div className="flex items-center gap-2">
                              <span>🌙</span>
                              <span>{t('accountSettings.darkTheme')}</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => formik.resetForm()}
                    disabled={updateUserMutation.isPending}
                    className="flex-1"
                  >
                    {t('common.reset')}
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateUserMutation.isPending || !formik.dirty}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {updateUserMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" />
                        {t('common.saving')}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>💾</span>
                        {t('accountSettings.updateProfile')}
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
      </div>
    </div>
  );
};

export default AccountSettingsPage;
