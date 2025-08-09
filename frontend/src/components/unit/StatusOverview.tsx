import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import type { Unit, Tenant } from '../../../../lib/src';

interface StatusOverviewProps {
  unit: Unit;
  tenant?: Tenant;
}

const StatusOverview: React.FC<StatusOverviewProps> = ({ unit, tenant }) => {
  const { t } = useTranslation();

  const totalRent = tenant ? (tenant.monthlyRent || 0) + (tenant.monthlyCharge || 0) : 0;
  const leaseStatus = tenant?.leaseEndDate ? 
    new Date(tenant.leaseEndDate) > new Date() ? 'active' : 'expired' : 'none';

  function getUnitStatusColor(isOccupied: boolean) {
    return isOccupied ? 'text-[var(--green-500)]' : 'text-[var(--red-500)]';
  }

  function getLeaseStatusColor(status: string) {
    return status === 'active' ? 'text-[var(--green-500)]' : 
      status === 'expired' ? 'text-[var(--red-500)]' : 
      'text-[var(--token-color-foreground-faint)]';
  }

  function getTenantStatusColor(isActive: boolean) {
    return isActive ? 'text-[var(--green-500)]' : 'text-[var(--red-500)]';
  }

  return (
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
  );
};

export default StatusOverview;