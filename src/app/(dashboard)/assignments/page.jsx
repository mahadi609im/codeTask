'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  LuPlus,
  LuSearch,
  LuCalendar,
  LuTrash2,
  LuArrowRight,
  LuLayers,
} from 'react-icons/lu';
import { getAssignments, deleteAssignment } from '@/actions/server/assignment';

export default function AssignmentsPage() {
  const { data: session, status: authStatus } = useSession();
  const isInstructor = session?.user?.role === 'instructor';

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const fetchAssignments = async () => {
    setLoading(true);
    const res = await getAssignments();
    if (res?.success) {
      setAssignments(res.data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this assignment?')) return;
    setDeletingId(id);
    const res = await deleteAssignment(id);
    if (res?.success) {
      setAssignments(prev => prev.filter(item => item._id !== id));
    } else {
      alert(res?.message || 'Could not delete assignment');
    }
    setDeletingId(null);
  };

  const getDifficultyPill = level => {
    switch ((level || '').toLowerCase()) {
      case 'beginner':
        return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'intermediate':
        return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'advanced':
        return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      default:
        return 'text-neutral-content/60 bg-base-300/40 border-base-300';
    }
  };

  const filteredAssignments = assignments.filter(item => {
    const matchesSearch = item.title
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase().trim());
    const matchesDifficulty =
      selectedDifficulty === 'all' || item.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-base-300/40">
        <div className="space-y-1">
          {authStatus === 'loading' ? (
            <div className="h-7 w-48 bg-base-200/50 rounded-lg animate-pulse" />
          ) : (
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {isInstructor ? 'Manage Assignments' : 'Available Assignments'}
            </h1>
          )}
          <p className="text-xs text-neutral-content/60">
            {isInstructor
              ? 'Draft curricula, define rubric constraints, and monitor evaluations.'
              : 'Browse active coursework, study task objectives, and submit solutions.'}
          </p>
        </div>

        {authStatus !== 'loading' && isInstructor && (
          <Link
            href="/assignments/new"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold tracking-wide transition-all shadow-sm active:scale-95 self-start sm:self-auto"
          >
            <LuPlus className="size-4" />
            <span>Create Assignment</span>
          </Link>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-content/40" />
          <input
            type="text"
            placeholder="Search by assignment title..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-base-200/40 border border-base-300/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-neutral-content/30 outline-none focus:border-primary/80 transition-colors"
          />
        </div>

        {/* Difficulty Chips */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none w-full md:w-auto">
          {['all', 'beginner', 'intermediate', 'advanced'].map(lvl => (
            <button
              key={lvl}
              onClick={() => setSelectedDifficulty(lvl)}
              className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-all cursor-pointer whitespace-nowrap ${
                selectedDifficulty === lvl
                  ? 'bg-base-200 text-white font-medium border border-base-300/80 shadow-xs'
                  : 'text-neutral-content/50 hover:text-white'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid / Empty State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div
              key={n}
              className="h-48 rounded-xl bg-base-200/30 border border-base-300/50 animate-pulse"
            />
          ))}
        </div>
      ) : filteredAssignments.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-base-200/20 border border-base-300/40 space-y-2.5">
          <LuLayers className="size-7 text-neutral-content/30 mx-auto" />
          <p className="text-sm text-neutral-content/70 font-medium">
            No assignments match your query
          </p>
          <p className="text-xs text-neutral-content/40">
            {isInstructor
              ? 'Click "Create Assignment" to post your first task.'
              : 'Try selecting a different difficulty filter or clearing search.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1 items-stretch">
          {filteredAssignments.map(item => {
            const formattedDeadline = item.deadline
              ? new Date(item.deadline).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'No deadline set';

            return (
              <div
                key={item._id}
                className="group flex flex-col justify-between p-4 sm:p-5 rounded-xl bg-base-200/40 border border-base-300/60 hover:border-base-300 transition-colors space-y-3.5"
              >
                <div className="space-y-3">
                  {/* Meta Details Top */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded-md border ${getDifficultyPill(
                        item.difficulty,
                      )}`}
                    >
                      {item.difficulty}
                    </span>

                    <div className="flex items-center gap-1 text-[11px] text-neutral-content/40">
                      <LuCalendar className="size-3" />
                      <span>{formattedDeadline}</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1">
                    <Link
                      href={`/assignments/${item._id}`}
                      className="text-sm sm:text-base font-semibold text-white tracking-tight line-clamp-1 group-hover:text-primary transition-colors block"
                      title={item.title}
                    >
                      {item.title}
                    </Link>
                    <p className="text-xs text-neutral-content/60 line-clamp-2 leading-relaxed font-sans">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-2.5 border-t border-base-300/40 mt-auto">
                  <Link
                    href={`/assignments/${item._id}`}
                    className="inline-flex items-center gap-1 text-xs text-neutral-content/70 hover:text-white transition-colors"
                  >
                    <span>
                      {isInstructor ? 'View Submissions' : 'Details & Submit'}
                    </span>
                    <LuArrowRight className="size-3.5 text-primary group-hover:translate-x-0.5 transition-transform" />
                  </Link>

                  {isInstructor && (
                    <button
                      onClick={e => handleDelete(e, item._id)}
                      disabled={deletingId === item._id}
                      className="p-1.5 rounded-lg text-neutral-content/40 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer disabled:opacity-30"
                      title="Delete assignment"
                    >
                      <LuTrash2 className="size-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
