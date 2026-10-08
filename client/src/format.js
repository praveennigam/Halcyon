const INDIA = 'Asia/Kolkata';

function utcDate(iso) {
  return new Date(`${iso}T00:00:00Z`);
}

export function todayISO() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: INDIA }).format(new Date());
}

export function addDaysISO(iso, days) {
  const date = utcDate(iso);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function formatLongDate(iso) {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(utcDate(iso));
}

function to12Hour(hhmm) {
  const [hourText, minute] = hhmm.split(':');
  let hour = Number(hourText);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${suffix}`;
}

export function formatRange(start, end) {
  const from = to12Hour(start);
  const to = to12Hour(end);
  if (from.endsWith(to.slice(-2))) return `${from.slice(0, -3)} – ${to}`;
  return `${from} – ${to}`;
}

export function formatPhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (digits.length !== 10) return String(phone || '');
  return `${digits.slice(0, 5)} ${digits.slice(5)}`;
}
