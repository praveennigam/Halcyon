import { useState } from 'react';
import { formatLongDate, formatPhone, formatRange } from '../format';
import CancelDialog from './CancelDialog';
import StatusPill from './StatusPill';

export default function AppointmentCard({ appointment, pending, onCancel }) {
  const [confirming, setConfirming] = useState(false);
  const busy = pending === appointment.id;

  return (
    <article className="panel overflow-hidden">
      <div className="flex items-center justify-between gap-2 border-b border-line/80 px-4 py-2.5 sm:px-5">
        <p className="font-mono text-xs tracking-wide text-mute">{appointment.reference}</p>
        <StatusPill status={appointment.status} />
      </div>

      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-end sm:justify-between sm:p-5">
        <div className="min-w-0">
          <h3 className="font-serif text-xl leading-none text-ink sm:text-2xl">{appointment.serviceName}</h3>
          <p className="mt-2 text-sm text-ink">{formatLongDate(appointment.date)}</p>
          <p className="text-sm font-bold text-pine-dark">
            {formatRange(appointment.startTime, appointment.endTime)} IST
          </p>
          <div className="mt-3 border-t border-line/80 pt-3">
            <p className="break-words text-sm font-medium text-ink">{appointment.customerName}</p>
            <p className="mt-0.5 break-all text-sm font-bold text-pine-dark">{appointment.email}</p>
            <p className="text-sm text-mute">+91 {formatPhone(appointment.phone)}</p>
          </div>
        </div>

        {appointment.canCancel ? (
          <button
            type="button"
            className="btn w-full shrink-0 bg-white text-clay ring-1 ring-inset ring-clay/30 hover:bg-red-50 sm:w-auto"
            onClick={() => setConfirming(true)}
            disabled={busy}
          >
            Cancel
          </button>
        ) : null}
      </div>

      {confirming ? (
        <CancelDialog
          busy={busy}
          onKeep={() => {
            if (!busy) setConfirming(false);
          }}
          onConfirm={async () => {
            const cancelled = await onCancel(appointment.id);
            if (cancelled) setConfirming(false);
          }}
        />
      ) : null}
    </article>
  );
}
