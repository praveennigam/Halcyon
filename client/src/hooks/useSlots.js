import { useEffect, useState } from 'react';
import { getSlots } from '../api';

export default function useSlots(serviceId, date, reloadKey) {
  const [result, setResult] = useState({
    key: '',
    slots: [],
    message: '',
    openCount: 0,
    error: '',
  });

  const key = serviceId && date ? `${serviceId}|${date}|${reloadKey}` : '';

  useEffect(() => {
    if (!key) return undefined;

    const controller = new AbortController();
    let stale = false;

    getSlots(serviceId, date, controller.signal)
      .then((data) => {
        if (stale) return;
        setResult({
          key,
          slots: data.slots || [],
          message: data.message || '',
          openCount: data.openCount || 0,
          error: '',
        });
      })
      .catch((err) => {
        if (stale || err.name === 'AbortError') return;
        setResult({
          key,
          slots: [],
          message: '',
          openCount: 0,
          error: err.message,
        });
      });

    return () => {
      stale = true;
      controller.abort();
    };
  }, [key, serviceId, date]);

  const ready = result.key === key;

  return {
    slots: ready ? result.slots : [],
    message: ready ? result.message : '',
    openCount: ready ? result.openCount : 0,
    error: ready ? result.error : '',
    loading: Boolean(key) && !ready,
  };
}
