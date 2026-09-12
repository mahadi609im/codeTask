'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { BiCheckCircle } from 'react-icons/bi';
import { FiAlertCircle } from 'react-icons/fi';
import {
  LuArrowRight,
  LuClock,
  LuExternalLink,
  LuGithub,
  LuLayers,
  LuMessageSquare,
  LuPencil,
  LuSend,
  LuTimer,
  LuTrash2,
  LuX,
  LuFileText,
  LuLock,
} from 'react-icons/lu';
import {
  getStudentSubmissions,
  updateSubmission,
  deleteSubmission,
} from '@/actions/server/submission';

export default function MySubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // ম্যানেজ / এডিট মডাল স্টেট
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

  const renderStatusBadge = status => {
    switch (status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <BiCheckCircle className="size-3.5" /> Accepted
          </span>
        );
      case 'needs_improvement':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <FiAlertCircle className="size-3.5" /> Needs Improvement
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <LuTimer className="size-3.5" /> Pending Review
          </span>
        );
    }
  };

  const handleOpenEdit = sub => {
    if (sub.status === 'accepted') {
      alert('Accepted submissions cannot be modified.');
      return;
    }
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
    if (sub.status === 'accepted') {
      alert('Accepted submissions cannot be deleted.');
      return;
    }
    if (
      !confirm('Are you sure you want to withdraw and delete this submission?')
    )
      return;
    const res = await deleteSubmission(sub._id);
    if (res?.success) {
      setSubmissions(prev => prev.filter(item => item._id !== sub._id));
    } else {
      alert(res?.message || 'Failed to delete');
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          My Submissions
        </h1>
        <p className="text-xs text-neutral-content/60">
          Monitor your task evaluations, track qualitative guidance, and update
          repositories.
        </p>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(n => (
            <div
              key={n}
              className="h-56 rounded-2xl bg-base-200/40 border border-base-300/60 animate-pulse"
            />
          ))}
        </div>
      ) : submissions.length === 0 ? (
        <div className="w-full py-16 text-center rounded-2xl bg-base-200/30 border border-base-300/50 flex flex-col items-center justify-center space-y-3">
          <LuLayers className="size-8 text-neutral-content/30" />
          <p className="text-sm text-neutral-content/70 font-medium">
            You haven&apos;t submitted any assignments yet.
          </p>
          <Link
            href="/assignments"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold tracking-wide transition-all shadow-md active:scale-95"
          >
            Browse Available Tasks <LuArrowRight className="size-3.5" />
          </Link>
        </div>
      ) : (
        /* কার্ড গ্রিড লেআউট */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {submissions.map(item => {
            const isAccepted = item.status === 'accepted';

            return (
              <div
                key={item._id}
                className="flex flex-col justify-between p-5 rounded-2xl bg-base-200/50 border border-base-300 hover:border-base-300/80 transition-all shadow-sm backdrop-blur-sm space-y-4"
              >
                {/* কার্ড হেডার: টাইটেল ও স্ট্যাটাস */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <Link
                        href={`/assignments/${item.assignmentId}`}
                        className="font-semibold text-base text-white hover:text-primary transition-colors line-clamp-1"
                      >
                        {item.assignmentTitle}
                      </Link>
                      <span className="inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-base-300/40 text-neutral-content/60 border border-base-300/60">
                        {item.assignmentDifficulty || 'Assignment'}
                      </span>
                    </div>
                    <div>{renderStatusBadge(item.status)}</div>
                  </div>

                  {/* সাবমিটেড লিংক ও ডেট */}
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                    <a
                      href={item.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-base-300/30 border border-base-300/60 text-neutral-content/80 hover:text-white hover:border-primary/50 transition-all"
                    >
                      <LuGithub className="size-3.5 text-primary" />
                      <span>Repository</span>
                    </a>

                    <a
                      href={item.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-base-300/30 border border-base-300/60 text-neutral-content/80 hover:text-white hover:border-primary/50 transition-all"
                    >
                      <LuExternalLink className="size-3.5 text-primary" />
                      <span>Live Preview</span>
                    </a>

                    <div className="flex items-center gap-1 text-[11px] text-neutral-content/50 ml-auto">
                      <LuClock className="size-3" />
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
                    </div>
                  </div>

                  {/* স্টুডেন্টের নোট */}
                  {item.notes && (
                    <div className="p-3 rounded-xl bg-base-300/20 border border-base-300/40 space-y-1">
                      <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-content/40">
                        <LuFileText className="size-3" /> Your Submission Note
                      </div>
                      <p className="text-xs text-neutral-content/70 line-clamp-2 font-mono">
                        {item.notes}
                      </p>
                    </div>
                  )}

                  {/* ইনস্ট্রাক্টর ফিডব্যাক */}
                  <div className="p-3.5 rounded-xl bg-base-300/30 border border-base-300/60 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                      <LuMessageSquare className="size-3" />
                      <span>Instructor Feedback</span>
                    </div>
                    {item.feedback ? (
                      <p className="text-xs text-neutral-content/90 font-mono leading-relaxed">
                        {item.feedback}
                      </p>
                    ) : (
                      <p className="text-xs text-neutral-content/40 italic">
                        Pending instructor evaluation. Feedback will appear here
                        once reviewed.
                      </p>
                    )}
                  </div>
                </div>

                {/* কার্ড ফুটার: এডিট ও ডিলিট বাটন (Accepted হলে লক) */}
                <div className="flex items-center justify-between pt-2 border-t border-base-300/40">
                  {isAccepted ? (
                    <div className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                      <LuLock className="size-3.5" />
                      <span>Submission Finalized & Locked</span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-neutral-content/40">
                      Editable while pending or needs improvement
                    </span>
                  )}

                  <div className="flex items-center gap-2">
                    {!isAccepted ? (
                      <>
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-base-100 hover:bg-base-300 border border-base-300 text-xs font-medium text-neutral-content/80 hover:text-white transition-all cursor-pointer shadow-xs active:scale-95"
                        >
                          <LuPencil className="size-3.5" />
                          <span>Update / Resubmit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-1.5 rounded-xl bg-base-100 hover:bg-rose-500/10 border border-base-300 text-neutral-content/60 hover:text-rose-400 transition-all cursor-pointer shadow-xs active:scale-95"
                          title="Withdraw submission"
                        >
                          <LuTrash2 className="size-4" />
                        </button>
                      </>
                    ) : (
                      <span className="px-3 py-1 rounded-xl bg-base-300/20 text-neutral-content/40 text-xs border border-base-300/40 cursor-not-allowed">
                        Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit / Resubmit Modal */}
      {editingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-base-200 border border-base-300 rounded-2xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-base-300">
              <div>
                <h3 className="text-base font-bold text-white">
                  Update Submission
                </h3>
                <p className="text-xs text-neutral-content/50">
                  {editingSub.assignmentTitle}
                </p>
              </div>
              <button
                onClick={() => setEditingSub(null)}
                className="p-1 rounded-lg text-neutral-content/50 hover:text-white hover:bg-base-300 transition-colors"
              >
                <LuX className="size-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium uppercase tracking-wider text-neutral-content/60 flex items-center gap-1.5">
                  <LuGithub className="size-3.5 text-primary" />
                  Repository URL
                </label>
                <input
                  type="url"
                  required
                  value={editForm.repoUrl}
                  onChange={e =>
                    setEditForm({ ...editForm, repoUrl: e.target.value })
                  }
                  placeholder="https://github.com/user/project"
                  className="w-full bg-base-300/30 border border-base-300 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-neutral-content/25 outline-none focus:border-primary/80 transition-all shadow-inner"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-medium uppercase tracking-wider text-neutral-content/60 flex items-center gap-1.5">
                  <LuExternalLink className="size-3.5 text-primary" />
                  Live Deployment URL
                </label>
                <input
                  type="url"
                  required
                  value={editForm.liveUrl}
                  onChange={e =>
                    setEditForm({ ...editForm, liveUrl: e.target.value })
                  }
                  placeholder="https://assignment-demo.vercel.app"
                  className="w-full bg-base-300/30 border border-base-300 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-neutral-content/25 outline-none focus:border-primary/80 transition-all shadow-inner"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-medium uppercase tracking-wider text-neutral-content/60">
                  Descriptive Note
                </label>
                <textarea
                  rows={3}
                  required
                  value={editForm.notes}
                  onChange={e =>
                    setEditForm({ ...editForm, notes: e.target.value })
                  }
                  placeholder="Mention updates made or edge cases resolved..."
                  className="w-full bg-base-300/30 border border-base-300 rounded-xl p-3 text-xs text-white placeholder:text-neutral-content/25 outline-none focus:border-primary/80 transition-all resize-none shadow-inner"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingSub(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-content/60 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold tracking-wide transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  <LuSend className="size-3.5" />
                  <span>{updating ? 'Saving...' : 'Save & Resubmit'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
