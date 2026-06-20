import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const toast = {
    success: useCallback((msg) => addToast(msg, 'success'), [addToast]),
    error: useCallback((msg) => addToast(msg, 'error'), [addToast]),
    warning: useCallback((msg) => addToast(msg, 'warning'), [addToast]),
    info: useCallback((msg) => addToast(msg, 'info'), [addToast]),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`pointer-events-auto px-5 py-3 rounded-xl shadow-[var(--shadow-warm)] text-sm font-medium animate-in slide-in-from-right-4 fade-in duration-300 max-w-sm ${
              t.type === 'success' ? 'bg-sage-deep text-white' :
              t.type === 'error' ? 'bg-red-500 text-white' :
              t.type === 'warning' ? 'bg-sun text-ink' :
              'bg-walnut text-cream'
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be inside ToastProvider');
  return ctx;
}