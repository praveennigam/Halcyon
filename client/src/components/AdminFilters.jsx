const SERVICES = [
  { id: '', label: 'All services' },
  { id: 'consultation', label: 'Consultation' },
  { id: 'demo', label: 'Demo' },
  { id: 'support', label: 'Support' },
];

const STATUSES = [
  { id: '', label: 'Any status', tone: 'ink' },
  { id: 'confirmed', label: 'Confirmed', tone: 'pine' },
  { id: 'cancelled', label: 'Cancelled', tone: 'clay' },
];

const SORTS = [
  { id: 'createdAt', label: 'Booked on' },
  { id: 'date', label: 'Visit date' },
  { id: 'startTime', label: 'Start time' },
  { id: 'customerName', label: 'Name' },
  { id: 'email', label: 'Email' },
  { id: 'reference', label: 'Reference' },
  { id: 'status', label: 'Status' },
];

function chipClass(active, tone) {
  if (!active) {
    return 'rounded-full bg-white px-3 py-2 text-sm text-ink ring-1 ring-line';
  }
  if (tone === 'pine') {
    return 'rounded-full bg-pine-soft px-3 py-2 text-sm font-medium text-pine-dark ring-1 ring-pine/25';
  }
  if (tone === 'clay') {
    return 'rounded-full bg-[#fdf6f4] px-3 py-2 text-sm font-medium text-clay ring-1 ring-clay/25';
  }
  return 'rounded-full bg-ink px-3 py-2 text-sm font-medium text-paper';
}

function ChipGroup({ label, options, value, onChange }) {
  return (
    <fieldset className="min-w-0 border-0 p-0">
      <legend className="text-xs font-medium text-mute">{label}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => {
          const active = value === option.id;
          return (
            <button
              key={option.id || 'all'}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.id)}
              className={chipClass(active, option.tone)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function Control({ id, label, action, children }) {
  return (
    <div className="min-w-0">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-xs font-medium text-mute">{label}</label>
        {action}
      </div>
      {children}
    </div>
  );
}

export default function AdminFilters({
  draft,
  onDraft,
  serviceId,
  onService,
  status,
  onStatus,
  date,
  onDate,
  sort,
  onSort,
  order,
  onOrder,
  limit,
  onLimit,
}) {
  return (
    <section className="panel mt-6 p-4 sm:p-5">
      <div className="min-w-0">
        <label htmlFor="visit-search" className="text-xs font-medium text-mute">Search appointments</label>
        <input
          id="visit-search"
          className="field-input mt-2"
          placeholder="Search name, email, reference, or phone"
          value={draft}
          onChange={(event) => onDraft(event.target.value)}
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <ChipGroup label="Service" options={SERVICES} value={serviceId} onChange={onService} />
        <ChipGroup label="Status" options={STATUSES} value={status} onChange={onStatus} />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 min-[520px]:grid-cols-2 xl:grid-cols-4">
        <Control
          id="visit-date"
          label="Visit date"
          action={date ? (
            <button type="button" className="text-xs font-medium text-pine" onClick={() => onDate('')}>
              Clear
            </button>
          ) : null}
        >
          <input
            id="visit-date"
            type="date"
            className="field-input min-w-0"
            value={date}
            onChange={(event) => onDate(event.target.value)}
          />
        </Control>
        <Control id="sort-by" label="Sort by">
          <select id="sort-by" className="field-input" value={sort} onChange={(event) => onSort(event.target.value)}>
            {SORTS.map((option) => (
              <option key={option.id} value={option.id}>{option.label}</option>
            ))}
          </select>
        </Control>
        <Control id="sort-order" label="Order">
          <select id="sort-order" className="field-input" value={order} onChange={(event) => onOrder(event.target.value)}>
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </Control>
        <Control id="page-size" label="Per page">
          <select
            id="page-size"
            className="field-input"
            value={String(limit)}
            onChange={(event) => onLimit(Number(event.target.value))}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </Control>
      </div>
    </section>
  );
}
