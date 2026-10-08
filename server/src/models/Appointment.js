const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    reference: { type: String, required: true, unique: true },
    serviceId: {
      type: String,
      required: true,
      enum: ['consultation', 'demo', 'support'],
    },
    serviceName: { type: String, required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    customerName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
    },
    cancelledAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// One confirmed visit per service, date, and start time.
// Cancelled rows stay in the collection but drop out of this index,
// which is what opens the slot again.
appointmentSchema.index(
  { serviceId: 1, date: 1, startTime: 1 },
  {
    unique: true,
    partialFilterExpression: { status: 'confirmed' },
  }
);

appointmentSchema.index({ email: 1, date: 1 });

appointmentSchema.set('toJSON', {
  versionKey: false,
  transform(_doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});

module.exports = mongoose.model('Appointment', appointmentSchema);
