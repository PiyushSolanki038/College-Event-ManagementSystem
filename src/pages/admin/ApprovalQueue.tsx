import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui-custom/Button';
import Modal from '@/components/ui-custom/Modal';
import { useAuth } from '@/context/AuthContext';
import { useEventContext } from '@/context/EventContext';
import { useToast } from '@/components/ui-custom/Toast';
import { formatDate } from '@/utils/helpers';
import { 
  CheckCircle2, Eye, ShieldCheck, Users, 
  MapPin, Calendar, ArrowUpRight, ShieldAlert,
  Info, Clock, Filter, Search, MoreVertical,
  ChevronRight, Building, Mail
} from 'lucide-react';
import Badge from '@/components/ui-custom/Badge';
import EmailModal from '@/components/ui-custom/EmailModal';

export default function ApprovalQueue() {
  const { user } = useAuth();
  const { events, venues, categories, users, updateEventStatus } = useEventContext();
  const { showToast } = useToast();
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  // Email Modal State
  const [emailModal, setEmailModal] = useState<{
    isOpen: boolean;
    recipientName: string;
    recipientEmail: string;
    targetId: string;
  }>({
    isOpen: false,
    recipientName: '',
    recipientEmail: '',
    targetId: ''
  });

  const pendingEvents = useMemo(() => events.filter(e => e.status === 'pending'), [events]);
  const previewEvent = useMemo(() => previewId ? events.find(e => e.id === previewId) : null, [previewId, events]);
  const confirmEvent = useMemo(() => confirmId ? events.find(e => e.id === confirmId) : null, [confirmId, events]);

  if (!user) return null;

  const handleApprove = (id: string) => { 
    setConfirmId(id);
  };

  const handleConfirmApprove = () => {
    if (confirmId) {
      updateEventStatus(confirmId, 'approved'); 
      showToast('success', 'Institutional record verified and approved'); 
      if (previewId === confirmId) setPreviewId(null);
      setConfirmId(null);
    }
  };

  const handleReject = () => {
    if (rejectId) {
      updateEventStatus(rejectId, 'rejected', rejectReason || undefined);
      showToast('danger', 'Exhibition submission rejected');
      setRejectId(null);
      setRejectReason('');
      if (previewId === rejectId) setPreviewId(null);
    }
  };

  return (
    <div style={{ padding: '0 40px 100px 40px' }}>
      {/* High-Contrast Governance Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 56, marginTop: 40 }}>
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}
          >
            <div style={{ padding: '6px 14px', backgroundColor: '#eef2ff', borderRadius: 12, border: '1px solid #e0e7ff', display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShieldCheck size={14} color="#3730a3" />
              <span style={{ fontSize: 11, fontWeight: 800, color: '#312e81', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Governance Portal</span>
            </div>
            <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>Active Queue: {pendingEvents.length} Pending Records</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ fontSize: 44, fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.03em' }}
          >
            Moderation <span style={{ color: '#2563eb' }}>Command Gallery</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ fontSize: 16, color: '#64748b', marginTop: 12, fontWeight: 500, maxWidth: 500 }}
          >
            Reviewing exhibition submissions for institutional alignment and facility standards.
          </motion.p>
        </div>

        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            style={{ display: 'flex', gap: 12 }}
        >
            <div style={{ padding: '12px 24px', backgroundColor: 'white', borderRadius: 16, border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 12 }}>
                <Clock size={16} color="#64748b" />
                <span style={{ fontSize: 14, fontWeight: 700, color: '#475569' }}>Avg. Response Time: <span style={{ color: '#2563eb' }}>2.4h</span></span>
            </div>
        </motion.div>
      </div>

      {pendingEvents.length === 0 ? (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', padding: '120px 0', backgroundColor: 'white', borderRadius: 40, border: '1px solid #f1f5f9' }}
        >
          <div style={{ width: 80, height: 80, borderRadius: 28, backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <CheckCircle2 size={40} color="#16a34a" />
          </div>
          <h3 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a' }}>Moderation Cleared</h3>
          <p style={{ fontSize: 15, color: '#64748b', marginTop: 8 }}>All pending institutional submissions have been successfully processed.</p>
        </motion.div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: 32 }}>
          <AnimatePresence>
            {pendingEvents.map((e, idx) => {
              const venue = venues.find(v => v.id === e.venueId);
              const organizer = users.find(u => u.id === e.organizerId);
              return (
                <motion.div 
                  layout
                  key={e.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -8, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)' }}
                  style={{ 
                    backgroundColor: 'white', 
                    borderRadius: 32, 
                    padding: 32, 
                    border: '1px solid #f1f5f9',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 24
                  }}
                >
                  {/* Floating Action Badge */}
                  <div style={{ position: 'absolute', top: 32, right: 32 }}>
                    <button onClick={() => setPreviewId(e.id)} style={{ padding: 10, borderRadius: 14, backgroundColor: '#f8fafc', border: '1px solid #f1f5f9', cursor: 'pointer', color: '#64748b' }}>
                        <ArrowUpRight size={18} />
                    </button>
                  </div>

                  {/* Curatorial Context */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Users size={20} color="#7c3aed" />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Submission From</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{organizer?.name || 'Institutional Curator'}</div>
                    </div>
                  </div>

                  {/* Submission Header */}
                  <div>
                    <h3 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.2 }}>{e.title}</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', backgroundColor: '#f1f5f9', borderRadius: 10, fontSize: 12, fontWeight: 700, color: '#475569' }}>
                            <Calendar size={14} /> {formatDate(e.date)}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', backgroundColor: '#f1f5f9', borderRadius: 10, fontSize: 12, fontWeight: 700, color: '#475569' }}>
                            <MapPin size={14} /> {venue?.name || 'Grand Plaza'}
                        </div>
                    </div>
                  </div>

                  {/* Impact Summary */}
                  <div style={{ backgroundColor: '#f8fafc', padding: 20, borderRadius: 20, border: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Target Capacity</div>
                            <div style={{ fontSize: 16, fontWeight: 900, color: '#0f172a' }}>{e.maxCapacity} Seats</div>
                        </div>
                        <div style={{ width: 1, height: 32, backgroundColor: '#e2e8f0' }} />
                        <div>
                            <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Category Suit</div>
                            <div style={{ fontSize: 16, fontWeight: 900, color: '#2563eb' }}>Specialist</div>
                        </div>
                    </div>
                  </div>

                  {/* Decision Matrix */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 'auto' }}>
                    <button 
                        onClick={() => handleApprove(e.id)}
                        style={{ 
                            padding: '14px', borderRadius: 16, border: 'none', backgroundColor: '#2563eb', color: 'white', 
                            fontWeight: 800, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', 
                            justifyContent: 'center', gap: 8, boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.2)' 
                        }}
                    >
                        <ShieldCheck size={16} /> Approve
                    </button>
                    <button 
                        onClick={() => setRejectId(e.id)}
                        style={{ 
                            padding: '14px', borderRadius: 16, border: '1px solid #fecaca', backgroundColor: '#fef2f2', color: '#dc2626', 
                            fontWeight: 800, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', 
                            justifyContent: 'center', gap: 8 
                        }}
                    >
                        <ShieldAlert size={16} /> Decline
                    </button>
                  </div>
                  
                  {/* Contact Curator Link */}
                  <button
                    onClick={() => setEmailModal({
                      isOpen: true,
                      recipientName: organizer?.name || 'Curator',
                      recipientEmail: organizer?.email || '',
                      targetId: organizer?.id || ''
                    })}
                    style={{
                      width: '100%', marginTop: -8, padding: '12px', borderRadius: 16, border: '1px solid #e2e8f0',
                      backgroundColor: 'white', color: '#64748b', fontSize: 12, fontWeight: 800,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer'
                    }}
                  >
                    <Mail size={14} /> Contact Curator
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Modern Preview Manifest */}
      <Modal isOpen={!!previewEvent} onClose={() => setPreviewId(null)} title="Institutional Exhibition Manifest">
        {previewEvent && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div style={{ display: 'flex', gap: 24 }}>
                <div style={{ width: 120, height: 120, borderRadius: 24, overflow: 'hidden', flexShrink: 0, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                    <img src={previewEvent.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                    <h3 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', margin: '0 0 8px 0' }}>{previewEvent.title}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748b', fontSize: 14, fontWeight: 600 }}>
                        <Building size={14} /> Facility: {venues.find(v => v.id === previewEvent.venueId)?.name}
                    </div>
                </div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', borderRadius: 24, padding: 32, border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 12, letterSpacing: '0.1em' }}>Scope of Engagement</div>
              <p style={{ fontSize: 15, color: '#334155', lineHeight: 1.7, margin: 0, fontWeight: 500 }}>{previewEvent.description}</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div style={{ padding: 20, backgroundColor: 'white', borderRadius: 20, border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 8 }}>Scheduling</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{formatDate(previewEvent.date)} at {previewEvent.time}</div>
              </div>
              <div style={{ padding: 20, backgroundColor: 'white', borderRadius: 20, border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 8 }}>Authorized Curator</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{users.find(u => u.id === previewEvent.organizerId)?.name}</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
              <Button style={{ flex: 1.5, height: 56, borderRadius: 16 }} onClick={() => handleApprove(previewEvent.id)}>Final Verification & Approval</Button>
              <Button variant="secondary" outline style={{ flex: 1, height: 56, borderRadius: 16 }} onClick={() => setPreviewId(null)}>Close Manifest</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirmation Modal with Full Details */}
      <Modal isOpen={!!confirmEvent} onClose={() => setConfirmId(null)} title="Confirm Event Approval">
        {confirmEvent && (() => {
          const venue = venues.find(v => v.id === confirmEvent.venueId);
          const organizer = users.find(u => u.id === confirmEvent.organizerId);
          const category = categories.find(c => c.id === confirmEvent.categoryId);
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Banner */}
              {confirmEvent.bannerImage && (
                <div style={{ borderRadius: 20, overflow: 'hidden', maxHeight: 200 }}>
                  <img src={confirmEvent.bannerImage} alt={confirmEvent.title} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                </div>
              )}

              {/* Title & Status Badge */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{ padding: '4px 12px', borderRadius: 8, backgroundColor: '#fef3c7', color: '#92400e', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pending Review</span>
                </div>
                <h3 style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>{confirmEvent.title}</h3>
              </div>

              {/* Description */}
              <div style={{ backgroundColor: '#f8fafc', borderRadius: 20, padding: 24, border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 10, letterSpacing: '0.1em' }}>Event Description</div>
                <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.7, margin: 0, fontWeight: 500 }}>{confirmEvent.description || 'No description provided.'}</p>
              </div>

              {/* Details Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ padding: 20, backgroundColor: '#f8fafc', borderRadius: 16, border: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 6 }}>Date & Time</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Calendar size={14} color="#2563eb" /> {formatDate(confirmEvent.date)} at {confirmEvent.time}
                  </div>
                </div>
                <div style={{ padding: 20, backgroundColor: '#f8fafc', borderRadius: 16, border: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 6 }}>Venue</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MapPin size={14} color="#2563eb" /> {venue?.name || 'Unassigned'}
                  </div>
                </div>
                <div style={{ padding: 20, backgroundColor: '#f8fafc', borderRadius: 16, border: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 6 }}>Organizer</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Users size={14} color="#2563eb" /> {organizer?.name || 'Unknown'}
                  </div>
                </div>
                <div style={{ padding: 20, backgroundColor: '#f8fafc', borderRadius: 16, border: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 6 }}>Category</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{category?.name || 'General'}</div>
                </div>
                <div style={{ padding: 20, backgroundColor: '#f8fafc', borderRadius: 16, border: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 6 }}>Max Capacity</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{confirmEvent.maxCapacity} Seats</div>
                </div>
                <div style={{ padding: 20, backgroundColor: '#f8fafc', borderRadius: 16, border: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 6 }}>Registrations</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{confirmEvent.registeredCount || 0} Registered</div>
                </div>
              </div>

              {/* Confirmation Warning */}
              <div style={{ display: 'flex', gap: 14, padding: 20, backgroundColor: '#eff6ff', borderRadius: 16, border: '1px solid #dbeafe' }}>
                <Info size={20} color="#2563eb" style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: 13, color: '#1e40af', fontWeight: 600, margin: 0, lineHeight: 1.6 }}>
                  Approving this event will make it visible to all students and open for registrations. This action cannot be undone.
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 12 }}>
                <button 
                  onClick={handleConfirmApprove}
                  style={{ 
                    flex: 1.5, height: 56, borderRadius: 16, border: 'none', backgroundColor: '#16a34a', color: 'white', 
                    fontWeight: 800, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', 
                    justifyContent: 'center', gap: 8, boxShadow: '0 10px 15px -3px rgba(22, 163, 74, 0.25)',
                    transition: 'all 0.2s'
                  }}
                >
                  <CheckCircle2 size={18} /> Yes, Approve This Event
                </button>
                <button 
                  onClick={() => setConfirmId(null)}
                  style={{ 
                    flex: 1, height: 56, borderRadius: 16, border: '1px solid #e2e8f0', backgroundColor: 'white', color: '#475569', 
                    fontWeight: 800, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', 
                    justifyContent: 'center', gap: 8,
                    transition: 'all 0.2s'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* Governance Rejection Modal */}
      <Modal isOpen={!!rejectId} onClose={() => { setRejectId(null); setRejectReason(''); }} title="Decline Institutional Submission">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'flex', gap: 14, padding: 20, backgroundColor: '#fef2f2', borderRadius: 16, border: '1px solid #fee2e2' }}>
            <ShieldAlert size={20} color="#dc2626" />
            <p style={{ fontSize: 14, color: '#991b1b', fontWeight: 600, margin: 0, lineHeight: 1.5 }}>
                Declining this submission will notify the curator immediately. Please provide specific feedback regarding institutional standards.
            </p>
          </div>
          
          <textarea
            value={rejectReason}
            onChange={e => setRejectReason(e.target.value)}
            placeholder="Official reason for rejection (e.g. Incomplete logistical plan, facility mismatch)..."
            style={{
              height: 140, border: '2px solid #f1f5f9', borderRadius: 20, padding: 24,
              fontSize: 15, color: '#0f172a', backgroundColor: '#f8fafc', outline: 'none',
              resize: 'none', fontFamily: 'Inter, sans-serif', fontWeight: 500, lineHeight: 1.6
            }}
          />

          <div style={{ display: 'flex', gap: 12 }}>
            <Button variant="danger" onClick={handleReject} style={{ flex: 1, height: 52, borderRadius: 14 }}>Confirm Decline</Button>
            <Button variant="secondary" outline onClick={() => { setRejectId(null); setRejectReason(''); }} style={{ flex: 1, height: 52, borderRadius: 14 }}>Abort</Button>
          </div>
        </div>
      </Modal>

      {/* Institutional Communication Modal */}
      <EmailModal 
        isOpen={emailModal.isOpen}
        onClose={() => setEmailModal(prev => ({ ...prev, isOpen: false }))}
        recipientName={emailModal.recipientName}
        recipientEmail={emailModal.recipientEmail}
        targetId={emailModal.targetId}
        type="direct"
      />
    </div>
  );
}
