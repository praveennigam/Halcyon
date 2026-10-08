export default function SlotSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
      {Array.from({ length: 8 }, (_, index) => (
        <div key={index} className="h-11 animate-pulse rounded-xl bg-stone-200/80" />
      ))}
    </div>
  );
}
