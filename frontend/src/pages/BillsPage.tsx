import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getBillsByTenant, markBillAsPaid, downloadReceipt } from '../api/bill';
import { useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useTenant } from '../hooks/useData';
import { Download } from 'lucide-react';
import type { Bill } from '@tenant-lib/model';

const BillsPage = () => {
  const { t } = useTranslation();
  const { tenantId } = useParams<{ tenantId: string }>();
  const { data: bills, isLoading, refetch } = useQuery<Bill[]>({ queryKey: ['bills', tenantId], queryFn: () => getBillsByTenant(tenantId!) });
  const { data: tenant, isLoading: isTenantLoading } = useTenant(tenantId);

  const handleMarkAsPaid = async (billId: string) => {
    await markBillAsPaid(billId);
    refetch();
  };

  const handleDownloadReceipt = async (billId: string) => {
    try {
      await downloadReceipt(billId);
    } catch (error) {
      console.error('Failed to download receipt:', error);
      // You could add a toast notification here
    }
  };


  function getBillCardStyle (isPaid: boolean) {
    return isPaid ? 'border-green-500' : 'border-red-500'
  };


  if (isLoading || isTenantLoading) {
    return <div className="text-muted-foreground">{t('bills.loading')}</div>;
  }

  if (!bills || bills.length === 0) {
    return <div className="text-muted-foreground">{t('bills.noBillsFound')}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-bold mb-6">
        {t('bills.billsFor')}{tenant ? `${tenant.firstName} ${tenant.lastName}` : t('tenant.tenant')} {t('common.id')}{tenantId})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bills.map((bill) => (
          <Card key={bill.id} className={getBillCardStyle(bill.isPaid)}>
            <CardHeader>
              <CardTitle>{t('bills.billFor')}{bill.month}/{bill.year}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold mb-2">{t('bills.amount')}{bill.amount.toFixed(2)}</p>
              <p className="text-muted-foreground mb-1">{t('bills.dueDate')}{new Date(bill.dueDate).toLocaleDateString()}</p>
              <p className="text-muted-foreground mb-4">{t('bills.statusLabel')}{bill.isPaid ? t('bills.statusValues.paid') : t('bills.statusValues.unpaid')}</p>
              <div className="space-y-2">
                {!bill.isPaid ? (
                  <Button onClick={() => handleMarkAsPaid(bill.id)} className="w-full">
                    {t('bills.markAsPaid')}
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={() => handleDownloadReceipt(bill.id)} 
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {t('bills.downloadReceipt')}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BillsPage;
