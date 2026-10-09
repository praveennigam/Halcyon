export default function StatusPill({ status }) {
  const confirmed = status === 'confirmed';
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
        confirmed ? 'bg-pine-soft text-pine-dark' : 'bg-[#fdf6f4] text-clay'
      }`}
    >
      {confirmed ? 'Confirmed' : 'Cancelled'}
    </span>
  );
}
