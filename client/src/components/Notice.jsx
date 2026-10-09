const TONES = {
  info: 'border-line bg-white',
  error: 'border-clay/30 bg-[#fdf6f4]',
  warn: 'border-[#ead7a6] bg-[#fbf6ea]',
};

export default function Notice({ tone = 'info', title, body, action }) {
  return (
    <div className={`rounded-2xl border px-4 py-3 ${TONES[tone]}`} role={tone === 'error' ? 'alert' : 'status'}>
      {title ? <p className="font-medium text-ink">{title}</p> : null}
      {body ? <p className={`text-sm leading-6 text-mute ${title ? 'mt-1' : ''}`}>{body}</p> : null}
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  );
}
