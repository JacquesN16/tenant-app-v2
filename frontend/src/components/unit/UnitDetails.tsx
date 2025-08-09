import React from 'react';
import { useTranslation } from 'react-i18next';
import { Home, Bed, Bath, Square } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import type { Unit } from '../../../../lib/src';

interface UnitDetailsProps {
  unit: Unit;
}

const UnitDetails: React.FC<UnitDetailsProps> = ({ unit }) => {
  const { t } = useTranslation();

  function getUnitStatusBadgeStyle(isOccupied: boolean) {
    return isOccupied 
      ? 'bg-[var(--green-100)] text-[var(--green-800)]'
      : 'bg-[var(--red-100)] text-[var(--red-800)]';
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5" />
          {t('unit.information')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-[var(--token-color-foreground-faint)]">{t('unit.unitNumber')}</label>
          <div className="text-[var(--token-color-foreground-primary)] font-semibold text-lg">
            {unit.unitNumber}
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium text-[var(--token-color-foreground-faint)]">{t('unit.status')}</label>
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getUnitStatusBadgeStyle(unit.isOccupied)}`}>
            {unit.isOccupied ? t('unit.occupied') : t('unit.vacant')}
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <h4 className="font-medium text-[var(--token-color-foreground-primary)]">{t('unit.specifications')}</h4>
          <div className="grid grid-cols-2 gap-4">
            {unit.bedrooms && (
              <div className="flex items-center gap-2">
                <Bed className="h-4 w-4 text-[var(--token-color-foreground-faint)]" />
                <span className="text-sm">{unit.bedrooms} {t('unit.bedrooms')}</span>
              </div>
            )}
            {unit.bathrooms && (
              <div className="flex items-center gap-2">
                <Bath className="h-4 w-4 text-[var(--token-color-foreground-faint)]" />
                <span className="text-sm">{unit.bathrooms} {t('unit.bathrooms')}</span>
              </div>
            )}
          </div>
          {unit.squareFootage && (
            <div className="flex items-center gap-2">
              <Square className="h-4 w-4 text-[var(--token-color-foreground-faint)]" />
              <span className="text-sm">{unit.squareFootage} m²</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UnitDetails;