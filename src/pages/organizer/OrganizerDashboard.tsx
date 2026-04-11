import React, { useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useEventContext } from '@/context/EventContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, Users, CheckCircle2, Plus, 
  TrendingUp, Clock, ShieldAlert, Award,
  ArrowRight, BarChart3, MapPin,
  Zap, Layers, Sparkles, Building,
  AlertCircle, XCircle, Timer, Star
} from 'lucide-react';
import { formatDate } from '@/utils/helpers';
import Badge from '@/components/ui-custom/Badge';
import Button from '@/components/ui-custom/Button';

export default function OrganizerDashboard() {
  const { user } = useAuth();
  const { events, categories, venues } = useEventContext();
  const navigate = useNavigate();

  if (!user) return null;

  const myEvents = useMemo(() => events.filter(e => String(e.organizerId) === String(user.id)), [events, user.id]);

  const stats = useMemo(() => {
    const totalRegs = myEvents.reduce((sum, e) => sum + e.registeredCount, 0);
    const pending = myEvents.filter(e => e.status === 'pending').length;
    const approved = myEvents.filter(e => e.status === 'approved').length;
    const rejected = myEvents.filter(e => e.status === 'rejected').length;
    const totalCapacity = myEvents.reduce((sum, e) => sum + e.maxCapacity, 0);
    const engagementRate = totalCapacity > 0 ? ((totalRegs / totalCapacity) * 100).toFixed(1) : '0.0';

    return { total: myEvents.length, pending, approved, rejected, totalRegs, engagementRate, totalCapacity };
  }, [myEvents]);

  // Top performer
  const topEvent = useMemo(() => {
    if (myEvents.length === 0) return null;
    return [...myEvents].sort((a, b) => b.registeredCount - a.registeredCount)[0];
  }, [myEvents]);

  // Upcoming events (next 14 days)
  const upcomingEvents = useMemo(() => {
    const now = new Date();
    const twoWeeks = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    return myEvents
      .filter(e => {
        const d = new Date(e.date);
        return d >= now && d <= twoWeeks && e.status === 'approved';
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 4);
  }, [myEvents]);

  // Recent status changes (notifications)
  const notifications = useMemo(() => {
    const items: { icon: any; color: string; bg: string; text: string; time: string }[] = [];
    myEvents.filter(e => e.status === 'approved').slice(0, 2).forEach(e => {
      items.push({ icon: CheckCircle2, color: '#16a34a', bg: '#f0fdf4', text: `"${e.title}" has been approved`, time: 'Recently' });
    });
    myEvents.filter(e => e.status === 'rejected').slice(0, 2).forEach(e => {
      items.push({ icon: XCircle, color: '#dc2626', bg: '#fef2f2', text: `"${e.title}" was declined${e.rejectionReason ? ': ' + e.rejectionReason : ''}`, time: 'Recently' });
    });
    myEvents.filter(e => e.status === 'pending').slice(0, 2).forEach(e => {
      items.push({ icon: Clock, color: '#f59e0b', bg: '#fffbeb', text: `"${e.title}" is awaiting review`, time: 'In Queue' });
    });
    return items.slice(0, 5);
  }, [myEvents]);

  const getDaysUntil = (date: string) => {
    const diff = Math.ceil((new Date(date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Tomorrow';
    return `${diff} days`;
  };

  const recentList = useMemo(() => {
    return [...myEvents].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  }, [myEvents]);

  return (
    <div style={{ padding: '0 40px 80px 40px' }}>
      {/* Cinematic Welcome Header */}
      <div style={{ position: 'relative', padding: '60px 0', marginBottom: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}
          >
            <div style={{ padding: '8px 16px', backgroundColor: '#eff6ff', borderRadius: 12, border: '1px solid #dbeafe', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, border: '2px solid #2563eb', borderRadius: '50%' }} />
              <span style={{ fontSize: 11, fontWeight: 800, color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Institutional Curator</span>
            </div>
            <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>Active Session: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ fontSize: 48, fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.03em' }}
          >
            Curatorial <span style={{ color: '#2563eb' }}>Command Suite</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ fontSize: 18, color: '#64748b', marginTop: 12, fontWeight: 500, maxWidth: 500 }}
          >
            Overseeing the lifecycle of high-impact institutional engagements.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          style={{ display: 'flex', gap: 16 }}
        >
          <Button variant="outline" onClick={() => navigate('/organizer/analytics')} style={{ padding: '0 24px', borderRadius: 16, height: 56 }}>
            <BarChart3 size={18} /> Performance Trends
          </Button>
          <Button onClick={() => navigate('/organizer/create-event')} style={{ padding: '0 32px', borderRadius: 16, height: 56, boxShadow: '0 10px 20px rgba(37, 99, 235, 0.15)' }}>
            <Plus size={20} /> Create New Exhibition
          </Button>
        </motion.div>

        <div style={{ position: 'absolute', top: 0, right: -100, width: 400, height: 400, background: 'radial-gradient(circle, rgba(37, 99, 235, 0.03) 0%, transparent 70%)', zIndex: 0 }} />
      </div>

      {/* KPI Orchestration Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 56 }}>
        {[
          { label: 'Managed Records', value: stats.total, icon: Layers, color: '#2563eb', bg: '#eff6ff', trend: 'Catalog Depth' },
          { label: 'Approved & Live', value: stats.approved, icon: CheckCircle2, color: '#16a34a', bg: '#f0fdf4', trend: 'Authorized Status' },
          { label: 'Collective Reach', value: stats.totalRegs.toLocaleString(), icon: Users, color: '#7c3aed', bg: '#f5f3ff', trend: 'Student Visits' },
          { label: 'Saturation Rate', value: `${stats.engagementRate}%`, icon: Zap, color: '#f59e0b', bg: '#fffbeb', trend: 'Capacity Flux' }
        ].map((kpi, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + (i * 0.1) }}
            style={{ backgroundColor: 'white', padding: 32, borderRadius: 28, border: '1px solid #f1f5f9', boxShadow: '0 4px 6px rgba(0,0,0,0.01)' }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: kpi.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <kpi.icon size={22} color={kpi.color} />
            </div>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{kpi.label}</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', marginTop: 4 }}>{kpi.value}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: kpi.color, marginTop: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <TrendingUp size={14} /> {kpi.trend}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Top Performer Banner */}
      {topEvent && topEvent.registeredCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ 
            background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)', 
            borderRadius: 28, padding: 32, marginBottom: 40, 
            display: 'flex', alignItems: 'center', gap: 32, color: 'white', position: 'relative', overflow: 'hidden' 
          }}
        >
          <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
          <div style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Star size={28} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6, marginBottom: 6 }}>Top Performing Event</div>
            <div style={{ fontSize: 22, fontWeight: 900 }}>{topEvent.title}</div>
            <div style={{ fontSize: 14, opacity: 0.7, marginTop: 4 }}>{topEvent.registeredCount} registrations • {((topEvent.registeredCount / topEvent.maxCapacity) * 100).toFixed(0)}% capacity filled</div>
          </div>
          <button
            onClick={() => navigate(`/organizer/edit-event/${topEvent.id}`)}
            style={{ padding: '12px 24px', backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 14, color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
          >
            Manage <ArrowRight size={16} />
          </button>
        </motion.div>
      )}

      {/* Upcoming Events Strip */}
      {upcomingEvents.length > 0 && (
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, padding: '0 8px' }}>
            <Timer size={18} color="#f59e0b" />
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>Upcoming This Fortnight</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(upcomingEvents.length, 4)}, 1fr)`, gap: 16 }}>
            {upcomingEvents.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                onClick={() => navigate(`/organizer/edit-event/${event.id}`)}
                style={{ 
                  backgroundColor: 'white', borderRadius: 20, padding: 24, border: '1px solid #f1f5f9', 
                  cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', gap: 12 
                }}
                whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ 
                    padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 800,
                    backgroundColor: getDaysUntil(event.date) === 'Today' ? '#fef2f2' : getDaysUntil(event.date) === 'Tomorrow' ? '#fffbeb' : '#eff6ff',
                    color: getDaysUntil(event.date) === 'Today' ? '#dc2626' : getDaysUntil(event.date) === 'Tomorrow' ? '#d97706' : '#2563eb'
                  }}>
                    {getDaysUntil(event.date)}
                  </span>
                  <Calendar size={14} color="#94a3b8" />
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', lineHeight: 1.3 }}>{event.title}</div>
                <div style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <MapPin size={12} /> {venues.find(v => v.id === event.venueId)?.name || 'TBD'}
                </div>
                <div style={{ height: 4, backgroundColor: '#f1f5f9', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: `${(event.registeredCount / event.maxCapacity) * 100}%`, height: '100%', backgroundColor: '#2563eb', borderRadius: 2, transition: 'width 0.5s' }} />
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>{event.registeredCount}/{event.maxCapacity} registered</div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Primary Context Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.1fr', gap: 40 }}>
        
        {/* Recent Ledger */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, padding: '0 8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Sparkles size={20} color="#2563eb" />
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0 }}>Recent Portfolio Activity</h3>
            </div>
            <button 
              onClick={() => navigate('/organizer/events')}
              style={{ fontSize: 13, fontWeight: 700, color: '#2563eb', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              Master Registry <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {recentList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '100px 0', backgroundColor: 'white', borderRadius: 32, border: '1px solid #f1f5f9' }}>
                <Calendar size={64} strokeWidth={1} color="#e2e8f0" style={{ marginBottom: 24 }} />
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#1e293b' }}>Registry Empty</h3>
                <p style={{ fontSize: 14, color: '#64748b' }}>Curate your first exhibition to initiate the ledger.</p>
              </div>
            ) : (
              recentList.map((event, idx) => (
                <motion.div 
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + (idx * 0.1) }}
                  whileHover={{ scale: 1.01, x: 8 }}
                  style={{ backgroundColor: 'white', padding: 24, borderRadius: 24, border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 24, cursor: 'pointer' }}
                  onClick={() => navigate(`/organizer/edit-event/${event.id}`)}
                >
                  <div style={{ width: 64, height: 64, borderRadius: 16, overflow: 'hidden', flexShrink: 0 }}>
                    <img src={event.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>{event.title}</div>
                    <div style={{ fontSize: 13, color: '#64748b', marginTop: 4, display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={13} /> {formatDate(event.date)}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={13} /> {venues.find(v => v.id === event.venueId)?.name || 'Building 4'}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <Badge variant={event.status as any}>{event.status}</Badge>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', marginTop: 8 }}>{event.registeredCount} Students</div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Notifications + Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          
          {/* Live Notification Feed */}
          <div style={{ backgroundColor: 'white', borderRadius: 32, padding: 32, border: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <AlertCircle size={18} color="#2563eb" />
              <h4 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: 0 }}>Status Notifications</h4>
            </div>
            {notifications.length === 0 ? (
              <p style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center', padding: '24px 0' }}>No activity yet. Submit events for review to see updates here.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {notifications.map((n, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, padding: 14, backgroundColor: n.bg, borderRadius: 16, alignItems: 'flex-start' }}>
                    <n.icon size={16} color={n.color} style={{ marginTop: 2, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#334155', lineHeight: 1.4 }}>{n.text}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4, fontWeight: 600 }}>{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions Card */}
          <div style={{ backgroundColor: '#0f172a', borderRadius: 32, padding: 32, color: 'white' }}>
            <h4 style={{ fontSize: 15, fontWeight: 800, margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp size={18} color="#2563eb" /> Resource Management
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { label: 'Venue Directory', icon: Building, path: '/organizer/venues', count: venues.length },
                { label: 'Engagement Audit', icon: BarChart3, path: '/organizer/analytics', count: stats.totalRegs }
              ].map((action, i) => (
                <button 
                  key={i}
                  onClick={() => navigate(action.path)}
                  style={{ 
                    backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: 20, padding: 20, textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                >
                  <action.icon size={20} color="#2563eb" />
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginTop: 12, textTransform: 'uppercase' }}>{action.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: 'white', marginTop: 4 }}>{action.count}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Pipeline Summary */}
          <div style={{ backgroundColor: 'white', borderRadius: 32, padding: 32, border: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <Clock size={18} color="#f59e0b" />
              <h4 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: 0 }}>Event Pipeline</h4>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Awaiting Review', count: stats.pending, color: '#f59e0b', bg: '#fffbeb' },
                { label: 'Approved & Live', count: stats.approved, color: '#16a34a', bg: '#f0fdf4' },
                { label: 'Declined', count: stats.rejected, color: '#dc2626', bg: '#fef2f2' }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', backgroundColor: item.bg, borderRadius: 14 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>{item.label}</span>
                  <span style={{ fontSize: 18, fontWeight: 900, color: item.color }}>{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Institutional Note */}
          <div style={{ padding: '24px', backgroundColor: '#f8fafc', borderRadius: 24, border: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <Award size={20} color="#2563eb" />
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>Curator Impact Status</div>
                <p style={{ fontSize: 12, color: '#64748b', marginTop: 4, lineHeight: 1.5 }}>
                  Successfully managing high-saturation exhibitions contributes to your institutional curator rating.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
