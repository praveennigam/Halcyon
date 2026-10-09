import { useEffect, useRef, useState } from 'react';
import { getAdminList } from '../api';
import AdminFilters from './AdminFilters';
import AdminRows from './AdminRows';
import Notice from './Notice';
import Spinner from './Spinner';

export default function AdminList() {
  const [draft, setDraft] = useState('');
  const [query, setQuery] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');
  const [sort, setSort] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [held, setHeld] = useState(false);
  const requestId = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => setHeld(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const queryRef = useRef('');

  useEffect(() => {
    const handle = setTimeout(() => {
      const next = draft.trim();
      if (queryRef.current === next) return;
      queryRef.current = next;
      setQuery(next);
      setPage(1);
    }, 250);
    return () => clearTimeout(handle);
  }, [draft]);

  function change(setter) {
    return (value) => {
      setter(value);
      setPage(1);
    };
  }

  function onColumnSort(key) {
    if (key === sort) {
      setOrder((current) => (current === 'asc' ? 'desc' : 'asc'));
    } else {
      setSort(key);
    }
    setPage(1);
  }

  useEffect(() => {
    const controller = new AbortController();
    const id = requestId.current + 1;
    requestId.current = id;
    setLoading(true);
    setError('');

    getAdminList({
      q: query,
      serviceId,
      status,
      date,
      page,
      limit,
      sort,
      order,
    }, controller.signal)
      .then((data) => {
        if (requestId.current !== id) return;
        setResult(data);
      })
      .catch((err) => {
        if (err.name === 'AbortError' || requestId.current !== id) return;
        setError(err.message);
      })
      .finally(() => {
        if (requestId.current === id) setLoading(false);
      });

    return () => controller.abort();
  }, [query, serviceId, status, date, page, limit, sort, order]);

  const appointments = result?.appointments || [];
  const total = result?.total || 0;
  const pages = result?.pages || 0;
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const visitLabel = total === 1 ? '1 visit' : `${total} visits`;
  const opening = !held || (loading && !result && !error);

  if (opening) {
    return (
      <div className="flex min-h-[calc(100dvh-13rem)] items-center justify-center">
        <Spinner prominent label="Loading all visits" />
      </div>
    );
  }

  return (
    <div className="step-in">
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
        <div className="min-w-0">
          <h1 className="font-serif text-[1.6rem] leading-none text-ink sm:text-4xl lg:text-5xl">All visits</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-mute sm:mt-3 sm:text-base sm:leading-7">
            Every booking on the desk. No email is required.
          </p>
        </div>
        {result && !error ? (
          <p className="rounded-full bg-card px-3 py-1.5 text-sm text-ink ring-1 ring-line">
            {visitLabel}
          </p>
        ) : null}
      </div>

      <AdminFilters
        draft={draft}
        onDraft={setDraft}
        serviceId={serviceId}
        onService={change(setServiceId)}
        status={status}
        onStatus={change(setStatus)}
        date={date}
        onDate={change(setDate)}
        sort={sort}
        onSort={change(setSort)}
        order={order}
        onOrder={change(setOrder)}
        limit={limit}
        onLimit={change(setLimit)}
      />

      {error ? (
        <div className="mt-6">
          <Notice tone="error" title="Could not load appointments" body={error} />
        </div>
      ) : null}

      {!loading && !error && result && total === 0 ? (
        <div className="panel mt-8 px-4 py-8 sm:px-5">
          <p className="font-serif text-2xl text-ink">Nothing matches</p>
          <p className="mt-2 text-sm leading-6 text-mute">Try another service, status, date, or search.</p>
        </div>
      ) : null}

      {!error ? (
        <AdminRows appointments={appointments} sort={sort} order={order} onSort={onColumnSort} />
      ) : null}

      {!error && total > 0 ? (
        <div className="panel mt-4 flex flex-col gap-3 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <p className="text-center text-sm text-mute sm:text-left">
            {loading ? 'Refreshing…' : `Showing ${from}–${to} of ${total}`}
          </p>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:flex">
            <button
              type="button"
              className="btn bg-white text-ink ring-1 ring-line disabled:opacity-40"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1 || loading}
            >
              Previous
            </button>
            <p className="min-w-[4.5rem] text-center text-sm text-ink">
              {pages ? `${page} / ${pages}` : '1 / 1'}
            </p>
            <button
              type="button"
              className="btn bg-white text-ink ring-1 ring-line disabled:opacity-40"
              onClick={() => setPage((current) => current + 1)}
              disabled={page >= pages || loading}
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
