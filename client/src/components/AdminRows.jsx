import { formatLongDate, formatPhone, formatRange } from '../format';
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

function When({ appointment }) {
  return (
    <>
      <span className="block text-ink">{formatLongDate(appointment.date)}</span>
      <span className="block text-mute">{formatRange(appointment.startTime, appointment.endTime)} IST</span>
    </>
  );
}

export default function AdminRows({ appointments, sort, order, onSort }) {
  if (!appointments.length) return null;

  return (
    <>
      <div className="panel mt-4 hidden overflow-hidden md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-white/70 text-xs">
            <tr>
              {COLUMNS.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className="px-4 py-3 font-medium"
                  aria-sort={sort === column.key ? (order === 'asc' ? 'ascending' : 'descending') : 'none'}
                >
                  <SortButton column={column} sort={sort} order={order} onSort={onSort} />
                </th>
              ))}
              <th scope="col" className="px-4 py-3 font-medium text-mute">Service</th>
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
          </li>
        ))}
      </ul>
    </>
  );
}
