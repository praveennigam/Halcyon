export default function ServiceOption({ service, selected, onSelect }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={() => onSelect(service)}
      className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-4 text-left transition ${
        selected ? 'border-pine bg-pine-soft/70' : 'border-line bg-white hover:border-stone-300'
      }`}
    >
      <span
        className={`mt-1.5 h-4 w-4 shrink-0 rounded-full border ${
          selected ? 'border-pine bg-pine shadow-[inset_0_0_0_3px_#fff]' : 'border-stone-300 bg-white'
        }`}
        aria-hidden="true"
      />
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <span className="font-serif text-xl leading-none text-ink sm:text-2xl">{service.name}</span>
          <span className="text-xs uppercase tracking-[0.14em] text-mute">30 min</span>
        </span>
        <span className="mt-2 block text-sm leading-6 text-mute">{service.summary}</span>
      </span>
    </button>
  );
}
