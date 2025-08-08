import React from 'react';
import { useTranslation } from 'react-i18next';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home } from 'lucide-react';

interface UnitStatus {
  occupied: number;
  vacant: number;
}

interface UnitOccupancyChartProps {
  unitStatus: UnitStatus;
}

export const UnitOccupancyChart: React.FC<UnitOccupancyChartProps> = ({ unitStatus }) => {
  const { t } = useTranslation();
  const chartData = [
    { name: t('unit.occupied'), value: unitStatus.occupied, color: '#10b981' },
    { name: t('unit.vacant'), value: unitStatus.vacant, color: '#f59e0b' },
  ];

  const total = unitStatus.occupied + unitStatus.vacant;
  const occupancyRate = total > 0 ? Math.round((unitStatus.occupied / total) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5" />
          {t('dashboard.unitOccupancy')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value} ${t('unit.unitsLabel')}`, name]}
                contentStyle={{
                  backgroundColor: "var(--token-color-surface-primary)",
                  border: "1px solid var(--token-color-border-primary)",
                  borderRadius: "8px",
                  color: "var(--token-color-foreground-primary)",
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                wrapperStyle={{ 
                  color: "var(--token-color-foreground-primary)",
                  fontSize: "14px"
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Summary Stats */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">{occupancyRate}%</p>
              <p className="text-sm text-gray-600">{t('dashboard.occupancyRate')}</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{total}</p>
              <p className="text-sm text-gray-600">{t('unit.totalUnits')}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};