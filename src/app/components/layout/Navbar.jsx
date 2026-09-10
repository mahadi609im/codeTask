export default function Navbar({ user, drawerId = 'dashboard-drawer' }) {
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
  const isInstructor = user?.role === 'instructor';

  return (
    <header className="h-16 w-full bg-base-200 border-b border-base-300 px-4 sm:px-6 flex items-center justify-between shrink-0">
      {/* Left: Drawer Trigger + Brand */}
      <div className="flex items-center gap-3">
        <label
          htmlFor={drawerId}
          aria-label="Toggle Sidebar"
          className="lg:hidden p-2 rounded-lg text-neutral-content/70 hover:text-white hover:bg-base-300 cursor-pointer transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-5"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </label>

        <span className="text-base font-medium text-neutral-content tracking-tight">
          <span className="font-bold">Hello</span> {user?.name || 'User'}
        </span>
      </div>

      {/* Right: Role Badge + Avatar + Down Arrow */}
      <div className="dropdown dropdown-end">
        <label
          tabIndex={0}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-base-300/40 hover:bg-base-300/80 border border-base-300 cursor-pointer transition-colors select-none"
        >
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded capitalize ${
              isInstructor
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'bg-info/20 text-info border border-info/30'
            }`}
          >
            {user?.role || 'Guest'}
          </span>
          <div className="size-6 rounded-md bg-primary text-white text-xs font-bold flex items-center justify-center">
            {initial}
          </div>
          {/* Right side Down Arrow */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-3.5 text-neutral-content/60"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </label>

        <ul
          tabIndex={0}
          className="dropdown-content z-50 menu p-3 shadow-2xl bg-base-200 border border-base-300 rounded-xl w-60 mt-2 space-y-2 text-xs"
        >
          <li className="pb-2 border-b border-base-300/80">
            <p className="font-semibold text-white text-sm leading-tight">
              {user?.name || 'User'}
            </p>
            <p className="text-neutral-content/60 text-xs truncate">
              {user?.email || 'user@platform.com'}
            </p>
            <span className="text-[10px] text-neutral-content/50 uppercase tracking-wide mt-1">
              Role: {user?.role || 'Guest'}
            </span>
          </li>
          <li>
            <button className="text-error hover:bg-error/10 rounded-md py-1.5 font-medium">
              Sign Out
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
}
