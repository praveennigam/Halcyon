import { useState } from 'react';

export default function EmailLookup({ onSubmit }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  function submit(event) {
    event.preventDefault();
    const email = value.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('That email does not look right.');
      return;
    }
    onSubmit(email);
  }

  return (
    <form onSubmit={submit} className="panel mt-8 w-full p-4 text-left sm:p-6" noValidate>
      <h2 className="font-serif text-2xl text-ink">Find your visits</h2>
      <p className="mt-2 text-sm leading-6 text-mute">
        Enter the email you booked with. Only those appointments are shown.
      </p>
      <label className="mt-5 block" htmlFor="lookup-email">
        <span className="mb-1.5 block text-sm font-medium text-ink">Email</span>
        <input
          id="lookup-email"
          type="email"
          autoComplete="email"
          inputMode="email"
          className="field-input"
          value={value}
          data-invalid={error ? 'true' : 'false'}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'lookup-email-error' : undefined}
          onChange={(event) => {
            setValue(event.target.value);
            setError('');
          }}
        />
        {error ? (
          <p id="lookup-email-error" className="mt-1.5 text-sm text-clay">{error}</p>
        ) : null}
      </label>
      <button type="submit" className="btn mt-5 w-full bg-pine text-white hover:bg-pine-dark">
        Show my appointments
      </button>
    </form>
  );
}
