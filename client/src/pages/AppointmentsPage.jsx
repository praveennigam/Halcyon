import { useEffect } from 'react';
import AppointmentsBoard from '../components/AppointmentsBoard';

export default function AppointmentsPage() {
  useEffect(() => {
    document.title = 'Appointments · Halcyon';
  }, []);

  return (
    <main id="main" className="mx-auto w-full max-w-6xl px-3 pb-12 pt-6 sm:px-6 sm:pb-16 sm:pt-8">
      <AppointmentsBoard />
    </main>
  );
}
