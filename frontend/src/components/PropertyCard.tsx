import React from 'react';
import { type Property } from '@tenant-lib/model';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const totalUnits = property.units?.length || 0;
  const occupiedUnits = property.units?.filter(unit => unit.isOccupied).length || 0;

  const handleCardClick = () => {
    navigate(`/properties/${property.id}`);
  };

  return (
    <div
      className="bg-card text-foreground rounded-lg shadow-lg p-4 sm:p-6 cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105 w-full"
      onClick={handleCardClick}
    >
      <h4 className="text-primary text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 break-words">
        <i className="mdi mdi-map-marker mr-1 sm:mr-2"></i>
          {property.address.street}
      </h4>
      <h4 className="text-primary text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 break-words">{property.address.city}</h4>
      <p> {t(`property.type.${property.propertyType}`)}</p>
      <ul className="flex justify-between items-center pt-3 sm:pt-4 border-t border-border">
        <li className="text-center">
          <h5 className="text-foreground text-base sm:text-lg font-semibold">{totalUnits}</h5>
          <p className="text-muted-foreground text-xs whitespace-nowrap">{t('property.units')}</p>
        </li>
        <li className="text-center">
          <h5 className="text-foreground text-base sm:text-lg font-semibold">
            {occupiedUnits} / {totalUnits}
          </h5>
          <p className="text-muted-foreground text-xs whitespace-nowrap">{t('property.tenants')}</p>
        </li>
      </ul>
    </div>
  );
};

export default PropertyCard;

