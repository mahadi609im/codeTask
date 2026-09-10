import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-base-100 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Large 404 with SVG Icon as '0' */}
        <div className="flex items-center justify-center gap-2 select-none">
          <span className="text-7xl sm:text-9xl font-black tracking-tighter text-error">
            4
          </span>

          <div className="relative flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-16 sm:size-24 text-error"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>

          <span className="text-7xl sm:text-9xl font-black tracking-tighter text-error">
            4
          </span>
        </div>

        {/* Simple & Clear Text */}
        <div className="space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Page Not Found
          </h2>
          <p className="text-xs sm:text-sm text-neutral-content/60">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-error hover:bg-error/90 text-white text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-md active:scale-[0.98]"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
