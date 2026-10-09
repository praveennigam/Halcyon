import { useEffect, useState } from 'react';

const KEY = 'halcyon.email';

function readEmail() {
  try {
    return window.localStorage.getItem(KEY) || '';
  } catch (err) {
    return '';
  }
}

function writeEmail(email) {
  try {
    window.localStorage.setItem(KEY, email);
  } catch (err) {
    // Private browsing can block storage. The lookup form still works.
  }
}

export default function useSavedEmail() {
  const [email, setEmail] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setEmail(readEmail());
    setReady(true);
  }, []);

  function save(next) {
    const value = String(next || '').trim().toLowerCase();
    writeEmail(value);
    setEmail(value);
  }

  function clear() {
    try {
      window.localStorage.removeItem(KEY);
    } catch (err) {
      // The form is the fallback when storage is blocked.
    }
    setEmail('');
  }

  return { email, ready, save, clear };
}
