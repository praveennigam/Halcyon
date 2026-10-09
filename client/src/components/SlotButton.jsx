export default function SlotButton({ slot, selected, onSelect }) {
  const open = slot.state === 'open';
  let className = 'w-full min-w-0 rounded-xl border px-3 py-2.5 text-left text-sm leading-snug transition';

  if (selected) className += ' border-pine bg-pine text-white';
  else if (open) className += ' border-line bg-white text-ink hover:border-pine';
  else if (slot.state === 'booked') className += ' border-line bg-[#f3f0ea] text-stone-400';
  else className += ' border-transparent bg-transparent text-stone-300';

  return (
    <button
      type="button"
      className={className}
      disabled={!open}
      aria-pressed={selected}
      onClick={() => onSelect(slot)}
    >
      <span className={slot.state === 'booked' ? 'line-through' : ''}>{slot.label}</span>
      {slot.state === 'booked' ? <span className="mt-0.5 block text-xs">Taken</span> : null}
      {slot.state === 'past' ? <span className="mt-0.5 block text-xs">Passed</span> : null}
    </button>
  );
}
