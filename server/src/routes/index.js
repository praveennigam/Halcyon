const express = require('express');
const appointmentController = require('../controllers/appointmentController');
const serviceController = require('../controllers/serviceController');
const slotController = require('../controllers/slotController');

const router = express.Router();

router.get('/health', (_req, res) => {
  res.json({ ok: true });
});

router.get('/services', serviceController.list);
router.get('/slots', slotController.list);
router.post('/appointments', appointmentController.create);
router.get('/appointments', appointmentController.list);
router.get('/admin/list', appointmentController.adminList);
router.get('/appointments/:id', appointmentController.getOne);
router.post('/appointments/:id/cancel', appointmentController.cancel);

router.use((_req, res) => {
  res.status(404).json({
    error: 'That route does not exist.',
    code: 'NOT_FOUND',
  });
});

module.exports = router;
