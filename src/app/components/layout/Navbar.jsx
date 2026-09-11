'use client';

import { useSession, signOut } from 'next-auth/react';

export default function Navbar({ drawerId = 'dashboard-drawer' }) {
  const { data: session, status } = useSession();
  const user = session?.user;

  // সেশন লোড না হওয়া পর্যন্ত বা ইউজার না থাকলে Navbar দেখাবে না
  if (status === 'loading' || !user) {
    return null;
  }

  const initial = user.name.charAt(0).toUpperCase();
  const isInstructor = user.role === 'instructor';
  const firstName = user.name.split(' ')[0];

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
          <span className="font-bold text-white">Hello</span> {firstName}
        </span>
      </div>

      {/* Right: Role Badge + Avatar + Dropdown */}
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
            {user.role}
          </span>
          <div className="size-7 rounded-lg bg-primary text-white text-xs font-bold flex items-center justify-center shadow-sm">
            {initial}
          </div>
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
              {user.name}
            </p>
            <p className="text-neutral-content/60 text-xs truncate">
              {user.email}
            </p>
            <span className="text-[10px] text-neutral-content/50 uppercase tracking-wide mt-1">
              Role: {user.role}
            </span>
          </li>
          <li>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-error hover:bg-error/10 rounded-md py-1.5 font-medium cursor-pointer transition-colors"
            >
              Sign Out
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
}
