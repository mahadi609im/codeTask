'use client';

import { useState } from 'react';
import { LuCopy, LuCheck } from 'react-icons/lu';

export default function StrugglingStudentsSection({ strugglingStudents = [] }) {
  const [copiedEmail, setCopiedEmail] = useState(null);

  const handleCopyEmail = email => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => {
      setCopiedEmail(null);
    }, 2000);
  };

  return (
    <div className="rounded-2xl bg-base-200/40 border border-base-300/80 p-5 space-y-3.5">
      {/* Sleek Minimal Header */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <span className="relative flex size-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full size-2 bg-rose-500"></span>
          </span>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
            Mentorship Outreach
          </h3>
          <span className="text-[11px] text-neutral-content/40 font-mono">
            ({strugglingStudents.length})
          </span>
        </div>
        <span className="text-[11px] text-neutral-content/40">
          Direct action queue
        </span>
      </div>

      {/* Empty State */}
      {strugglingStudents.length === 0 ? (
        <div className="py-6 text-center text-xs text-neutral-content/40">
          No students currently flagged for revisions.
        </div>
      ) : (
        /* Minimalist Compact Strips */
        <div className="space-y-2">
          {strugglingStudents.map((st, i) => {
            const isCopied = copiedEmail === st.email;

            return (
              <div
                key={i}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-base-300/25 hover:bg-base-300/60 border border-base-300/40 hover:border-rose-500/30 transition-all"
              >
                {/* Left: Identity & Revision Count */}
                <div className="flex items-center gap-3 min-w-50">
                  <div className="size-7 rounded-lg bg-base-100 flex items-center justify-center text-[10px] font-bold text-neutral-content/80 group-hover:text-rose-400 group-hover:bg-rose-500/10 transition-colors shrink-0">
                    {st.flaggedCount}x
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-white truncate group-hover:text-primary transition-colors">
                      {st.studentName}
                    </p>
                    <p className="text-[10px] text-neutral-content/45 font-mono truncate">
                      {st.email}
                    </p>
                  </div>
                </div>

                {/* Middle: Hurdle Assignment Tag */}
                <div className="min-w-0 flex-1 sm:px-2">
                  <p className="text-[11px] text-neutral-content/70 truncate">
                    <span className="text-neutral-content/30 text-[10px] uppercase font-mono mr-1.5">
                      Hurdle:
                    </span>
                    {st.tasks && st.tasks.length > 0
                      ? st.tasks.join(', ')
                      : 'Coursework tasks'}
                  </p>
                </div>

                {/* Right: Copy Email Trigger */}
                <div className="shrink-0 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => handleCopyEmail(st.email)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all shadow-xs cursor-pointer active:scale-95 border ${
                      isCopied
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                        : 'bg-base-100/70 hover:bg-primary border-base-300 text-neutral-content/70 hover:text-white'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <LuCheck className="size-3 text-emerald-400 animate-in zoom-in-50 duration-150" />
                        <span>Email Copied!</span>
                      </>
                    ) : (
                      <>
                        <LuCopy className="size-3 text-neutral-content/50 group-hover:text-white transition-colors" />
                        <span>Reach out</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
