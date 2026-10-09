import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('Toast is only available inside the app shell.');
  }
  return ctx;
}

export default function Providers({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((tone, message) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToasts((current) => [...current, { id, tone, message }].slice(-3));
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 4200);
  }, []);

  const toast = useMemo(() => ({
    success: (message) => push('success', message),
    error: (message) => push('error', message),
  }), [push]);

  function dismiss(id) {
    setToasts((current) => current.filter((item) => item.id !== id));
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4 sm:items-end sm:px-6"
        aria-live="polite"
      >
        {toasts.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => dismiss(item.id)}
            className={`pointer-events-auto w-full max-w-sm break-words rounded-2xl border bg-white px-4 py-3 text-left text-sm text-ink shadow-sm ${
              item.tone === 'success' ? 'border-pine/30' : 'border-clay/30'
            }`}
          >
            <span
              className={`mr-2 inline-block h-2 w-2 rounded-full ${
                item.tone === 'success' ? 'bg-pine' : 'bg-clay'
              }`}
              aria-hidden="true"
            />
            {item.message}
          </button>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
