import { Link } from 'react-router-dom';

export default function MissingPage() {
  return (
    <main id="main" className="mx-auto max-w-lg px-3 py-12 sm:px-4 sm:py-16">
      <h1 className="font-serif text-3xl text-ink sm:text-4xl">That page is not here</h1>
      <p className="mt-3 text-sm leading-6 text-mute">The link may be old, or the page was never added.</p>
      <Link to="/" className="btn mt-6 bg-pine text-white hover:bg-pine-dark">
        Back to booking
      </Link>
    </main>
  );
}
