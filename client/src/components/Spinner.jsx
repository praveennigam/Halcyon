export default function Spinner({ label = 'Loading', prominent = false }) {
  if (!prominent) {
    return (
      <div className="flex items-center gap-3 text-sm text-mute" role="status">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-line border-t-pine" />
        {label}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2.5 px-4 text-center" role="status">
      <span
        className="relative grid h-11 w-11 place-items-center md:h-[3.25rem] md:w-[3.25rem]"
        aria-hidden="true"
      >
        <span className="absolute inset-0 rounded-full bg-card shadow-sm ring-1 ring-line" />
        <span className="absolute inset-[3px] rounded-full border border-dashed border-line" />
        <span className="absolute inset-0 animate-spin motion-reduce:animate-none">
          <span className="absolute left-1/2 top-1/2 h-[34%] w-0.5 -translate-x-1/2 -translate-y-full rounded-full bg-ink" />
        </span>
        <span className="relative h-2 w-2 rounded-full bg-ink ring-2 ring-card">
          <span className="absolute left-px top-px h-1 w-1 rounded-full bg-white/80" />
        </span>
      </span>
      <p className="font-serif text-sm leading-none text-ink md:text-base">{label}</p>
    </div>
  );
}
