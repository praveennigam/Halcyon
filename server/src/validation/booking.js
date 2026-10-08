const { z } = require('zod');
const { HttpError } = require('../utils/httpError');
const { dateProblem, isSlotStart } = require('../utils/time');

function normalizePhone(input) {
  const digits = String(input || '').replace(/\D/g, '');
  let local = digits;
  if (digits.length === 12 && digits.startsWith('91')) local = digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) local = digits.slice(1);
  if (!/^[6-9]\d{9}$/.test(local)) return '';
  return local;
}

function cleanName(input) {
  return String(input || '').replace(/\s+/g, ' ').trim();
}

const FIELD_LABELS = {
  serviceId: 'Service',
  date: 'Date',
  startTime: 'Time',
  customerName: 'Name',
  email: 'Email',
  phone: 'Mobile number',
};

function issueMessage(issue) {
  const key = issue.path[0];
  if (issue.code === 'invalid_type') {
    const label = FIELD_LABELS[key] || 'A field';
    return `${label} is missing or in the wrong format.`;
  }
  return issue.message;
}

function parseBooking(body, now) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new HttpError(400, 'Send the booking details as JSON.', 'INVALID_INPUT');
  }

  const schema = z.object({
    serviceId: z.enum(['consultation', 'demo', 'support'], {
      errorMap: () => ({ message: 'Choose a consultation, demo, or support visit.' }),
    }),
    date: z
      .string({ required_error: 'Choose a date.' })
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose a valid date.')
      .superRefine((value, ctx) => {
        const problem = dateProblem(value, now);
        if (problem) ctx.addIssue({ code: 'custom', message: problem });
      }),
    startTime: z
      .string({ required_error: 'Choose a time.' })
      .regex(/^\d{2}:\d{2}$/, 'Choose a valid time.')
      .superRefine((value, ctx) => {
        if (!isSlotStart(value)) {
          ctx.addIssue({
            code: 'custom',
            message: 'Choose a 30-minute time between 10:00 AM and 6:00 PM.',
          });
        }
      }),
    customerName: z
      .string({ required_error: 'Please enter your name.' })
      .trim()
      .min(2, 'Name looks too short.')
      .max(80, 'Name is too long.')
      .superRefine((value, ctx) => {
        if (!/^[A-Za-z][A-Za-z .'-]*$/.test(cleanName(value))) {
          ctx.addIssue({ code: 'custom', message: 'Use letters in your name.' });
        }
      }),
    email: z
      .string({ required_error: 'Please enter your email.' })
      .trim()
      .email('That email does not look right.')
      .max(120, 'Email is too long.'),
    phone: z
      .string({ required_error: 'Enter a mobile number.' })
      .trim()
      .min(1, 'Enter a mobile number.')
      .superRefine((value, ctx) => {
        if (!normalizePhone(value)) {
          ctx.addIssue({ code: 'custom', message: 'Enter a 10-digit mobile number.' });
        }
      }),
  });

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const fields = {};
    parsed.error.issues.forEach((issue) => {
      const key = issue.path[0];
      if (key && !fields[key]) fields[key] = issueMessage(issue);
    });
    const message = Object.values(fields)[0] || 'Please check the form.';
    throw new HttpError(400, message, 'INVALID_INPUT', fields);
  }

  return {
    serviceId: parsed.data.serviceId,
    date: parsed.data.date,
    startTime: parsed.data.startTime,
    customerName: cleanName(parsed.data.customerName),
    email: parsed.data.email.trim().toLowerCase(),
    phone: normalizePhone(parsed.data.phone),
  };
}

module.exports = { parseBooking, normalizePhone, cleanName };
