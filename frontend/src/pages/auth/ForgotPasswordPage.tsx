import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '@/hooks/useAuth.ts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ForgotPasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const { forgotPassword } = useAuth();

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email(t('form.invalidEmail')).required(t('form.required')),
    }),
    onSubmit: async (values) => {
      await forgotPassword(values.email);
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md bg-card text-foreground border border-border">
        <CardHeader className="text-center bg-primary rounded-t-lg">
          <div className="flex items-center justify-center space-x-2">
            <img 
              src="/asset/logo.png" 
              alt={t('common.logoAlt')} 
              className="h-8 w-8 object-contain"
            />
            <CardTitle className="text-3xl font-bold text-primary-foreground">{t('common.appName')}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h4 className="text-2xl font-bold text-foreground mb-2">{t('auth.resetPassword')}</h4>
            <p className="text-muted-foreground">{t('auth.enterEmailForReset')}</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="emailaddress">{t('auth.email')}</Label>
              <Input
                type="email"
                id="emailaddress"
                placeholder={t('auth.enterEmail')}
                {...formik.getFieldProps('email')}
                className={formik.touched.email && formik.errors.email ? 'border-destructive' : ''}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-destructive text-sm mt-1">{formik.errors.email as string}</div>
              ) : null}
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              {t('auth.reset')}
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-muted-foreground">
              {t('auth.backTo')}{' '}
              <Link to="/login" className="text-primary hover:underline">
                <b>{t('auth.logIn')}</b>
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
