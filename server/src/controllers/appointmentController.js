const { asyncHandler } = require('../utils/asyncHandler');
const {
  cancelAppointment,
  createAppointment,
  getAppointment,
  listAdminAppointments,
  listAppointments,
} = require('../services/appointments');
const { parseAdminListQuery, parseListQuery } = require('../validation/queries');

const create = asyncHandler(async (req, res) => {
  const result = await createAppointment(req.body);
  res.status(201).json(result);
});

const list = asyncHandler(async (req, res) => {
  const appointments = await listAppointments(parseListQuery(req.query));
  res.json({ appointments });
});

const adminList = asyncHandler(async (req, res) => {
  const result = await listAdminAppointments(parseAdminListQuery(req.query));
  res.json(result);
});

const getOne = asyncHandler(async (req, res) => {
  const appointment = await getAppointment(req.params.id, { email: req.query.email });
  res.json({ appointment });
});

const cancel = asyncHandler(async (req, res) => {
  const result = await cancelAppointment(req.params.id, { email: req.body && req.body.email });
  res.json(result);
});

module.exports = { create, list, adminList, getOne, cancel };
