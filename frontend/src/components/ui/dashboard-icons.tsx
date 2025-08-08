import React from 'react';

export const DashboardIcons = {
  Properties: (
    <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.707L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.646a.5.5 0 0 0 .708-.707L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z"/>
    </svg>
  ),
  
  Tenants: (
    <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/>
    </svg>
  ),
  
  OccupiedUnits: (
    <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
      <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
    </svg>
  ),
  
  VacantUnits: (
    <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
    </svg>
  ),
  
  Revenue: (
    <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
      <path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718H4zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73l.348.086z"/>
    </svg>
  ),
  
  Outstanding: (
    <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
      <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
    </svg>
  ),
  
  CollectionRate: (
    <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
    </svg>
  ),
  
  OccupancyRate: (
    <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
      <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811V2.828zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z"/>
    </svg>
  )
};

export interface DashboardStats {
  // Basic stats
  totalProperties: number;
  totalUnits: number;
  totalTenants: number;
  activeTenants: number;
  unitStatus: {
    occupied: number;
    vacant: number;
  };
  occupancyRate: number;

  // Financial stats
  totalMonthlyRevenue: number;
  outstandingAmount: number;
  outstandingBillsCount: number;
  collectionRate: number;

  // Recent activity
  recentTenants: Array<{
    id: string;
    name: string;
    entryDate: Date;
    monthlyRent: number;
    isActive: boolean;
  }>;
  upcomingLeaseExpirations: Array<{
    id: string;
    name: string;
    leaseEndDate: Date;
    daysUntilExpiry: number;
  }>;

  // Property insights
  propertyTypeBreakdown: Record<string, number>;
  avgUnitsPerProperty: number;
}

export interface StatCardData {
  titleKey: string;
  key: keyof DashboardStats | 'occupiedUnits' | 'vacantUnits';
  icon: React.ReactNode;
}

// Dashboard stat cards configuration - translations handled at runtime
export const dashboardStatCards = [
  {
    titleKey: 'dashboard.totalProperties',
    key: 'totalProperties',
    icon: DashboardIcons.Properties
  },
  {
    titleKey: 'dashboard.activeTenants',
    key: 'activeTenants',
    icon: DashboardIcons.Tenants
  },
  {
    titleKey: 'dashboard.occupiedUnits',
    key: 'occupiedUnits',
    icon: DashboardIcons.OccupiedUnits
  },
  {
    titleKey: 'dashboard.monthlyRevenue',
    key: 'totalMonthlyRevenue',
    icon: DashboardIcons.Revenue
  },
  {
    titleKey: 'dashboard.outstandingAmount',
    key: 'outstandingAmount',
    icon: DashboardIcons.Outstanding
  },
  {
    titleKey: 'dashboard.collectionRate',
    key: 'collectionRate',
    icon: DashboardIcons.CollectionRate
  },
  {
    titleKey: 'dashboard.occupancyRate',
    key: 'occupancyRate',
    icon: DashboardIcons.OccupancyRate
  },
  {
    titleKey: 'dashboard.vacantUnits',
    key: 'vacantUnits',
    icon: DashboardIcons.VacantUnits
  }
] as const;