import React, { useState, useMemo } from 'react';
import Badge from '@/components/ui-custom/Badge';
import Button from '@/components/ui-custom/Button';
import Modal from '@/components/ui-custom/Modal';
import { useAuth } from '@/context/AuthContext';
import { useEventContext } from '@/context/EventContext';
import { useToast } from '@/components/ui-custom/Toast';
import { useNavigate } from 'react-router-dom';
import { 
  Pencil, Send, Trash2, Calendar, Plus, 
  Search, Users, MapPin, 
  Clock, TrendingUp, AlertCircle, CheckCircle2,
  Copy, Download, ArrowUpDown, ChevronDown, ChevronUp,
  Eye, Mail, Phone, Globe
} from 'lucide-react';
import { formatDate } from '@/utils/helpers';
import { motion, AnimatePresence } from 'framer-motion';

export default function MyEvents() {
  const { user } = useAuth();
  const { events, venues, categories, deleteEvent, updateEventStatus } = useEventContext();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [tab, setTab] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'registrations' | 'capacity' | 'title'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  if (!user) return null;

  const myEvents = useMemo(() => {
    let filtered = events
      .filter(e => String(e.organizerId) === String(user.id))
      .filter(e => tab === 'all' || e.status === tab)
      .filter(e => !search || e.title.toLowerCase().includes(search.toLowerCase()));

    filtered.sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case 'date': cmp = new Date(a.date).getTime() - new Date(b.date).getTime(); break;
        case 'registrations': cmp = a.registeredCount - b.registeredCount; break;
        case 'capacity': cmp = (a.registeredCount / a.maxCapacity) - (b.registeredCount / b.maxCapacity); break;
        case 'title': cmp = a.title.localeCompare(b.title); break;
      }
      return sortDir === 'desc' ? -cmp : cmp;
    });

    return filtered;
  }, [events, user.id, tab, search, sortBy, sortDir]);

  const stats = useMemo(() => {
    const relevant = events.filter(e => String(e.organizerId) === String(user.id));
    return {
      active: relevant.filter(e => e.status === 'approved').length,
      pending: relevant.filter(e => e.status === 'pending').length,
      totalRegistrations: relevant.reduce((acc, curr) => acc + curr.registeredCount, 0),
      avgEngagement: relevant.length ? (relevant.reduce((acc, curr) => acc + (curr.registeredCount / curr.maxCapacity), 0) / relevant.length * 100).toFixed(1) : 0
    };
  }, [events, user.id]);

  const handleDelete = async () => {
    if (deleteId) {
      showToast('info', 'Purging institutional record...');
      await deleteEvent(deleteId);
      showToast('danger', 'Exhibition record purged');
      setDeleteId(null);
    }
  };

  const handleSubmit = async (eventId: string) => {
    showToast('info', 'Synchronizing review metadata...');
    await updateEventStatus(eventId, 'pending');
    showToast('success', 'Submitted for institutional review');
  };

  const handleBulkSubmit = async () => {
    const eligibleIds = [...selectedIds].filter(id => {
      const event = events.find(e => e.id === id);
      return event && (event.status === 'draft' || event.status === 'rejected');
    });
    if (eligibleIds.length === 0) {
      showToast('danger', 'No eligible events selected (must be draft or rejected)');
      return;
    }
    for (const id of eligibleIds) {
      await updateEventStatus(id, 'pending');
    }
    showToast('success', `${eligibleIds.length} event(s) submitted for review`);
    setSelectedIds(new Set());
  };

  const handleDuplicate = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      navigate('/organizer/create-event', { state: { duplicate: event } });
    }
  };

  const handleExportCSV = () => {
    const headers = ['Title', 'Status', 'Date', 'Venue', 'Category', 'Registered', 'Capacity', 'Fill %'];
    const rows = myEvents.map(e => [
      e.title,
      e.status,
      formatDate(e.date),
      venues.find(v => v.id === e.venueId)?.name || '',
      categories.find(c => c.id === e.categoryId)?.name || '',
      e.registeredCount,
      e.maxCapacity,
      ((e.registeredCount / e.maxCapacity) * 100).toFixed(1) + '%'
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'my-events.csv'; a.click();
    URL.revokeObjectURL(url);
    showToast('success', 'Events exported as CSV');
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortDir('desc'); }
  };

  const tabs = ['all', 'draft', 'pending', 'approved', 'rejected'];

  return (
    <div style={{ padding: '0 40px 80px 40px' }}>
      {/* Premium Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, marginTop: 40 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            My <span style={{ color: '#2563eb' }}>Exhibition Registry</span>
          </h1>
          <p style={{ fontSize: 15, color: '#64748b', marginTop: 8, fontWeight: 500 }}>
            Management interface for verified institutional engagements.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button variant="outline" onClick={handleExportCSV} style={{ padding: '12px 20px', borderRadius: 16 }}>
            <Download size={16} /> Export CSV
          </Button>
          <Button onClick={() => navigate('/organizer/create-event')} style={{ padding: '12px 24px', borderRadius: 16 }}>
            <Plus size={18} /> New Exhibition
          </Button>
        </div>
      </div>

      {/* Analytics Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 40 }}>
        {[
          { label: 'Live Exhibitions', value: stats.active, icon: CheckCircle2, color: '#16a34a', bg: '#f0fdf4' },
          { label: 'In Review', value: stats.pending, icon: Clock, color: '#2563eb', bg: '#eff6ff' },
          { label: 'Total Engagement', value: stats.totalRegistrations, icon: Users, color: '#7c3aed', bg: '#f5f3ff' },
          { label: 'Avg Attendance', value: `${stats.avgEngagement}%`, icon: TrendingUp, color: '#f97316', bg: '#fff7ed' }
        ].map((s, i) => (
          <div key={i} style={{ backgroundColor: 'white', padding: 24, borderRadius: 24, border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <s.icon size={22} color={s.color} />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#0f172a' }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search, Filter & Sort Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, gap: 16 }}>
        <div style={{ display: 'flex', backgroundColor: '#f1f5f9', padding: 4, borderRadius: 14, gap: 4 }}>
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '8px 20px', fontSize: 13, fontWeight: tab === t ? 800 : 600, borderRadius: 10,
                border: 'none', backgroundColor: tab === t ? 'white' : 'transparent',
                color: tab === t ? '#2563eb' : '#64748b', transition: 'all 0.2s', cursor: 'pointer',
                textTransform: 'capitalize', boxShadow: tab === t ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              {t}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {/* Sort Buttons */}
          <div style={{ display: 'flex', gap: 4, backgroundColor: '#f8fafc', borderRadius: 12, padding: 4, border: '1px solid #f1f5f9' }}>
            {([['date', 'Date'], ['registrations', 'Regs'], ['capacity', 'Fill %'], ['title', 'Name']] as [typeof sortBy, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => toggleSort(key)}
                style={{
                  padding: '6px 12px', fontSize: 11, fontWeight: sortBy === key ? 800 : 600, borderRadius: 8,
                  border: 'none', backgroundColor: sortBy === key ? 'white' : 'transparent',
                  color: sortBy === key ? '#2563eb' : '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                  boxShadow: sortBy === key ? '0 1px 4px rgba(0,0,0,0.05)' : 'none'
                }}
              >
                {label}
                {sortBy === key && (sortDir === 'desc' ? <ChevronDown size={12} /> : <ChevronUp size={12} />)}
              </button>
            ))}
          </div>
          <div style={{ position: 'relative', width: 260 }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search registry..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '12px 16px 12px 48px', borderRadius: 14, border: '1px solid #e2e8f0', outline: 'none', fontSize: 14 }}
            />
          </div>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '16px 24px', backgroundColor: '#eff6ff', borderRadius: 16, marginBottom: 24, border: '1px solid #dbeafe'
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 700, color: '#1e40af' }}>{selectedIds.size} event(s) selected</span>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={handleBulkSubmit} style={{ padding: '8px 16px', borderRadius: 10, border: 'none', backgroundColor: '#2563eb', color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Send size={14} /> Submit All for Review
            </button>
            <button onClick={() => setSelectedIds(new Set())} style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid #bfdbfe', backgroundColor: 'white', color: '#2563eb', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
              Clear
            </button>
          </div>
        </motion.div>
      )}

      {/* Advanced Card Grid */}
      {myEvents.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '100px 0', backgroundColor: 'white', borderRadius: 32, border: '1px solid #f1f5f9' }}>
          <Calendar size={64} strokeWidth={1} color="#e2e8f0" style={{ marginBottom: 24 }} />
          <h3 style={{ fontSize: 20, fontWeight: 800, color: '#1e293b' }}>No Records Found</h3>
          <p style={{ fontSize: 14, color: '#64748b' }}>Curate a new exhibition to populate the repository.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 32 }}>
          {myEvents.map(event => {
            const venue = venues.find(v => v.id === event.venueId);
            const category = categories.find(c => c.id === event.categoryId);
            const fillPercent = (event.registeredCount / event.maxCapacity) * 100;
            const isExpanded = expandedId === event.id;

            return (
              <motion.div 
                key={event.id}
                layout
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ backgroundColor: 'white', borderRadius: 28, border: selectedIds.has(event.id) ? '2px solid #2563eb' : '1px solid #f1f5f9', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ height: 160, position: 'relative' }}>
                  <img src={event.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(event.id)}
                      onChange={() => toggleSelect(event.id)}
                      style={{ width: 20, height: 20, accentColor: '#2563eb', cursor: 'pointer' }}
                      onClick={e => e.stopPropagation()}
                    />
                    <Badge variant={event.status as any}>{event.status}</Badge>
                  </div>
                </div>
                
                <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#3b82f6', textTransform: 'uppercase', marginBottom: 8 }}>
                    {category?.name || 'General Event'}
                  </div>
                  <h4 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '0 0 16px 0', lineHeight: 1.4 }}>{event.title}</h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#64748b' }}>
                      <Calendar size={14} /> {formatDate(event.date)} at {event.time}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#64748b' }}>
                      <MapPin size={14} /> {venue?.name || 'Academic Center'}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ overflow: 'hidden', marginBottom: 16 }}
                      >
                        <div style={{ padding: 16, backgroundColor: '#f8fafc', borderRadius: 16, border: '1px solid #f1f5f9', marginBottom: 12 }}>
                          <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 8 }}>Description</div>
                          <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.6, margin: 0 }}>{event.description || 'No description provided.'}</p>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                          {(event as any).contactEmail && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b', padding: '8px 12px', backgroundColor: '#f8fafc', borderRadius: 10 }}>
                              <Mail size={12} /> {(event as any).contactEmail}
                            </div>
                          )}
                          {(event as any).contactPhone && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b', padding: '8px 12px', backgroundColor: '#f8fafc', borderRadius: 10 }}>
                              <Phone size={12} /> {(event as any).contactPhone}
                            </div>
                          )}
                          {(event as any).websiteUrl && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b', padding: '8px 12px', backgroundColor: '#f8fafc', borderRadius: 10, gridColumn: 'span 2' }}>
                              <Globe size={12} /> {(event as any).websiteUrl}
                            </div>
                          )}
                        </div>
                        {event.rejectionReason && (
                          <div style={{ display: 'flex', gap: 8, padding: 12, backgroundColor: '#fef2f2', borderRadius: 12, marginTop: 12, border: '1px solid #fecaca' }}>
                            <AlertCircle size={14} color="#dc2626" style={{ marginTop: 2, flexShrink: 0 }} />
                            <div style={{ fontSize: 12, color: '#991b1b', fontWeight: 600 }}>Rejection Reason: {event.rejectionReason}</div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div style={{ marginTop: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12 }}>
                      <span style={{ fontWeight: 700, color: '#475569' }}>Occupancy</span>
                      <span style={{ fontWeight: 800, color: '#0f172a' }}>{event.registeredCount} / {event.maxCapacity}</span>
                    </div>
                    <div style={{ height: 6, backgroundColor: '#f1f5f9', borderRadius: 3, overflow: 'hidden', marginBottom: 20 }}>
                      <div style={{ width: `${fillPercent}%`, height: '100%', backgroundColor: fillPercent > 80 ? '#ef4444' : '#2563eb', transition: 'width 0.5s' }} />
                    </div>

                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {(event.status === 'draft' || event.status === 'rejected') && (
                        <Button 
                          variant="primary" size="sm" style={{ flex: 1, borderRadius: 12, minWidth: 80 }}
                          onClick={() => handleSubmit(event.id)}
                        >
                          <Send size={14} /> Submit
                        </Button>
                      )}
                      <Button 
                        variant="outline" size="sm" style={{ flex: 1, borderRadius: 12, minWidth: 80 }}
                        onClick={() => navigate(`/organizer/edit-event/${event.id}`)} 
                      >
                        <Pencil size={14} /> Manage
                      </Button>
                      <Button 
                        variant="outline" size="sm" style={{ flex: 1, borderRadius: 12, minWidth: 80, border: '1px solid #dbeafe', color: '#2563eb' }}
                        onClick={() => navigate(`/organizer/event/${event.id}/registrations`)} 
                      >
                        <Users size={14} /> Participants
                      </Button>
                      <button 
                        onClick={() => setExpandedId(isExpanded ? null : event.id)}
                        title="View Details"
                        style={{ width: 36, height: 36, borderRadius: 12, border: '1px solid #e2e8f0', backgroundColor: isExpanded ? '#eff6ff' : 'white', color: isExpanded ? '#2563eb' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleDuplicate(event.id)}
                        title="Duplicate Event"
                        style={{ width: 36, height: 36, borderRadius: 12, border: '1px solid #e2e8f0', backgroundColor: 'white', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      >
                        <Copy size={16} />
                      </button>
                      <button 
                        onClick={() => setDeleteId(event.id)}
                        style={{ width: 36, height: 36, borderRadius: 12, border: 'none', backgroundColor: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Retention Modal */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Record Purge" footer={
        <div style={{ display: 'flex', gap: 12, width: '100%' }}>
          <Button variant="outline" onClick={() => setDeleteId(null)} style={{ flex: 1 }}>Maintain Assets</Button>
          <Button variant="danger" onClick={handleDelete} style={{ flex: 1 }}>Confirm Purge</Button>
        </div>
      }>
        <div style={{ display: 'flex', gap: 16 }}>
          <AlertCircle size={40} color="#dc2626" style={{ flexShrink: 0 }} />
          <div>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0f172a' }}>Confirm Irreversible Purge</p>
            <p style={{ marginTop: 8, fontSize: 14, color: '#64748b', lineHeight: 1.5 }}>
              Purging this exhibition will permanently remove all registration metadata and associated institutional records. This action cannot be revoked.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
