import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Badge from '@/components/ui-custom/Badge';
import Button from '@/components/ui-custom/Button';
import Card from '@/components/ui-custom/Card';
import { useAuth } from '@/context/AuthContext';
import { useEventContext } from '@/context/EventContext';
import { useToast } from '@/components/ui-custom/Toast';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, MapPin, FileDown, History, CheckCircle2, 
  ChevronRight, Search, LayoutGrid, List, Filter, ArrowUpDown,
  Download, ExternalLink, ShieldCheck, AlertCircle
} from 'lucide-react';
import { formatDate } from '@/utils/helpers';
import TicketModal from '@/components/ui-custom/TicketModal';

export default function MyRegistrations() {
  const { user } = useAuth();
  const { events, registrations, venues, unregisterFromEvent } = useEventContext();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<{ event: any, reg: any } | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');

  if (!user) return null;

  const now = new Date().toISOString().split('T')[0];
  
  const stats = useMemo(() => {
    const userRegs = registrations.filter(r => r.userId === user.id);
    const upcoming = userRegs.filter(r => {
      const e = events.find(ev => ev.id === r.eventId);
      return e && e.date >= now;
    }).length;
    return {
      total: userRegs.length,
      upcoming,
      completed: userRegs.length - upcoming,
      attendanceRate: '100%' // Placeholder
    };
  }, [registrations, events, user.id, now]);

  const filteredRegs = useMemo(() => {
    return registrations
      .map(r => {
        const event = events.find(e => e.id === r.eventId);
        const venue = event ? venues.find(v => v.id === event.venueId) : null;
        const isUpcoming = event ? event.date >= now : false;
        return { ...r, event, venue, isUpcoming };
      })
      .filter(r => r.event)
      .filter(r => tab === 'upcoming' ? r.isUpcoming : !r.isUpcoming)
      .filter(r => r.event!.title.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === 'date') return new Date(a.event!.date).getTime() - new Date(b.event!.date).getTime();
        return a.event!.title.localeCompare(b.event!.title);
      });
  }, [registrations, events, venues, tab, now, searchQuery, sortBy]);

  const handleCancel = async (regId: number) => {
    if (window.confirm('Are you sure you want to withdraw from this institutional engagement? This action is logged.')) {
      try {
        await unregisterFromEvent(regId);
      } catch (err) {
        console.error('Cancellation failed:', err);
      }
    }
  };

  return (
    <div style={{ padding: '0 40px 80px 40px' }}>
      {/* Advanced Analytic Header */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 32, marginTop: 40, marginBottom: 48 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            Event Registry
          </h2>
          <p style={{ fontSize: 14, color: '#64748b', marginTop: 8, fontWeight: 500, lineHeight: 1.5 }}>
            Centralized portal for managing your academic engagements and attendance documentation.
          </p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { label: 'Total Registrations', value: stats.total, icon: <History size={16} /> },
            { label: 'Scheduled Attendance', value: stats.upcoming, icon: <Calendar size={16} /> },
            { label: 'Completed Engagements', value: stats.completed, icon: <CheckCircle2 size={16} /> },
          ].map((stat, i) => (
            <div key={i} style={{ backgroundColor: 'white', border: '1px solid #f1f5f9', borderRadius: 16, padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748b', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>
                {stat.icon} {stat.label}
              </div>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#0f172a' }}>{stat.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Persistent Registry Controls */}
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        backgroundColor: 'white', padding: '12px 16px', borderRadius: 20, border: '1px solid #f1f5f9',
        marginBottom: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flex: 1 }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              placeholder="Filter by title..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ 
                width: '100%', padding: '10px 14px 10px 40px', borderRadius: 12, border: '1px solid #e2e8f0', 
                fontSize: 13, fontWeight: 500, outline: 'none', transition: 'border-color 0.2s'
              }}
            />
          </div>
          <div style={{ width: 1, height: 24, backgroundColor: '#f1f5f9', margin: '0 8px' }} />
          <div style={{ display: 'flex', backgroundColor: '#f1f5f9', padding: '3px', borderRadius: 10 }}>
            <button onClick={() => setTab('upcoming')} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', backgroundColor: tab === 'upcoming' ? 'white' : 'transparent', color: tab === 'upcoming' ? '#0f172a' : '#64748b', boxShadow: tab === 'upcoming' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none' }}>Upcoming</button>
            <button onClick={() => setTab('past')} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', backgroundColor: tab === 'past' ? 'white' : 'transparent', color: tab === 'past' ? '#0f172a' : '#64748b', boxShadow: tab === 'past' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none' }}>History</button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button 
            onClick={() => setSortBy(sortBy === 'date' ? 'title' : 'date')}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 12, border: '1px solid #e2e8f0', backgroundColor: 'white', color: '#64748b', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            <ArrowUpDown size={14} /> Sort: {sortBy === 'date' ? 'Date' : 'Title'}
          </button>
        </div>
      </div>

      {filteredRegs.length === 0 ? (
        <div style={{ p: 100, textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: 32, padding: '80px 0' }}>
          <AlertCircle size={48} color="#cbd5e1" style={{ marginBottom: 16 }} />
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#64748b' }}>No engagement records found matching your criteria.</h3>
          {searchQuery && <Button variant="secondary" onClick={() => setSearchQuery('')} style={{ marginTop: 16 }}>Clear Search Filters</Button>}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Header Legend */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1.2fr', padding: '0 32px 12px 32px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Event Details</div>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Logistics</div>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Registry Status</div>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', textAlign: 'right' }}>Actions</div>
          </div>

          {filteredRegs.map(reg => (
            <motion.div 
              key={reg.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1.2fr', alignItems: 'center',
                padding: '20px 32px', backgroundColor: 'white', borderBottom: '1px solid #f8fafc',
                transition: 'all 0.2s'
              }}
              whileHover={{ backgroundColor: '#fcfdfe' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                  <img src={reg.event!.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#1e293b' }}>{reg.event!.title}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>Ref: REG-{new Date(reg.registeredAt).getFullYear()}-{String(reg.id).padStart(5, '0')}</div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Calendar size={14} color="#94a3b8" /> {formatDate(reg.event!.date)}
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{reg.event!.time} • {reg.venue?.name || 'TBD'}</div>
              </div>

              <div>
                {reg.isUpcoming ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#2563eb', fontSize: 12, fontWeight: 700 }}>
                    <ShieldCheck size={14} /> Confirmed
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: reg.attended ? '#16a34a' : '#94a3b8', fontSize: 12, fontWeight: 700 }}>
                    {reg.attended ? <CheckCircle2 size={14} /> : <History size={14} />}
                    {reg.attended ? 'Attended' : 'History'}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                {reg.isUpcoming ? (
                  <>
                    <button 
                      onClick={() => handleCancel(reg.id)}
                      title="Withdraw"
                      style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', cursor: 'pointer', backgroundColor: 'white' }}
                    >
                      <AlertCircle size={16} />
                    </button>
                    <button 
                      onClick={() => setSelectedTicket({ event: reg.event, reg })}
                      title="Download Pass"
                      style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid #eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', cursor: 'pointer', backgroundColor: '#eff6ff' }}
                    >
                      <FileDown size={18} />
                    </button>
                  </>
                ) : (
                  <button 
                    title="Certified Entry"
                    disabled
                    style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', cursor: 'default', backgroundColor: '#f8fafc' }}
                  >
                    <ShieldCheck size={18} />
                  </button>
                )}
                <button 
                  onClick={() => navigate(`/student/event/${reg.eventId}`)}
                  style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', cursor: 'pointer', backgroundColor: 'white' }}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Advanced Registry Integration */}
      {selectedTicket && (
        <TicketModal 
          isOpen={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
          event={selectedTicket.event}
          registration={selectedTicket.reg}
          venue={selectedTicket.event.venue}
          user={user}
          showToast={showToast}
        />
      )}
    </div>
  );
}
