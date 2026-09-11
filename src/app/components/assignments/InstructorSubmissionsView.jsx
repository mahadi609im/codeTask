'use client';

import { useState } from 'react';
import {
  LuGithub,
  LuExternalLink,
  LuUsers,
  LuLayers,
  LuClock,
} from 'react-icons/lu';
import { reviewSubmission } from '@/actions/server/submission';

export default function InstructorSubmissionsView({
  submissionsList,
  setSubmissionsList,
  loading,
}) {
  const [activeReviewSub, setActiveReviewSub] = useState(null);
  const [reviewStatus, setReviewStatus] = useState('pending');
  const [reviewFeedback, setReviewFeedback] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [savingReview, setSavingReview] = useState(false);

  const renderStatusBadge = status => {
    switch (status) {
      case 'accepted':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Accepted
          </span>
        );
      case 'needs_improvement':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
            Needs Improvement
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Pending
          </span>
        );
    }
  };

  const handleOpenReview = sub => {
    setActiveReviewSub(sub);
    setReviewStatus(sub.status || 'pending');
    setReviewFeedback(sub.feedback || '');
  };

  const handleAIFeedback = () => {
    if (!activeReviewSub) return;
    setAiGenerating(true);
    setTimeout(() => {
      let generated = '';
      if (reviewStatus === 'accepted') {
        generated = `Good grasp of requirements. ${activeReviewSub.studentName} addressed the key technical points: "${activeReviewSub.notes || 'Clean implementation'}". Deployment functions reliably and code adheres to design guidelines.`;
      } else if (reviewStatus === 'needs_improvement') {
        generated = `The foundation is solid, but certain edge cases require attention based on your notes. Review role redirection consistency and ensure proper error handling before re-submitting.`;
      } else {
        generated = `Initial implementation is under evaluation. Overall architecture meets base expectations; verifying route validation edge cases.`;
      }
      setReviewFeedback(generated);
      setAiGenerating(false);
    }, 600);
  };

  const handleSaveReview = async e => {
    e.preventDefault();
    setSavingReview(true);
    const res = await reviewSubmission({
      submissionId: activeReviewSub._id,
      status: reviewStatus,
      feedback: reviewFeedback,
    });

    if (res?.success) {
      setSubmissionsList(prev =>
        prev.map(item =>
          item._id === activeReviewSub._id
            ? { ...item, status: reviewStatus, feedback: reviewFeedback }
            : item,
        ),
      );
      setActiveReviewSub(null);
    } else {
      alert(res?.message || 'Failed to save review');
    }
    setSavingReview(false);
  };

  return (
    <>
      <div className="rounded-2xl bg-base-200/50 border border-base-300 p-6 sm:p-7 space-y-5 backdrop-blur-sm">
        <div className="flex items-center justify-between pb-3 border-b border-base-300/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary">
              <LuUsers className="size-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">
                Student Submissions ({submissionsList.length})
              </h2>
              <p className="text-[11px] text-neutral-content/50">
                Review student repositories and live deployments.
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-neutral-content/40 animate-pulse">
            Loading submissions...
          </div>
        ) : submissionsList.length === 0 ? (
          <div className="py-12 text-center rounded-xl bg-base-300/20 border border-base-300/40 space-y-2">
            <LuLayers className="size-7 text-neutral-content/30 mx-auto" />
            <p className="text-xs text-neutral-content/60 font-medium">
              No submissions received yet for this assignment.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-base-300/60 text-[11px] font-semibold uppercase tracking-wider text-neutral-content/50">
                  <th className="pb-3 pr-4">Student</th>
                  <th className="pb-3 px-4">Repository</th>
                  <th className="pb-3 px-4">Live URL</th>
                  <th className="pb-3 px-4">Submitted At</th>
                  <th className="pb-3 px-4">Status</th>
                  <th className="pb-3 pl-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-300/40">
                {submissionsList.map(sub => (
                  <tr key={sub._id} className="group transition-colors">
                    <td className="py-3.5 pr-4">
                      <div className="font-medium text-white group-hover:text-primary transition-colors">
                        {sub.studentName}
                      </div>
                      <div className="text-[11px] text-neutral-content/40 group-hover:text-primary/70 transition-colors">
                        {sub.studentEmail}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <a
                        href={sub.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-primary hover:underline"
                      >
                        <LuGithub className="size-3.5" />
                        <span>Code</span>
                      </a>
                    </td>
                    <td className="py-3.5 px-4">
                      <a
                        href={sub.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-primary hover:underline"
                      >
                        <LuExternalLink className="size-3.5" />
                        <span>Demo</span>
                      </a>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-content/60">
                      <div className="flex items-center gap-1.5">
                        <LuClock className="size-3.5 text-neutral-content/40" />
                        <span>
                          {sub.updatedAt
                            ? new Date(sub.updatedAt).toLocaleDateString(
                                'en-US',
                                {
                                  month: 'short',
                                  day: 'numeric',
                                },
                              )
                            : 'Recent'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {renderStatusBadge(sub.status)}
                    </td>
                    <td className="py-3.5 pl-4 text-right">
                      <button
                        onClick={() => handleOpenReview(sub)}
                        className="px-3 py-1 rounded-lg bg-base-100 hover:bg-base-300 border border-base-300 text-neutral-content/80 hover:text-white transition-colors cursor-pointer"
                      >
                        Review & Feedback
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review & Feedback Modal */}
      {activeReviewSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-base-200 border border-base-300 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-base-300">
              <div>
                <h3 className="text-base font-bold text-white">
                  Review Submission
                </h3>
                <p className="text-xs text-neutral-content/50">
                  {activeReviewSub.studentName} ({activeReviewSub.studentEmail})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveReviewSub(null)}
                className="text-neutral-content/50 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-base-300/30 border border-base-300 space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-content/50">
                Student&apos;s Note
              </span>
              <p className="text-xs text-neutral-content/80 font-mono">
                {activeReviewSub.notes ||
                  'No note provided with this submission.'}
              </p>
            </div>

            <form onSubmit={handleSaveReview} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-content/70">
                  Evaluation Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'pending', label: 'Pending' },
                    { id: 'accepted', label: 'Accepted' },
                    { id: 'needs_improvement', label: 'Needs Improvement' },
                  ].map(st => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setReviewStatus(st.id)}
                      className={`py-2 px-1 text-xs font-medium rounded-xl border transition-all text-center ${
                        reviewStatus === st.id
                          ? 'bg-base-100 border-primary text-white shadow-sm'
                          : 'bg-base-300/30 border-base-300 text-neutral-content/50 hover:text-white'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-content/70">
                    Qualitative Feedback
                  </label>
                  <button
                    type="button"
                    onClick={handleAIFeedback}
                    disabled={aiGenerating}
                    className="text-xs font-medium text-primary hover:text-primary-focus cursor-pointer disabled:opacity-50"
                  >
                    {aiGenerating ? 'Analyzing...' : '✦ AI Draft Feedback'}
                  </button>
                </div>
                <textarea
                  rows={4}
                  required
                  value={reviewFeedback}
                  onChange={e => setReviewFeedback(e.target.value)}
                  placeholder="Provide constructive, qualitative feedback..."
                  className="w-full bg-base-300/30 border border-base-300 rounded-xl p-3 text-xs text-white placeholder:text-neutral-content/25 outline-none focus:border-primary/80 transition-all resize-none shadow-inner"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveReviewSub(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-content/60 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingReview}
                  className="px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold tracking-wide transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {savingReview ? 'Saving...' : 'Save & Update Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
