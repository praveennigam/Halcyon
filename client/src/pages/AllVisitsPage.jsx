import { useEffect } from 'react';
import AdminList from '../components/AdminList';

export default function AllVisitsPage() {
  useEffect(() => {
    document.title = 'All visits · Halcyon';
  }, []);

  return (
    <main id="main" className="mx-auto w-full max-w-6xl px-3 pb-12 pt-6 sm:px-6 sm:pb-16 sm:pt-8">
      <AdminList />
    </main>
  );
}
