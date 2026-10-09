function clockParts(hhmm) {
  const [hourStr, minute] = hhmm.split(':');
  let hour = Number(hourStr);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  hour %= 12;
  if (hour === 0) hour = 12;
  return { hour, minute, suffix };
}

function formatClock(hhmm) {
  const parts = clockParts(hhmm);
  return `${parts.hour}:${parts.minute} ${parts.suffix}`;
}

function formatRange(start, end) {
  const from = clockParts(start);
  const to = clockParts(end);
  if (from.suffix === to.suffix) {
    return `${from.hour}:${from.minute} – ${to.hour}:${to.minute} ${to.suffix}`;
  }
  return `${formatClock(start)} – ${formatClock(end)}`;
}

function dateFromISO(iso) {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function formatLongDate(iso) {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(dateFromISO(iso));
}

function formatShortDate(iso) {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  }).format(dateFromISO(iso));
}

function formatPhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (digits.length !== 10) return String(phone || '');
  return `${digits.slice(0, 5)} ${digits.slice(5)}`;
}

module.exports = {
  formatClock,
  formatRange,
  formatLongDate,
  formatShortDate,
  formatPhone,
};
