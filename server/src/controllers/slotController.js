const { asyncHandler } = require('../utils/asyncHandler');
const { formatRange } = require('../utils/format');
const { DAY_CLOSE, DAY_OPEN, kolkataNow, SLOT_MINUTES, TIMEZONE } = require('../utils/time');
const { getAvailability } = require('../services/availability');
const { parseSlotQuery } = require('../validation/queries');

const list = asyncHandler(async (req, res) => {
  const now = kolkataNow();
  const { service, date } = parseSlotQuery(req.query, now);
  const availability = await getAvailability(service.id, date, now);

  res.json({
    service,
    date,
    timezone: TIMEZONE,
    hours: {
      open: DAY_OPEN,
      close: DAY_CLOSE,
      intervalMinutes: SLOT_MINUTES,
    },
    openCount: availability.openCount,
    fullyBooked: availability.fullyBooked,
    dayClosed: availability.dayClosed,
    message: availability.message,
    slots: availability.slots.map((slot) => ({
      ...slot,
      label: formatRange(slot.startTime, slot.endTime),
    })),
  });
});

module.exports = { list };
