import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '../ui/card';

interface UnitErrorStateProps {
  error: Error;
}

const UnitErrorState: React.FC<UnitErrorStateProps> = ({ error }) => {
  const { t } = useTranslation();

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardContent className="pt-6">
        <div className="text-center">
          <div className="text-[var(--red-500)] text-2xl mb-2">⚠️</div>
          <h3 className="text-lg font-semibold mb-2">{t('common.error')}</h3>
          <p className="text-[var(--token-color-foreground-faint)]">{error.message}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default UnitErrorState;