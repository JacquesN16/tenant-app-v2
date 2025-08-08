import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '@/hooks/useAuth.ts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ResetPasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const { token } = useParams<{ token: string }>();
  const { resetPassword } = useAuth();

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      password: Yup.string().min(6, t('form.passwordMinLength')).required(t('form.required')),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], t('form.passwordsMustMatch'))
        .required(t('form.required')),
    }),
    onSubmit: async (values) => {
      if (token) {
        await resetPassword(token, values.password);
      }
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
            <p className="text-muted-foreground">{t('auth.enterNewPassword')}</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password">{t('auth.password')}</Label>
              <Input
                type="password"
                id="password"
                placeholder={t('auth.enterPassword')}
                {...formik.getFieldProps('password')}
                className={formik.touched.password && formik.errors.password ? 'border-destructive' : ''}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="text-destructive text-sm mt-1">{formik.errors.password as string}</div>
              ) : null}
            </div>

            <div>
              <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
              <Input
                type="password"
                id="confirmPassword"
                placeholder={t('auth.confirmPassword')}
                {...formik.getFieldProps('confirmPassword')}
                className={formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-destructive' : ''}
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                <div className="text-destructive text-sm mt-1">{formik.errors.confirmPassword as string}</div>
              ) : null}
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              {t('auth.resetPassword')}
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

export default ResetPasswordPage;
