import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DataTable from '@/components/ui-custom/DataTable';
import Badge from '@/components/ui-custom/Badge';
import Button from '@/components/ui-custom/Button';
import Input from '@/components/ui-custom/Input';
import Modal from '@/components/ui-custom/Modal';
import { useAuth } from '@/context/AuthContext';
import { useEventContext } from '@/context/EventContext';
import { useToast } from '@/components/ui-custom/Toast';
import { 
  Pencil, Trash2, X, MapPin, Building, 
  Users, Layers, Plus, Database, Activity,
  ShieldCheck, Info, ShieldAlert, Zap,
  Wifi, Monitor, Speaker, Wind, Search,
  Download
} from 'lucide-react';

export default function VenueManagement() {
  const { user } = useAuth();
  const { venues, events, addVenue, updateVenue, deleteVenue } = useEventContext();
  const { showToast } = useToast();
  const [editVenueId, setEditVenueId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');
  const [facilities, setFacilities] = useState<string[]>([]);
  const [facilityInput, setFacilityInput] = useState('');

  const stats = useMemo(() => ({
    total: venues.length,
    totalCapacity: venues.reduce((sum, v) => sum + v.capacity, 0),
    activeBookings: events.filter(e => e.status === 'approved').length,
    avgSaturation: venues.length ? (events.filter(e => e.status === 'approved').length / venues.length).toFixed(1) : 0
  }), [venues, events]);

  if (!user) return null;

  const openAdd = () => {
    setEditVenueId(null);
    setIsAdding(true);
    setName(''); setLocation(''); setCapacity(''); setFacilities([]); setFacilityInput('');
  };

  const openEdit = (v: any) => {
    setEditVenueId(v.id);
    setIsAdding(true);
    setName(v.name); setLocation(v.location); setCapacity(v.capacity.toString()); setFacilities([...v.facilities]); setFacilityInput('');
  };

  const handleSave = () => {
    if (!name.trim() || !location.trim() || !capacity) {
        showToast('danger', 'Incomplete spatial characteristics detected.');
        return;
    }
    if (editVenueId) {
      updateVenue(editVenueId, { name, location, capacity: parseInt(capacity), facilities });
      showToast('success', 'Spatial asset record updated successfully.');
    } else {
      addVenue({ name, location, capacity: parseInt(capacity), facilities });
      showToast('success', 'New spatial asset registered in master ledger.');
    }
    setIsAdding(false);
  };

  const handleFacilityKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && facilityInput.trim()) {
      e.preventDefault();
      if (!facilities.includes(facilityInput.trim())) {
        setFacilities(prev => [...prev, facilityInput.trim()]);
      }
      setFacilityInput('');
    }
  };

  const handleDelete = () => {
    if (deleteId) { 
        deleteVenue(deleteId); 
        showToast('danger', 'Spatial asset successfully decommissioned.'); 
        setDeleteId(null); 
    }
  };

  const columns = [
    { 
      key: 'name', 
      header: 'Spatial Asset', 
      render: (v: any) => (
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building size={20} color="#2563eb" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 800, color: '#0f172a', fontSize: 15 }}>{v.name}</span>
            <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700 }}>FAC-ID: {v.id.padStart(3, '0')}</span>
          </div>
        </div>
      ) 
    },
    { 
        key: 'location', 
        header: 'Institutional Location', 
        render: (v: any) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#475569', fontSize: 14, fontWeight: 600 }}>
                <MapPin size={14} color="#94a3b8" /> {v.location}
            </div>
        ) 
    },
    { 
        key: 'capacity', 
        header: 'Spatial Threshold', 
        render: (v: any) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Users size={14} color="#64748b" />
                <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>{v.capacity} <span style={{ color: '#94a3b8', fontSize: 12, fontWeight: 500 }}>Max Visits</span></span>
            </div>
        ) 
    },
    { 
        key: 'facilities', 
        header: 'Resource Suite', 
        render: (v: any) => (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxWidth: 300 }}>
                {v.facilities.map((f: string) => (
                    <div key={f} style={{ padding: '6px 12px', backgroundColor: '#f8fafc', borderRadius: 10, border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Zap size={10} color="#3b82f6" />
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>{f}</span>
                    </div>
                ))}
                {v.facilities.length === 0 && <span style={{ fontSize: 12, color: '#cbd5e1' }}>No special resources assigned.</span>}
            </div>
        )
    },
    { 
        key: 'booked', 
        header: 'Record Intensity', 
        render: (v: any) => {
            const count = events.filter(e => e.venueId === v.id && e.status === 'approved').length;
            return (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: count > 0 ? '#10b981' : '#cbd5e1' }} />
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>{count} Bookings</span>
                </div>
            );
        }
    },
    { key: 'actions', header: '', render: (v: any) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end' }}>
        <button 
          onClick={() => openEdit(v)} 
          style={{ width: 36, height: 36, borderRadius: 10, border: 'none', backgroundColor: '#f8fafc', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
        >
          <Pencil size={16} />
        </button>
        <button 
          onClick={() => setDeleteId(v.id)} 
          style={{ width: 36, height: 36, borderRadius: 10, border: 'none', backgroundColor: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
        >
          <Trash2 size={16} />
        </button>
      </div>
    )},
  ];

  return (
    <div style={{ padding: '0 40px 100px 40px' }}>
      {/* High-Fidelity Spatial Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 56, marginTop: 40 }}>
        {[
          { label: 'Spatial Directory', count: stats.total, icon: Database, color: '#0f172a', bg: '#f8fafc', desc: 'Managed facilities' },
          { label: 'Total Threshold', count: stats.totalCapacity.toLocaleString(), icon: Layers, color: '#2563eb', bg: '#eff6ff', desc: 'Communal visits' },
          { label: 'Active Saturation', count: stats.activeBookings, icon: Activity, color: '#16a34a', bg: '#f0fdf4', desc: 'Verified exhibitions' },
          { label: 'Booking Density', count: stats.avgSaturation, icon: ShieldCheck, color: '#f59e0b', bg: '#fffbeb', desc: 'Exhibits per venue' }
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

      {/* Control Architecture */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center', flex: 1 }}>
            <div style={{ width: 400, position: 'relative' }}>
                <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', zIndex: 10 }} />
                <input 
                    placeholder="Audit facilities by name or location..." 
                    style={{ width: '100%', padding: '16px 20px 16px 52px', borderRadius: 20, border: '1px solid #f1f5f9', fontSize: 15, outline: 'none', fontWeight: 600, backgroundColor: 'white' }}
                />
            </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
            <Button variant="outline" onClick={() => {
                const headers = ['ID', 'Name', 'Location', 'Capacity', 'Facilities', 'Active Bookings'];
                const rows = venues.map(v => {
                    const bookings = events.filter(e => e.venueId === v.id && e.status === 'approved').length;
                    return [v.id, v.name, v.location, v.capacity, Array.isArray(v.facilities) ? v.facilities.join('; ') : v.facilities, bookings];
                });
                const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url; a.download = `venue_registry_${new Date().toISOString().split('T')[0]}.csv`; a.click();
                URL.revokeObjectURL(url);
                showToast('success', 'Venue registry exported as CSV.');
            }} style={{ height: 56, borderRadius: 18, fontWeight: 800, padding: '0 24px' }}>
                <Download size={18} /> Export Registry
            </Button>
            <Button onClick={openAdd} style={{ height: 56, borderRadius: 18, backgroundColor: '#2563eb', border: 'none', fontWeight: 800, padding: '0 24px' }}>
                <Plus size={18} /> Register Spatial Asset
            </Button>
        </div>
      </div>

      {/* Spatial Master Ledger Architecture */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ backgroundColor: '#ffffff', border: '1px solid #f1f5f9', borderRadius: 40, overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.03)' }}
      >
        <DataTable columns={columns} data={venues} />
        {venues.length === 0 && (
            <div style={{ textAlign: 'center', padding: '120px 0' }}>
                <MapPin size={64} color="#f1f5f9" style={{ marginBottom: 24 }} />
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#94a3b8' }}>Spatial Directory Empty</h3>
                <p style={{ fontSize: 14, color: '#cbd5e1' }}>No institutional facilities registered in the master ledger.</p>
            </div>
        )}
      </motion.div>

      {/* Advanced Spatial Asset Modal */}
      <Modal 
        isOpen={isAdding} 
        onClose={() => setIsAdding(false)} 
        title={editVenueId ? 'Audit Spatial Characteristics' : 'Register New Spatial Asset'}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Facility Designation</label>
            <Input 
              placeholder="e.g. Grand Auditorium Hall" 
              value={name} 
              onChange={e => setName(e.target.value)} 
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: 20, width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Institutional Location</label>
                <Input 
                    placeholder="Block A, 2nd Floor" 
                    value={location} 
                    onChange={e => setLocation(e.target.value)} 
                    style={{ height: 48, borderRadius: 14 }}
                />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Capacity Threshold</label>
                <Input 
                    type="number" 
                    placeholder="e.g. 500" 
                    value={capacity} 
                    onChange={e => setCapacity(e.target.value)} 
                    style={{ height: 48, borderRadius: 14 }}
                />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Resource Suite Configuration</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 4 }}>
              <AnimatePresence>
                {facilities.map((f, i) => (
                    <motion.div 
                        key={f} 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        style={{ 
                            fontSize: 12, fontWeight: 700, borderRadius: 12, padding: '8px 16px', 
                            backgroundColor: '#f8fafc', border: '1px solid #f1f5f9', color: '#0f172a',
                            display: 'flex', alignItems: 'center', gap: 10
                        }}
                    >
                        <Zap size={12} color="#2563eb" />
                        {f}
                        <button onClick={() => setFacilities(prev => prev.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex', color: '#94a3b8' }}>
                            <X size={14} />
                        </button>
                    </motion.div>
                ))}
              </AnimatePresence>
              {facilities.length === 0 && <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500, padding: '8px 0' }}>Assign technical resources to this space.</span>}
            </div>
            <div style={{ position: 'relative' }}>
                <input
                value={facilityInput}
                onChange={e => setFacilityInput(e.target.value)}
                onKeyDown={handleFacilityKey}
                placeholder="Declare resource (e.g. Fiber Uplink) & press Enter"
                style={{
                    height: 52, width: '100%', border: '2px solid #f1f5f9', borderRadius: 16,
                    padding: '0 52px 0 20px', fontSize: 14, color: '#0f172a', backgroundColor: '#f8fafc', outline: 'none',
                    fontWeight: 600
                }}
                />
                <Plus size={18} color="#94a3b8" style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div style={{ display: 'flex', itemsCenter: 'center', gap: 12, padding: 20, backgroundColor: '#eff6ff', borderRadius: 20, border: '1px solid #dbeafe' }}>
            <Info size={18} color="#3b82f6" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: 13, color: '#1e40af', fontWeight: 600, margin: 0, lineHeight: 1.5 }}>
              Updating spatial characteristics will instantly propagate to all active curatorial registration engines.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
            <Button onClick={handleSave} style={{ flex: 1.5, height: 56, borderRadius: 18 }}>Authorize Spatial Record</Button>
            <Button variant="secondary" outline={false} onClick={() => setIsAdding(false)} style={{ flex: 1, height: 56, borderRadius: 18, backgroundColor: '#f1f5f9', border: 'none', color: '#64748b' }}>Abort Registry</Button>
          </div>
        </div>
      </Modal>

      {/* Spatial Asset Decommission protocol */}
      <Modal 
        isOpen={!!deleteId} onClose={() => setDeleteId(null)} 
        title="Institutional Facility Decommissioning authorization"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div style={{ display: 'flex', gap: 24, padding: 32, backgroundColor: '#fef2f2', borderRadius: 28, border: '1px solid #fee2e2' }}>
                <ShieldAlert size={40} color="#dc2626" style={{ flexShrink: 0 }} />
                <div>
                    <h4 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#991b1b' }}>Irreversible Hub Decommission</h4>
                    <p style={{ marginTop: 12, fontSize: 14, color: '#b91c1c', lineHeight: 1.6, fontWeight: 600 }}>
                        Are you certain you want to decommission the <span style={{ color: '#0f172a' }}>{venues.find(v => v.id === deleteId)?.name}</span> from the universal directory? This will orphan any linked curatorial exhibitions.
                    </p>
                </div>
            </div>
            
            <div style={{ display: 'flex', gap: 16 }}>
                <Button variant="danger" onClick={handleDelete} style={{ flex: 1.3, height: 56, borderRadius: 18, fontSize: 15 }}>Execute Master Decommission</Button>
                <Button variant="secondary" outline onClick={() => setDeleteId(null)} style={{ flex: 1, height: 56, borderRadius: 18, fontSize: 15 }}>Maintain Asset Record</Button>
            </div>
            
            <div style={{ display: 'flex', gap: 10, padding: 20, backgroundColor: '#eff6ff', borderRadius: 20, border: '1px solid #dbeafe' }}>
                <Info size={16} color="#3b82f6" />
                <p style={{ fontSize: 12, color: '#1e40af', fontWeight: 600, margin: 0 }}>
                    Security Auditor Note: Spatial decommissionings are logged in the institutional asset security ledger.
                </p>
            </div>
        </div>
      </Modal>
    </div>
  );
}
