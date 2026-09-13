'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  LuArrowRight,
  LuBookOpen,
  LuClock,
  LuCalendar,
  LuLayers,
  LuExternalLink,
} from 'react-icons/lu';
import { getStudentDashboardAnalytics } from '@/actions/server/studentAnalytics';
import { BiCheckCircle } from 'react-icons/bi';
import { FiAlertCircle } from 'react-icons/fi';

export default function StudentDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    {
      label: 'Available Tasks',
      count: 0,
      icon: LuBookOpen,
      color: 'text-sky-400',
      bg: 'bg-sky-400/10 border-sky-400/20',
    },
    {
      label: 'Under Review',
      count: 0,
      icon: LuClock,
      color: 'text-amber-400',
      bg: 'bg-amber-400/10 border-amber-400/20',
    },
    {
      label: 'Accepted',
      count: 0,
      icon: BiCheckCircle,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10 border-emerald-400/20',
    },
    {
      label: 'Needs Revision',
      count: 0,
      icon: FiAlertCircle,
      color: 'text-rose-400',
      bg: 'bg-rose-400/10 border-rose-400/20',
    },
  ]);
  const [recentTasks, setRecentTasks] = useState([]);

  useEffect(() => {
    async function loadStudentAnalytics() {
      setLoading(true);
      const res = await getStudentDashboardAnalytics();
      if (res?.success && res.data) {
        if (res.data.stats) {
          setStats(prev =>
            prev.map((item, idx) => ({
              ...item,
              count: res.data.stats[idx]?.count ?? item.count,
            })),
          );
        }
        setRecentTasks(res.data.recentTasks || []);
      }
      setLoading(false);
    }
    loadStudentAnalytics();
  }, []);

  const renderStatus = status => {
    switch ((status || '').toLowerCase()) {
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-400">
            <span className="size-1.5 rounded-full bg-emerald-400"></span>
            Accepted
          </span>
        );
      case 'needs improvement':
      case 'needs_improvement':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-rose-400">
            <span className="size-1.5 rounded-full bg-rose-400"></span>
            Revision Required
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-400">
            <span className="size-1.5 rounded-full bg-amber-400"></span>
            In Review
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-neutral-content/50">
            <span className="size-1.5 rounded-full bg-neutral-content/40"></span>
            Not Submitted
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 w-full max-w-5xl mx-auto animate-pulse pb-10">
        <div className="h-10 bg-base-200/50 rounded-xl w-1/3" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[1, 2, 3, 4].map(n => (
            <div
              key={n}
              className="h-24 bg-base-200/40 border border-base-300/60 rounded-xl"
            />
          ))}
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(n => (
            <div
              key={n}
              className="h-28 bg-base-200/40 border border-base-300/60 rounded-xl"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7 w-full max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-base-300/40">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Learning Space
          </h1>
          <p className="text-xs text-neutral-content/60">
            Monitor progress, submit active coursework, and check feedback.
          </p>
        </div>
        <Link
          href="/assignments"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold tracking-wide transition-all shadow-sm active:scale-95 self-start sm:self-auto"
        >
          <span>Explore Assignments</span>
          <LuArrowRight className="size-3.5" />
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-xl bg-base-200/40 border border-base-300/60 flex items-center justify-between gap-3 hover:border-base-300 transition-colors"
            >
              <div className="space-y-1">
                <span className="text-[11px] font-medium text-neutral-content/60 block">
                  {item.label}
                </span>
                <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {item.count}
                </p>
              </div>
              <div className={`p-2.5 rounded-xl border ${item.bg}`}>
                <Icon className={`size-4 sm:size-5 ${item.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Tasks & Activity Section */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white tracking-wide uppercase">
            Recent Activities
          </h2>
          <Link
            href="/my-submissions"
            className="text-xs text-neutral-content/60 hover:text-primary transition-colors flex items-center gap-1"
          >
            <span>My Submissions</span>
            <LuArrowRight className="size-3" />
          </Link>
        </div>

        {recentTasks.length === 0 ? (
          <div className="py-14 text-center rounded-2xl bg-base-200/20 border border-base-300/50 space-y-2.5">
            <LuLayers className="size-7 text-neutral-content/30 mx-auto" />
            <p className="text-xs text-neutral-content/60">
              No recent assignments found.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTasks.map(task => {
              const isNeedsImprovement =
                task.status?.toLowerCase() === 'needs improvement' ||
                task.status?.toLowerCase() === 'needs_improvement';
              const isNotSubmitted =
                task.status?.toLowerCase() === 'not submitted';

              return (
                <div
                  key={task.id}
                  className="p-4 sm:p-5 rounded-xl bg-base-200/40 border border-base-300/60 hover:border-base-300 transition-all space-y-3.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Title & Metadata */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <Link
                        href={`/assignments/${task.id}`}
                        className="text-sm sm:text-base font-semibold text-white hover:text-primary transition-colors block wrap-break-word line-clamp-1"
                        title={task.title}
                      >
                        {task.title}
                      </Link>

                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-neutral-content/50">
                        <span className="capitalize text-neutral-content/70 font-medium">
                          {task.difficulty || 'General'}
                        </span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <LuCalendar className="size-3" />
                          <span>Due {task.deadline || 'Soon'}</span>
                        </div>
                        <span>•</span>
                        <div>{renderStatus(task.status)}</div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-base-300/40 flex items-center gap-2">
                      {isNotSubmitted || isNeedsImprovement ? (
                        <Link
                          href={`/assignments/${task.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary hover:bg-primary/90 text-white transition-all shadow-xs active:scale-95"
                        >
                          <span>
                            {isNeedsImprovement
                              ? 'Resubmit Solution'
                              : 'Submit Task'}
                          </span>
                          <LuArrowRight className="size-3" />
                        </Link>
                      ) : (
                        <Link
                          href="/my-submissions"
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-base-300/40 hover:bg-base-300 border border-base-300/60 text-neutral-content/80 hover:text-white transition-colors"
                        >
                          <span>Review Status</span>
                          <LuExternalLink className="size-3 text-primary" />
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Feedback preview for revisions */}
                  {task.feedback && (
                    <div className="pl-3 py-1 border-l-2 border-rose-500/50 space-y-0.5 bg-base-300/10 rounded-r-lg">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-rose-400 block">
                        Instructor Note
                      </span>
                      <p className="text-xs text-neutral-content/80 leading-relaxed line-clamp-2">
                        {task.feedback}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
