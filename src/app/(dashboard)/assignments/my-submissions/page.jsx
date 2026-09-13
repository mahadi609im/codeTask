'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  LuArrowRight,
  LuExternalLink,
  LuGithub,
  LuLayers,
  LuLock,
  LuPencil,
  LuSend,
  LuTrash2,
  LuX,
} from 'react-icons/lu';
import {
  getStudentSubmissions,
  updateSubmission,
  deleteSubmission,
} from '@/actions/server/submission';

export default function MySubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingSub, setEditingSub] = useState(null);
  const [editForm, setEditForm] = useState({
    repoUrl: '',
    liveUrl: '',
    notes: '',
  });
  const [updating, setUpdating] = useState(false);

  const fetchSubmissions = async () => {
    setLoading(true);
    const res = await getStudentSubmissions();
    if (res?.success) {
      setSubmissions(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const renderStatus = status => {
    switch (status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
            <span className="size-1.5 rounded-full bg-emerald-400"></span>
            Accepted
          </span>
        );
      case 'needs_improvement':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-400">
            <span className="size-1.5 rounded-full bg-rose-400"></span>
            Needs Revision
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400">
            <span className="size-1.5 rounded-full bg-amber-400"></span>
            In Review
          </span>
        );
    }
  };

  const handleOpenEdit = sub => {
    if (sub.status === 'accepted') return;
    setEditingSub(sub);
    setEditForm({
      repoUrl: sub.repoUrl || '',
      liveUrl: sub.liveUrl || '',
      notes: sub.notes || '',
    });
  };

  const handleUpdate = async e => {
    e.preventDefault();
    setUpdating(true);
    const res = await updateSubmission({
      submissionId: editingSub._id,
      ...editForm,
    });

    if (res?.success) {
      setSubmissions(prev =>
        prev.map(item =>
          item._id === editingSub._id
            ? {
                ...item,
                ...editForm,
                status: 'pending',
                submittedAt: new Date().toISOString(),
              }
            : item,
        ),
      );
      setEditingSub(null);
    } else {
      alert(res?.message || 'Failed to update submission');
    }
    setUpdating(false);
  };

  const handleDelete = async sub => {
    if (sub.status === 'accepted') return;
    if (!confirm('Are you sure you want to delete this submission?')) return;
    const res = await deleteSubmission(sub._id);
    if (res?.success) {
      setSubmissions(prev => prev.filter(item => item._id !== sub._id));
    } else {
      alert(res?.message || 'Failed to delete');
    }
  };

  return (
    <div className="w-full mx-auto space-y-5 pb-10">
      {/* Header */}
      <div className="space-y-0.5">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          My Submissions
        </h1>
        <p className="text-xs text-neutral-content/50">
          Assignments you have submitted and their evaluation status.
        </p>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map(n => (
            <div
              key={n}
              className="h-36 rounded-xl bg-base-200/40 border border-base-300/50 animate-pulse"
            />
          ))}
        </div>
      ) : submissions.length === 0 ? (
        <div className="py-14 text-center rounded-2xl bg-base-200/20 border border-base-300/40 space-y-3">
          <LuLayers className="size-7 text-neutral-content/30 mx-auto" />
          <p className="text-xs text-neutral-content/60">No submissions yet.</p>
          <Link
            href="/assignments"
            className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline"
          >
            Browse Assignments <LuArrowRight className="size-3" />
          </Link>
        </div>
      ) : (
        /* Minimal Grid (Mobile: 1, Desktop/Tablet: 2) */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
          {submissions.map(item => {
            const isAccepted = item.status === 'accepted';

            return (
              <div
                key={item._id}
                className="flex flex-col justify-between p-4 sm:p-5 rounded-xl bg-base-200/40 border border-base-300/60 hover:border-base-300 transition-colors space-y-4"
              >
                {/* Top Details */}
                <div className="space-y-3.5">
                  {/* Line 1: Title */}
                  <div className="space-y-1">
                    <Link
                      href={`/assignments/${item.assignmentId}`}
                      className="text-sm sm:text-base font-semibold text-white hover:text-primary transition-colors block wrap-break-word line-clamp-1"
                      title={item.assignmentTitle}
                    >
                      {item.assignmentTitle}
                    </Link>

                    {/* Line 2: Meta Row */}
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-neutral-content/40">
                      <span className="capitalize text-neutral-content/60 font-medium">
                        {item.assignmentDifficulty || 'General'}
                      </span>
                      <span>•</span>
                      <span>
                        {item.submittedAt
                          ? new Date(item.submittedAt).toLocaleDateString(
                              'en-US',
                              {
                                month: 'short',
                                day: 'numeric',
                              },
                            )
                          : 'Recent'}
                      </span>
                      <span>•</span>
                      <div>{renderStatus(item.status)}</div>
                    </div>
                  </div>

                  {/* Line 3: Instructor Feedback (if present) */}
                  {item.feedback && (
                    <div className="pl-3 py-1 border-l-2 border-primary/40 space-y-0.5">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-primary block">
                        Feedback
                      </span>
                      <p className="text-xs text-neutral-content/80 leading-relaxed line-clamp-3">
                        {item.feedback}
                      </p>
                    </div>
                  )}
                </div>

                {/* Line 4: Footer Actions */}
                <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-base-300/40 mt-auto">
                  {/* Left Links */}
                  <div className="flex items-center gap-3">
                    <a
                      href={item.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-neutral-content/60 hover:text-white transition-colors"
                    >
                      <LuGithub className="size-3.5 text-primary" />
                      <span>Code</span>
                    </a>
                    <a
                      href={item.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-neutral-content/60 hover:text-white transition-colors"
                    >
                      <LuExternalLink className="size-3.5 text-primary" />
                      <span>Demo</span>
                    </a>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2">
                    {!isAccepted ? (
                      <>
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-base-300/40 hover:bg-base-300 border border-base-300/60 text-xs text-neutral-content/80 hover:text-white transition-colors cursor-pointer"
                        >
                          <LuPencil className="size-3 text-primary" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-1.5 rounded-lg text-neutral-content/40 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Delete submission"
                        >
                          <LuTrash2 className="size-3.5" />
                        </button>
                      </>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-neutral-content/40">
                        <LuLock className="size-3 text-emerald-400" />
                        <span>Completed</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Minimal Edit Modal */}
      {editingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-base-200 border border-base-300 rounded-xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-base-300/60">
              <h3 className="text-sm font-semibold text-white truncate max-w-70">
                Update: {editingSub.assignmentTitle}
              </h3>
              <button
                onClick={() => setEditingSub(null)}
                className="text-neutral-content/40 hover:text-white"
              >
                <LuX className="size-4" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-neutral-content/60 font-medium">
                  Repository URL
                </label>
                <input
                  type="url"
                  required
                  value={editForm.repoUrl}
                  onChange={e =>
                    setEditForm({ ...editForm, repoUrl: e.target.value })
                  }
                  placeholder="https://github.com/..."
                  className="w-full bg-base-300/30 border border-base-300/80 rounded-lg px-3 py-2 text-white outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-neutral-content/60 font-medium">
                  Live URL
                </label>
                <input
                  type="url"
                  required
                  value={editForm.liveUrl}
                  onChange={e =>
                    setEditForm({ ...editForm, liveUrl: e.target.value })
                  }
                  placeholder="https://...vercel.app"
                  className="w-full bg-base-300/30 border border-base-300/80 rounded-lg px-3 py-2 text-white outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-neutral-content/60 font-medium">
                  Notes
                </label>
                <textarea
                  rows={2}
                  required
                  value={editForm.notes}
                  onChange={e =>
                    setEditForm({ ...editForm, notes: e.target.value })
                  }
                  placeholder="Brief note on updates made..."
                  className="w-full bg-base-300/30 border border-base-300/80 rounded-lg p-2.5 text-white outline-none focus:border-primary resize-none font-sans"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingSub(null)}
                  className="px-3 py-1.5 text-neutral-content/60 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium disabled:opacity-50"
                >
                  <LuSend className="size-3" />
                  <span>{updating ? 'Saving...' : 'Resubmit'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
