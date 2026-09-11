'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  LuPlus,
  LuSearch,
  LuCalendar,
  LuClock,
  LuTrash2,
  LuExternalLink,
  LuLayers,
} from 'react-icons/lu';
import { getAssignments, deleteAssignment } from '@/actions/server/assignment';

export default function AssignmentsPage() {
  const { data: session } = useSession();
  const isInstructor = session?.user?.role === 'instructor';

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const fetchAssignments = async () => {
    setLoading(true);
    const res = await getAssignments();
    if (res?.success) {
      setAssignments(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleDelete = async id => {
    if (!confirm('Are you sure you want to delete this assignment?')) return;
    const res = await deleteAssignment(id);
    if (res?.success) {
      setAssignments(prev => prev.filter(item => item._id !== id));
    } else {
      alert(res?.message || 'Could not delete');
    }
  };

  const difficultyBadges = {
    beginner: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    intermediate: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    advanced: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  const filteredAssignments = assignments.filter(item => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesDifficulty =
      selectedDifficulty === 'all' || item.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="w-full space-y-6">
      {/* Top Header & New Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-base-300/60">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {isInstructor ? 'Manage Assignments' : 'Available Assignments'}
          </h1>
          <p className="text-xs text-neutral-content/60">
            {isInstructor
              ? 'Create, edit parameters, and monitor student evaluation tracks.'
              : 'Browse active coursework, study instructions, and submit deliverables.'}
          </p>
        </div>

        {isInstructor && (
          <Link
            href="/assignments/new"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold tracking-wide transition-all shadow-md active:scale-95 cursor-pointer w-full sm:w-auto"
          >
            <LuPlus className="size-4" />
            <span>New Assignment</span>
          </Link>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-content/40" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-base-200/50 border border-base-300/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-neutral-content/30 outline-none focus:border-primary/80 transition-all shadow-inner"
          />
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto p-1 rounded-xl bg-base-200/50 border border-base-300/80">
          {['all', 'beginner', 'intermediate', 'advanced'].map(lvl => (
            <button
              key={lvl}
              onClick={() => setSelectedDifficulty(lvl)}
              className={`px-3 py-1 rounded-lg text-xs capitalize transition-all cursor-pointer ${
                selectedDifficulty === lvl
                  ? 'bg-base-100 text-white font-medium shadow-sm'
                  : 'text-neutral-content/60 hover:text-white'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Grid or Empty State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {[1, 2, 3].map(n => (
            <div
              key={n}
              className="h-48 rounded-2xl bg-base-200/40 border border-base-300/60 animate-pulse"
            />
          ))}
        </div>
      ) : filteredAssignments.length === 0 ? (
        <div className="w-full py-16 text-center rounded-2xl bg-base-200/30 border border-base-300/50 flex flex-col items-center justify-center space-y-2">
          <LuLayers className="size-8 text-neutral-content/30" />
          <p className="text-sm text-neutral-content/70 font-medium">
            No assignments found
          </p>
          <p className="text-xs text-neutral-content/40">
            {isInstructor
              ? 'Get started by creating your first course assignment.'
              : 'No available tasks match your search.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          {filteredAssignments.map(item => {
            const badgeStyle =
              difficultyBadges[item.difficulty] ||
              'bg-base-300/30 text-white border-base-300';
            const formattedDeadline = item.deadline
              ? new Date(item.deadline).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'No deadline';

            return (
              <div
                key={item._id}
                className="group flex flex-col justify-between p-5 rounded-2xl bg-base-200/50 border border-base-300 hover:border-primary/40 transition-all shadow-sm backdrop-blur-sm space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md border ${badgeStyle}`}
                    >
                      {item.difficulty}
                    </span>

                    <div className="flex items-center gap-1.5 text-[11px] text-neutral-content/50">
                      <LuCalendar className="size-3.5" />
                      <span>{formattedDeadline}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-white tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-neutral-content/60 line-clamp-2 mt-1 font-mono">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-base-300/60">
                  <Link
                    href={`/assignments/${item._id}`}
                    className="inline-flex items-center gap-1.5 text-xs text-neutral-content/70 hover:text-white transition-colors cursor-pointer"
                  >
                    <span>
                      {isInstructor ? 'View Submissions' : 'View Task'}
                    </span>
                    <LuExternalLink className="size-3.5" />
                  </Link>

                  {isInstructor && (
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-1.5 rounded-lg text-neutral-content/40 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Delete assignment"
                    >
                      <LuTrash2 className="size-4" />
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
