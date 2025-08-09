import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { User, Phone, Mail, Euro, Calendar, Edit, Plus, Receipt, Eye } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import type { Unit, Tenant } from '../../../../lib/src';

interface TenantInformationProps {
  unit: Unit;
  tenant?: Tenant;
  isTenantLoading: boolean;
  tenantError: Error | null;
  onCreateTenant: () => void;
  onEditTenant: () => void;
}

const TenantInformation: React.FC<TenantInformationProps> = ({ 
  unit, 
  tenant, 
  isTenantLoading, 
  tenantError, 
  onCreateTenant, 
  onEditTenant 
}) => {
  const { t } = useTranslation();

  function getLeaseEndDateColor(endDate: string | Date) {
    return new Date(endDate) < new Date() ? 'text-[var(--red-500)]' : '';
  }

  return (
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
              <Button variant="outline" size="sm" onClick={onEditTenant}>
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
            <Button onClick={onCreateTenant}>
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
            <Button onClick={onCreateTenant}>
              <Plus className="h-4 w-4 mr-2" />
              {t('tenant.createNew')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TenantInformation;