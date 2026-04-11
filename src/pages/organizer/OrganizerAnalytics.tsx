import React, { useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useEventContext } from '@/context/EventContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, Users, Calendar, Activity, 
  Target, BarChart3, PieChart as PieIcon, 
  Zap, Award, Layers, 
  CheckCircle2, Clock, ShieldCheck, XCircle,
  Building2, ArrowRight, MapPin
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDate } from '@/utils/helpers';

const COLORS = ['#2563eb', '#7c3aed', '#db2777', '#f59e0b', '#10b981', '#6366f1'];

export default function OrganizerAnalytics() {
  const { user } = useAuth();
  const { events, categories, venues } = useEventContext();

  if (!user) return null;

  const myEvents = useMemo(() => events.filter(e => String(e.organizerId) === String(user.id)), [events, user.id]);

  // High-Fidelity Metrics
  const metrics = useMemo(() => {
    const totalRegs = myEvents.reduce((sum, e) => sum + e.registeredCount, 0);
    const totalCapacity = myEvents.reduce((sum, e) => sum + e.maxCapacity, 0);
    const avgSaturation = totalCapacity > 0 ? (totalRegs / totalCapacity * 100).toFixed(1) : '0.0';
    const approvedCount = myEvents.filter(e => e.status === 'approved').length;
    
    return {
      totalEvents: myEvents.length,
      totalRegistrations: totalRegs,
      saturationIndex: avgSaturation,
      approvedRate: myEvents.length > 0 ? (approvedCount / myEvents.length * 100).toFixed(0) : '0'
    };
  }, [myEvents]);

  // Engagement Distribution (registrations per event)
  const engagementData = useMemo(() => {
    return myEvents
      .sort((a, b) => b.registeredCount - a.registeredCount)
      .slice(0, 6)
      .map(e => ({
        name: e.title.length > 15 ? e.title.substring(0, 15) + '...' : e.title,
        full: e.maxCapacity,
        current: e.registeredCount
      }));
  }, [myEvents]);

  // Category Architecture
  const categoryArchitecture = useMemo(() => {
    const cats: Record<string, number> = {};
    myEvents.forEach(e => {
        const cat = categories.find(c => c.id === e.categoryId);
        const name = cat?.name || 'General';
        cats[name] = (cats[name] || 0) + 1;
    });
    return Object.entries(cats).map(([name, value]) => ({ name, value }));
  }, [myEvents, categories]);

  // Real Momentum Data — group events by month
  const momentumData = useMemo(() => {
    const months: Record<string, number> = {};
    myEvents.forEach(e => {
      const d = new Date(e.date);
      const key = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      months[key] = (months[key] || 0) + e.registeredCount;
    });
    const entries = Object.entries(months).slice(-7);
    if (entries.length === 0) return [{ month: 'No Data', regs: 0 }];
    return entries.map(([month, regs]) => ({ month, regs }));
  }, [myEvents]);

  // Venue Utilization
  const venueUtilization = useMemo(() => {
    const usage: Record<string, { name: string; events: number; totalRegs: number; totalCap: number }> = {};
    myEvents.forEach(e => {
      const v = venues.find(v => v.id === e.venueId);
      const name = v?.name || 'Unknown';
      if (!usage[e.venueId]) usage[e.venueId] = { name, events: 0, totalRegs: 0, totalCap: 0 };
      usage[e.venueId].events++;
      usage[e.venueId].totalRegs += e.registeredCount;
      usage[e.venueId].totalCap += e.maxCapacity;
    });
    return Object.values(usage).sort((a, b) => b.events - a.events);
  }, [myEvents, venues]);

  // Status Pipeline
  const pipeline = useMemo(() => {
    return {
      draft: myEvents.filter(e => e.status === 'draft').length,
      pending: myEvents.filter(e => e.status === 'pending').length,
      approved: myEvents.filter(e => e.status === 'approved').length,
      rejected: myEvents.filter(e => e.status === 'rejected').length
    };
  }, [myEvents]);

  return (
    <div style={{ padding: '0 40px 80px 40px' }}>
      {/* Analytics Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, marginTop: 40 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            Curatorial <span style={{ color: '#2563eb' }}>Intelligence Hub</span>
          </h1>
          <p style={{ fontSize: 15, color: '#64748b', marginTop: 8, fontWeight: 500 }}>
            Analytical overview of exhibition performance and institutional engagement.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ padding: '8px 16px', backgroundColor: '#f0fdf4', borderRadius: 12, border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#16a34a' }} />
            <span style={{ fontSize: 12, fontWeight: 800, color: '#166534' }}>Live Repository Sync</span>
          </div>
        </div>
      </div>

      {/* KPI Command Center */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 40 }}>
        {[
          { label: 'Total Portfolio', value: metrics.totalEvents, icon: Calendar, color: '#2563eb', bg: '#eff6ff', desc: 'Managed exhibitions' },
          { label: 'Collective Reach', value: metrics.totalRegistrations.toLocaleString(), icon: Users, color: '#7c3aed', bg: '#f5f3ff', desc: 'Total students engaged' },
          { label: 'Saturation Index', value: `${metrics.saturationIndex}%`, icon: Zap, color: '#f59e0b', bg: '#fffbeb', desc: 'Capacity utilization pool' },
          { label: 'Vetting Rate', value: `${metrics.approvedRate}%`, icon: ShieldCheck, color: '#10b981', bg: '#ecfdf5', desc: 'Moderation success rate' }
        ].map((kpi, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{ backgroundColor: 'white', padding: 24, borderRadius: 24, border: '1px solid #f1f5f9', position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: kpi.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <kpi.icon size={20} color={kpi.color} />
              </div>
              <TrendingUp size={16} color="#cbd5e1" />
            </div>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{kpi.label}</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', marginTop: 4 }}>{kpi.value}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 8, fontWeight: 500 }}>{kpi.desc}</div>
          </motion.div>
        ))}
      </div>

      {/* Status Pipeline Funnel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ backgroundColor: 'white', borderRadius: 28, padding: 32, border: '1px solid #f1f5f9', marginBottom: 32 }}
      >
        <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Target size={20} color="#2563eb" /> Event Status Pipeline
        </h3>
        <div style={{ display: 'flex', gap: 0, alignItems: 'stretch' }}>
          {[
            { label: 'Draft', count: pipeline.draft, color: '#94a3b8', bg: '#f1f5f9', icon: Layers },
            { label: 'Pending', count: pipeline.pending, color: '#f59e0b', bg: '#fffbeb', icon: Clock },
            { label: 'Approved', count: pipeline.approved, color: '#16a34a', bg: '#f0fdf4', icon: CheckCircle2 },
            { label: 'Rejected', count: pipeline.rejected, color: '#dc2626', bg: '#fef2f2', icon: XCircle }
          ].map((stage, i, arr) => (
            <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <div style={{ 
                flex: 1, padding: 24, backgroundColor: stage.bg, borderRadius: 20, textAlign: 'center',
                border: `1px solid ${stage.color}20`
              }}>
                <stage.icon size={24} color={stage.color} style={{ marginBottom: 8 }} />
                <div style={{ fontSize: 28, fontWeight: 900, color: stage.color }}>{stage.count}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginTop: 4 }}>{stage.label}</div>
              </div>
              {i < arr.length - 1 && (
                <ArrowRight size={20} color="#cbd5e1" style={{ margin: '0 8px', flexShrink: 0 }} />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Primary Analytics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: 32, marginBottom: 32 }}>
        {/* Engagement Analytics */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ backgroundColor: 'white', borderRadius: 32, padding: 32, border: '1px solid #f1f5f9' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>Saturation Landscape</h3>
              <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0 0' }}>Registration density relative to facility thresholds.</p>
            </div>
            <BarChart3 size={20} color="#94a3b8" />
          </div>

          <div style={{ height: 350 }}>
            {engagementData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={engagementData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity={1} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: '#64748b' }} />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: 12, fontWeight: 700 }}
                  />
                  <Bar dataKey="current" name="Registrations" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
                    <Layers size={48} strokeWidth={1} style={{ marginBottom: 16 }} />
                    <p style={{ fontSize: 14, fontWeight: 600 }}>Insufficient record depth for saturation mapping.</p>
                </div>
            )}
          </div>
        </motion.div>

        {/* Real Momentum Index */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ backgroundColor: '#0f172a', borderRadius: 32, padding: 32, color: 'white' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Registration Momentum</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: '4px 0 0 0' }}>Monthly engagement trends (real data).</p>
            </div>
            <Activity size={20} color="rgba(255,255,255,0.3)" />
          </div>

          <div style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={momentumData}>
                <defs>
                  <linearGradient id="momentumGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.5)' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: 8, color: 'white', fontSize: 12 }}
                  itemStyle={{ color: '#3b82f6' }}
                />
                <Area type="monotone" dataKey="regs" name="Registrations" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#momentumGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div style={{ marginTop: 20, padding: 20, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <TrendingUp size={16} color="#3b82f6" />
              <span style={{ fontSize: 14, fontWeight: 700 }}>
                {metrics.totalRegistrations} total registrations across {metrics.totalEvents} events
              </span>
            </div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
              Data sourced from actual event registrations in the database.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Secondary Data Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 32 }}>
        {/* Domain Mix */}
        <div style={{ backgroundColor: 'white', borderRadius: 32, padding: 32, border: '1px solid #f1f5f9' }}>
          <h4 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
            <PieIcon size={18} color="#2563eb" /> Domain Architecture
          </h4>
          <div style={{ height: 260 }}>
            {categoryArchitecture.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={categoryArchitecture}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={8}
                            dataKey="value"
                        >
                            {categoryArchitecture.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                    </PieChart>
                </ResponsiveContainer>
            ) : (
                <p style={{ textAlign: 'center', padding: '100px 0', color: '#94a3b8', fontSize: 13 }}>No domain data yet.</p>
            )}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            {categoryArchitecture.map((cat, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: '#64748b' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: COLORS[i % COLORS.length] }} />
                {cat.name} ({cat.value})
              </div>
            ))}
          </div>
        </div>

        {/* Venue Utilization */}
        <div style={{ backgroundColor: 'white', borderRadius: 32, padding: 32, border: '1px solid #f1f5f9' }}>
          <h4 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Building2 size={18} color="#7c3aed" /> Venue Utilization
          </h4>
          {venueUtilization.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {venueUtilization.map((v, i) => {
                const fillPct = v.totalCap > 0 ? (v.totalRegs / v.totalCap * 100) : 0;
                return (
                  <div key={i} style={{ padding: 16, backgroundColor: '#f8fafc', borderRadius: 16, border: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <MapPin size={14} color="#7c3aed" />
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{v.name}</span>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8' }}>{v.events} event(s)</span>
                    </div>
                    <div style={{ height: 6, backgroundColor: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(100, fillPct)}%`, height: '100%', backgroundColor: '#7c3aed', borderRadius: 3, transition: 'width 0.5s' }} />
                    </div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 6 }}>{v.totalRegs} regs / {v.totalCap} capacity ({fillPct.toFixed(0)}%)</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ textAlign: 'center', padding: '80px 0', color: '#94a3b8', fontSize: 13 }}>No venue data recorded yet.</p>
          )}
        </div>

        {/* Top Performing Events Table */}
        <div style={{ backgroundColor: 'white', borderRadius: 32, padding: 32, border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h4 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Award size={18} color="#f59e0b" /> Top Performers
                </h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[...myEvents].sort((a, b) => b.registeredCount - a.registeredCount).slice(0, 5).map((event, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 14, backgroundColor: '#f8fafc', borderRadius: 16, border: '1px solid #f1f5f9' }}>
                        <div style={{ 
                          width: 32, height: 32, borderRadius: 10, 
                          backgroundColor: i === 0 ? '#fffbeb' : i === 1 ? '#f1f5f9' : '#fef2f2',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                          fontSize: 13, fontWeight: 900, color: i === 0 ? '#d97706' : i === 1 ? '#64748b' : '#dc2626'
                        }}>
                          #{i + 1}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{event.title}</div>
                            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 500 }}>{categories.find(c => c.id === event.categoryId)?.name}</div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <div style={{ fontSize: 16, fontWeight: 900, color: '#2563eb' }}>{((event.registeredCount / event.maxCapacity) * 100).toFixed(0)}%</div>
                            <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8' }}>{event.registeredCount} regs</div>
                        </div>
                    </div>
                ))}
                {myEvents.length === 0 && (
                     <div style={{ textAlign: 'center', padding: '60px 0', border: '2px dashed #f1f5f9', borderRadius: 24 }}>
                        <Clock size={32} color="#cbd5e1" style={{ marginBottom: 12 }} />
                        <p style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>Awaiting exhibition lifecycles to generate benchmarks.</p>
                     </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
