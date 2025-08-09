import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

interface UnitNotFoundProps {
  onBack: () => void;
}

const UnitNotFound: React.FC<UnitNotFoundProps> = ({ onBack }) => {
  const { t } = useTranslation();

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardContent className="pt-6">
        <div className="text-center">
          <div className="text-4xl mb-4">🏠</div>
          <h3 className="text-lg font-semibold mb-2">{t('unit.notFound')}</h3>
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('common.back')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UnitNotFound;