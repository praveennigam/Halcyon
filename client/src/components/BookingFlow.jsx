import { useEffect, useRef, useState } from 'react';
import { createAppointment, getServices } from '../api';
import useSavedEmail from '../hooks/useSavedEmail';
import ConfirmationPanel from './ConfirmationPanel';
import DetailsStep from './DetailsStep';
import Notice from './Notice';
import ScheduleStep from './ScheduleStep';
import SelectionSummary from './SelectionSummary';
import ServiceStep from './ServiceStep';
import Spinner from './Spinner';
import StepPills from './StepPills';
import { useToast } from './Providers';

export default function BookingFlow() {
  const toast = useToast();
  const savedEmail = useSavedEmail();
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [held, setHeld] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [step, setStep] = useState(0);
  const [service, setService] = useState(null);
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState(null);
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '' });
  const [confirmation, setConfirmation] = useState(null);
  const panelRef = useRef(null);
  const stepBodyRef = useRef(null);
  const [stepMinHeight, setStepMinHeight] = useState(0);
  const stepReady = useRef(false);

  function changeStep(next) {
    if (stepBodyRef.current) setStepMinHeight(stepBodyRef.current.offsetHeight);
    setStep(next);
  }

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (confirmation) {
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      return undefined;
    }

    if (!stepReady.current) {
      stepReady.current = true;
      return undefined;
    }

    const body = stepBodyRef.current;
    let frame = 0;
    if (body) {
      const locked = body.style.minHeight;
      body.style.minHeight = '0px';
      const nextHeight = body.scrollHeight;
      body.style.minHeight = locked;
      frame = requestAnimationFrame(() => setStepMinHeight(nextHeight));
    }

    const panel = panelRef.current;
    if (panel && panel.getBoundingClientRect().top < 80) {
      panel.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    }

    return () => cancelAnimationFrame(frame);
  }, [step, confirmation]);

  useEffect(() => {
    const timer = setTimeout(() => setHeld(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoadingServices(true);
    setLoadError('');

    getServices(controller.signal)
      .then((data) => setServices(data.services || []))
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setLoadError(err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingServices(false);
      });

    return () => controller.abort();
  }, [reloadKey]);

  function chooseDate(nextDate) {
    setDate(nextDate);
    setSlot(null);
  }

  function reset() {
    setStep(0);
    setService(null);
    setDate('');
    setSlot(null);
    setCustomer({ name: '', email: '', phone: '' });
    setConfirmation(null);
  }

  async function submit(customer) {
    try {
      const data = await createAppointment({
        serviceId: service.id,
        date,
        startTime: slot.startTime,
        customerName: customer.name,
        email: customer.email,
        phone: customer.phone,
      });
      savedEmail.save(data.appointment.email);
      setConfirmation(data);
      toast.success('Your visit is booked.');
      return { ok: true };
    } catch (error) {
      const incoming = error.fields || {};
      const fields = {
        name: incoming.customerName || '',
        email: incoming.email || '',
        phone: incoming.phone || '',
      };
      const inline = Boolean(fields.name || fields.email || fields.phone);
      const scheduleProblem = error.code === 'SLOT_TAKEN'
        || error.code === 'SLOT_PAST'
        || Boolean(incoming.date || incoming.startTime);

      if (scheduleProblem) {
        setSlot(null);
        changeStep(1);
      }
      if (!inline || scheduleProblem) toast.error(error.message);
      return { ok: false, fields };
    }
  }

  if (confirmation) {
    return (
      <ConfirmationPanel
        appointment={confirmation.appointment}
        onBookAnother={reset}
      />
    );
  }

  if (!held || (loadingServices && !services.length && !loadError)) {
    return (
      <div className="flex min-h-[calc(100dvh-13rem)] items-center justify-center">
        <Spinner prominent label="Loading book" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 max-w-xl">
        <h1 className="font-serif text-[1.6rem] leading-tight text-ink sm:text-4xl lg:text-5xl">Book a time</h1>
        
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <section ref={panelRef} className="panel min-w-0 scroll-mt-24 p-4 sm:p-7">
          <StepPills current={step} />
          <div
            ref={stepBodyRef}
            key={step}
            style={stepMinHeight ? { minHeight: stepMinHeight } : undefined}
            className="step-in transition-[min-height] duration-300 ease-out motion-reduce:transition-none"
          >
            {!loadingServices && loadError ? (
              <Notice
                tone="error"
                title="Services are unavailable"
                body={loadError}
                action={(
                  <button type="button" className="text-sm font-medium text-pine" onClick={() => setReloadKey((value) => value + 1)}>
                    Try again
                  </button>
                )}
              />
            ) : null}
            {!loadingServices && !loadError && step === 0 ? (
              <ServiceStep
                services={services}
                selectedId={service?.id}
                onSelect={(next) => {
                  setService(next);
                  setSlot(null);
                }}
                onContinue={() => changeStep(1)}
              />
            ) : null}
            {!loadingServices && !loadError && step === 1 && service ? (
              <ScheduleStep
                service={service}
                date={date}
                slot={slot}
                onDate={chooseDate}
                onSlot={setSlot}
                onBack={() => changeStep(0)}
                onContinue={() => changeStep(2)}
              />
            ) : null}
            {!loadingServices && !loadError && step === 2 && service && slot ? (
              <DetailsStep
                service={service}
                date={date}
                slot={slot}
                customer={customer}
                onChange={setCustomer}
                onBack={() => changeStep(1)}
                onSubmit={submit}
              />
            ) : null}
          </div>
        </section>
        <SelectionSummary service={service} date={date} slot={slot} />
      </div>
    </div>
  );
}
