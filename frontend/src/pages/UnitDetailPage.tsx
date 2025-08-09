import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Home, Edit, Plus } from 'lucide-react';
import { useUnit, useTenant } from '../hooks/useData';
import { Button } from '../components/ui/button';
import NiceModal from '@ebay/nice-modal-react';
import CreateTenantModal from '../components/CreateTenantModal';
import EditUnitModal from '../components/EditUnitModal';
import EditTenantModal from '../components/EditTenantModal';
import { useGlobalLoading } from '../stores/loadingStore';
import UnitErrorState from '../components/unit/UnitErrorState';
import UnitNotFound from '../components/unit/UnitNotFound';
import StatusOverview from '../components/unit/StatusOverview';
import UnitDetails from '../components/unit/UnitDetails';
import TenantInformation from '../components/unit/TenantInformation';

const UnitDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useGlobalLoading();
  const { data: unit, isLoading: isUnitLoading, error: unitError } = useUnit(id);

  const handleCreateTenant = () => {
    NiceModal.show(CreateTenantModal, { preSelectedUnitId: id });
  };

  const handleEditUnit = () => {
    if (unit) {
      NiceModal.show(EditUnitModal, { unit });
    }
  };

  const handleEditTenant = () => {
    if (tenant) {
      NiceModal.show(EditTenantModal, { tenant });
    }
  };

  const { data: tenant, isLoading: isTenantLoading, error: tenantError } = useTenant(
    unit?.isOccupied && unit.tenantIds && unit.tenantIds.length > 0 ? unit.tenantIds[0] : undefined
  );

  React.useEffect(() => {
    if (isUnitLoading || isTenantLoading) {
      showLoading(t('common.loading'));
    } else {
      hideLoading();
    }
  }, [isUnitLoading, isTenantLoading, showLoading, hideLoading, t]);


  if (unitError) {
    return <UnitErrorState error={unitError} />;
  }

  if (!unit) {
    return <UnitNotFound onBack={() => navigate(-1)} />;
  }


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[var(--token-color-foreground-high-contrast)]">
              {t('unit.unit')} {unit.unitNumber}
            </h1>
            <div className="flex items-center gap-2 text-[var(--token-color-foreground-faint)]">
              <Home className="h-4 w-4" />
              {unit.property ? (
                <Link 
                  to={`/properties/${unit.property.id}`}
                  className="hover:text-[var(--token-color-surface-action)] transition-colors"
                >
                  {unit.property.nickname || unit.property.address?.street || t('property.defaultNickname')}
                </Link>
              ) : (
                <span>{t('unit.belongsToProperty')}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleEditUnit}>
            <Edit className="h-4 w-4 mr-2" />
            {t('common.edit')}
          </Button>
          {!unit.isOccupied && (
            <Button onClick={handleCreateTenant} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              {t('tenant.createNew')}
            </Button>
          )}
        </div>
      </div>

      {/* Status Overview */}
      <StatusOverview unit={unit} tenant={tenant} />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <UnitDetails unit={unit} />
        <TenantInformation 
          unit={unit} 
          tenant={tenant} 
          isTenantLoading={isTenantLoading}
          tenantError={tenantError}
          onCreateTenant={handleCreateTenant}
          onEditTenant={handleEditTenant}
        />
      </div>
    </div>
  );
};

export default UnitDetailPage;