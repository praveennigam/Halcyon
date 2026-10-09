import { useEffect, useState } from 'react';
import useSlots from '../hooks/useSlots';
import { addDaysISO, todayISO } from '../format';
import Notice from './Notice';
import SlotButton from './SlotButton';
import SlotSkeleton from './SlotSkeleton';
import StepHeading from './StepHeading';

export default function ScheduleStep({
  service,
  date,
  slot,
  onDate,
  onSlot,
  onBack,
  onContinue,
}) {
  const [reloadKey, setReloadKey] = useState(0);
  const { slots, message, openCount, error, loading } = useSlots(service.id, date, reloadKey);
  const min = todayISO();
  const max = addDaysISO(min, 60);

  useEffect(() => {
    if (loading || !slot) return;
    const match = slots.find((item) => item.startTime === slot.startTime);
    if (!match || match.state !== 'open') onSlot(null);
  }, [loading, slots, slot, onSlot]);

  return (
    <div>
      <StepHeading eyebrow="Step 2 of 3" title="Pick a time">
        <button type="button" className="text-sm text-pine" onClick={onBack}>
          Change service
        </button>
      </StepHeading>

      <label htmlFor="booking-date" className="mb-1.5 block text-sm font-medium text-ink">
        Date
      </label>
      <div className="date-field date-field-narrow">
        <input
          id="booking-date"
          type="date"
          className="field-input"
          min={min}
          max={max}
          value={date}
          onChange={(event) => onDate(event.target.value)}
        />
      </div>

      <div className="mt-5">
        {!date ? <p className="text-sm text-mute">Choose a date to see open times.</p> : null}
        {date && loading ? <SlotSkeleton /> : null}
        {date && !loading && error ? (
          <Notice
            tone="error"
            title="Times did not load"
            body={error}
            action={(
              <button type="button" className="text-sm font-medium text-pine" onClick={() => setReloadKey((value) => value + 1)}>
                Try again
              </button>
            )}
          />
        ) : null}
        {date && !loading && !error && message ? <Notice tone="warn" body={message} /> : null}
        {date && !loading && !error && slots.length > 0 ? (
          <>
            {openCount > 0 ? (
              <p className="mb-3 text-sm text-mute">
                {openCount} open {openCount === 1 ? 'time' : 'times'}
              </p>
            ) : null}
            <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 lg:grid-cols-3" role="group" aria-label="Times">
              {slots.map((item) => (
                <SlotButton
                  key={item.startTime}
                  slot={item}
                  selected={slot?.startTime === item.startTime}
                  onSelect={onSlot}
                />
              ))}
            </div>
            <p className="mt-3 text-xs leading-5 text-mute">
              Taken times stay closed until that appointment is cancelled.
            </p>
          </>
        ) : null}
      </div>

      <div className="mt-8 flex flex-col-reverse gap-2 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
        <button type="button" className="btn w-full text-ink hover:bg-black/5 min-[420px]:w-auto" onClick={onBack}>
          Back
        </button>
        <button
          type="button"
          className="btn w-full bg-pine text-white hover:bg-pine-dark min-[420px]:w-auto"
          disabled={!slot}
          onClick={onContinue}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
