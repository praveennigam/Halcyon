const { getService } = require('../data/services');
const { HttpError } = require('../utils/httpError');
const { dateProblem, isRealDate } = require('../utils/time');

function parseSlotQuery(query, now) {
  const service = getService(query.serviceId);
  if (!service) {
    throw new HttpError(400, 'Choose a consultation, demo, or support visit.', 'INVALID_INPUT');
  }

  const problem = dateProblem(query.date, now);
  if (problem) {
    throw new HttpError(400, problem, 'INVALID_INPUT', { date: problem });
  }

  return { service, date: query.date };
}

const ADMIN_SORTS = ['date', 'startTime', 'createdAt', 'customerName', 'reference', 'status', 'email'];

function optionalEmail(value) {
  const email = String(value || '').trim().toLowerCase();
  if (!email) return '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new HttpError(400, 'That email does not look right.', 'INVALID_INPUT');
  }
  return email;
}

function visitFilters(query) {
  const filter = {};

  if (query.serviceId) {
    if (!getService(query.serviceId)) {
      throw new HttpError(400, 'Unknown service.', 'INVALID_INPUT');
    }
    filter.serviceId = String(query.serviceId);
  }

  if (query.status) {
    if (!['confirmed', 'cancelled'].includes(query.status)) {
      throw new HttpError(400, 'Status must be confirmed or cancelled.', 'INVALID_INPUT');
    }
    filter.status = query.status;
  }

  if (query.date) {
    if (!isRealDate(query.date)) {
      throw new HttpError(400, 'Choose a valid date.', 'INVALID_INPUT');
    }
    filter.date = query.date;
  }

  return filter;
}

function parseListQuery(query) {
  const email = optionalEmail(query.email);
  if (!email) {
    throw new HttpError(400, 'Enter the email you booked with.', 'INVALID_INPUT');
  }
  return { email, ...visitFilters(query) };
}

function wholeNumber(value, fallback, label) {
  if (value === undefined || value === '') return fallback;
  const number = Number(value);
  if (!Number.isInteger(number)) {
    throw new HttpError(400, `${label} must be a whole number.`, 'INVALID_INPUT');
  }
  return number;
}

function parseAdminListQuery(query) {
  const filter = visitFilters(query);
  const email = optionalEmail(query.email);
  if (email) filter.email = email;

  const search = String(query.q || '').trim();
  if (search) {
    if (search.length > 80) {
      throw new HttpError(400, 'Search must be 80 characters or fewer.', 'INVALID_INPUT');
    }
    const pattern = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [
      { customerName: pattern },
      { email: pattern },
      { reference: pattern },
      { phone: pattern },
    ];
  }

  const page = wholeNumber(query.page, 1, 'Page');
  const limit = wholeNumber(query.limit, 10, 'Limit');
  if (page < 1) throw new HttpError(400, 'Page must be 1 or more.', 'INVALID_INPUT');
  if (limit < 1 || limit > 50) {
    throw new HttpError(400, 'Limit must be from 1 to 50.', 'INVALID_INPUT');
  }

  const sortBy = query.sort || 'createdAt';
  if (!ADMIN_SORTS.includes(sortBy)) {
    throw new HttpError(400, 'Sort by date, startTime, createdAt, customerName, reference, status, or email.', 'INVALID_INPUT');
  }

  const order = query.order || 'desc';
  if (!['asc', 'desc'].includes(order)) {
    throw new HttpError(400, 'Order must be asc or desc.', 'INVALID_INPUT');
  }

  const direction = order === 'asc' ? 1 : -1;
  let sort = { [sortBy]: direction, _id: 1 };
  if (sortBy === 'date') sort = { date: direction, startTime: direction, _id: 1 };
  if (sortBy === 'startTime') sort = { startTime: direction, date: direction, _id: 1 };

  return { filter, page, limit, sort };
}

module.exports = { parseSlotQuery, parseListQuery, parseAdminListQuery };
