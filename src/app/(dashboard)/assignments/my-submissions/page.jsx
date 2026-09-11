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
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <BiCheckCircle className="size-3" /> Accepted
          </span>
        );
      case 'needs_improvement':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <FiAlertCircle className="size-3" /> Needs Improvement
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <LuTimer className="size-3" /> Pending
          </span>
        );
    }
  };

  const handleOpenEdit = sub => {
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

  const handleDelete = async id => {
    if (
      !confirm('Are you sure you want to withdraw and delete this submission?')
    )
      return;
    const res = await deleteSubmission(id);
    if (res?.success) {
      setSubmissions(prev => prev.filter(item => item._id !== id));
    } else {
      alert(res?.message || 'Failed to delete');
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Header - ক্লিন ও বর্ডারবিহীন */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          My Submissions
        </h1>
        <p className="text-xs text-neutral-content/60">
          Monitor your task evaluations, track qualitative guidance, and update
          repositories.
        </p>
      </div>

      {/* Submissions List / Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(n => (
            <div
              key={n}
              className="h-20 rounded-2xl bg-base-200/40 border border-base-300/60 animate-pulse"
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
        <div className="rounded-2xl bg-base-200/50 border border-base-300 overflow-hidden backdrop-blur-sm shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-base-300/60 text-[11px] font-semibold uppercase tracking-wider text-neutral-content/50 bg-base-300/20">
                  <th className="py-3 px-5">Assignment Title</th>
                  <th className="py-3 px-4">Repository</th>
                  <th className="py-3 px-4">Live URL</th>
                  <th className="py-3 px-4">Submitted On</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-5">Instructor Feedback</th>
                  <th className="py-3 pr-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-300/40">
                {submissions.map(item => (
                  <tr
                    key={item._id}
                    className="group hover:bg-base-300/10 transition-colors"
                  >
                    {/* Assignment Title */}
                    <td className="py-4 px-5">
                      <Link
                        href={`/assignments/${item.assignmentId}`}
                        className="font-medium text-white group-hover:text-primary transition-colors hover:underline block"
                      >
                        {item.assignmentTitle}
                      </Link>
                      <span className="text-[10px] uppercase text-neutral-content/40 tracking-wider">
                        {item.assignmentDifficulty}
                      </span>
                    </td>

                    {/* Repository */}
                    <td className="py-4 px-4">
                      <a
                        href={item.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-primary hover:underline"
                      >
                        <LuGithub className="size-3.5" />
                        <span>Code</span>
                      </a>
                    </td>

                    {/* Live URL */}
                    <td className="py-4 px-4">
                      <a
                        href={item.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-primary hover:underline"
                      >
                        <LuExternalLink className="size-3.5" />
                        <span>Preview</span>
                      </a>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 text-neutral-content/60">
                      <div className="flex items-center gap-1.5">
                        <LuClock className="size-3.5 text-neutral-content/40" />
                        <span>
                          {item.submittedAt
                            ? new Date(item.submittedAt).toLocaleDateString(
                                'en-US',
                                {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                },
                              )
                            : 'N/A'}
                        </span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4">
                      {renderStatusBadge(item.status)}
                    </td>

                    {/* Qualitative Feedback */}
                    <td className="py-4 px-5 max-w-xs">
                      {item.feedback ? (
                        <div className="p-2.5 rounded-lg bg-base-300/40 border border-base-300/70 text-neutral-content/80 text-[11px] font-mono leading-relaxed">
                          <div className="flex items-center gap-1 text-primary text-[10px] font-semibold mb-1">
                            <LuMessageSquare className="size-3" /> Qualitative
                            Note:
                          </div>
                          {item.feedback}
                        </div>
                      ) : (
                        <span className="text-neutral-content/30 italic text-[11px]">
                          Evaluation in progress
                        </span>
                      )}
                    </td>

                    {/* Manage Actions */}
                    <td className="py-4 pr-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded-lg bg-base-100 hover:bg-base-300 border border-base-300 text-neutral-content/70 hover:text-primary transition-colors cursor-pointer"
                          title="Edit submission"
                        >
                          <LuPencil className="size-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-1.5 rounded-lg bg-base-100 hover:bg-rose-500/10 border border-base-300 text-neutral-content/70 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Delete submission"
                        >
                          <LuTrash2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
