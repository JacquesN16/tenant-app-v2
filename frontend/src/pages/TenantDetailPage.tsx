import React, {useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, User, Calendar, Euro, Phone, Mail, Edit, Trash2, Clock, Home, AlertTriangle, CheckCircle, Receipt } from 'lucide-react';
import { useTenant, useUnit } from '../hooks/useData';
import type { Tenant } from '@tenant-lib/model';
import { useUpdateTenant } from '../hooks/useUpdateTenant';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import NiceModal from '@ebay/nice-modal-react';
import EditTenantModal from '../components/EditTenantModal';
import SetTenantEndDateModal from '../components/SetTenantEndDateModal';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const TenantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [softDeleteDialogOpen, setSoftDeleteDialogOpen] = useState(false);
  
  const { data: tenant, isLoading: isTenantLoading, error: tenantError } = useTenant(id) as { data: Tenant | undefined, isLoading: boolean, error: Error | null };
  const { data: unit, isLoading: isUnitLoading } = useUnit(tenant?.unitId);
  const { mutate: updateTenant, isPending: isUpdating } = useUpdateTenant();

  const actualStay = useMemo(()=>{
    if(!tenant){
      return 0
    }
    let stay_count = Math.floor((new Date().getTime() - new Date(tenant?.entryDate).getTime()) / (1000 * 60 * 60 * 24))

    if(stay_count < 0) {
      stay_count =0
    }

    return  tenant?.entryDate ? stay_count  : 0

  },[tenant])

  const handleEditTenant = () => {
    if (tenant) {
      NiceModal.show(EditTenantModal, { tenant });
    }
  };

  const handleSetEndDate = () => {
    if (tenant) {
      NiceModal.show(SetTenantEndDateModal, { tenant });
    }
  };

  const handleSoftDelete = () => {
    if (!tenant) return;
    
    updateTenant({ 
      id: tenant.id, 
      tenant: { isActive: false }
    }, {
      onSuccess: () => {
        toast.success(t('tenant.deactivatedSuccessfully') || 'Tenant deactivated successfully');
        setSoftDeleteDialogOpen(false);
      },
      onError: (error) => {
        toast.error(error.message || t('common.unexpectedError'));
      }
    });
  };

  if (isTenantLoading || isUnitLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--token-color-surface-action)]"></div>
        <span className="ml-2 text-[var(--token-color-foreground-faint)]">{t('common.loading')}</span>
      </div>
    );
  }

  if (tenantError) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-[var(--red-500)] text-2xl mb-2">⚠️</div>
            <h3 className="text-lg font-semibold mb-2">{t('common.error')}</h3>
            <p className="text-[var(--token-color-foreground-faint)]">{tenantError.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!tenant) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-4xl mb-4">👤</div>
            <h3 className="text-lg font-semibold mb-2">{t('tenant.notFound')}</h3>
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('common.back')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalRent = (tenant.monthlyRent || 0) + (tenant.monthlyCharge || 0);
  const leaseStatus = tenant.leaseEndDate ? 
    new Date(tenant.leaseEndDate) > new Date() ? 'active' : 'expired' : 'none';

  function getTenantStatusColor(isActive: boolean) {
    return isActive ? 'text-[var(--green-500)]' : 'text-[var(--red-500)]';
  }

  function getLeaseStatusColor(status: string) {
    return status === 'active' ? 'text-[var(--green-500)]' : 
      status === 'expired' ? 'text-[var(--red-500)]' : 
      'text-[var(--token-color-foreground-faint)]';
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
              {(tenant as any).title ? `${t(`tenant.titleOptions.${(tenant as any).title.toLowerCase()}`)} ` : ''}{tenant.firstName} {tenant.lastName}
            </h1>
            <div className="flex items-center gap-2 text-[var(--token-color-foreground-faint)]">
              {unit && (
                <>
                  <Home className="h-4 w-4" />
                  <Link 
                    to={`/units/${unit.id}`}
                    className="hover:text-[var(--token-color-surface-action)] transition-colors"
                  >
                    {t('unit.unit')} {unit.unitNumber}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleEditTenant}>
            <Edit className="h-4 w-4 mr-2" />
            {t('common.edit')}
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleSetEndDate}>
            <Clock className="h-4 w-4 mr-2" />
            {t('tenant.setEndDate')}
          </Button>

          <Dialog open={softDeleteDialogOpen} onOpenChange={setSoftDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                {t('tenant.deactivate')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('tenant.deactivateTenant')}</DialogTitle>
                <DialogDescription>
                  {t('tenant.deactivateDescription')}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSoftDeleteDialogOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleSoftDelete}
                  disabled={isUpdating}
                >
                  {isUpdating ? t('common.saving') : t('tenant.deactivate')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <div className="text-2xl font-bold text-[var(--token-color-foreground-primary)]">
                {actualStay}
              </div>
              <div className="text-sm text-[var(--token-color-foreground-faint)]">{t('common.days')} {t('tenant.inResidence')}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t('tenant.personalInfo')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-[var(--token-color-foreground-faint)]">{t('tenant.title')}</label>
                <div className="text-[var(--token-color-foreground-primary)]">
                  {(tenant as any).title ? t(`tenant.titleOptions.${(tenant as any).title.toLowerCase()}`) : '-'}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--token-color-foreground-faint)]">{t('tenant.firstName')}</label>
                <div className="text-[var(--token-color-foreground-primary)]">{tenant.firstName}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--token-color-foreground-faint)]">{t('tenant.lastName')}</label>
                <div className="text-[var(--token-color-foreground-primary)]">{tenant.lastName}</div>
              </div>
            </div>
            
            <div className="space-y-3">
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

            {/* Notes */}
            {tenant.notes && (
              <div className="pt-4">
                <label className="text-sm font-medium text-[var(--token-color-foreground-faint)]">{t('tenant.notes')}</label>
                <div className="bg-[var(--token-color-surface-secondary)] p-3 rounded-lg text-[var(--token-color-foreground-primary)] mt-1">
                  {tenant.notes}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Financial & Lease Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Euro className="h-5 w-5" />
              {t('tenant.financialDetails')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Financial Information */}
            <div>
              <h4 className="font-medium text-[var(--token-color-foreground-primary)] mb-3">{t('tenant.financialInfo')}</h4>
              <div className="space-y-3">
                {tenant.monthlyRent && (
                  <div className="flex justify-between">
                    <span className="text-[var(--token-color-foreground-faint)]">{t('tenant.monthlyRent')}</span>
                    <span className="font-semibold">€{tenant.monthlyRent}</span>
                  </div>
                )}
                {tenant.monthlyCharge && (
                  <div className="flex justify-between">
                    <span className="text-[var(--token-color-foreground-faint)]">{t('tenant.monthlyCharge')}</span>
                    <span className="font-semibold">€{tenant.monthlyCharge}</span>
                  </div>
                )}
                {tenant.securityDeposit && (
                  <div className="flex justify-between">
                    <span className="text-[var(--token-color-foreground-faint)]">{t('tenant.securityDeposit')}</span>
                    <span className="font-semibold">€{tenant.securityDeposit}</span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-2">
                  <span className="font-medium text-[var(--token-color-foreground-primary)]">{t('tenant.monthlyTotal')}</span>
                  <span className="font-bold text-lg">€{totalRent}</span>
                </div>
              </div>
            </div>

            {/* Lease Information */}
            <div>
              <h4 className="font-medium text-[var(--token-color-foreground-primary)] mb-3">{t('tenant.leaseInfo')}</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[var(--token-color-foreground-faint)]" />
                  <div className="flex-1">
                    <div className="text-sm text-[var(--token-color-foreground-faint)]">{t('tenant.entryDate')}</div>
                    <div className="font-semibold">{format(new Date(tenant.entryDate), 'PPP')}</div>
                  </div>
                </div>
                {tenant.leaseStartDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[var(--token-color-foreground-faint)]" />
                    <div className="flex-1">
                      <div className="text-sm text-[var(--token-color-foreground-faint)]">{t('tenant.leaseStartDate')}</div>
                      <div className="font-semibold">{format(new Date(tenant.leaseStartDate), 'PPP')}</div>
                    </div>
                  </div>
                )}
                {tenant.leaseEndDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[var(--token-color-foreground-faint)]" />
                    <div className="flex-1">
                      <div className="text-sm text-[var(--token-color-foreground-faint)]">{t('tenant.leaseEndDate')}</div>
                      <div className={`font-semibold ${getLeaseEndDateColor(tenant.leaseEndDate)}`}>
                        {format(new Date(tenant.leaseEndDate), 'PPP')}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4">
              <Link to={`/bills/tenant/${tenant.id}`}>
                <Button variant="outline" className="w-full">
                  <Receipt className="h-4 w-4 mr-2" />
                  {t('tenant.viewBills')}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TenantDetailPage;