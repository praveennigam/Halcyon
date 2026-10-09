const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const { getService } = require('../data/services');
const { parseBooking } = require('../validation/booking');
const { HttpError } = require('../utils/httpError');
const { makeReference } = require('../utils/reference');
const { endTimeFor, hasEnded, isPastSlot, kolkataNow } = require('../utils/time');

function present(doc, now = kolkataNow()) {
  const appointment = doc.toJSON();
  const ended = hasEnded(appointment.date, appointment.endTime, now);
  const phase = appointment.status === 'confirmed' && !ended ? 'upcoming' : 'closed';
  return {
    ...appointment,
    phase,
    canCancel: appointment.status === 'confirmed',
  };
}

function isDuplicateKey(err) {
  return Boolean(err && (err.code === 11000 || err.cause?.code === 11000));
}

function isReferenceClash(err) {
  const pattern = err.keyPattern || err.cause?.keyPattern || {};
  if (pattern.reference) return true;
  const text = `${err.message || ''} ${err.cause?.message || ''}`;
  return text.includes('reference');
}

async function insertOnce(payload) {
  try {
    return await Appointment.create(payload);
  } catch (err) {
    if (!isDuplicateKey(err)) throw err;
    if (isReferenceClash(err)) return null;
    throw new HttpError(409, 'That time was just booked. Please choose another.', 'SLOT_TAKEN');
  }
}

async function insertAppointment(payload) {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const doc = await insertOnce({ ...payload, reference: makeReference() });
    if (doc) return doc;
  }
  throw new HttpError(500, 'We could not finish the booking. Please try again.', 'SERVER_ERROR');
}

async function createAppointment(payload, options = {}) {
  const now = options.now || kolkataNow();
  const input = parseBooking(payload, now);
  const service = getService(input.serviceId);

  if (isPastSlot(input.date, input.startTime, now)) {
    throw new HttpError(400, 'That time has already passed.', 'SLOT_PAST');
  }

  const taken = await Appointment.exists({
    serviceId: input.serviceId,
    date: input.date,
    startTime: input.startTime,
    status: 'confirmed',
  });

  if (taken) {
    throw new HttpError(409, 'That time was just booked. Please choose another.', 'SLOT_TAKEN');
  }

  // Two requests can both pass the check above. The unique index
  // is what lets only one of them insert.
  const appointment = await insertAppointment({
    serviceId: service.id,
    serviceName: service.name,
    date: input.date,
    startTime: input.startTime,
    endTime: endTimeFor(input.startTime),
    customerName: input.customerName,
    email: input.email,
    phone: input.phone,
    status: 'confirmed',
  });

  return { appointment: present(appointment, now) };
}

async function listAdminAppointments(query, options = {}) {
  const now = options.now || kolkataNow();
  const { filter, page, limit, sort } = query;
  const [total, docs] = await Promise.all([
    Appointment.countDocuments(filter),
    Appointment.find(filter).sort(sort).skip((page - 1) * limit).limit(limit),
  ]);

  return {
    appointments: docs.map((doc) => present(doc, now)),
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
  };
}

async function listAppointments(filter, options = {}) {
  const now = options.now || kolkataNow();
  const docs = await Appointment.find(filter);
  return docs
    .map((doc) => present(doc, now))
    .sort((a, b) => {
      if (a.phase !== b.phase) return a.phase === 'upcoming' ? -1 : 1;
      if (a.date !== b.date) return a.date < b.date ? -1 : 1;
      return a.startTime < b.startTime ? -1 : 1;
    });
}

function bookedEmail(value) {
  const email = String(value || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new HttpError(400, 'Enter the email you booked with.', 'INVALID_INPUT');
  }
  return email;
}

async function getAppointment(id, options = {}) {
  const email = bookedEmail(options.email);
  if (!mongoose.isValidObjectId(id)) {
    throw new HttpError(404, 'We could not find that appointment.', 'NOT_FOUND');
  }
  const doc = await Appointment.findOne({ _id: id, email });
  if (!doc) {
    throw new HttpError(404, 'We could not find that appointment.', 'NOT_FOUND');
  }
  return present(doc, options.now || kolkataNow());
}

async function cancelAppointment(id, options = {}) {
  const now = options.now || kolkataNow();
  const email = bookedEmail(options.email);

  if (!mongoose.isValidObjectId(id)) {
    throw new HttpError(404, 'We could not find that appointment.', 'NOT_FOUND');
  }

  const updated = await Appointment.findOneAndUpdate(
    { _id: id, status: 'confirmed', email },
    { $set: { status: 'cancelled', cancelledAt: new Date() } },
    { new: true }
  );

  if (!updated) {
    const existing = await Appointment.findOne({ _id: id, email });
    if (!existing) {
      throw new HttpError(404, 'We could not find that appointment.', 'NOT_FOUND');
    }
    throw new HttpError(409, 'This appointment is already cancelled.', 'ALREADY_CANCELLED');
  }

  return { appointment: present(updated, now) };
}

module.exports = {
  createAppointment,
  listAppointments,
  listAdminAppointments,
  getAppointment,
  cancelAppointment,
  present,
};
