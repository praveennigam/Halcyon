import { Link } from 'react-router-dom';
import { useState } from 'react';
import { formatLongDate, formatPhone, formatRange } from '../format';
import { useToast } from './Providers';

export default function ConfirmationPanel({ appointment, onBookAnother }) {
  const toast = useToast();
  const [copied, setCopied] = useState(false);
  const when = formatRange(appointment.startTime, appointment.endTime);

  async function copyReference() {
    try {
      await navigator.clipboard.writeText(appointment.reference);
      setCopied(true);
    } catch (err) {
      toast.error('Could not copy the reference.');
    }
  }

  return (
    <section className="mx-auto max-w-xl">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-pine">Confirmed</p>
      <h1 className="mt-2 font-serif text-[1.75rem] leading-tight text-ink sm:text-4xl lg:text-5xl">You&apos;re booked.</h1>
      <p className="mt-3 break-words text-base leading-7 text-mute">Your visit is booked. Keep the reference below.</p>

      <div className="panel mt-6 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-mute">Reference</p>
            <p className="mt-1 font-mono text-lg tracking-wide text-ink">{appointment.reference}</p>
          </div>
          <button type="button" className="text-sm text-pine" onClick={copyReference}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-4">
            <dt className="text-mute">Service</dt>
            <dd className="break-words text-ink sm:text-right">{appointment.serviceName}</dd>
          </div>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-4">
            <dt className="text-mute">When</dt>
            <dd className="break-words text-ink sm:text-right">{formatLongDate(appointment.date)}</dd>
          </div>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-4">
            <dt className="text-mute">Time</dt>
            <dd className="break-words text-ink sm:text-right">{when} IST</dd>
          </div>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-4">
            <dt className="text-mute">Name</dt>
            <dd className="break-words text-ink sm:text-right">{appointment.customerName}</dd>
          </div>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-4">
            <dt className="text-mute">Mobile</dt>
            <dd className="break-words text-ink sm:text-right">+91 {formatPhone(appointment.phone)}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button type="button" className="btn w-full bg-pine text-white hover:bg-pine-dark sm:w-auto" onClick={onBookAnother}>
          Book another
        </button>
        <Link to="/appointments" className="btn w-full bg-white text-ink ring-1 ring-line hover:bg-black/5 sm:w-auto">
          View appointments
        </Link>
      </div>
    </section>
  );
}
