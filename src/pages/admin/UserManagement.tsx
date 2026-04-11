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
  Trash2, Users as UsersIcon, Shield, 
  Search, Filter, ShieldCheck, Mail,
  Calendar, Fingerprint, Lock, Unlock,
  ShieldAlert, MoreVertical, ChevronRight,
  UserPlus, Download, Database, Activity,
  GraduationCap, Briefcase, UserCog, Info,
  Send
} from 'lucide-react';
import EmailModal from '@/components/ui-custom/EmailModal';

export default function UserManagement() {
  const { user } = useAuth();
  const { users, updateUser, deleteUser, provisionUser } = useEventContext();
  const { showToast } = useToast();
  const [tab, setTab] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({ name: '', email: '', password: 'password123', role: 'student' });
  
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

  const filtered = useMemo(() => {
    return users.filter(u => {
      if (tab !== 'all' && u.role !== tab) return false;
      const term = search.toLowerCase();
      if (search && !u.name.toLowerCase().includes(term) && !u.email.toLowerCase().includes(term)) return false;
      return true;
    });
  }, [users, tab, search]);

  const stats = useMemo(() => ({
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    organizers: users.filter(u => u.role === 'organizer').length,
    active: users.filter(u => u.status === 'active').length
  }), [users]);

  if (!user) return null;

  const handleExport = () => {
    const headers = ['Identity ID', 'Name', 'Email', 'Role', 'Status', 'Enrollment', 'Department', 'Joined'];
    const rows = filtered.map(u => [
      `PR-${String(u.id).padStart(4, '0')}`,
      u.name,
      u.email,
      u.role.toUpperCase(),
      u.status.toUpperCase(),
      u.enrollmentNo || 'N/A',
      u.department || 'N/A',
      u.joinedDate || '2026-04-01'
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `institutional_directory_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('success', 'Institutional directory exported successfully');
  };

  const handleProvision = async () => {
    if (!newUserData.name || !newUserData.email) {
      showToast('danger', 'Please provide complete principal identification data');
      return;
    }

    try {
      await provisionUser(newUserData);
      setIsProvisionModalOpen(false);
      setNewUserData({ name: '', email: '', password: 'password123', role: 'student' });
    } catch (error) {
      // Error handled by context toast
    }
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    updateUser(userId, { role: newRole as 'student' | 'organizer' | 'admin' });
    showToast('info', `Institutional privilege escalated to ${newRole}`);
  };

  const handleToggleActive = (userId: string) => {
    const u = users.find(x => x.id === userId);
    if (u) {
      updateUser(userId, { status: u.status === 'active' ? 'inactive' : 'active' });
      showToast(u.status === 'active' ? 'warning' : 'success', 
        u.status === 'active' ? 'Principal credentials suspended' : 'Principal access restored');
    }
  };

  const handleDelete = () => {
    if (deleteId) { 
      deleteUser(deleteId); 
      showToast('danger', 'Principal identity purged from master registry'); 
      setDeleteId(null); 
    }
  };

  const columns = [
    { 
      key: 'name', 
      header: 'System Principal', 
      render: (u: any) => {
        const initials = u.name.split(' ').map((n: any) => n[0]).join('').toUpperCase().slice(0, 2);
        const roleColor = u.role === 'admin' ? '#ef4444' : u.role === 'organizer' ? '#2563eb' : '#6366f1';
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14, backgroundColor: '#f8fafc',
              border: `2px solid ${roleColor}20`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 900, color: roleColor, flexShrink: 0
            }}>
              {initials}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 800, color: '#0f172a', fontSize: 15 }}>{u.name}</span>
                <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700 }}>ID: PR-{String(u.id).padStart(4, '0')}</span>
            </div>
          </div>
        );
      }
    },
    { 
        key: 'email', 
        header: 'Institutional Communications', 
        render: (u: any) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#475569', fontSize: 14, fontWeight: 500 }}>
                <Mail size={14} color="#94a3b8" /> {u.email}
            </div>
        ) 
    },
    { 
      key: 'role', 
      header: 'Access Level', 
      render: (u: any) => (
        <div style={{ position: 'relative', width: 140 }}>
          <select
            value={u.role}
            onChange={e => handleRoleChange(u.id, e.target.value)}
            style={{
              width: '100%', fontSize: 12, fontWeight: 800, border: '1px solid #f1f5f9', 
              borderRadius: 12, padding: '10px 12px', backgroundColor: '#f8fafc', 
              color: '#0f172a', cursor: 'pointer', outline: 'none', appearance: 'none',
              textTransform: 'uppercase', letterSpacing: '0.05em'
            }}
          >
            <option value="student">Student Account</option>
            <option value="organizer">Institutional Curator</option>
            <option value="admin">System Admin</option>
          </select>
          <ChevronRight size={14} color="#cbd5e1" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%) rotate(90deg)', pointerEvents: 'none' }} />
        </div>
      )
    },
    { 
        key: 'status', 
        header: 'Registry Status', 
        render: (u: any) => <Badge variant={u.status === 'active' ? 'success' : 'danger'}>{u.status}</Badge> 
    },
    { 
        key: 'joined', 
        header: 'Enrolled', 
        render: (u: any) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: '#64748b' }}>
                <Calendar size={14} /> {u.joinedDate || '2026-04-01'}
            </div>
        ) 
    },
    { key: 'actions', header: '', render: (u: any) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end' }}>
        <button 
          onClick={() => setEmailModal({
            isOpen: true,
            recipientName: u.name,
            recipientEmail: u.email,
            targetId: u.id
          })}
          title="Send Institutional Mail"
          style={{ 
            width: 36, height: 36, borderRadius: 10, border: 'none', 
            backgroundColor: '#eff6ff', color: '#2563eb',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
          }}
        >
          <Mail size={16} />
        </button>
        <button 
          onClick={() => handleToggleActive(u.id)}
          title={u.status === 'active' ? 'Suspend Access' : 'Restore Access'}
          style={{ 
            width: 36, height: 36, borderRadius: 10, border: 'none', 
            backgroundColor: u.status === 'active' ? '#fff7ed' : '#f0fdf4', 
            color: u.status === 'active' ? '#f59e0b' : '#16a34a',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
          }}
        >
          {u.status === 'active' ? <Lock size={16} /> : <Unlock size={16} />}
        </button>
        <button 
          onClick={() => setDeleteId(u.id)} 
          title="Purge Identity"
          style={{ width: 36, height: 36, borderRadius: 10, border: 'none', backgroundColor: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} 
        >
          <Trash2 size={16} />
        </button>
      </div>
    )},
  ];

  return (
    <div style={{ padding: '0 40px 100px 40px' }}>
      {/* High-Fidelity Identity Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 56, marginTop: 40 }}>
        {[
          { label: 'Total Principals', count: stats.total, icon: UsersIcon, color: '#0f172a', bg: '#f8fafc', desc: 'Active directory depth' },
          { label: 'Authorized Admins', count: stats.admins, icon: ShieldCheck, color: '#dc2626', bg: '#fef2f2', desc: 'Elevated privileges' },
          { label: 'Verified Curators', count: stats.organizers, icon: Briefcase, color: '#2563eb', bg: '#eff6ff', desc: 'Exhibition managers' },
          { label: 'Registry Security', count: stats.active, icon: Database, color: '#16a34a', bg: '#f0fdf4', desc: 'Secure handshake accounts' }
        ].map((s, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            style={{ backgroundColor: 'white', padding: 32, borderRadius: 32, border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)' }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <s.icon size={22} color={s.color} />
            </div>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: s.color, marginTop: 4 }}>{s.count}</div>
            <div style={{ fontSize: 12, color: '#cbd5e1', fontWeight: 600, marginTop: 8 }}>{s.desc}</div>
          </motion.div>
        ))}
      </div>

      {/* Directory Logic Suite */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', flex: 1 }}>
            <div style={{ 
                display: 'flex', backgroundColor: '#f1f5f9', borderRadius: 16, padding: 4, gap: 4
            }}>
                {['all', 'student', 'organizer', 'admin'].map(t => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        style={{
                            padding: '10px 20px', fontSize: 13, fontWeight: tab === t ? 800 : 500, borderRadius: 12,
                            textTransform: 'capitalize', cursor: 'pointer', border: 'none',
                            backgroundColor: tab === t ? 'white' : 'transparent',
                            color: tab === t ? '#2563eb' : '#64748b',
                            boxShadow: tab === t ? '0 4px 6px -1px rgba(0,0,0,0.05)' : 'none',
                            transition: 'all 0.2s',
                        }}
                    >
                        {t === 'all' ? 'Directory' : t + 's'}
                    </button>
                ))}
            </div>
            <div style={{ width: 340, position: 'relative' }}>
                <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', zIndex: 10 }} />
                <input 
                    placeholder="Identify principal by name or mail..." 
                    value={search} onChange={e => setSearch(e.target.value)} 
                    style={{ width: '100%', padding: '16px 20px 16px 52px', borderRadius: 20, border: '1px solid #f1f5f9', fontSize: 15, outline: 'none', fontWeight: 600, backgroundColor: 'white' }}
                />
            </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
            <Button variant="outline" onClick={handleExport} style={{ height: 52, borderRadius: 16, fontWeight: 800, padding: '0 24px' }}>
                <Download size={18} /> Export Directory
            </Button>
            <Button onClick={() => setIsProvisionModalOpen(true)} style={{ height: 52, borderRadius: 16, backgroundColor: '#2563eb', border: 'none', fontWeight: 800, padding: '0 24px' }}>
                <UserPlus size={18} /> Provision Account
            </Button>
        </div>
      </div>

      {/* Identity Ledger architecture */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ backgroundColor: '#ffffff', border: '1px solid #f1f5f9', borderRadius: 40, overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.03)' }}
      >
        <DataTable columns={columns} data={filtered} />
        {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '120px 0' }}>
                <UsersIcon size={64} color="#f1f5f9" style={{ marginBottom: 24 }} />
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#94a3b8' }}>Directory Search Empty</h3>
                <p style={{ fontSize: 14, color: '#cbd5e1' }}>No institutional records matching your query detected.</p>
            </div>
        )}
      </motion.div>

      {/* Provision Account Modal */}
      <Modal 
        isOpen={isProvisionModalOpen} 
        onClose={() => setIsProvisionModalOpen(false)} 
        title="Provision Verified Account"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 12, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Full Legal Name</label>
            <Input 
              placeholder="e.g. Dr. Jane Cooper" 
              value={newUserData.name} 
              onChange={e => setNewUserData({ ...newUserData, name: e.target.value })} 
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 12, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Institutional Email</label>
            <Input 
              type="email" 
              placeholder="name@aura.edu" 
              value={newUserData.email} 
              onChange={e => setNewUserData({ ...newUserData, email: e.target.value })} 
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 12, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Initial Access Privilege</label>
            <select
              value={newUserData.role}
              onChange={e => setNewUserData({ ...newUserData, role: e.target.value })}
              style={{
                width: '100%', fontSize: 14, fontWeight: 700, border: '1px solid #f1f5f9', 
                borderRadius: 16, padding: '14px 16px', backgroundColor: '#f8fafc', 
                color: '#0f172a', outline: 'none'
              }}
            >
              <option value="student">Student / Scholar</option>
              <option value="organizer">Institutional Curator</option>
              <option value="admin">System Administrator</option>
            </select>
          </div>
          <div style={{ display: 'flex', itemsCenter: 'center', gap: 10, padding: 16, backgroundColor: '#f0fdf4', borderRadius: 16, border: '1px solid #bbf7d0' }}>
            <ShieldCheck size={16} color="#16a34a" />
            <p style={{ fontSize: 12, color: '#15803d', fontWeight: 600, margin: 0 }}>
              Default credential 'password123' will be assigned upon provisioning.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
            <Button onClick={handleProvision} style={{ flex: 1.5, height: 56, borderRadius: 18 }}>Authorize Provisioning</Button>
            <Button variant="secondary" outline onClick={() => setIsProvisionModalOpen(false)} style={{ flex: 1, height: 56, borderRadius: 18 }}>Abort</Button>
          </div>
        </div>
      </Modal>

      {/* Principal Purge Protocol */}
      <Modal 
        isOpen={!!deleteId} onClose={() => setDeleteId(null)} 
        title="Institutional Principal Purge Authorization"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div style={{ display: 'flex', gap: 20, padding: 32, backgroundColor: '#fef2f2', borderRadius: 28, border: '1px solid #fee2e2' }}>
                <ShieldAlert size={40} color="#dc2626" style={{ flexShrink: 0 }} />
                <div>
                    <h4 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#991b1b' }}>Critical Identity Erasure</h4>
                    <p style={{ marginTop: 12, fontSize: 14, color: '#b91c1c', lineHeight: 1.6, fontWeight: 600 }}>
                        Are you certain you want to purge <span style={{ color: '#0f172a' }}>{users.find(u => u.id === deleteId)?.name}</span> from the universal directory? All credentials, exhibition records, and engagement history will be permanently terminated.
                    </p>
                </div>
            </div>
            
            <div style={{ display: 'flex', gap: 16 }}>
                <Button variant="danger" onClick={handleDelete} style={{ flex: 1.3, height: 56, borderRadius: 18, fontSize: 15 }}>Execute Identity Purge</Button>
                <Button variant="secondary" outline onClick={() => setDeleteId(null)} style={{ flex: 1, height: 56, borderRadius: 18, fontSize: 15 }}>Maintain Record</Button>
            </div>
            
            <div style={{ display: 'flex', gap: 10, padding: 20, backgroundColor: '#eff6ff', borderRadius: 20, border: '1px solid #dbeafe' }}>
                <Info size={16} color="#3b82f6" />
                <p style={{ fontSize: 12, color: '#1e40af', fontWeight: 600, margin: 0 }}>
                    Security Auditor Note: This identity decommissioning will be logged in the principal security ledger.
                </p>
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
