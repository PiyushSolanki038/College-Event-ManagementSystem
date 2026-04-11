import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DataTable from '@/components/ui-custom/DataTable';
import Badge from '@/components/ui-custom/Badge';
import Button from '@/components/ui-custom/Button';
import Input from '@/components/ui-custom/Input';
import Select from '@/components/ui-custom/Select';
import Modal from '@/components/ui-custom/Modal';
import { useAuth } from '@/context/AuthContext';
import { useEventContext } from '@/context/EventContext';
import { useToast } from '@/components/ui-custom/Toast';
import { formatDate } from '@/utils/helpers';
import { useNavigate } from 'react-router-dom';
import { 
  Eye, Calendar, Trash2, ShieldAlert, 
  BarChart3, Users, MapPin, Search, 
  Filter, ArrowUpDown, ChevronRight,
  Database, ShieldCheck, Activity, Layers,
  Building, GraduationCap, Download, Info, Clock
} from 'lucide-react';

export default function AllEvents() {
  const { user } = useAuth();
  const { events, venues, users, deleteEvent } = useEventContext();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const filtered = useMemo(() => {
    let result = events.filter(e => {
      const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase()) || 
                           (users.find(u => u.id === e.organizerId)?.name || '').toLowerCase().includes(search.toLowerCase());
      if (search && !matchesSearch) return false;
      if (statusFilter !== 'all' && e.status !== statusFilter) return false;
      return true;
    });
    
    if (sortKey === 'date') {
      result = [...result].sort((a, b) => sortDir === 'asc' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date));
    } else if (sortKey === 'regs') {
      result = [...result].sort((a, b) => sortDir === 'asc' ? a.registeredCount - b.registeredCount : b.registeredCount - a.registeredCount);
    }
    return result;
  }, [events, search, statusFilter, sortKey, sortDir, users]);

  const stats = useMemo(() => ({
    total: events.length,
    approved: events.filter(e => e.status === 'approved').length,
    pending: events.filter(e => e.status === 'pending').length,
    registrations: events.reduce((sum, e) => sum + e.registeredCount, 0)
  }), [events]);

  if (!user) return null;

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const handleDelete = async () => {
    if (deleteId) {
      showToast('info', 'Purging institutional dataset...');
      await deleteEvent(deleteId);
      showToast('success', 'Master record successfully decommissioned.');
      setDeleteId(null);
    }
  };

  const columns = [
    { 
      key: 'name', 
      header: 'Exhibition Designation', 
      render: (e: any) => (
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, overflow: 'hidden', flexShrink: 0, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
            <img src={e.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 800, color: '#0f172a', fontSize: 15 }}>{e.title}</span>
            <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>ID: EX-{String(e.id).padStart(4, '0')}</span>
          </div>
        </div>
      ) 
    },
    { 
      key: 'curator', 
      header: 'Authored By', 
      render: (e: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={14} color="#64748b" />
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>{users.find(u => u.id === e.organizerId)?.name || 'Institutional Curator'}</span>
        </div>
      )
    },
    { 
      key: 'date', 
      header: 'Master Schedule', 
      render: (e: any) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>{formatDate(e.date)}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#94a3b8', fontWeight: 700 }}>
                <Calendar size={12} /> {e.time || '09:00 AM'}
            </div>
        </div>
      ), 
      sortable: true 
    },
    { key: 'venue', header: 'Resource Allocation', render: (e: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: '#475569' }}>
            <Building size={16} color="#2563eb" /> {venues.find(v => v.id === e.venueId)?.name || 'Grand Plaza'}
        </div>
    )},
    { key: 'status', header: 'Governance', render: (e: any) => <Badge variant={e.status as any}>{e.status}</Badge> },
    { 
        key: 'regs', 
        header: 'Engagement Velocity', 
        render: (e: any) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ flex: 1, minWidth: 80, height: 8, backgroundColor: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(e.registeredCount / e.maxCapacity) * 100}%` }}
                        style={{ height: '100%', backgroundColor: '#2563eb', borderRadius: 4 }} 
                    />
                </div>
                <span style={{ fontWeight: 900, color: '#0f172a', fontSize: 13, width: 60 }}>{e.registeredCount} / {e.maxCapacity}</span>
            </div>
        ), 
        sortable: true 
    },
    { key: 'actions', header: '', render: (e: any) => (
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button onClick={() => setPreviewId(e.id)} style={{ width: 40, height: 40, borderRadius: 12, border: '1px solid #f1f5f9', backgroundColor: 'white', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} title="Preview">
          <Eye size={18} />
        </button>
        <button onClick={() => navigate(`/admin/event/${e.id}/registrations`)} style={{ width: 40, height: 40, borderRadius: 12, border: '1px solid #dbeafe', backgroundColor: 'white', color: '#2563eb', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} title="Registrations">
          <Users size={18} />
        </button>
        <button onClick={() => setDeleteId(e.id)} style={{ width: 40, height: 40, borderRadius: 12, border: '1px solid #fee2e2', backgroundColor: 'white', color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} title="Delete">
          <Trash2 size={18} />
        </button>
      </div>
    )},
  ];

  return (
    <div style={{ padding: '0 40px 100px 40px' }}>
      {/* High-Fidelity Intelligence Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 56, marginTop: 40 }}>
        {[
          { label: 'Master Registry', count: stats.total, icon: Database, color: '#0f172a', bg: '#f8fafc', desc: 'Total tracked assets' },
          { label: 'Collective Reach', count: stats.registrations.toLocaleString(), icon: Activity, color: '#2563eb', bg: '#eff6ff', desc: 'Total students engaged' },
          { label: 'Verified Records', count: stats.approved, icon: ShieldCheck, color: '#16a34a', bg: '#f0fdf4', desc: 'Authorized exhibits' },
          { label: 'Moderation Flow', count: stats.pending, icon: Clock, color: '#f59e0b', bg: '#fffbeb', desc: 'Awaiting verification' }
        ].map((s, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            style={{ backgroundColor: 'white', padding: 32, borderRadius: 32, border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)' }}
          >
            <div style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <s.icon size={24} color={s.color} />
            </div>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.label}</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: s.color, marginTop: 4 }}>{s.count}</div>
            <div style={{ fontSize: 12, color: '#cbd5e1', fontWeight: 600, marginTop: 8 }}>{s.desc}</div>
          </motion.div>
        ))}
      </div>

      {/* Unified Catalog Controllers */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
        <div style={{ display: 'flex', gap: 20, flex: 1 }}>
            <div style={{ width: 400, position: 'relative' }}>
                <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', zIndex: 10 }} />
                <input 
                    placeholder="Search by exhibition title or curator..." 
                    value={search} onChange={e => setSearch(e.target.value)} 
                    style={{ width: '100%', padding: '16px 20px 16px 52px', borderRadius: 20, border: '1px solid #f1f5f9', fontSize: 15, outline: 'none', fontWeight: 600, backgroundColor: 'white' }}
                />
            </div>
            <div style={{ width: 240 }}>
                <Select
                    options={[
                        { value: 'all', label: 'Entire Universal Ledger' },
                        { value: 'approved', label: 'Authorized Records' },
                        { value: 'pending', label: 'Moderation Queue' },
                        { value: 'rejected', label: 'Decommissioned' },
                    ]}
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                />
            </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
            <Button variant="outline" onClick={() => {
                const headers = ['ID', 'Title', 'Organizer', 'Date', 'Time', 'Venue', 'Status', 'Registrations', 'Capacity', 'Fill %'];
                const rows = filtered.map(e => {
                    const organizer = users.find(u => u.id === e.organizerId)?.name || 'Unknown';
                    const venue = venues.find(v => v.id === e.venueId)?.name || 'N/A';
                    return [e.id, e.title, organizer, formatDate(e.date), e.time, venue, e.status, e.registeredCount, e.maxCapacity, ((e.registeredCount / e.maxCapacity) * 100).toFixed(1) + '%'];
                });
                const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url; a.download = `events_dataset_${new Date().toISOString().split('T')[0]}.csv`; a.click();
                URL.revokeObjectURL(url);
                showToast('success', 'Institutional dataset exported as CSV.');
            }} style={{ height: 56, borderRadius: 18, fontWeight: 800, padding: '0 24px' }}>
                <Download size={18} /> Export Institutional Dataset
            </Button>
        </div>
      </div>

      {/* Master Institutional Ledger */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ backgroundColor: '#ffffff', border: '1px solid #f1f5f9', borderRadius: 40, overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.03)' }}
      >
        <DataTable 
            columns={columns} 
            data={filtered} 
            onSort={handleSort} 
            sortKey={sortKey} 
            sortDir={sortDir} 
        />
        {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '120px 0' }}>
                <Layers size={64} color="#f1f5f9" style={{ marginBottom: 24 }} />
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#94a3b8' }}>Universal Ledger Clear</h3>
                <p style={{ fontSize: 14, color: '#cbd5e1' }}>No matching records detected in the master repository.</p>
            </div>
        )}
      </motion.div>

      {/* Advanced Exhibition Manifest */}
      <Modal isOpen={!!previewId} onClose={() => setPreviewId(null)} title="Exhibition Master Manifest">
        {previewId && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div style={{ height: 280, borderRadius: 28, overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
              <img src={events.find(e => e.id === previewId)?.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                   <h3 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.03em' }}>{events.find(e => e.id === previewId)?.title}</h3>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8, color: '#64748b', fontSize: 14, fontWeight: 600 }}>
                        <GraduationCap size={16} /> Curated by {users.find(u => u.id === events.find(e => e.id === previewId)?.organizerId)?.name}
                   </div>
                </div>
                <Badge variant={events.find(e => e.id === previewId)?.status as any}>{events.find(e => e.id === previewId)?.status}</Badge>
              </div>
              <p style={{ fontSize: 16, color: '#475569', lineHeight: 1.8, marginTop: 24, fontWeight: 500 }}>{events.find(e => e.id === previewId)?.description}</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {[
                { label: 'Spatial Allocation', value: venues.find(v => v.id === events.find(e => e.id === previewId)?.venueId)?.name, icon: MapPin },
                { label: 'Scheduling', value: formatDate(events.find(e => e.id === previewId)?.date || '') + ' at ' + events.find(e => e.id === previewId)?.time, icon: Calendar },
                { label: 'Verified Reach', value: events.find(e => e.id === previewId)?.registeredCount + ' Students', icon: Users },
                { label: 'Total Capacity', value: events.find(e => e.id === previewId)?.maxCapacity + ' Potential Visits', icon: Activity }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 20, backgroundColor: '#f8fafc', borderRadius: 20, border: '1px solid #f1f5f9' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                        <item.icon size={18} color="#2563eb" />
                    </div>
                    <div>
                        <div style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{item.value}</div>
                    </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
                <Button variant="primary" style={{ flex: 1.5, height: 56, borderRadius: 18, fontSize: 15 }} onClick={() => setPreviewId(null)}>Close Master Manifest</Button>
                <Button variant="danger" outline style={{ flex: 1, height: 56, borderRadius: 18, fontSize: 15 }} onClick={() => { setDeleteId(previewId); setPreviewId(null); }}>Initiate Purge</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* High-Severity Purge Authorization */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Institutional Purge Protocol">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div style={{ display: 'flex', gap: 20, padding: 32, backgroundColor: '#fef2f2', borderRadius: 28, border: '1px solid #fee2e2' }}>
                <ShieldAlert size={40} color="#dc2626" style={{ flexShrink: 0 }} />
                <div>
                    <h4 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#991b1b' }}>Irreversible Registry Erasure</h4>
                    <p style={{ marginTop: 12, fontSize: 14, color: '#b91c1c', lineHeight: 1.6, fontWeight: 600 }}>
                        You are about to authorize the permanent deletion of this exhibition from the master repository. This will terminate all active registrations and engagement signatures.
                    </p>
                </div>
            </div>
            
            <div style={{ display: 'flex', gap: 16 }}>
                <Button variant="danger" onClick={handleDelete} style={{ flex: 1.3, height: 56, borderRadius: 18, fontSize: 15 }}>Execute Master Purge</Button>
                <Button variant="secondary" outline onClick={() => setDeleteId(null)} style={{ flex: 1, height: 56, borderRadius: 18, fontSize: 15 }}>Maintain Asset Record</Button>
            </div>
            
            <div style={{ display: 'flex', itemsCenter: 'center', gap: 10, padding: 20, backgroundColor: '#eff6ff', borderRadius: 20, border: '1px solid #dbeafe' }}>
                <Info size={16} color="#3b82f6" />
                <p style={{ fontSize: 12, color: '#1e40af', fontWeight: 600, margin: 0 }}>
                    This action is logged in the institutional security audit ledger.
                </p>
            </div>
        </div>
      </Modal>
    </div>
  );
}
