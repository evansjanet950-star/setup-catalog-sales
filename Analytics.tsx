import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { MetricsCards } from './analytics/MetricsCards';
import { RevenueChart } from './analytics/RevenueChart';
import { TopProductsTable } from './analytics/TopProductsTable';
import { DateRangeFilter } from './analytics/DateRangeFilter';

export function Analytics() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [carts, setCarts] = useState<any[]>([]);
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', startDate)
        .lte('created_at', endDate + 'T23:59:59');

      const { data: cartsData } = await supabase
        .from('abandoned_carts')
        .select('*')
        .gte('created_at', startDate)
        .lte('created_at', endDate + 'T23:59:59');

      setOrders(ordersData || []);
      setCarts(cartsData || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = () => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.total_amount, 0);
    const totalAbandoned = carts.length;
    const recoveredCarts = carts.filter(c => c.completed).length;
    const recoveryRate = totalAbandoned > 0 ? (recoveredCarts / totalAbandoned) * 100 : 0;
    const conversionRate = (totalAbandoned + totalOrders) > 0 ? (totalOrders / (totalAbandoned + totalOrders)) * 100 : 0;

    const productSales: any = {};
    orders.forEach(order => {
      order.order_items?.forEach((item: any) => {
        if (!productSales[item.product_id]) {
          productSales[item.product_id] = { name: item.name, quantity: 0, revenue: 0 };
        }
        productSales[item.product_id].quantity += item.quantity;
        productSales[item.product_id].revenue += item.price * item.quantity;
      });
    });

    const topProducts = Object.entries(productSales)
      .map(([id, data]: any) => ({ id, ...data }))
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 10);

    const dailyRevenue: any = {};
    orders.forEach(order => {
      const date = new Date(order.created_at).toISOString().split('T')[0];
      dailyRevenue[date] = (dailyRevenue[date] || 0) + order.total_amount;
    });

    const revenueData = Object.entries(dailyRevenue)
      .map(([date, revenue]) => ({ date, revenue: revenue as number }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return { totalOrders, totalRevenue, conversionRate, recoveryRate, topProducts, revenueData };
  };

  const exportCSV = () => {
    const metrics = calculateMetrics();
    const csv = [
      ['Metric', 'Value'],
      ['Total Orders', metrics.totalOrders],
      ['Total Revenue', `$${metrics.totalRevenue.toFixed(2)}`],
      ['Conversion Rate', `${metrics.conversionRate.toFixed(1)}%`],
      ['Cart Recovery Rate', `${metrics.recoveryRate.toFixed(1)}%`],
      ['', ''],
      ['Date', 'Revenue'],
      ...metrics.revenueData.map(d => [d.date, d.revenue]),
      ['', ''],
      ['Product', 'Units Sold', 'Revenue'],
      ...metrics.topProducts.map(p => [p.name, p.quantity, `$${p.revenue.toFixed(2)}`])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${startDate}-to-${endDate}.csv`;
    a.click();
  };

  if (loading) return <div className="text-center py-8">Loading analytics...</div>;

  const metrics = calculateMetrics();

  return (
    <div>
      <DateRangeFilter
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onExport={exportCSV}
      />
      <MetricsCards {...metrics} />
      <RevenueChart data={metrics.revenueData} />
      <TopProductsTable products={metrics.topProducts} />
    </div>
  );
}