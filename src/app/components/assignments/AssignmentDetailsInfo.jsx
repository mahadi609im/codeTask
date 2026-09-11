import Link from 'next/link';
import { LuArrowLeft, LuCalendar } from 'react-icons/lu';

export default function AssignmentDetailsInfo({ assignment }) {
  const difficultyBadges = {
    beginner: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    intermediate: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    advanced: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  const formattedDeadline = assignment.deadline
    ? new Date(assignment.deadline).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'No deadline set';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 pb-3 border-b border-base-300/60">
        <Link
          href="/assignments"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-content/60 hover:text-primary transition-colors w-fit cursor-pointer group"
        >
          <LuArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Assignments</span>
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {assignment.title}
            </h1>
            <p className="text-xs text-neutral-content/50 mt-0.5">
              Task ID:{' '}
              <span className="font-mono text-neutral-content/70">
                {assignment._id}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <span
              className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-md border ${
                difficultyBadges[assignment.difficulty] ||
                'bg-base-300/30 text-white border-base-300'
              }`}
            >
              {assignment.difficulty}
            </span>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-base-200/80 border border-base-300 text-xs text-neutral-content/60">
              <LuCalendar className="size-3.5 text-primary" />
              <span>Due: {formattedDeadline}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Task Description */}
      <div className="rounded-2xl bg-base-200/50 border border-base-300 p-6 sm:p-7 space-y-4 backdrop-blur-sm">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-content/70 pb-3 border-b border-base-300/60">
          Task Brief & Specifications
        </h2>
        <div className="text-sm text-neutral-content/80 whitespace-pre-wrap leading-relaxed font-mono">
          {assignment.description}
        </div>
      </div>
    </div>
  );
}
