import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const LINKS = [
  { href: '/', label: 'Book' },
  { href: '/appointments', label: 'Appointments' },
  { href: '/admin/list', label: 'All visits' },
];

function linkClass(active, roomy) {
  const size = roomy ? 'px-3 py-2 text-sm' : 'px-3 py-1.5 text-sm';
  if (active) return `rounded-full bg-ink font-medium text-paper ${size}`;
  return `rounded-full text-ink hover:bg-black/5 ${size}`;
}

export default function SiteHeader() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return undefined;
    function onKey(event) {
      if (event.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-20 border-b border-line/80 bg-paper/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-3 py-3 sm:px-6 sm:py-3.5">
        <Link to="/" className="min-w-0">
          <span className="block font-serif text-lg leading-none text-ink sm:text-xl">Halcyon</span>
          <span className="mt-1 block text-[11px] leading-none text-mute sm:text-xs">Appointment desk</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                aria-current={active ? 'page' : undefined}
                className={linkClass(active, false)}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-ink ring-1 ring-line lg:hidden"
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="relative block h-3.5 w-[18px]" aria-hidden="true">
            <span className={`absolute left-0 h-0.5 w-full rounded-full bg-ink transition duration-200 ${open ? 'top-[6px] rotate-45' : 'top-0'}`} />
            <span className={`absolute left-0 top-[6px] h-0.5 w-full rounded-full bg-ink transition duration-200 ${open ? 'scale-x-0 opacity-0' : ''}`} />
            <span className={`absolute left-0 h-0.5 w-full rounded-full bg-ink transition duration-200 ${open ? 'top-[6px] -rotate-45' : 'top-3'}`} />
          </span>
        </button>
      </div>

      <div className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none lg:hidden ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <nav
            id="site-menu"
            className="border-t border-line/80 px-3 py-3"
            aria-label="Primary"
            aria-hidden={open ? undefined : true}
            inert={open ? undefined : ''}
          >
            <ul className="mx-auto flex w-full max-w-6xl flex-col gap-1">
              {LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      tabIndex={open ? undefined : -1}
                      aria-current={active ? 'page' : undefined}
                      className={`block ${linkClass(active, true)}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
