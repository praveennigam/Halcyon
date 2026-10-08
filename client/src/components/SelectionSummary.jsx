import { formatLongDate, formatRange } from '../format';

function Line({ label, value }) {
  return (
    <div>
      <dt className="text-xs text-mute">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-pine-dark">{value}</dd>
    </div>
  );
}

export default function SelectionSummary({ service, date, slot }) {
  const time = slot ? (slot.label || formatRange(slot.startTime, slot.endTime)) : '';

  return (
    <aside className="panel h-fit p-5 lg:sticky lg:top-24">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-mute">Your visit</p>
      <dl className="mt-4 space-y-4">
        <Line label="Service" value={service ? service.name : 'Not chosen yet'} />
        <Line label="Date" value={date ? formatLongDate(date) : 'Not chosen yet'} />
        <Line label="Time" value={time ? `${time} IST` : 'Not chosen yet'} />
      </dl>
      <p className="mt-6 border-t border-line pt-4 text-sm leading-6 text-mute">
        Open every day, 10:00 AM to 6:00 PM IST. Each visit is half an hour, and a cancelled visit frees the slot.
      </p>
    </aside>
  );
}
