import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats } from '../api/dashboard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { StatsGrid } from '@/components/ui/stats-grid';
import { UnitOccupancyChart } from '@/components/ui/unit-occupancy-chart';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertTriangle, Users, TrendingUp } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: stats, isLoading } = useQuery({ 
    queryKey: ['dashboardStats'], 
    queryFn: getDashboardStats 
  });

  const handleTenantClick = (tenantId: string) => {
    navigate(`/tenants/${tenantId}`);
  };

  if (isLoading) {
    return <LoadingSpinner message={t('dashboard.loadingData')} />;
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <p style={{ color: 'var(--token-color-foreground-faint)' }}>
          {t('dashboard.noDataAvailable')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6" style={{ color: 'var(--token-color-foreground-primary)' }}>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{t('dashboard.title')}</h1>
        <p className="text-gray-600">{t('dashboard.overview')}</p>
      </div>

      {/* Stats Grid */}
      <StatsGrid stats={stats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Unit Status Chart */}
        <div className="lg:col-span-1">
          <UnitOccupancyChart unitStatus={stats.unitStatus} />
        </div>
        
        {/* Recent Tenants */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {t('dashboard.recentTenants')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.recentTenants.length > 0 ? (
              stats.recentTenants.map((tenant: any) => (
                <div 
                  key={tenant.id} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleTenantClick(tenant.id)}
                >
                  <div>
                    <p className="font-medium">{tenant.name}</p>
                    <p className="text-sm text-gray-600">
                      {t('dashboard.movedIn')}{new Date(tenant.entryDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">€{tenant.monthlyRent}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      tenant.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {tenant.isActive ? t('tenant.statusValues.active') : t('tenant.statusValues.inactive')}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">{t('dashboard.noRecentTenants')}</p>
            )}
          </CardContent>
        </Card>

        {/* Lease Expiration Alerts */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              {t('dashboard.leaseExpirationAlerts')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.upcomingLeaseExpirations.length > 0 ? (
              stats.upcomingLeaseExpirations.map((lease: any) => (
                <div key={lease.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                  <div>
                    <p className="font-medium">{lease.name}</p>
                    <p className="text-sm text-gray-600">
                      {t('dashboard.expires')}{new Date(lease.leaseEndDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                      lease.daysUntilExpiry <= 30 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {lease.daysUntilExpiry} {t('common.days')}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">{t('dashboard.noUpcomingExpirations')}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Property Type Breakdown */}
      {Object.keys(stats.propertyTypeBreakdown).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {t('dashboard.portfolioBreakdown')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(stats.propertyTypeBreakdown).map(([type, count]: [string, any]) => (
                <div key={type} className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{count}</p>
                  <p className="text-sm text-gray-600 capitalize">
                    {type.toLowerCase().replace('_', ' ')}
                  </p>
                </div>
              ))}
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{stats.avgUnitsPerProperty}</p>
                <p className="text-sm text-gray-600">{t('dashboard.avgUnitsPerProperty')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardPage;