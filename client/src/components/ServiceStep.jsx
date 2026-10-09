import ServiceOption from './ServiceOption';
import StepHeading from './StepHeading';

export default function ServiceStep({ services, selectedId, onSelect, onContinue }) {
  return (
    <div>
      <StepHeading eyebrow="Step 1 of 3" title="What do you need?" />
      <div className="space-y-3" role="radiogroup" aria-label="Services">
        {services.map((service) => (
          <ServiceOption
            key={service.id}
            service={service}
            selected={service.id === selectedId}
            onSelect={onSelect}
          />
        ))}
      </div>
      <div className="mt-8 flex justify-end">
        <button
          type="button"
          className="btn w-full bg-pine text-white hover:bg-pine-dark min-[420px]:w-auto"
          disabled={!selectedId}
          onClick={onContinue}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
