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
      className="bg-card text-foreground rounded-lg shadow-lg p-3 cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105 w-full"
      onClick={handleCardClick}
    >
      <h4 className="text-primary text-lg font-bold mb-2 break-words">
        <i className="mdi mdi-map-marker mr-1 sm:mr-2"></i>
          {property.address.street}
      </h4>
      <h4 className="text-primary text-lg font-bold mb-2 break-words">{property.address.city}</h4>
      <div className='flex items-center justify-between'>
        <p className="font-bold"> {t(`property.type.${property.propertyType}`)}</p>
        <p className="text-muted-foreground text-xs whitespace-nowrap">{totalUnits} {t('property.units')}</p>
        <p className="text-muted-foreground text-xs whitespace-nowrap">{occupiedUnits} / {totalUnits} {t('property.tenants')}</p>
      </div>

    </div>
  );
};

export default PropertyCard;

