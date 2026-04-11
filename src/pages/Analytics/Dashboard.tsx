import React, { useMemo } from 'react';
import { useEventContext } from '../../context/EventContext';
import MetricCard from '@/components/ui-custom/MetricCard';
import Card from '@/components/ui-custom/Card';
import BarChartComponent from '@/components/charts/BarChart';
import PieChartComponent from '@/components/charts/PieChart';
import LineChartComponent from '@/components/charts/LineChart';
import { Calendar, Users, Clock, TrendingUp } from 'lucide-react';

const mockTrend = Array.from({ length: 14 }, (_, i) => ({
  date: `Apr ${i + 1}`,
  count: Math.floor(Math.random() * 30) + 10,
}));

const Analytics: React.FC = () => {
  const { events, categories, users } = useEventContext();

  const totalRegistrations = events.reduce((sum, e) => sum + e.registeredCount, 0);
  const pendingCount = events.filter(e => e.status === 'pending').length;
  const avgRegs = events.length > 0 ? Math.round(totalRegistrations / events.length) : 0;

  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    events.forEach(e => { counts[e.status] = (counts[e.status] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));
  }, [events]);

  const categoryData = useMemo(() => {
    return categories.map(cat => ({
      name: cat.name,
      value: events.filter(e => e.categoryId === cat.id).length,
    })).filter(c => c.value > 0);
  }, [events, categories]);

  const registrationData = useMemo(() => {
    return events
      .filter(e => e.status === 'approved' && e.registeredCount > 0)
      .map(e => ({ name: e.title.length > 12 ? e.title.substring(0, 12) + '...' : e.title, value: e.registeredCount }));
  }, [events]);

  return (
    <div>
      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        <MetricCard label="Total Events" value={events.length} icon={Calendar} />
        <MetricCard label="Total Registrations" value={totalRegistrations} icon={Users} />
        <MetricCard label="Pending Review" value={pendingCount} icon={Clock} changeType={pendingCount > 0 ? 'warning' : 'neutral'} />
        <MetricCard label="Avg per Event" value={avgRegs} icon={TrendingUp} />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <Card title="Events by Status">
          <PieChartComponent data={statusData} height={280} innerRadius={60} />
        </Card>
        <Card title="Events by Category">
          {categoryData.length > 0 ? (
            <BarChartComponent data={categoryData} height={280} />
          ) : (
            <p style={{ fontSize: 12.5, color: '#64748b', textAlign: 'center', padding: '32px 0' }}>No data</p>
          )}
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Card title="Registration Performance">
          {registrationData.length > 0 ? (
            <BarChartComponent data={registrationData} height={280} />
          ) : (
            <p style={{ fontSize: 12.5, color: '#64748b', textAlign: 'center', padding: '32px 0' }}>No data</p>
          )}
        </Card>
        <Card title="Registration Trend">
          <LineChartComponent data={mockTrend} height={280} />
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
