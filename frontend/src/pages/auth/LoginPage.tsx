import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '@/hooks/useAuth.ts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';


const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const { login } = useAuth();

  // Styling function for form field validation
  function getFieldErrorStyle(hasError: boolean) {
    return hasError ? 'border-red-500 ring-2 ring-red-200' : '';
  }

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email(t('form.invalidEmail')).required(t('form.required')),
      password: Yup.string().required(t('form.required')),
    }),
    onSubmit: async (values) => {
      await login(values.email, values.password);
    },
  });

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12 lg:px-8">
        <div className="w-full max-w-md space-y-6 sm:space-y-8">
          {/* Logo and Header */}
          <div className="text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
              <img 
                src="/asset/logo.png" 
                alt={t('common.logoAlt')} 
                className="w-full h-full object-contain"
              />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{t('auth.welcomeBack')}</h2>
            <p className="text-gray-600 text-sm sm:text-base">{t('auth.signInMessage')}</p>
          </div>

          {/* Login Form */}
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="emailaddress" className="text-sm font-medium text-gray-700 mb-2 block">
                  {t('auth.email')}
                </Label>
                <Input
                  type="email"
                  id="emailaddress"
                  placeholder={t('auth.enterEmail')}
                  {...formik.getFieldProps('email')}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${getFieldErrorStyle(!!(formik.touched.email && formik.errors.email))}`}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="text-red-500 text-sm mt-1 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {formik.errors.email as string}
                  </div>
                ) : null}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    {t('auth.password')}
                  </Label>
                  <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                    {t('auth.forgotPassword')}
                  </Link>
                </div>
                <Input
                  type="password"
                  id="password"
                  placeholder={t('auth.enterPassword')}
                  {...formik.getFieldProps('password')}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${getFieldErrorStyle(!!(formik.touched.password && formik.errors.password))}`}
                />
                {formik.touched.password && formik.errors.password ? (
                  <div className="text-red-500 text-sm mt-1 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {formik.errors.password as string}
                  </div>
                ) : null}
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
            >
              {t('auth.logIn')}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-gray-600">
              {t('auth.dontHaveAccount')}{' '}
              <Link to="/signup" className="text-blue-600 hover:text-blue-500 font-semibold">
                {t('auth.signUp')}
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Image/Illustration */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10"></div>
        <div className="flex-1 flex items-center justify-center p-12 relative z-10">
          <div className="text-center space-y-6">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="white">
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{t('auth.manageProperties')}</h3>
            <p className="text-xl text-gray-600 max-w-md">
              {t('auth.dashboardDescription')}
            </p>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-16 h-16 bg-blue-200 rounded-full opacity-50"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 bg-purple-200 rounded-full opacity-30"></div>
        <div className="absolute top-1/2 right-8 w-8 h-8 bg-blue-300 rounded-full opacity-40"></div>
      </div>
    </div>
  );
};

export default LoginPage;
