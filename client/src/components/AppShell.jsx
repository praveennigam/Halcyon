import { Outlet } from 'react-router-dom';
import SiteFooter from './SiteFooter';
import SiteHeader from './SiteHeader';

export default function AppShell() {
  return (
    <div className="flex min-h-screen flex-col font-sans antialiased">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <SiteHeader />
      <div className="flex-1">
        <Outlet />
      </div>
      <SiteFooter />
    </div>
  );
}
