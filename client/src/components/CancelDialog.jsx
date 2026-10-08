import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function CancelDialog({ busy, onKeep, onConfirm }) {
  useEffect(() => {
    function onKey(event) {
      if (event.key === 'Escape' && !busy) onKeep();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [busy, onKeep]);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-3 py-6"
      onClick={busy ? undefined : onKeep}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-dialog-title"
        aria-describedby="cancel-dialog-note"
        className="w-full max-w-md rounded-3xl bg-card px-5 py-6 shadow-[0_20px_50px_rgba(36,31,27,0.18)] sm:px-8 sm:py-7"
        onClick={(event) => event.stopPropagation()}
      >
        <p
          id="cancel-dialog-title"
          className="whitespace-nowrap font-serif text-[clamp(1.15rem,5.6vw,1.7rem)] leading-none tracking-[-0.03em] text-ink"
        >
          Cancel this appointment?
        </p>
        <p id="cancel-dialog-note" className="mt-3 text-[15px] leading-6 text-mute sm:text-base sm:leading-7">
          That time opens up again.
        </p>
        <div className="mt-7 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="btn w-full bg-white px-5 py-3 text-[15px] text-ink ring-1 ring-line hover:bg-black/5 sm:w-auto sm:text-base"
            onClick={onKeep}
            disabled={busy}
          >
            Keep it
          </button>
          <button
            type="button"
            className="btn w-full bg-clay px-5 py-3 text-[15px] text-white hover:bg-[#823328] sm:w-auto sm:text-base"
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? 'Cancelling…' : 'Cancel appointment'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
