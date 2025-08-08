import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Home, User, Bed, Bath, Square, Calendar, Euro, Phone, Mail, Edit, Plus, Receipt, AlertTriangle, CheckCircle, Clock, Eye } from 'lucide-react';
import { useUnit, useTenant } from '../hooks/useData';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import NiceModal from '@ebay/nice-modal-react';
import CreateTenantModal from '../components/CreateTenantModal';
import EditUnitModal from '../components/EditUnitModal';
import EditTenantModal from '../components/EditTenantModal';

const UnitDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
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

  if (isUnitLoading || isTenantLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--token-color-surface-action)]"></div>
        <span className="ml-2 text-[var(--token-color-foreground-faint)]">{t('common.loading')}</span>
      </div>
    );
  }

  if (unitError) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-[var(--red-500)] text-2xl mb-2">⚠️</div>
            <h3 className="text-lg font-semibold mb-2">{t('common.error')}</h3>
            <p className="text-[var(--token-color-foreground-faint)]">{unitError.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!unit) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-4xl mb-4">🏠</div>
            <h3 className="text-lg font-semibold mb-2">{t('unit.notFound')}</h3>
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('common.back')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalRent = tenant ? (tenant.monthlyRent || 0) + (tenant.monthlyCharge || 0) : 0;
  const leaseStatus = tenant?.leaseEndDate ? 
    new Date(tenant.leaseEndDate) > new Date() ? 'active' : 'expired' : 'none';

  // Styling functions for conditional displays
  function getUnitStatusColor(isOccupied: boolean) {
    return isOccupied ? 'text-[var(--green-500)]' : 'text-[var(--red-500)]';
  }

  function getUnitStatusBadgeStyle(isOccupied: boolean) {
    return isOccupied 
      ? 'bg-[var(--green-100)] text-[var(--green-800)]'
      : 'bg-[var(--red-100)] text-[var(--red-800)]';
  }

  function getLeaseStatusColor(status: string) {
    return status === 'active' ? 'text-[var(--green-500)]' : 
      status === 'expired' ? 'text-[var(--red-500)]' : 
      'text-[var(--token-color-foreground-faint)]';
  }

  function getTenantStatusColor(isActive: boolean) {
    return isActive ? 'text-[var(--green-500)]' : 'text-[var(--red-500)]';
  }

  function getLeaseEndDateColor(endDate: string | Date) {
    return new Date(endDate) < new Date() ? 'text-[var(--red-500)]' : '';
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className={`text-2xl font-bold ${getUnitStatusColor(unit.isOccupied)}`}>
                {unit.isOccupied ? 
                  <CheckCircle className="h-8 w-8 mx-auto" /> : 
                  <AlertTriangle className="h-8 w-8 mx-auto" />
                }
              </div>
              <div className="text-sm text-[var(--token-color-foreground-faint)] mt-2">
                {unit.isOccupied ? t('unit.occupied') : t('unit.vacant')}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {tenant && (
          <>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--token-color-surface-action)]">
                    €{totalRent}
                  </div>
                  <div className="text-sm text-[var(--token-color-foreground-faint)]">{t('tenant.monthlyTotal')}</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getLeaseStatusColor(leaseStatus)}`}>
                    {leaseStatus === 'active' ? 
                      <CheckCircle className="h-8 w-8 mx-auto" /> : 
                      leaseStatus === 'expired' ?
                      <Clock className="h-8 w-8 mx-auto" /> :
                      <AlertTriangle className="h-8 w-8 mx-auto" />
                    }
                  </div>
                  <div className="text-sm text-[var(--token-color-foreground-faint)] mt-2">
                    {leaseStatus === 'active' ? t('tenant.leaseActive') : 
                     leaseStatus === 'expired' ? t('tenant.leaseExpired') : 
                     t('tenant.noLease')}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getTenantStatusColor(tenant.isActive)}`}>
                    {tenant.isActive ? 
                      <CheckCircle className="h-8 w-8 mx-auto" /> : 
                      <AlertTriangle className="h-8 w-8 mx-auto" />
                    }
                  </div>
                  <div className="text-sm text-[var(--token-color-foreground-faint)] mt-2">
                    {tenant.isActive ? t('tenant.activeTenant') : t('tenant.inactiveTenant')}
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Unit Details */}
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

            {/* Unit Specifications */}
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

        {/* Tenant Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t('tenant.information')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {unit.isOccupied && tenant ? (
              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h4 className="font-medium text-[var(--token-color-foreground-primary)] mb-3">{t('tenant.personalInfo')}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-[var(--token-color-foreground-faint)]">{t('tenant.firstName')}</label>
                      <div className="text-[var(--token-color-foreground-primary)]">{tenant.firstName}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[var(--token-color-foreground-faint)]">{t('tenant.lastName')}</label>
                      <div className="text-[var(--token-color-foreground-primary)]">{tenant.lastName}</div>
                    </div>
                    {tenant.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-[var(--token-color-foreground-faint)]" />
                        <a href={`mailto:${tenant.email}`} className="text-[var(--token-color-surface-action)] hover:underline">
                          {tenant.email}
                        </a>
                      </div>
                    )}
                    {tenant.phoneNumber && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-[var(--token-color-foreground-faint)]" />
                        <a href={`tel:${tenant.phoneNumber}`} className="text-[var(--token-color-surface-action)] hover:underline">
                          {tenant.phoneNumber}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Financial Information */}
                <div>
                  <h4 className="font-medium text-[var(--token-color-foreground-primary)] mb-3">{t('tenant.financialInfo')}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {tenant.monthlyRent && (
                      <div className="flex items-center gap-2">
                        <Euro className="h-4 w-4 text-[var(--token-color-foreground-faint)]" />
                        <div>
                          <div className="text-sm text-[var(--token-color-foreground-faint)]">{t('tenant.monthlyRent')}</div>
                          <div className="font-semibold">€{tenant.monthlyRent}</div>
                        </div>
                      </div>
                    )}
                    {tenant.monthlyCharge && (
                      <div className="flex items-center gap-2">
                        <Euro className="h-4 w-4 text-[var(--token-color-foreground-faint)]" />
                        <div>
                          <div className="text-sm text-[var(--token-color-foreground-faint)]">{t('tenant.monthlyCharge')}</div>
                          <div className="font-semibold">€{tenant.monthlyCharge}</div>
                        </div>
                      </div>
                    )}
                    {tenant.securityDeposit && (
                      <div className="flex items-center gap-2">
                        <Euro className="h-4 w-4 text-[var(--token-color-foreground-faint)]" />
                        <div>
                          <div className="text-sm text-[var(--token-color-foreground-faint)]">{t('tenant.securityDeposit')}</div>
                          <div className="font-semibold">€{tenant.securityDeposit}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Lease Information */}
                <div>
                  <h4 className="font-medium text-[var(--token-color-foreground-primary)] mb-3">{t('tenant.leaseInfo')}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[var(--token-color-foreground-faint)]" />
                      <div>
                        <div className="text-sm text-[var(--token-color-foreground-faint)]">{t('tenant.entryDate')}</div>
                        <div className="font-semibold">{new Date(tenant.entryDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                    {tenant.leaseStartDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[var(--token-color-foreground-faint)]" />
                        <div>
                          <div className="text-sm text-[var(--token-color-foreground-faint)]">{t('tenant.leaseStartDate')}</div>
                          <div className="font-semibold">{new Date(tenant.leaseStartDate).toLocaleDateString()}</div>
                        </div>
                      </div>
                    )}
                    {tenant.leaseEndDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[var(--token-color-foreground-faint)]" />
                        <div>
                          <div className="text-sm text-[var(--token-color-foreground-faint)]">{t('tenant.leaseEndDate')}</div>
                          <div className={`font-semibold ${getLeaseEndDateColor(tenant.leaseEndDate)}`}>
                            {new Date(tenant.leaseEndDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Notes */}
                {tenant.notes && (
                  <div>
                    <h4 className="font-medium text-[var(--token-color-foreground-primary)] mb-2">{t('tenant.notes')}</h4>
                    <div className="bg-[var(--token-color-surface-secondary)] p-3 rounded-lg text-[var(--token-color-foreground-primary)]">
                      {tenant.notes}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-4">
                  <Link to={`/tenants/${tenant.id}`}>
                    <Button variant="primary" size="sm" className="w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      {t('tenant.viewProfile')}
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={handleEditTenant}>
                    <Edit className="h-4 w-4 mr-2" />
                    {t('tenant.editTenant')}
                  </Button>
                  <Link to={`/bills/tenant/${tenant.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      <Receipt className="h-4 w-4 mr-2" />
                      {t('tenant.viewBills')}
                    </Button>
                  </Link>
                </div>
              </div>
            ) : unit.isOccupied && !tenant && !isTenantLoading && !tenantError ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">⚠️</div>
                <h3 className="text-lg font-semibold mb-2">{t('tenant.noTenantFound')}</h3>
                <p className="text-[var(--token-color-foreground-faint)] mb-4">
                  {t('tenant.unitMarkedOccupied')}
                </p>
                <Button onClick={handleCreateTenant}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('tenant.createNew')}
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🏠</div>
                <h3 className="text-lg font-semibold mb-2">{t('unit.vacant')}</h3>
                <p className="text-[var(--token-color-foreground-faint)] mb-4">
                  {t('unit.vacantDescription')}
                </p>
                <Button onClick={handleCreateTenant}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('tenant.createNew')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UnitDetailPage;