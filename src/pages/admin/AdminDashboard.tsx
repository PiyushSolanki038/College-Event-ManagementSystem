import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MetricCard from '@/components/ui-custom/MetricCard';
import Card from '@/components/ui-custom/Card';
import DataTable from '@/components/ui-custom/DataTable';
import Badge from '@/components/ui-custom/Badge';
import BarChartComponent from '@/components/charts/BarChart';
import Button from '@/components/ui-custom/Button';
import { useAuth } from '@/context/AuthContext';
import { useEventContext } from '@/context/EventContext';
import { useToast } from '@/components/ui-custom/Toast';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Users, MapPin, Clock, 
  CheckCircle, Shield, ArrowRight, Database, 
  Download, Activity, Zap, ShieldCheck,
  TrendingUp, Layers, Info, Filter,
  ExternalLink, MousePointer2, Briefcase, Globe
} from 'lucide-react';
import { formatDate } from '@/utils/helpers';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { events, users, venues, updateEventStatus, refreshData } = useEventContext();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isSeeding, setIsSeeding] = useState(false);

  const stats = useMemo(() => {
    const totalRegs = events.reduce((sum, e) => sum + (e.registeredCount || 0), 0);
    const pending = events.filter(e => e.status === 'pending').length;
    return {
      totalEvents: events.length,
      activeUsers: users.length,
      facilityDepth: venues.length,
      pendingCount: pending,
      impactReach: totalRegs,
      throughput: events.length > 0 ? (((events.length - pending) / events.length) * 100).toFixed(0) : 100
    };
  }, [events, users, venues]);

  const recentActivity = useMemo(() => [...events].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5), [events]);
  const highImpactEvents = useMemo(() => [...events].sort((a,b) => (b.registeredCount || 0) - (a.registeredCount || 0)).slice(0, 5), [events]);
  const chartData = useMemo(() => highImpactEvents.map(e => ({ 
    name: e.title.length > 12 ? e.title.substring(0, 12) + '...' : e.title, 
    value: e.registeredCount 
  })), [highImpactEvents]);

  const pendingQueue = useMemo(() => events.filter(e => e.status === 'pending').slice(0, 4), [events]);

  if (!user) return null;

  const handleSeed = async () => {
    setIsSeeding(true);
    showToast('info', 'Synchronizing institutional database (MSSQL)...');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/seed`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('college_auth_token')}`
        }
      });
      if (!response.ok) throw new Error('Seeding failed');
      await refreshData();
      showToast('success', 'Institutional data residency confirmed.');
    } catch (error) {
      showToast('danger', 'Residency synchronization failed.');
    } finally {
      setIsSeeding(false);
    }
  };

  const handleGovernance = (id: string, status: 'approved' | 'rejected') => {
    updateEventStatus(id, status);
    showToast(status === 'approved' ? 'success' : 'danger', `Institutional record ${status}`);
  };

  const columns = [
    { 
      key: 'title', 
      header: 'Exhibition Payload', 
      render: (e: any) => (
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
            <img src={e.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <span style={{ fontWeight: 800, color: '#0f172a', fontSize: 14 }}>{e.title}</span>
        </div>
      ) 
    },
    { key: 'status', header: 'Registry State', render: (e: any) => <Badge variant={e.status}>{e.status}</Badge> },
    { key: 'regs', header: 'Saturation', render: (e: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, color: '#2563eb' }}>
            <TrendingUp size={14} /> {e.registeredCount}
        </div>
    )},
    { key: 'date', header: 'Schedule', render: (e: any) => <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>{formatDate(e.date)}</span> },
  ];

  return (
    <div style={{ padding: '0 40px 100px 40px' }}>
      {/* SaaS-Grade Command Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 56, marginTop: 40 }}>
        <div>
          <h1 style={{ fontSize: 36, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>System Governance <span style={{ color: '#2563eb' }}>Command</span></h1>
          <p style={{ fontSize: 16, color: '#64748b', marginTop: 8, fontWeight: 500 }}>Universal administrative oversight and infrastructure auditing.</p>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
            <Button 
                variant="outline" 
                onClick={handleSeed}
                disabled={isSeeding}
                style={{ height: 56, borderRadius: 18, fontWeight: 800, padding: '0 24px' }}
            >
                <Database size={18} /> {isSeeding ? 'Syncing...' : 'Synchronize Registry'}
            </Button>
            <Button onClick={() => {
                const headers = ['ID', 'Title', 'Organizer', 'Date', 'Time', 'Venue', 'Status', 'Registrations', 'Capacity', 'Fill %'];
                const rows = events.map(e => {
                    const organizer = users.find(u => u.id === e.organizerId)?.name || 'Unknown';
                    const venue = venues.find(v => v.id === e.venueId)?.name || 'N/A';
                    return [e.id, e.title, organizer, formatDate(e.date), e.time, venue, e.status, e.registeredCount, e.maxCapacity, ((e.registeredCount / e.maxCapacity) * 100).toFixed(1) + '%'];
                });
                const summaryRow = ['', 'TOTALS', '', '', '', '', '', events.reduce((s, e) => s + e.registeredCount, 0), events.reduce((s, e) => s + e.maxCapacity, 0), ''];
                const csv = [
                    `# System Protocol Export - ${new Date().toLocaleString()}`,
                    `# Total Events: ${stats.totalEvents} | Total Users: ${stats.activeUsers} | Total Venues: ${stats.facilityDepth}`,
                    '',
                    headers.join(','),
                    ...rows.map(r => r.map(c => `"${c}"`).join(',')),
                    summaryRow.map(c => `"${c}"`).join(',')
                ].join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url; a.download = `system_protocol_${new Date().toISOString().split('T')[0]}.csv`; a.click();
                URL.revokeObjectURL(url);
                showToast('success', 'System protocol exported as CSV.');
            }} style={{ height: 56, borderRadius: 18, backgroundColor: '#0f172a', border: 'none', fontWeight: 800, padding: '0 24px' }}>
                <Download size={18} /> Export Protocol
            </Button>
        </div>
      </div>

      {/* Intelligence Command Gallery */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 48 }}>
        {[
          { label: 'Exhibition Depth', value: stats.totalEvents, icon: Layers, color: '#2563eb', bg: '#eff6ff', desc: 'Global system records' },
          { label: 'Network Reach', value: stats.impactReach.toLocaleString(), icon: TrendingUp, color: '#16a34a', bg: '#f0fdf4', desc: 'Saturated engagement' },
          { label: 'Principal Registry', value: stats.activeUsers, icon: Users, color: '#7c3aed', bg: '#f5f3ff', desc: 'Verified identities' },
          { label: 'Moderation Flow', value: `${stats.throughput}%`, icon: ShieldCheck, color: '#f59e0b', bg: '#fffbeb', desc: 'Governance velocity' }
        ].map((s, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            style={{ backgroundColor: 'white', padding: 32, borderRadius: 32, border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)' }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <s.icon size={22} color={s.color} />
            </div>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', marginTop: 4 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#cbd5e1', fontWeight: 600, marginTop: 8 }}>{s.desc}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 32 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {/* Real-Time Registry Section */}
          <Card 
            title="Institutional Registry Audit"
            action={<Button variant="ghost" size="sm" onClick={() => navigate('/admin/events')} style={{ fontSize: 12, fontWeight: 800 }}>Universal View <ArrowRight size={14} /></Button>}
          >
            <DataTable columns={columns} data={recentActivity} />
          </Card>

          {/* Engagement Velocity */}
          <Card title="Exhibition Impact Velocity">
            <div style={{ padding: '16px 0' }}>
                {chartData.length > 0 ? (
                    <BarChartComponent data={chartData} height={280} />
                ) : (
                    <div style={{ textAlign: 'center', padding: '100px 0' }}>
                        <Activity size={48} color="#f1f5f9" style={{ marginBottom: 16 }} />
                        <p style={{ color: '#cbd5e1', fontSize: 14, fontWeight: 600 }}>Registry velocity insufficient for visualization.</p>
                    </div>
                )}
            </div>
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {/* High-Severity Governance Hub */}
          <Card 
            title="High-Severity Moderation hub"
            action={stats.pendingCount > 0 ? <Badge variant="warning">{stats.pendingCount} CRITICAL</Badge> : null}
          >
            {pendingQueue.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '64px 0', border: '2px dashed #f1f5f9', borderRadius: 32 }}>
                <ShieldCheck size={56} color="#dcfce7" style={{ marginBottom: 20 }} />
                <h4 style={{ fontSize: 16, fontWeight: 900, color: '#166534', margin: 0 }}>Governance Compliant</h4>
                <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 8, fontWeight: 600 }}>All curatorial submissions audited.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {pendingQueue.map((e, idx) => (
                  <motion.div 
                    key={e.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    style={{ padding: 24, backgroundColor: '#f8fafc', borderRadius: 24, border: '1px solid #f1f5f9', position: 'relative' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                            <Zap size={20} color="#f59e0b" />
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button 
                                onClick={() => handleGovernance(e.id, 'approved')}
                                style={{ width: 40, height: 40, borderRadius: 12, border: 'none', backgroundColor: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                            >
                                <CheckCircle size={18} />
                            </button>
                            <button 
                                onClick={() => handleGovernance(e.id, 'rejected')}
                                style={{ width: 40, height: 40, borderRadius: 12, border: 'none', backgroundColor: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                            >
                                <Shield size={18} />
                            </button>
                        </div>
                    </div>
                    <div>
                        <div style={{ fontSize: 15, fontWeight: 900, color: '#0f172a' }}>{e.title}</div>
                        <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                            <Clock size={12} /> {formatDate(e.date)}
                        </div>
                    </div>
                  </motion.div>
                ))}
                <Button 
                    variant="ghost" 
                    onClick={() => navigate('/admin/approvals')}
                    style={{ width: '100%', height: 52, borderRadius: 16, fontSize: 13, fontWeight: 800, marginTop: 8 }}
                >
                    Expand Governance Protocol <ArrowRight size={16} />
                </Button>
              </div>
            )}
          </Card>

          {/* Infrastructure Health */}
          <Card title="Infrastructure Saturation">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                    { label: 'Active Facilities', count: venues.length, icon: MapPin, color: '#2563eb' },
                    { label: 'System Reach', count: users.length, icon: Globe, color: '#16a34a' }
                ].map((item, i) => (
                    <div key={i} style={{ padding: 24, backgroundColor: '#f8fafc', borderRadius: 24, border: '1px solid #f1f5f9', textAlign: 'center' }}>
                        <div style={{ fontSize: 24, fontWeight: 900, color: '#0f172a' }}>{item.count}</div>
                        <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginTop: 4 }}>{item.label}</div>
                    </div>
                ))}
            </div>
            <div style={{ marginTop: 24, padding: 20, backgroundColor: '#f0fdf4', borderRadius: 20, border: '1px solid #bbf7d0', display: 'flex', gap: 12 }}>
                <ShieldCheck size={18} color="#16a34a" style={{ flexShrink: 0 }} />
                <p style={{ fontSize: 12, color: '#15803d', fontWeight: 600, margin: 0, lineHeight: 1.5 }}>
                  Institutional infra is currently operating at optimal saturation levels.
                </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
