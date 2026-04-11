import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Clock, CheckCircle2, Share2, ArrowRight, Download } from 'lucide-react';
import Badge from './Badge';
import { useEventContext } from '@/context/EventContext';
import { formatDate } from '@/utils/helpers';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: any;
  registration: any;
  venue: any;
  user: any;
  showToast?: (type: 'success' | 'info' | 'danger', message: string) => void;
}

export default function TicketModal({ isOpen, onClose, event, registration, venue, user, showToast }: TicketModalProps) {
  const { downloadTicket } = useEventContext();
  if (!isOpen || !event) return null;

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/student/event/${event.id}`;
    const shareData = {
      title: event.title,
      text: `Academic Gallery Invitation: Joining ${event.title} at ${venue?.name || 'Institutional Hall'}.`,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        if (showToast) showToast('info', 'Gallery link archived to clipboard.');
      }
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
      }}>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(8px)',
          }}
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          style={{
            position: 'relative',
            backgroundColor: 'var(--surface)',
            borderRadius: 32,
            width: '100%',
            maxWidth: 480,
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}
          className="print-modal"
        >
          <div style={{ padding: 32 }}>
            <div 
              className="ticket-card"
              style={{
                backgroundColor: 'white',
                borderRadius: 24,
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb',
                position: 'relative',
              }}
            >
              {/* Top Banner (Branding) */}
              <div style={{
                height: 120,
                backgroundColor: 'var(--primary)',
                backgroundImage: event.bannerImage ? `url(${event.bannerImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '16px 24px'
              }}>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                }} />
                <div style={{ position: 'relative', color: 'white' }}>
                  <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.9, marginBottom: 4 }}>Institutional Event Registry</div>
                  <h3 style={{ fontSize: 24, fontWeight: 800, margin: 0, lineHeight: 1.1 }}>{event.title}</h3>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{event.category?.name || 'Academic Event'}</div>
                </div>
              </div>

              {/* Ticket Body */}
              <div style={{ padding: 24, position: 'relative' }}>
                {/* Punch Holes for Ticket Aesthetic */}
                <div style={{ position: 'absolute', left: -10, top: -10, width: 20, height: 20, borderRadius: '50%', backgroundColor: 'var(--surface)', border: '1px solid #e5e7eb' }} />
                <div style={{ position: 'absolute', right: -10, top: -10, width: 20, height: 20, borderRadius: '50%', backgroundColor: 'var(--surface)', border: '1px solid #e5e7eb' }} />

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <label style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Attendee Name</label>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginTop: 2, fontFamily: 'Manrope, sans-serif' }}>{registration?.attendeeName || user?.name || 'Authorized Student'}</div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div>
                        <label style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Gender</label>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginTop: 4 }}>{registration?.attendeeGender || 'Not Specified'}</div>
                      </div>
                      <div>
                        <label style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Contact</label>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginTop: 4 }}>{registration?.attendeeContact || 'N/A'}</div>
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Email</label>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginTop: 4 }}>{registration?.attendeeEmail || user?.email || 'N/A'}</div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div>
                        <label style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Admission Date</label>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginTop: 4 }}>{formatDate(event.date)}</div>
                      </div>
                      <div>
                        <label style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Entry Time</label>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginTop: 4 }}>{event.time}</div>
                      </div>
                    </div>
                    
                    <div>
                      <label style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Venue Location</label>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <MapPin size={14} color="var(--primary)" /> {venue?.name || 'Academic Plaza'}
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Attendee Status</label>
                      <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                        <Badge variant="info">Student Delegate</Badge>
                        <Badge variant="draft">Confirmed</Badge>
                      </div>
                    </div>
                  </div>

                  {/* QR Stub */}
                  <div className="ticket-stub" style={{ borderLeft: '1px dashed #e2e8f0', paddingLeft: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                      <label style={{ fontSize: 9, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', display: 'block' }}>Pass Identity</label>
                      <div style={{ fontSize: 13, fontWeight: 800, fontFamily: 'monospace', color: '#0f172a', marginTop: 4 }}>REG-2026-{registration?.id?.toString().padStart(5, '0') || 'XXXXX'}</div>
                    </div>

                    <div className="qr-container" style={{ width: 100, height: 100, backgroundColor: '#f8fafc', padding: 12, borderRadius: 12, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3, width: '100%', height: '100%' }}>
                        {[...Array(16)].map((_, i) => (
                          <div key={i} style={{ backgroundColor: '#0f172a' }} />
                        ))}
                      </div>
                    </div>

                    <div style={{ fontSize: 8, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Verified Entry</div>
                  </div>
                </div>

                <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500 }}>Generated for institutional use only.</div>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {[...Array(20)].map((_, i) => (
                      <div key={i} style={{ width: 2, height: 12, backgroundColor: '#cbd5e1' }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="modal-actions" style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <button
                  onClick={() => downloadTicket(registration.id)}
                  style={{
                    width: '100%',
                    padding: '16px',
                    backgroundColor: '#0f172a',
                    color: 'white',
                    borderRadius: 16,
                    border: 'none',
                    fontWeight: 700,
                    fontSize: 15,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)'
                  }}
                >
                  <Download size={18} /> Download Official PDF Ticket
                </button>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <button
                  onClick={handleShare}
                  style={{
                    padding: '12px',
                    backgroundColor: 'white',
                    color: '#1e293b',
                    borderRadius: 12,
                    border: '1px solid #e2e8f0',
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  <Share2 size={16} /> Share
                </button>
                <button
                  onClick={onClose}
                  style={{
                    padding: '12px',
                    backgroundColor: 'white',
                    color: '#1e293b',
                    borderRadius: 12,
                    border: '1px solid #e2e8f0',
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8
                  }}
                >
                  Done <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </motion.div>

        {/* Global Print Styles */}
        <style>
          {`
            @media print {
              #root > div > aside, 
              #root > div > div > header,
              nav, .sidebar, .topbar, button:not(.print-only) { 
                display: none !important; 
              }

              body, html { 
                background-color: white !important; 
                margin: 0 !important; 
                padding: 0 !important; 
              }

              .print-modal {
                position: absolute !important;
                inset: 0 !important;
                width: 100% !important;
                max-width: none !important;
                box-shadow: none !important;
                background-color: white !important;
                visibility: visible !important;
                display: block !important;
              }

              .ticket-card {
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                margin: 0 auto !important;
                width: 100% !important;
                max-width: 600px !important;
                box-shadow: none !important;
                border: 1px solid #e2e8f0 !important;
                background-color: white !important;
                border-radius: 0 !important;
              }

              .ticket-card > div:first-child { 
                height: 100px !important;
                background-color: #0f172a !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .ticket-card h3 { font-size: 28px !important; color: white !important; }

              .ticket-card > div:last-child > div:nth-child(3) { 
                display: block !important; 
              }
              
              .ticket-stub {
                border-left: none !important;
                border-top: 1px dashed #e2e8f0 !important;
                padding-left: 0 !important;
                padding-top: 32px !important;
                margin-top: 32px !important;
                width: 100% !important;
              }

              .qr-container {
                width: 150px !important;
                height: 150px !important;
                margin: 20px auto !important;
              }

              .modal-actions, .close-button { display: none !important; }

              .ticket-card::after {
                content: 'INSTITUTIONAL REGISTRY - OFFICIAL GATE PASS';
                display: block;
                text-align: center;
                font-size: 10px;
                font-weight: 800;
                color: #0f172a;
                margin-top: 40px;
                letter-spacing: 0.2em;
              }

              * {
                box-shadow: none !important;
                text-shadow: none !important;
                transition: none !important;
                animation: none !important;
                backdrop-filter: none !important;
              }

              * { 
                -webkit-print-color-adjust: exact !important; 
                print-color-adjust: exact !important; 
              }

              @page {
                size: portrait;
                margin: 0;
              }
            }
          `}
        </style>
      </div>
    </AnimatePresence>
  );
}
