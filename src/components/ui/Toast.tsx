import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, Info, type LucideIcon } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';
interface Toast { id: string; message: string; type: ToastType; }
interface ToastContextType { toast: (message: string, type?: ToastType) => void; }

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  const icons: Record<ToastType, LucideIcon> = { success: CheckCircle, error: XCircle, info: Info };
  const styles: Record<ToastType, React.CSSProperties> = {
    success: { backgroundColor: '#f0fdf4', color: '#16a34a', borderColor: '#bbf7d0' },
    error: { backgroundColor: '#fef2f2', color: '#dc2626', borderColor: '#fecaca' },
    info: { backgroundColor: '#eff6ff', color: '#2563eb', borderColor: '#bfdbfe' },
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        pointerEvents: 'none',
      }}>
        {toasts.map(t => {
          const Icon = icons[t.type];
          const s = styles[t.type];
          return (
            <div key={t.id} style={{
              width: 320,
              padding: '12px 16px',
              borderRadius: 8,
              border: `0.5px solid ${s.borderColor}`,
              backgroundColor: s.backgroundColor,
              color: s.color,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontSize: 13,
              fontWeight: 500,
              pointerEvents: 'auto',
            }}>
              <Icon size={16} strokeWidth={1.5} />
              <span style={{ flex: 1 }}>{t.message}</span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
