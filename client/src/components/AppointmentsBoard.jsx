import { Link } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cancelAppointment, getAppointments } from '../api';
import useSavedEmail from '../hooks/useSavedEmail';
import AppointmentCard from './AppointmentCard';
import EmailLookup from './EmailLookup';
import Notice from './Notice';
import Spinner from './Spinner';
import { useToast } from './Providers';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'consultation', label: 'Consultation' },
  { id: 'demo', label: 'Demo' },
  { id: 'support', label: 'Support' },
];

function matchesQuery(appointment, query) {
  if (!query) return true;
  const haystack = [
    appointment.reference,
    appointment.serviceName,
  ].join(' ').toLowerCase();
  return haystack.includes(query);
}

function Group({ title, items, pending, onCancel }) {
  if (!items.length) return null;
  return (
    <section className="mt-8">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-serif text-lg leading-none text-ink sm:text-xl">{title}</h2>
        <span className="rounded-full bg-card px-2.5 py-1 text-xs text-mute ring-1 ring-line">
          {items.length}
        </span>
      </div>
      <div className="mt-3 space-y-3">
        {items.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            pending={pending}
            onCancel={onCancel}
          />
        ))}
      </div>
    </section>
  );
}

export default function AppointmentsBoard() {
  const toast = useToast();
  const { email, ready, save, clear } = useSavedEmail();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [serviceId, setServiceId] = useState('all');
  const [pending, setPending] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [held, setHeld] = useState(false);
  const requestId = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => setHeld(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (ready && !email) setLoading(false);
  }, [ready, email]);

  const load = useCallback(async (signal) => {
    if (!email) return;
    const id = requestId.current + 1;
    requestId.current = id;
    setLoading(true);
    setError('');
    try {
      const data = await getAppointments(email, signal);
      if (requestId.current !== id) return { ok: false, skipped: true };
      setAppointments(data.appointments || []);
      return { ok: true };
    } catch (err) {
      if (err.name === 'AbortError' || requestId.current !== id) return { ok: false, skipped: true };
      setError(err.message);
      return { ok: false, message: err.message };
    } finally {
      if (requestId.current === id) setLoading(false);
    }
  }, [email]);

  useEffect(() => {
    if (!ready || !email) return undefined;
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [ready, email, load]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return appointments.filter((appointment) => {
      if (serviceId !== 'all' && appointment.serviceId !== serviceId) return false;
      return matchesQuery(appointment, needle);
    });
  }, [appointments, query, serviceId]);

  const upcoming = visible.filter((appointment) => appointment.phase === 'upcoming');
  const closed = visible.filter((appointment) => appointment.phase !== 'upcoming');

  async function onRefresh() {
    setRefreshing(true);
    try {
      const [result] = await Promise.all([
        load(),
        new Promise((resolve) => setTimeout(resolve, 2000)),
      ]);
      if (result?.skipped) return;
      if (result?.ok) toast.success('Appointments are up to date.');
      else toast.error(result?.message || 'Could not refresh appointments.');
    } finally {
      setRefreshing(false);
    }
  }

  function useEmail(next) {
    setQuery('');
    setServiceId('all');
    setAppointments([]);
    setLoading(true);
    save(next);
  }

  function switchEmail() {
    requestId.current += 1;
    setAppointments([]);
    setError('');
    setQuery('');
    setServiceId('all');
    clear();
  }

  async function onCancel(id) {
    setPending(id);
    try {
      const data = await cancelAppointment(id, email);
      setAppointments((current) => current.map((item) => (
        item.id === id ? data.appointment : item
      )));
      toast.success('Appointment cancelled. That time is open again.');
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    } finally {
      setPending('');
    }
  }

  const opening = !held || !ready || (Boolean(email) && loading && !appointments.length && !error);

  if (opening) {
    return (
      <div className="flex min-h-[calc(100dvh-13rem)] items-center justify-center">
        <Spinner prominent label="Loading appointments" />
      </div>
    );
  }

  if (!email) {
    return (
      <div className="step-in mx-auto flex min-h-[calc(100dvh-13rem)] w-full max-w-md flex-col items-center justify-center text-center">
        <h1 className="font-serif text-[1.75rem] leading-tight text-ink sm:text-4xl">Your appointments</h1>
        <p className="mt-3 text-base leading-7 text-mute">
          Only the visits booked with your email are listed here.
        </p>
        <EmailLookup onSubmit={useEmail} />
      </div>
    );
  }

  return (
    <div className="step-in">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-serif text-[1.6rem] leading-tight text-ink sm:text-4xl lg:text-5xl">Your appointments</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-mute sm:mt-3 sm:text-base sm:leading-7">
            Only the visits booked with your email are listed here.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <button
            type="button"
            className="inline-flex h-5 min-w-[4.25rem] items-center text-sm text-pine disabled:opacity-50"
            onClick={onRefresh}
            disabled={loading || refreshing}
            aria-label={refreshing ? 'Refreshing' : 'Refresh'}
          >
            {refreshing ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-pine/25 border-t-pine" />
            ) : (
              'Refresh'
            )}
          </button>
          <button type="button" className="text-sm text-pine" onClick={switchEmail}>
            Use a different email
          </button>
        </div>
      </div>
      <p className="mt-3 w-full whitespace-nowrap text-[clamp(0.68rem,2.9vw,0.875rem)] leading-5 text-mute sm:text-sm sm:leading-6">
        Showing visits for{' '}
        <span className="rounded bg-pine-soft px-1 font-bold text-pine-dark">
          {email}
        </span>
        .
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="block w-full min-w-0 sm:max-w-sm">
          <span className="sr-only">Search appointments</span>
          <input
            className="field-input"
            placeholder="Search reference or service"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <div className="flex flex-nowrap gap-1.5" role="group" aria-label="Filter by service">
          {FILTERS.map((filter) => {
            const active = serviceId === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                aria-pressed={active}
                onClick={() => setServiceId(filter.id)}
                className={
                  active
                    ? 'shrink-0 whitespace-nowrap rounded-full bg-ink px-2 py-1.5 text-[11px] text-white sm:px-3 sm:text-sm'
                    : 'shrink-0 whitespace-nowrap rounded-full bg-white px-2 py-1.5 text-[11px] text-ink ring-1 ring-line sm:px-3 sm:text-sm'
                }
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {loading && !appointments.length ? <div className="mt-8"><Spinner prominent label="Loading appointments" /></div> : null}
      {error ? (
        <div className="mt-6">
          <Notice tone="error" title="Could not load appointments" body={error} />
        </div>
      ) : null}

      {!loading && !error && !appointments.length ? (
        <div className="panel mt-8 px-4 py-8 sm:px-5">
          <p className="font-serif text-2xl text-ink">Nothing booked with this email yet</p>
          <p className="mt-2 text-sm leading-6 text-mute">When a visit is confirmed, it will show up here.</p>
          <Link to="/" className="btn mt-5 w-full bg-pine text-white hover:bg-pine-dark sm:w-auto">Book a time</Link>
        </div>
      ) : null}

      {!error && appointments.length > 0 && !visible.length ? (
        <p className="mt-8 text-sm text-mute">Nothing matches that search.</p>
      ) : null}

      <Group title="Upcoming" items={upcoming} pending={pending} onCancel={onCancel} />
      <Group title="Past and cancelled" items={closed} pending={pending} onCancel={onCancel} />
    </div>
  );
}
