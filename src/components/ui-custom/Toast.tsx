import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, type LucideIcon } from 'lucide-react';

type ToastType = 'success' | 'danger' | 'info' | 'warning';

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

const icons: Record<ToastType, LucideIcon> = {
  success: CheckCircle,
  danger: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const styles: Record<ToastType, React.CSSProperties> = {
  success: { backgroundColor: '#f0fdf4', color: '#16a34a', borderColor: '#bbf7d0' },
  danger: { backgroundColor: '#fef2f2', color: '#dc2626', borderColor: '#fecaca' },
  info: { backgroundColor: '#eff6ff', color: '#2563eb', borderColor: '#bfdbfe' },
  warning: { backgroundColor: '#fffbeb', color: '#d97706', borderColor: '#fde68a' },
};

let nextId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = nextId++;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
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
            }}>
              <Icon size={16} strokeWidth={1.5} />
              {t.message}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
