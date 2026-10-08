import { formatLongDate, formatRange } from '../format';

export default function BookingRecap({ service, date, slot, onEdit }) {
  const when = slot.label || formatRange(slot.startTime, slot.endTime);

  return (
    <div className="mb-6 rounded-2xl border border-line bg-white px-4 py-3 text-sm">
      <p className="font-medium text-ink">{service.name}</p>
      <p className="mt-1 text-mute">{formatLongDate(date)}</p>
      <p className="text-mute">{when} IST</p>
      <button type="button" onClick={onEdit} className="mt-2 text-pine hover:underline">
        Change time
      </button>
    </div>
  );
}
