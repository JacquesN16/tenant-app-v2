import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGlobalLoading } from '@/stores/loadingStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { type User } from '@tenant-lib/model';
import { toast } from 'react-toastify';
import apiClient from '@/api/axios';
import PersonalInformation from '@/components/settings/PersonalInformation';
import AddressInformation from '@/components/settings/AddressInformation';
import Preferences from '@/components/settings/Preferences';
import AccountErrorState from '@/components/settings/AccountErrorState';

type UserProfile = Omit<User, 'password' | 'token' | 'resetPasswordToken' | 'resetPasswordExpires'> & {
  language?: string;
  theme?: string;
};

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
  const { showLoading, hideLoading } = useGlobalLoading();
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

  // Initialize user preferences from profile when it loads
  useEffect(() => {
    if (userProfile) {
      // Set language from user profile if available
      if (userProfile.language && userProfile.language !== i18n.language) {
        i18n.changeLanguage(userProfile.language);
        localStorage.setItem('preferred-language', userProfile.language);
      }
      
      // Set theme from user profile if available
      if (userProfile.theme && userProfile.theme !== theme) {
        setTheme(userProfile.theme as 'light' | 'dark');
        localStorage.setItem('theme', userProfile.theme);
      }
    }
  }, [userProfile, i18n, theme]);

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

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
  };

  React.useEffect(() => {
    if (isLoading) {
      showLoading(t('accountSettings.loadingProfile'));
    } else {
      hideLoading();
    }
  }, [isLoading, showLoading, hideLoading, t]);


  if (isError) {
    return <AccountErrorState error={error!} />;
  }

  return (
    <div className="space-y-6">
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <PersonalInformation formik={formik} />
            <AddressInformation formik={formik} />
          </div>
          <div className="space-y-6">
            <Preferences theme={theme} onThemeChange={handleThemeChange} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--token-color-border-secondary)]">
          <Button
            type="button"
            variant="outline"
            onClick={() => formik.resetForm()}
            disabled={updateUserMutation.isPending}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            {t('common.reset')}
          </Button>
          <Button
            type="submit"
            disabled={updateUserMutation.isPending || !formik.dirty}
          >
            {updateUserMutation.isPending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" />
                {t('common.saving')}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {t('accountSettings.updateProfile')}
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AccountSettingsPage;
