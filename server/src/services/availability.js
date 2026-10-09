const Appointment = require('../models/Appointment');
const { buildDaySlots, isPastSlot } = require('../utils/time');

function applyAvailability(date, takenStarts, now) {
  const slots = buildDaySlots().map((slot) => {
    let state = 'open';
    if (isPastSlot(date, slot.startTime, now)) state = 'past';
    else if (takenStarts.has(slot.startTime)) state = 'booked';
    return { ...slot, state };
  });

  const openCount = slots.filter((slot) => slot.state === 'open').length;
  const upcomingCount = slots.filter((slot) => slot.state !== 'past').length;

  return {
    slots,
    openCount,
    fullyBooked: upcomingCount > 0 && openCount === 0,
    dayClosed: upcomingCount === 0,
  };
}

function availabilityMessage(availability) {
  if (availability.dayClosed) {
    return "Today's schedule has finished. Please pick another date.";
  }
  if (availability.fullyBooked) {
    return 'This day is fully booked. Please try another date.';
  }
  return '';
}

async function getAvailability(serviceId, date, now) {
  const bookings = await Appointment.find({
    serviceId,
    date,
    status: 'confirmed',
  }).select('startTime').lean();

  const taken = new Set(bookings.map((booking) => booking.startTime));
  const availability = applyAvailability(date, taken, now);
  return {
    ...availability,
    message: availabilityMessage(availability),
  };
}

module.exports = { applyAvailability, availabilityMessage, getAvailability };
