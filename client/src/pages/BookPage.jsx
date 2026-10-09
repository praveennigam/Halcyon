import { useEffect } from 'react';
import BookingFlow from '../components/BookingFlow';

export default function BookPage() {
  useEffect(() => {
    document.title = 'Book a time · Halcyon';
  }, []);

  return (
    <main id="main" className="mx-auto w-full max-w-6xl px-3 pb-12 pt-6 sm:px-6 sm:pb-16 sm:pt-8">
      <BookingFlow />
    </main>
  );
}
