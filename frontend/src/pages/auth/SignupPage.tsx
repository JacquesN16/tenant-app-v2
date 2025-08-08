import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '@/hooks/useAuth.ts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const SignupPage: React.FC = () => {
  const { t } = useTranslation();
  const { signup } = useAuth();

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required(t('form.required')),
      lastName: Yup.string().required(t('form.required')),
      email: Yup.string().email(t('form.invalidEmail')).required(t('form.required')),
      password: Yup.string().min(6, t('form.passwordMinLength')).required(t('form.required')),
    }),
    onSubmit: async (values) => {
      await signup(values.firstName, values.lastName, values.email, values.password);
    },
  });

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image/Illustration */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-green-50 to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-blue-600/10"></div>
        <div className="flex-1 flex items-center justify-center p-12 relative z-10">
          <div className="text-center space-y-6">
            <div className="w-32 h-32 mx-auto flex items-center justify-center">
              <img 
                src="/asset/logo.png" 
                alt={t('common.logoAlt')} 
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{t('auth.joinKangal')}</h3>
            <p className="text-xl text-gray-600 max-w-md">
              {t('auth.signupDescription')}
            </p>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-20 left-20 w-16 h-16 bg-green-200 rounded-full opacity-50"></div>
        <div className="absolute bottom-32 left-32 w-24 h-24 bg-blue-200 rounded-full opacity-30"></div>
        <div className="absolute top-1/2 left-8 w-8 h-8 bg-green-300 rounded-full opacity-40"></div>
      </div>

      {/* Right side - Signup Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo and Header */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <img 
                src="/asset/logo.png" 
                alt={t('common.logoAlt')} 
                className="w-full h-full object-contain"
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('auth.createAccount')}</h2>
            <p className="text-gray-600">{t('auth.getStartedToday')}</p>
          </div>

          {/* Signup Form */}
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 mb-2 block">
                    {t('auth.firstName')}
                  </Label>
                  <Input
                    type="text"
                    id="firstName"
                    placeholder={t('auth.enterFirstName')}
                    {...formik.getFieldProps('firstName')}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                      formik.touched.firstName && formik.errors.firstName ? 'border-red-500 ring-2 ring-red-200' : ''
                    }`}
                  />
                  {formik.touched.firstName && formik.errors.firstName ? (
                    <div className="text-red-500 text-sm mt-1 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {formik.errors.firstName as string}
                    </div>
                  ) : null}
                </div>

                <div>
                  <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 mb-2 block">
                    {t('auth.lastName')}
                  </Label>
                  <Input
                    type="text"
                    id="lastName"
                    placeholder={t('auth.enterLastName')}
                    {...formik.getFieldProps('lastName')}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                      formik.touched.lastName && formik.errors.lastName ? 'border-red-500 ring-2 ring-red-200' : ''
                    }`}
                  />
                  {formik.touched.lastName && formik.errors.lastName ? (
                    <div className="text-red-500 text-sm mt-1 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {formik.errors.lastName as string}
                    </div>
                  ) : null}
                </div>
              </div>

              <div>
                <Label htmlFor="emailaddress" className="text-sm font-medium text-gray-700 mb-2 block">
                  {t('auth.email')}
                </Label>
                <Input
                  type="email"
                  id="emailaddress"
                  placeholder={t('auth.enterEmail')}
                  {...formik.getFieldProps('email')}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                    formik.touched.email && formik.errors.email ? 'border-red-500 ring-2 ring-red-200' : ''
                  }`}
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
                <Label htmlFor="password" className="text-sm font-medium text-gray-700 mb-2 block">
                  {t('auth.password')}
                </Label>
                <Input
                  type="password"
                  id="password"
                  placeholder={t('auth.enterPassword')}
                  {...formik.getFieldProps('password')}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                    formik.touched.password && formik.errors.password ? 'border-red-500 ring-2 ring-red-200' : ''
                  }`}
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
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
            >
              {t('auth.signUp')}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-gray-600">
              {t('auth.alreadyHaveAccount')}{' '}
              <Link to="/login" className="text-green-600 hover:text-green-500 font-semibold">
                {t('auth.logIn')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
