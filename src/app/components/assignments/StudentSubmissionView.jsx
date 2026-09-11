'use client';

import { useState } from 'react';
import { LuGithub, LuExternalLink, LuSend } from 'react-icons/lu';
import { BiCheckCircle } from 'react-icons/bi';
import { submitAssignment } from '@/actions/server/submission';

export default function StudentSubmissionView({
  assignmentId,
  existingSubmission,
  onSubmissionSuccess,
  loading,
}) {
  const [submission, setSubmission] = useState({
    repoUrl: '',
    liveUrl: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    success: false,
    message: '',
  });

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

  const handleStudentSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    const res = await submitAssignment({
      assignmentId,
      ...submission,
    });

    if (res?.success) {
      setSubmitStatus({
        success: true,
        message: 'Assignment submitted successfully for review!',
      });
      if (onSubmissionSuccess) onSubmissionSuccess();
    } else {
      alert(res?.message || 'Failed to submit deliverable');
    }
    setSubmitting(false);
  };

  // ডাটা লোড হওয়ার আগ পর্যন্ত ফর্ম হাইড থাকবে এবং স্কেলিটন লোডার দেখাবে
  if (loading) {
    return (
      <div className="rounded-2xl bg-base-200/50 border border-base-300 p-6 space-y-5 backdrop-blur-sm sticky top-6 animate-pulse">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-base-300/70 rounded-md" />
          <div className="h-3 w-48 bg-base-300/40 rounded-md" />
        </div>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <div className="h-3 w-24 bg-base-300/50 rounded-md" />
            <div className="h-10 w-full bg-base-300/30 rounded-xl" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-28 bg-base-300/50 rounded-md" />
            <div className="h-10 w-full bg-base-300/30 rounded-xl" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-20 bg-base-300/50 rounded-md" />
            <div className="h-20 w-full bg-base-300/30 rounded-xl" />
          </div>
          <div className="h-10 w-full bg-base-300/50 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-base-200/50 border border-base-300 p-6 space-y-5 backdrop-blur-sm sticky top-6">
      <div>
        <h3 className="text-sm font-semibold text-white">Submit Deliverable</h3>
        <p className="text-[11px] text-neutral-content/50 mt-0.5">
          Provide verified repository and live preview links before the
          deadline.
        </p>
      </div>

      {existingSubmission ? (
        <div className="p-4 rounded-xl bg-base-300/20 border border-base-300 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-white">
              Current Status:
            </span>
            {renderStatusBadge(existingSubmission.status)}
          </div>

          <div className="space-y-1 text-xs">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-content/50">
              Instructor Feedback:
            </span>
            {existingSubmission.feedback ? (
              <p className="p-3 rounded-lg bg-base-300/40 border border-base-300 text-neutral-content/90 font-mono leading-relaxed">
                {existingSubmission.feedback}
              </p>
            ) : (
              <p className="text-neutral-content/40 italic">
                Pending instructor evaluation. Feedback will appear here once
                reviewed.
              </p>
            )}
          </div>

          <div className="pt-2 border-t border-base-300/60 flex items-center gap-4 text-xs">
            <a
              href={existingSubmission.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              <LuGithub className="size-3.5" /> Repository
            </a>
            <a
              href={existingSubmission.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              <LuExternalLink className="size-3.5" /> Live Demo
            </a>
          </div>
        </div>
      ) : submitStatus.success ? (
        <div className="p-5 rounded-xl bg-success/10 border border-success/20 text-center space-y-2">
          <BiCheckCircle className="size-6 text-success mx-auto" />
          <p className="text-xs font-semibold text-white">
            {submitStatus.message}
          </p>
        </div>
      ) : (
        <form onSubmit={handleStudentSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wider text-neutral-content/60 flex items-center gap-1.5">
              <LuGithub className="size-3.5 text-primary" />
              Repository URL
            </label>
            <input
              type="url"
              name="repoUrl"
              required
              value={submission.repoUrl}
              onChange={e =>
                setSubmission({ ...submission, repoUrl: e.target.value })
              }
              placeholder="https://github.com/user/project"
              className="w-full bg-base-300/30 border border-base-300/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-neutral-content/25 outline-none focus:border-primary/80 transition-all shadow-inner"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wider text-neutral-content/60 flex items-center gap-1.5">
              <LuExternalLink className="size-3.5 text-primary" />
              Live Deployment URL
            </label>
            <input
              type="url"
              name="liveUrl"
              required
              value={submission.liveUrl}
              onChange={e =>
                setSubmission({ ...submission, liveUrl: e.target.value })
              }
              placeholder="https://assignment-demo.vercel.app"
              className="w-full bg-base-300/30 border border-base-300/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-neutral-content/25 outline-none focus:border-primary/80 transition-all shadow-inner"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wider text-neutral-content/60">
              Notes for Instructor
            </label>
            <textarea
              name="notes"
              rows={3}
              required
              value={submission.notes}
              onChange={e =>
                setSubmission({ ...submission, notes: e.target.value })
              }
              placeholder="Brief note on approach or features..."
              className="w-full bg-base-300/30 border border-base-300/80 rounded-xl p-3 text-xs text-white placeholder:text-neutral-content/25 outline-none focus:border-primary/80 transition-all resize-none shadow-inner"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold tracking-wide transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <LuSend className="size-3.5" />
            <span>{submitting ? 'Submitting...' : 'Submit Assignment'}</span>
          </button>
        </form>
      )}
    </div>
  );
}
