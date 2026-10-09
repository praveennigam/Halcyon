import { useState } from 'react';
import { formatLongDate, formatPhone, formatRange } from '../format';
import CancelDialog from './CancelDialog';
import StatusPill from './StatusPill';

const COLUMNS = [
  { key: 'reference', label: 'Reference' },
  { key: 'customerName', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'date', label: 'When' },
  { key: 'status', label: 'Status' },
];

function SortButton({ column, sort, order, onSort }) {
  const active = sort === column.key;
  const arrow = active ? (order === 'asc' ? '↑' : '↓') : '';
  return (
    <button
      type="button"
      className={`inline-flex items-center gap-1 ${active ? 'text-ink' : 'text-mute hover:text-ink'}`}
      onClick={() => onSort(column.key)}
    >
      {column.label}
      <span aria-hidden="true" className="w-3 text-xs">{arrow}</span>
    </button>
  );
}

function CancelIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  );
}

function CancelMark({ appointment, pending, onCancel, wide = false }) {
  const [confirming, setConfirming] = useState(false);
  const busy = pending === appointment.id;

  if (!appointment.canCancel) {
    if (wide) return null;
    return <span className="inline-block h-8 w-8" />;
  }

  return (
    <>
      <button
        type="button"
        aria-label={`Cancel ${appointment.reference}`}
        className={wide
          ? 'btn mt-4 w-full gap-2 bg-[#fdf6f4] py-3 text-[15px] text-clay ring-1 ring-inset ring-clay/25 hover:bg-[#f8ebe7] disabled:opacity-50'
          : 'grid h-8 w-8 place-items-center rounded-full text-clay ring-1 ring-clay/30 hover:bg-[#fdf6f4] disabled:opacity-50'}
        onClick={() => setConfirming(true)}
        disabled={busy}
      >
        <CancelIcon />
        {wide ? 'Cancel appointment' : null}
      </button>
      {confirming ? (
        <CancelDialog
          busy={busy}
          onKeep={() => {
            if (!busy) setConfirming(false);
          }}
          onConfirm={async () => {
            const cancelled = await onCancel(appointment);
            if (cancelled) setConfirming(false);
          }}
        />
      ) : null}
    </>
  );
}

function When({ appointment }) {
  return (
    <>
      <span className="block text-ink">{formatLongDate(appointment.date)}</span>
      <span className="block text-mute">{formatRange(appointment.startTime, appointment.endTime)} IST</span>
    </>
  );
}

export default function AdminRows({ appointments, sort, order, onSort, pending, onCancel }) {
  if (!appointments.length) return null;

  return (
    <>
      <div className="panel mt-4 hidden overflow-x-auto md:block">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-line bg-white/70 text-xs">
            <tr>
              {COLUMNS.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className="whitespace-nowrap px-4 py-3 font-medium"
                  aria-sort={sort === column.key ? (order === 'asc' ? 'ascending' : 'descending') : 'none'}
                >
                  <SortButton column={column} sort={sort} order={order} onSort={onSort} />
                </th>
              ))}
              <th scope="col" className="whitespace-nowrap px-4 py-3 font-medium text-mute">Service</th>
              <th scope="col" className="whitespace-nowrap px-3 py-3 text-center font-medium text-mute">Cancel</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id} className="border-b border-line/80 last:border-0">
                <td className="px-4 py-3 font-mono text-xs text-mute">{appointment.reference}</td>
                <td className="px-4 py-3">
                  <span className="block text-ink">{appointment.customerName}</span>
                  <span className="block text-mute">+91 {formatPhone(appointment.phone)}</span>
                </td>
                <td className="max-w-[14rem] break-all px-4 py-3 text-ink">{appointment.email}</td>
                <td className="px-4 py-3"><When appointment={appointment} /></td>
                <td className="px-4 py-3"><StatusPill status={appointment.status} /></td>
                <td className="px-4 py-3 text-ink">{appointment.serviceName}</td>
                <td className="px-3 py-3 text-center">
                  <CancelMark appointment={appointment} pending={pending} onCancel={onCancel} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="mt-4 space-y-3 md:hidden">
        {appointments.map((appointment) => (
          <li key={appointment.id} className="panel p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-mono text-xs text-mute">{appointment.reference}</p>
              <StatusPill status={appointment.status} />
            </div>
            <p className="mt-3 font-serif text-[1.35rem] leading-tight text-ink">{appointment.customerName}</p>
            <p className="mt-1 break-all text-sm text-mute">{appointment.email}</p>
            <p className="text-sm text-mute">+91 {formatPhone(appointment.phone)}</p>
            <div className="mt-3 border-t border-line/80 pt-3 text-sm">
              <p className="text-ink">{appointment.serviceName}</p>
              <When appointment={appointment} />
            </div>
            <CancelMark wide appointment={appointment} pending={pending} onCancel={onCancel} />
          </li>
        ))}
      </ul>
    </>
  );
}
