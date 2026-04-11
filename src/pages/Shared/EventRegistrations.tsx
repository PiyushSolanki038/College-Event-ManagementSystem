import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, ArrowLeft, Search, Edit3, Check, X, Download,
  Mail, Phone, Hash, User, Calendar, ChevronDown,
  Megaphone
} from 'lucide-react';
import EmailModal from '@/components/ui-custom/EmailModal';

interface RegistrationEntry {
  id: number;
  seatNumber: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeeContact: string;
  attendeeGender: string;
  profileName: string;
  enrollmentNo: string;
  department: string;
  registeredAt: string;
  attended: boolean;
}

const EventRegistrations: React.FC = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<RegistrationEntry[]>([]);
  const [eventTitle, setEventTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingSeat, setEditingSeat] = useState<number | null>(null);
  const [seatValue, setSeatValue] = useState('');

  // Email Modal State
  const [emailModal, setEmailModal] = useState<{
    isOpen: boolean;
    recipientName: string;
    recipientEmail: string;
    targetId: string;
    type: 'direct' | 'broadcast';
  }>({
    isOpen: false,
    recipientName: '',
    recipientEmail: '',
    targetId: '',
    type: 'direct'
  });

  useEffect(() => {
    fetchData();
  }, [eventId]);

  const fetchData = async () => {
    const token = localStorage.getItem('college_auth_token');
    try {
      const [regRes, eventRes] = await Promise.all([
        fetch(`http://localhost:5000/api/events/${eventId}/registrations`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`http://localhost:5000/api/events`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      const regData = await regRes.json();
      const events = await eventRes.json();
      const event = events.find((e: any) => e.id === parseInt(eventId || '0'));
      setEventTitle(event?.title || 'Event');
      setRegistrations(Array.isArray(regData) ? regData : []);
    } catch (err) {
      console.error('Failed to fetch registrations', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSeatUpdate = async (regId: number) => {
    const token = localStorage.getItem('college_auth_token');
    try {
      await fetch(`http://localhost:5000/api/registrations/${regId}/seat`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ seatNumber: seatValue })
      });
      setRegistrations(prev =>
        prev.map(r => r.id === regId ? { ...r, seatNumber: seatValue } : r)
      );
      setEditingSeat(null);
      setSeatValue('');
    } catch (err) {
      console.error('Failed to update seat', err);
    }
  };

  const filtered = registrations.filter(r =>
    r.attendeeName.toLowerCase().includes(search.toLowerCase()) ||
    r.attendeeEmail.toLowerCase().includes(search.toLowerCase()) ||
    r.seatNumber.toLowerCase().includes(search.toLowerCase()) ||
    r.enrollmentNo.toLowerCase().includes(search.toLowerCase())
  );

  const exportCSV = () => {
    const headers = ['#', 'Seat', 'Name', 'Email', 'Contact', 'Gender', 'Enrollment', 'Department', 'Registered At'];
    const rows = filtered.map((r, i) => [
      i + 1, r.seatNumber, r.attendeeName, r.attendeeEmail, r.attendeeContact,
      r.attendeeGender, r.enrollmentNo, r.department, new Date(r.registeredAt).toLocaleString()
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `registrations_${eventId}.csv`; a.click();
  };

  const user = JSON.parse(localStorage.getItem('college_user') || '{}');
  const backPath = user.role === 'admin' ? '/admin/events' : '/organizer/events';

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <button
          onClick={() => navigate(backPath)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, background: 'none', border: 'none',
            color: '#64748b', fontSize: 13, fontWeight: 700, cursor: 'pointer', marginBottom: 16,
            padding: 0
          }}
        >
          <ArrowLeft size={16} /> Back to Events
        </button>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
              Registrations
            </h1>
            <p style={{ fontSize: 14, color: '#64748b', margin: '6px 0 0', fontWeight: 500 }}>
              {eventTitle} — <strong style={{ color: '#2563eb' }}>{registrations.length}</strong> registered
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => setEmailModal({
                isOpen: true,
                recipientName: 'All Registrants',
                recipientEmail: 'Bulk Broadcast',
                targetId: eventId || '',
                type: 'broadcast'
              })}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 14,
                border: 'none', background: '#1A1A1A', color: 'white', fontWeight: 700,
                fontSize: 13, cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
              }}
            >
              <Megaphone size={16} /> Broadcast Announcement
            </button>
            <button
              onClick={exportCSV}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 14,
                border: '1px solid #e2e8f0', background: 'white', color: '#0f172a', fontWeight: 700,
                fontSize: 13, cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
            >
              <Download size={16} /> Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total Registered', value: registrations.length, color: '#2563eb', bg: '#eff6ff' },
          { label: 'Male', value: registrations.filter(r => r.attendeeGender?.toLowerCase() === 'male').length, color: '#7c3aed', bg: '#f5f3ff' },
          { label: 'Female', value: registrations.filter(r => r.attendeeGender?.toLowerCase() === 'female').length, color: '#ec4899', bg: '#fdf2f8' },
          { label: 'With Contact', value: registrations.filter(r => r.attendeeContact !== 'Not provided').length, color: '#059669', bg: '#ecfdf5' },
        ].map((stat, i) => (
          <div key={i} style={{
            background: 'white', borderRadius: 18, padding: '20px 24px', border: '1px solid #f1f5f9',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>{stat.label}</p>
            <p style={{ fontSize: 32, fontWeight: 900, color: stat.color, margin: '8px 0 0', letterSpacing: '-0.02em' }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 24 }}>
        <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        <input
          type="text"
          placeholder="Search by name, email, seat or enrollment..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '14px 16px 14px 48px', borderRadius: 16,
            border: '1px solid #e2e8f0', outline: 'none', fontSize: 14, fontWeight: 500,
            color: '#0f172a', backgroundColor: 'white'
          }}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8', fontWeight: 600 }}>Loading registrations...</div>
      ) : filtered.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: 60, backgroundColor: 'white', borderRadius: 20,
          border: '1px solid #f1f5f9'
        }}>
          <Users size={48} color="#cbd5e1" style={{ margin: '0 auto 16px' }} />
          <p style={{ fontSize: 16, fontWeight: 700, color: '#64748b', margin: 0 }}>
            {registrations.length === 0 ? 'No registrations yet' : 'No matching results'}
          </p>
        </div>
      ) : (
        <div style={{ backgroundColor: 'white', borderRadius: 20, border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  {['#', 'Seat', 'Name', 'Email', 'Contact', 'Gender', 'Enrollment', 'Dept', 'Date', 'Action'].map(h => (
                    <th key={h} style={{
                      padding: '14px 16px', fontSize: 11, fontWeight: 800, color: '#94a3b8',
                      textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'left',
                      whiteSpace: 'nowrap'
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((reg, index) => (
                  <motion.tr
                    key={reg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    style={{
                      borderBottom: '1px solid #f8fafc',
                      transition: 'background-color 0.15s'
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 700, color: '#94a3b8' }}>
                      {index + 1}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {editingSeat === reg.id ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <input
                            type="text"
                            value={seatValue}
                            onChange={e => setSeatValue(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSeatUpdate(reg.id)}
                            autoFocus
                            style={{
                              width: 80, padding: '6px 8px', borderRadius: 8, border: '1px solid #2563eb',
                              outline: 'none', fontSize: 13, fontWeight: 700, textAlign: 'center'
                            }}
                          />
                          <button onClick={() => handleSeatUpdate(reg.id)} style={{ background: '#22c55e', border: 'none', borderRadius: 6, padding: 4, cursor: 'pointer', display: 'flex' }}>
                            <Check size={14} color="white" />
                          </button>
                          <button onClick={() => setEditingSeat(null)} style={{ background: '#ef4444', border: 'none', borderRadius: 6, padding: 4, cursor: 'pointer', display: 'flex' }}>
                            <X size={14} color="white" />
                          </button>
                        </div>
                      ) : (
                        <span
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            padding: '4px 12px', borderRadius: 8, backgroundColor: '#eff6ff',
                            color: '#2563eb', fontSize: 12, fontWeight: 800, letterSpacing: '0.03em'
                          }}
                        >
                          <Hash size={12} /> {reg.seatNumber}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: 10, backgroundColor: '#f1f5f9',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, fontWeight: 800, color: '#475569'
                        }}>
                          {reg.attendeeName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{reg.attendeeName}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#475569', fontWeight: 500 }}>{reg.attendeeEmail}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#475569', fontWeight: 500 }}>{reg.attendeeContact}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                        backgroundColor: reg.attendeeGender?.toLowerCase() === 'male' ? '#f5f3ff' : reg.attendeeGender?.toLowerCase() === 'female' ? '#fdf2f8' : '#f8fafc',
                        color: reg.attendeeGender?.toLowerCase() === 'male' ? '#7c3aed' : reg.attendeeGender?.toLowerCase() === 'female' ? '#ec4899' : '#94a3b8',
                        textTransform: 'capitalize'
                      }}>
                        {reg.attendeeGender}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#475569', fontWeight: 600 }}>{reg.enrollmentNo}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#475569', fontWeight: 500 }}>{reg.department}</td>
                    <td style={{ padding: '14px 16px', fontSize: 12, color: '#94a3b8', fontWeight: 500, whiteSpace: 'nowrap' }}>
                      {new Date(reg.registeredAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => setEmailModal({
                            isOpen: true,
                            recipientName: reg.attendeeName,
                            recipientEmail: reg.attendeeEmail,
                            targetId: String(reg.userId), // Corrected: Use Student Profile ID instead of Registration ID
                            type: 'direct'
                          })}
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32,
                            borderRadius: 8, border: ' none', background: '#eff6ff',
                            color: '#2563eb', cursor: 'pointer'
                          }}
                          title="Message Student"
                        >
                          <Mail size={14} />
                        </button>
                        <button
                          onClick={() => { setEditingSeat(reg.id); setSeatValue(reg.seatNumber); }}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
                            borderRadius: 8, border: '1px solid #e2e8f0', background: 'white',
                            color: '#475569', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                            transition: 'all 0.15s'
                          }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.color = '#2563eb'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#475569'; }}
                        >
                          <Edit3 size={12} /> Edit
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Institutional Communication Modal */}
      <EmailModal 
        isOpen={emailModal.isOpen}
        onClose={() => setEmailModal(prev => ({ ...prev, isOpen: false }))}
        recipientName={emailModal.recipientName}
        recipientEmail={emailModal.recipientEmail}
        targetId={emailModal.targetId}
        type={emailModal.type}
        eventTitle={eventTitle}
      />
    </div>
  );
};

export default EventRegistrations;
