import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send, X, Loader2, Info, AlertCircle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import { useToast } from './Toast';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  recipientEmail: string;
  targetId: string; // userId or eventId
  type: 'direct' | 'broadcast';
  eventTitle?: string;
}

const EmailModal: React.FC<EmailModalProps> = ({ 
  isOpen, onClose, recipientName, recipientEmail, targetId, type, eventTitle 
}) => {
  const { showToast } = useToast();
  const [subject, setSubject] = useState(type === 'broadcast' ? `Important Update: ${eventTitle}` : '');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      showToast('warning', 'Subject and message are required.');
      return;
    }

    setIsSending(true);
    try {
      const endpoint = type === 'direct' ? '/api/communicate/direct' : '/api/communicate/broadcast';
      const body = type === 'direct' 
        ? { targetUserId: targetId, subject, message }
        : { eventId: targetId, subject, message };

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('college_auth_token')}`
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to dispatch message');

      showToast('success', data.message);
      setSubject('');
      setMessage('');
      onClose();
    } catch (error: any) {
      showToast('danger', error.message || 'Institutional communication failed');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={type === 'broadcast' ? 'Institutional Broadcast' : 'Direct Communication'}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Recipient Ribbon */}
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', 
          backgroundColor: '#f8fafc', borderRadius: 20, border: '1px solid #f1f5f9' 
        }}>
          <div style={{ 
            width: 40, height: 40, borderRadius: 12, backgroundColor: '#eff6ff', 
            display: 'flex', alignItems: 'center', justifyContent: 'center' 
          }}>
            <Mail size={18} color="#2563eb" />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {type === 'broadcast' ? 'Target Audience' : 'Recipient Principal'}
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
              {type === 'broadcast' ? `All registered students of "${eventTitle}"` : `${recipientName} (${recipientEmail})`}
            </div>
          </div>
        </div>

        {/* Guidance Note */}
        <div style={{ 
          display: 'flex', gap: 12, padding: 16, backgroundColor: type === 'broadcast' ? '#fff7ed' : '#f0fdf4', 
          borderRadius: 16, border: `1px solid ${type === 'broadcast' ? '#fed7aa' : '#bbf7d0'}` 
        }}>
          {type === 'broadcast' ? <AlertCircle size={18} color="#c2410c" /> : <Info size={18} color="#15803d" />}
          <p style={{ 
            fontSize: 12, color: type === 'broadcast' ? '#9a3412' : '#15803d', 
            fontWeight: 600, margin: 0, lineHeight: 1.5 
          }}>
            {type === 'broadcast' 
              ? 'Institutional Note: This broadcast will be dispatched to all authorized student IDs registered for this exhibition.' 
              : 'Institutional Note: This communication will be logged in the system and sent via official mail servers.'}
          </p>
        </div>

        {/* Form Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Subject Header</label>
            <input 
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Primary subject of communication..."
              style={{ 
                width: '100%', padding: '14px 16px', borderRadius: 14, border: '1px solid #e2e8f0', 
                fontSize: 14, fontWeight: 600, outline: 'none', backgroundColor: '#ffffff'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Message Body</label>
            <textarea 
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Draft your institutional message here..."
              style={{ 
                width: '100%', height: 160, padding: '16px', borderRadius: 16, border: '1px solid #e2e8f0', 
                fontSize: 14, fontWeight: 500, outline: 'none', resize: 'none', backgroundColor: '#ffffff',
                lineHeight: 1.6
              }}
            />
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
          <button 
            onClick={handleSend}
            disabled={isSending}
            style={{ 
              flex: 1.5, height: 56, borderRadius: 18, border: 'none', 
              backgroundColor: '#1A1A1A', color: 'white', fontWeight: 800, 
              fontSize: 14, cursor: isSending ? 'wait' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
              transition: 'all 0.2s',
              opacity: isSending ? 0.7 : 1
            }}
          >
            {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            {isSending ? 'Dispatching Message...' : 'Send Institutional Mail'}
          </button>
          <button 
            onClick={onClose}
            disabled={isSending}
            style={{ 
              flex: 1, height: 56, borderRadius: 18, border: '1px solid #e2e8f0', 
              backgroundColor: 'white', color: '#64748b', fontWeight: 800, 
              fontSize: 14, cursor: 'pointer'
            }}
          >
            Cancel Draft
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EmailModal;
