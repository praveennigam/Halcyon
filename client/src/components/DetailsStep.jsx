import { useState } from 'react';
import { hasErrors, tidyCustomer, validateCustomer } from '../validate';
import BookingRecap from './BookingRecap';
import Field from './Field';
import StepHeading from './StepHeading';

const EMPTY_ERRORS = { name: '', email: '', phone: '' };

export default function DetailsStep({ service, date, slot, customer, onChange, onBack, onSubmit }) {
  const [errors, setErrors] = useState(EMPTY_ERRORS);
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    onChange({ ...customer, [field]: value });
    setErrors((current) => ({ ...current, [field]: '' }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const tidy = tidyCustomer(customer);
    const nextErrors = validateCustomer(tidy);
    onChange(tidy);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;

    setSubmitting(true);
    const result = await onSubmit(tidy);
    if (!result.ok) {
      setErrors((current) => ({
        name: result.fields.name || current.name,
        email: result.fields.email || current.email,
        phone: result.fields.phone || current.phone,
      }));
      setSubmitting(false);
    }
  }

  return (
    <form id="booking-details" onSubmit={handleSubmit} noValidate>
      <StepHeading eyebrow="Step 3 of 3" title="Your details" />
      <BookingRecap service={service} date={date} slot={slot} onEdit={onBack} />
      <div className="space-y-4">
        <Field id="customer-name" label="Name" error={errors.name}>
          <input
            id="customer-name"
            className="field-input"
            autoComplete="name"
            maxLength={80}
            value={customer.name}
            data-invalid={errors.name ? 'true' : 'false'}
            aria-invalid={errors.name ? 'true' : 'false'}
            aria-describedby={errors.name ? 'customer-name-error' : undefined}
            onChange={(event) => update('name', event.target.value)}
          />
        </Field>
        <Field id="customer-email" label="Email" error={errors.email}>
          <input
            id="customer-email"
            type="email"
            className="field-input"
            autoComplete="email"
            inputMode="email"
            maxLength={120}
            value={customer.email}
            data-invalid={errors.email ? 'true' : 'false'}
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'customer-email-error' : undefined}
            onChange={(event) => update('email', event.target.value)}
          />
        </Field>
        <Field id="customer-phone" label="Mobile" hint="10-digit Indian mobile number." error={errors.phone}>
          <div className="flex">
            <span className="inline-flex items-center rounded-l-xl border border-r-0 border-line bg-[#f7f4ee] px-3 text-sm text-mute">
              +91
            </span>
            <input
              id="customer-phone"
              type="tel"
              className="field-input rounded-l-none"
              autoComplete="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="98765 43210"
              value={customer.phone}
              data-invalid={errors.phone ? 'true' : 'false'}
              aria-invalid={errors.phone ? 'true' : 'false'}
              aria-describedby={errors.phone ? 'customer-phone-error' : 'customer-phone-hint'}
              onChange={(event) => update('phone', event.target.value.replace(/\D/g, '').slice(0, 10))}
            />
          </div>
        </Field>
      </div>
      <div className="mt-8 flex flex-col-reverse gap-2 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
        <button type="button" className="btn w-full text-ink hover:bg-black/5 min-[420px]:w-auto" onClick={onBack} disabled={submitting}>
          Back
        </button>
        <button type="submit" className="btn w-full bg-pine text-white hover:bg-pine-dark min-[420px]:w-auto" disabled={submitting}>
          {submitting ? 'Booking…' : 'Confirm booking'}
        </button>
      </div>
    </form>
  );
}
