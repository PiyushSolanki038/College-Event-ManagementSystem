import React, { useState, useMemo } from 'react';
import { useEventContext } from '@/context/EventContext';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Badge from '@/components/ui-custom/Badge';
import Button from '@/components/ui-custom/Button';
import Input from '@/components/ui-custom/Input';
import Modal from '@/components/ui-custom/Modal';
import { useToast } from '@/components/ui-custom/Toast';
import { 
  MapPin, Users, Wifi, Laptop, 
  Shield, Search, 
  Layers, Building2, CalendarPlus, 
  Sparkles, Building,
  Plus, X, Trash2, Pencil, Info,
  Calendar, AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function VenuesView() {
  const { venues, events, addVenue, updateVenue, deleteVenue } = useEventContext();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [capacityFilter, setCapacityFilter] = useState<'all' | 'small' | 'medium' | 'large'>('all');

  // Management State
  const [isAdding, setIsAdding] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');
  const [facilities, setFacilities] = useState<string[]>([]);
  const [facilityInput, setFacilityInput] = useState('');

  // Event counts per venue
  const venueEventCounts = useMemo(() => {
    const counts: Record<string, { total: number; upcoming: number; totalRegs: number; totalCap: number }> = {};
    const now = new Date();
    events.forEach(e => {
      if (!counts[e.venueId]) counts[e.venueId] = { total: 0, upcoming: 0, totalRegs: 0, totalCap: 0 };
      counts[e.venueId].total++;
      counts[e.venueId].totalRegs += e.registeredCount;
      counts[e.venueId].totalCap += e.maxCapacity;
      if (new Date(e.date) >= now && e.status === 'approved') counts[e.venueId].upcoming++;
    });
    return counts;
  }, [events]);

  const filteredVenues = useMemo(() => {
    return venues.filter(v => {
      const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase()) || 
                           v.location.toLowerCase().includes(search.toLowerCase());
      
      let matchesCapacity = true;
      if (capacityFilter === 'small') matchesCapacity = v.capacity <= 100;
      else if (capacityFilter === 'medium') matchesCapacity = v.capacity > 100 && v.capacity <= 500;
      else if (capacityFilter === 'large') matchesCapacity = v.capacity > 500;

      return matchesSearch && matchesCapacity;
    });
  }, [venues, search, capacityFilter]);

  const stats = useMemo(() => ({
    totalCapacity: venues.reduce((acc, curr) => acc + curr.capacity, 0),
    avgCapacity: venues.length ? Math.round(venues.reduce((acc, curr) => acc + curr.capacity, 0) / venues.length) : 0,
    topVenue: venues.length ? [...venues].sort((a, b) => b.capacity - a.capacity)[0].name : 'N/A'
  }), [venues]);

  const openAdd = () => {
    setEditId(null);
    setName(''); setLocation(''); setCapacity(''); setFacilities([]); setFacilityInput('');
    setIsAdding(true);
  };

  const openEdit = (venue: any) => {
    setEditId(venue.id);
    setName(venue.name);
    setLocation(venue.location);
    setCapacity(venue.capacity.toString());
    setFacilities(Array.isArray(venue.facilities) ? venue.facilities : (typeof venue.facilities === 'string' ? venue.facilities.split(',').filter(Boolean) : []));
    setFacilityInput('');
    setIsAdding(true);
  };

  const handleSave = async () => {
    if (!name.trim() || !location.trim() || !capacity) {
      showToast('danger', 'Please complete all mandatory facility fields.');
      return;
    }
    
    try {
      const data = { name, location, capacity: parseInt(capacity), facilities: facilities.join(',') };
      if (editId) {
        await updateVenue(editId, data);
        showToast('success', 'Institutional facility record updated.');
      } else {
        await addVenue(data);
        showToast('success', 'New facility successfully registered.');
      }
      setIsAdding(false);
    } catch (err) {
      showToast('danger', 'Registry update failed.');
    }
  };

  const handleDelete = async () => {
    if (deleteConfirmId) {
      try {
        await deleteVenue(deleteConfirmId);
        showToast('success', 'Facility removed from registry.');
        setDeleteConfirmId(null);
      } catch (err) {
        showToast('danger', 'Deletion failed — venue may have linked events.');
      }
    }
  };

  const handleFacilityKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && facilityInput.trim()) {
      e.preventDefault();
      setFacilities(prev => [...prev, facilityInput.trim()]);
      setFacilityInput('');
    }
  };

  const getFacilityIcon = (facility: string) => {
    const f = facility.toLowerCase();
    if (f.includes('wifi')) return <Wifi size={14} />;
    if (f.includes('projector') || f.includes('digital') || f.includes('ac')) return <Laptop size={14} />;
    if (f.includes('sound') || f.includes('mic')) return <Sparkles size={14} />;
    return <Layers size={14} />;
  };

  return (
    <div style={{ padding: '0 40px 80px 40px' }}>
      {/* Cinematic Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, marginTop: 40 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            Institutional <span style={{ color: '#2563eb' }}>Facility Registry</span>
          </h1>
          <p style={{ fontSize: 15, color: '#64748b', marginTop: 8, fontWeight: 500 }}>
            Curated spatial resources for high-impact academic engagements.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ backgroundColor: '#eff6ff', padding: '12px 24px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 12, border: '1px solid #dbeafe' }}>
            <Building2 size={20} color="#2563eb" />
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#1e40af', textTransform: 'uppercase' }}>Total Capacity</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#1e3a8a' }}>{stats.totalCapacity.toLocaleString()}</div>
            </div>
          </div>
          <Button onClick={openAdd} variant="primary" style={{ padding: '0 24px', borderRadius: 20, height: 52 }}>
            <Plus size={20} /> Add Facility
          </Button>
        </div>
      </div>

      {/* Advanced Control Suite */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, gap: 24 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search facilities by name or location..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '14px 16px 14px 48px', borderRadius: 20, border: '1px solid #e2e8f0', outline: 'none', fontSize: 14, backgroundColor: 'white', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}
          />
        </div>
        <div style={{ display: 'flex', backgroundColor: '#f1f5f9', padding: 4, borderRadius: 16, gap: 4 }}>
          {['all', 'small', 'medium', 'large'].map(f => (
            <button
              key={f}
              onClick={() => setCapacityFilter(f as any)}
              style={{
                padding: '8px 20px', fontSize: 13, fontWeight: capacityFilter === f ? 800 : 600, borderRadius: 12,
                border: 'none', backgroundColor: capacityFilter === f ? 'white' : 'transparent',
                color: capacityFilter === f ? '#2563eb' : '#64748b', transition: 'all 0.2s', cursor: 'pointer',
                textTransform: 'capitalize', boxShadow: capacityFilter === f ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Facility Grid */}
      {filteredVenues.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '120px 0', backgroundColor: 'white', borderRadius: 40, border: '1px solid #f1f5f9' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
            <Building size={32} strokeWidth={1.5} color="#cbd5e1" />
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: '#1e293b' }}>No Spatial Matches</h3>
          <p style={{ fontSize: 14, color: '#64748b', maxWidth: 300, margin: '8px auto 0 auto' }}>Adjust your filters or register a new facility asset.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 32 }}>
          {filteredVenues.map((venue, idx) => {
            const eventData = venueEventCounts[venue.id] || { total: 0, upcoming: 0, totalRegs: 0, totalCap: 0 };
            
            return (
              <motion.div 
                key={venue.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -8 }}
                style={{ backgroundColor: 'white', borderRadius: 32, border: '1px solid #f1f5f9', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', position: 'relative' }}
              >
                <div style={{ height: 180, position: 'relative', backgroundColor: '#f8fafc' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.4))', zIndex: 1 }} />
                  <div style={{ position: 'absolute', bottom: 20, left: 24, zIndex: 2, display: 'flex', gap: 8 }}>
                    <Badge variant={venue.capacity > 400 ? 'approved' : 'info'}>
                      {venue.capacity > 400 ? 'High Capacity' : 'Standard Resource'}
                    </Badge>
                    {eventData.upcoming > 0 && (
                      <span style={{ padding: '4px 10px', borderRadius: 8, backgroundColor: '#eff6ff', color: '#2563eb', fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Calendar size={12} /> {eventData.upcoming} upcoming
                      </span>
                    )}
                  </div>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#cbd5e1' }}>
                    <Building2 size={64} color="white" strokeWidth={0.5} />
                  </div>
                </div>

                <div style={{ padding: 32 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                    <div>
                      <h3 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>{venue.name}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748b', fontWeight: 500 }}>
                        <MapPin size={14} color="#2563eb" /> {venue.location}
                      </div>
                    </div>
                    {/* Edit/Delete buttons */}
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => openEdit(venue)}
                        title="Edit Venue"
                        style={{ width: 34, height: 34, borderRadius: 10, border: '1px solid #e2e8f0', backgroundColor: 'white', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(venue.id)}
                        title="Delete Venue"
                        style={{ width: 34, height: 34, borderRadius: 10, border: 'none', backgroundColor: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 24 }}>
                    <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: 14, border: '1px solid #f1f5f9', textAlign: 'center' }}>
                      <div style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>Capacity</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                        <Users size={14} color="#64748b" /> {venue.capacity}
                      </div>
                    </div>
                    <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: 14, border: '1px solid #f1f5f9', textAlign: 'center' }}>
                      <div style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>Events</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#2563eb' }}>{eventData.total}</div>
                    </div>
                    <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: 14, border: '1px solid #f1f5f9', textAlign: 'center' }}>
                      <div style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>Registrations</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#7c3aed' }}>{eventData.totalRegs}</div>
                    </div>
                  </div>

                  {/* Utilization Bar */}
                  {eventData.totalCap > 0 && (
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>Avg. Utilization</span>
                        <span style={{ fontSize: 11, fontWeight: 800, color: '#0f172a' }}>{(eventData.totalRegs / eventData.totalCap * 100).toFixed(0)}%</span>
                      </div>
                      <div style={{ height: 5, backgroundColor: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(100, eventData.totalRegs / eventData.totalCap * 100)}%`, height: '100%', backgroundColor: '#2563eb', borderRadius: 3 }} />
                      </div>
                    </div>
                  )}

                  <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 12 }}>Available Utilities</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {(Array.isArray(venue.facilities) ? venue.facilities : []).map((facility: string) => (
                        <span key={facility} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#475569', backgroundColor: '#eff6ff', padding: '6px 12px', borderRadius: 10, border: '1px solid #dbeafe' }}>
                          {getFacilityIcon(facility)}
                          {facility}
                        </span>
                      ))}
                      {(!venue.facilities || (Array.isArray(venue.facilities) && venue.facilities.length === 0)) && (
                        <span style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>No utilities listed</span>
                      )}
                    </div>
                  </div>

                  <Button 
                    block 
                    onClick={() => navigate('/organizer/create-event', { state: { venueId: venue.id } })}
                    style={{ borderRadius: 18, padding: '16px' }}
                  >
                    <CalendarPlus size={18} /> Schedule Exhibition Here
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Facility Registration/Edit Modal */}
      <Modal 
        isOpen={isAdding} 
        onClose={() => setIsAdding(false)} 
        title={editId ? 'Modify Facility Entry' : 'Register New Facility'}
        footer={
          <div style={{ display: 'flex', gap: 12, width: '100%' }}>
            <Button variant="outline" onClick={() => setIsAdding(false)} style={{ flex: 1 }}>Dismiss</Button>
            <Button onClick={handleSave} style={{ flex: 1 }}>{editId ? 'Save Changes' : 'Confirm Registration'}</Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', gap: 12, padding: 16, backgroundColor: '#f8fafc', borderRadius: 16, border: '1px solid #f1f5f9' }}>
            <Info size={16} color="#3b82f6" style={{ marginTop: 2 }} />
            <p style={{ fontSize: 11.5, color: '#64748b', margin: 0, lineHeight: 1.5 }}>
              {editId 
                ? 'Update the facility details below. Changes will be reflected immediately across all linked events.'
                : 'Registering a new facility will make it immediately available for institutional exhibition planning in the curator suite.'
              }
            </p>
          </div>
          
          <Input label="Facility Name" placeholder="e.g. Silver Jubilee Auditorium" value={name} onChange={e => setName(e.target.value)} />
          <Input label="Registry Location" placeholder="e.g. Block C, Level 4" value={location} onChange={e => setLocation(e.target.value)} />
          <Input label="Max Occupancy Threshold" type="number" placeholder="500" value={capacity} onChange={e => setCapacity(e.target.value)} />
          
          <div>
            <label style={{ fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10, display: 'block' }}>Utility Inventory</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
              {facilities.map((f, i) => (
                <span key={i} style={{ fontSize: 11, fontWeight: 700, color: '#1e40af', backgroundColor: '#eff6ff', padding: '4px 10px', borderRadius: 8, border: '1px solid #dbeafe', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {f}
                  <button onClick={() => setFacilities(prev => prev.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: '#64748b' }}><X size={10} /></button>
                </span>
              ))}
            </div>
            <input
              placeholder="Add utility (e.g. Wifi) and press Enter"
              value={facilityInput}
              onChange={e => setFacilityInput(e.target.value)}
              onKeyDown={handleFacilityKey}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13, outline: 'none' }}
            />
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deleteConfirmId} onClose={() => setDeleteConfirmId(null)} title="Delete Facility" footer={
        <div style={{ display: 'flex', gap: 12, width: '100%' }}>
          <Button variant="outline" onClick={() => setDeleteConfirmId(null)} style={{ flex: 1 }}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete} style={{ flex: 1 }}>Confirm Delete</Button>
        </div>
      }>
        <div style={{ display: 'flex', gap: 16 }}>
          <AlertCircle size={40} color="#dc2626" style={{ flexShrink: 0 }} />
          <div>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0f172a' }}>Remove this venue permanently?</p>
            <p style={{ marginTop: 8, fontSize: 14, color: '#64748b', lineHeight: 1.5 }}>
              This will delete the facility record. Events already linked to this venue may be affected. This action cannot be undone.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
