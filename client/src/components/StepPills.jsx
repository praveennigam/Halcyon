const STEPS = ['Service', 'Time', 'Details'];

export default function StepPills({ current }) {
  return (
    <ol className="mb-6 flex flex-wrap gap-2" aria-label="Booking steps">
      {STEPS.map((label, index) => {
        const active = index === current;
        const done = index < current;
        let className = 'rounded-full bg-white px-3 py-1 text-xs font-medium text-mute ring-1 ring-line';
        if (active) className = 'rounded-full bg-ink px-3 py-1 text-xs font-medium text-white';
        if (done) className = 'rounded-full bg-pine-soft px-3 py-1 text-xs font-medium text-pine-dark';

        return (
          <li key={label} className={className} aria-current={active ? 'step' : undefined}>
            {index + 1}. {label}
          </li>
        );
      })}
    </ol>
  );
}
