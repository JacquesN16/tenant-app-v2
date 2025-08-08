import React from 'react';
import { useTranslation } from 'react-i18next';
import { StatCard } from './stat-card';
import { dashboardStatCards, type DashboardStats } from './dashboard-icons';

interface StatsGridProps {
  stats: DashboardStats;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  const { t } = useTranslation();
  const getStatValue = (key: string): number => {
    switch (key) {
      case 'totalProperties':
        return stats.totalProperties;
      case 'totalTenants':
        return stats.totalTenants;
      case 'activeTenants':
        return stats.activeTenants;
      case 'occupiedUnits':
        return stats.unitStatus.occupied;
      case 'vacantUnits':
        return stats.unitStatus.vacant;
      case 'totalMonthlyRevenue':
        return Math.round(stats.totalMonthlyRevenue);
      case 'outstandingAmount':
        return Math.round(stats.outstandingAmount);
      case 'collectionRate':
        return stats.collectionRate;
      case 'occupancyRate':
        return stats.occupancyRate;
      default:
        return 0;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {dashboardStatCards.map((card) => (
        <StatCard
          key={card.key}
          title={t(card.titleKey)}
          value={getStatValue(card.key)}
          icon={card.icon}
        />
      ))}
    </div>
  );
};