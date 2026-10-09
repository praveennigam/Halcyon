export default function StepHeading({ eyebrow, title, children }) {
  return (
    <div className="mb-5">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-mute">{eyebrow}</p>
      <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-serif text-2xl text-ink sm:text-3xl">{title}</h2>
        {children}
      </div>
    </div>
  );
}
