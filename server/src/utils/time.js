const TIMEZONE = 'Asia/Kolkata';
const DAY_OPEN_MINUTES = 10 * 60;
const DAY_CLOSE_MINUTES = 18 * 60;
const SLOT_MINUTES = 30;
const WINDOW_DAYS = 60;

const DAY_OPEN = '10:00';
const DAY_CLOSE = '18:00';

function pad(value) {
  return String(value).padStart(2, '0');
}

function minutesToTime(total) {
  const hour = Math.floor(total / 60);
  const minute = total % 60;
  return `${pad(hour)}:${pad(minute)}`;
}

function timeToMinutes(hhmm) {
  const [hour, minute] = hhmm.split(':').map(Number);
  return hour * 60 + minute;
}

function buildDaySlots() {
  const slots = [];
  for (let minute = DAY_OPEN_MINUTES; minute < DAY_CLOSE_MINUTES; minute += SLOT_MINUTES) {
    slots.push({
      startTime: minutesToTime(minute),
      endTime: minutesToTime(minute + SLOT_MINUTES),
    });
  }
  return slots;
}

const SLOT_STARTS = new Set(buildDaySlots().map((slot) => slot.startTime));

function isSlotStart(value) {
  return SLOT_STARTS.has(value);
}

function endTimeFor(startTime) {
  return minutesToTime(timeToMinutes(startTime) + SLOT_MINUTES);
}

function kolkataNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);

  const pick = (type) => parts.find((part) => part.type === type).value;
  let hour = Number(pick('hour'));
  if (hour === 24) hour = 0;
  const minute = Number(pick('minute'));

  return {
    isoDate: `${pick('year')}-${pick('month')}-${pick('day')}`,
    minutes: hour * 60 + minute,
  };
}

function isRealDate(iso) {
  if (typeof iso !== 'string') return false;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
}

function addDaysISO(iso, days) {
  const [year, month, day] = iso.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function dateProblem(iso, now = kolkataNow()) {
  if (!isRealDate(iso)) return 'Choose a valid date.';
  if (iso < now.isoDate) return 'That date has already passed.';
  if (iso > addDaysISO(now.isoDate, WINDOW_DAYS)) {
    return 'You can book up to 60 days ahead.';
  }
  return '';
}

function isPastSlot(date, startTime, now = kolkataNow()) {
  if (date < now.isoDate) return true;
  if (date > now.isoDate) return false;
  return timeToMinutes(startTime) <= now.minutes;
}

function hasEnded(date, endTime, now = kolkataNow()) {
  if (date < now.isoDate) return true;
  if (date > now.isoDate) return false;
  return timeToMinutes(endTime) <= now.minutes;
}

module.exports = {
  TIMEZONE,
  DAY_OPEN,
  DAY_CLOSE,
  SLOT_MINUTES,
  WINDOW_DAYS,
  buildDaySlots,
  isSlotStart,
  endTimeFor,
  kolkataNow,
  isRealDate,
  addDaysISO,
  dateProblem,
  isPastSlot,
  hasEnded,
};
