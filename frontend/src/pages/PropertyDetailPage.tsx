import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, MapPin, Home, Users, Plus, Edit, Trash2, Eye, Bed, Bath, Square } from 'lucide-react';
import type { Unit } from '@tenant-lib/model';
import { useProperty } from '../hooks/useData.ts';
import NiceModal from '@ebay/nice-modal-react';
import CreateUnitModal from '../components/CreateUnitModal';
import EditPropertyModal from '../components/EditPropertyModal';
import { useDeleteProperty } from '../hooks/useDeleteProperty.ts';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: property, isLoading, error } = useProperty(id);
  const { mutate: deleteProperty } = useDeleteProperty();

  const handleAddUnit = () => {
    NiceModal.show(CreateUnitModal, { propertyId: property?.id });
  };

  const handleEditProperty = () => {
    if (property) {
      NiceModal.show(EditPropertyModal, { property });
    }
  };

  const handleDelete = () => {
    if (window.confirm(t('property.deleteConfirmation'))) {
      deleteProperty(id as string, {
        onSuccess: () => {
          navigate('/properties');
        },
      });
    }
  };

  const handleUnitClick = (unitId: string) => {
    navigate(`/units/${unitId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--token-color-surface-action)]"></div>
        <span className="ml-2 text-[var(--token-color-foreground-faint)]">{t('common.loading')}</span>
      </div>
    );
  }

  if (error) {
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
  }

  if (!property) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-4xl mb-4">🏠</div>
            <h3 className="text-lg font-semibold mb-2">{t('property.notFound')}</h3>
            <Button variant="outline" onClick={() => navigate('/properties')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('common.back')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const occupiedUnits = property.units?.filter(unit => unit.isOccupied) || [];
  const vacantUnits = property.units?.filter(unit => !unit.isOccupied) || [];
  const totalUnits = property.units?.length || 0;
  const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits.length / totalUnits) * 100) : 0;

  // Styling functions for unit display
  function getUnitCardStyle(isOccupied: boolean) {
    return isOccupied 
      ? 'border-[var(--green-200)] bg-[var(--green-50)]' 
      : 'border-[var(--red-200)] bg-[var(--red-50)]';
  }

  function getUnitStatusStyle(isOccupied: boolean) {
    return isOccupied 
      ? 'bg-[var(--green-100)] text-[var(--green-800)]'
      : 'bg-[var(--red-100)] text-[var(--red-800)]';
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/properties')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[var(--token-color-foreground-high-contrast)]">
              {property.nickname || `${property.address.street}`}
            </h1>
            <div className="flex items-center gap-1 text-[var(--token-color-foreground-faint)]">
              <MapPin className="h-4 w-4" />
              <span>{property.address.street}, {property.address.city}, {property.address.state}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleEditProperty}>
            <Edit className="h-4 w-4 mr-2" />
            {t('common.edit')}
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            {t('property.delete')}
          </Button>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--token-color-surface-action)]">{totalUnits}</div>
              <div className="text-sm text-[var(--token-color-foreground-faint)]">{t('unit.totalUnits')}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--green-500)]">{occupiedUnits.length}</div>
              <div className="text-sm text-[var(--token-color-foreground-faint)]">{t('unit.occupied')}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--red-500)]">{vacantUnits.length}</div>
              <div className="text-sm text-[var(--token-color-foreground-faint)]">{t('unit.vacant')}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--token-color-surface-action)]">{occupancyRate}%</div>
              <div className="text-sm text-[var(--token-color-foreground-faint)]">{t('property.occupancyRate')}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Property Details */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              {t('property.details')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[var(--token-color-foreground-faint)]">{t('property.address')}</label>
              <div className="text-[var(--token-color-foreground-primary)]">
                {property.address.street}<br />
                {property.address.city}, {property.address.state} {property.address.zipCode}<br />
                {property.address.country}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-[var(--token-color-foreground-faint)]">{t('property.form.propertyType')}</label>
              <div className="text-[var(--token-color-foreground-primary)]">
                {t(`property.type.${property.propertyType}`)}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-[var(--token-color-foreground-faint)]">{t('property.ownerId')}</label>
              <div className="text-[var(--token-color-foreground-primary)]">{property.ownerId}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-[var(--token-color-foreground-faint)]">{t('common.createdAt')}</label>
                <div className="text-[var(--token-color-foreground-primary)] text-sm">
                  {new Date(property.createdAt!).toLocaleDateString()}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--token-color-foreground-faint)]">{t('common.updatedAt')}</label>
                <div className="text-[var(--token-color-foreground-primary)] text-sm">
                  {new Date(property.updatedAt!).toLocaleDateString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Units Section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {t('unit.units')} ({totalUnits})
              </CardTitle>
              <Button onClick={handleAddUnit} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                {t('unit.addUnit')}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {totalUnits > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.units?.map((unit: Unit) => (
                  <Card 
                    key={unit.id} 
                    className={`transition-all hover:shadow-md cursor-pointer ${getUnitCardStyle(unit.isOccupied)}`}
                    onClick={() => unit.isOccupied && handleUnitClick(unit.id)}
                  >
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-[var(--token-color-foreground-high-contrast)]">
                            {t('unit.unit')} {unit.unitNumber}
                          </h4>
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getUnitStatusStyle(unit.isOccupied)}`}>
                            {unit.isOccupied ? t('unit.occupied') : t('unit.vacant')}
                          </div>
                        </div>
                        {unit.isOccupied && (
                          <Button variant="ghost" size="icon" onClick={(e) => {
                            e.stopPropagation();
                            handleUnitClick(unit.id);
                          }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-[var(--token-color-foreground-faint)]">
                        {unit.bedrooms && (
                          <div className="flex items-center gap-1">
                            <Bed className="h-4 w-4" />
                            <span>{unit.bedrooms}</span>
                          </div>
                        )}
                        {unit.bathrooms && (
                          <div className="flex items-center gap-1">
                            <Bath className="h-4 w-4" />
                            <span>{unit.bathrooms}</span>
                          </div>
                        )}
                        {unit.squareFootage && (
                          <div className="flex items-center gap-1">
                            <Square className="h-4 w-4" />
                            <span>{unit.squareFootage} m²</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🏠</div>
                <h3 className="text-lg font-semibold mb-2">{t('unit.noUnits')}</h3>
                <p className="text-[var(--token-color-foreground-faint)] mb-4">
                  {t('unit.addFirstUnit')}
                </p>
                <Button onClick={handleAddUnit}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('unit.addUnit')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PropertyDetailPage;