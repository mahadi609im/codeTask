'use client';

import { useState, useEffect } from 'react';
import {
  LuExternalLink,
  LuSend,
  LuLock,
  LuRefreshCw,
  LuClock,
  LuGithub,
} from 'react-icons/lu';
import {
  submitAssignment,
  updateSubmission,
} from '@/actions/server/submission';
import { BiCheckCircle } from 'react-icons/bi';
import { FiAlertTriangle } from 'react-icons/fi';

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
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    success: false,
    message: '',
  });

  // আগের সাবমিশন ডেটা থাকলে তা ফর্মে সেট করা
  useEffect(() => {
    if (existingSubmission) {
      setSubmission({
        repoUrl: existingSubmission.repoUrl || '',
        liveUrl: existingSubmission.liveUrl || '',
        notes: existingSubmission.notes || '',
      });
      // needs_improvement পেলে স্বয়ংক্রিয়ভাবে রি-সাবমিট মোড অন থাকবে
      if (existingSubmission.status === 'needs_improvement') {
        setIsEditing(true);
      } else {
        setIsEditing(false);
      }
    }
  }, [existingSubmission]);

  const renderStatusBadge = status => {
    switch (status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <BiCheckCircle className="size-3" /> Accepted
          </span>
        );
      case 'needs_improvement':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <FiAlertTriangle className="size-3" /> Needs Revision
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <LuClock className="size-3" /> In Review
          </span>
        );
    }
  };

  const handleStudentSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);

    let res;
    // যদি আগে থেকেই সাবমিশন থাকে তবে updateSubmission কল হবে, অন্যথায় নতুন সাবমিশন
    if (existingSubmission?._id) {
      res = await updateSubmission({
        submissionId: existingSubmission._id,
        ...submission,
      });
    } else {
      res = await submitAssignment({
        assignmentId,
        ...submission,
      });
    }

    if (res?.success) {
      setSubmitStatus({
        success: true,
        message: existingSubmission?._id
          ? 'Solution updated and resubmitted successfully!'
          : 'Assignment submitted successfully for review!',
      });
      setIsEditing(false);
      if (onSubmissionSuccess) onSubmissionSuccess();
    } else {
      alert(res?.message || 'Failed to submit deliverable');
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="rounded-2xl bg-base-200/50 border border-base-300 p-6 space-y-5 backdrop-blur-sm sticky top-6 animate-pulse">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-base-300/70 rounded-md" />
          <div className="h-3 w-48 bg-base-300/40 rounded-md" />
        </div>
        <div className="space-y-4 pt-2">
          <div className="h-10 w-full bg-base-300/30 rounded-xl" />
          <div className="h-10 w-full bg-base-300/30 rounded-xl" />
          <div className="h-20 w-full bg-base-300/30 rounded-xl" />
          <div className="h-10 w-full bg-base-300/50 rounded-xl" />
        </div>
      </div>
    );
  }

  const isAccepted = existingSubmission?.status === 'accepted';
  const isNeedsImprovement = existingSubmission?.status === 'needs_improvement';

  return (
    <div className="rounded-2xl bg-base-200/50 border border-base-300 p-5 sm:p-6 space-y-4 backdrop-blur-sm sticky top-6 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-base-300/60">
        <div>
          <h3 className="text-sm font-semibold text-white">Your Submission</h3>
          <p className="text-[11px] text-neutral-content/50">
            {isAccepted
              ? 'Submission has been accepted and finalized.'
              : isNeedsImprovement
                ? 'Instructor requested revisions.'
                : 'Submit or track your task deliverables.'}
          </p>
        </div>
        {existingSubmission && renderStatusBadge(existingSubmission.status)}
      </div>

      {/* Accepted View (Locked) */}
      {existingSubmission && isAccepted && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 font-medium">
            <LuLock className="size-4 shrink-0" />
            <span>
              This assignment is approved and locked for modifications.
            </span>
          </div>

          {existingSubmission.feedback && (
            <div className="p-3 rounded-xl bg-base-300/30 border border-base-300 space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-primary block">
                Final Feedback
              </span>
              <p className="text-xs text-neutral-content/90 leading-relaxed font-sans">
                {existingSubmission.feedback}
              </p>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2 text-xs">
            <a
              href={existingSubmission.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-base-300/30 border border-base-300/70 text-neutral-content/80 hover:text-white"
            >
              <LuGithub className="size-3.5 text-primary" /> Repository
            </a>
            <a
              href={existingSubmission.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-base-300/30 border border-base-300/70 text-neutral-content/80 hover:text-white"
            >
              <LuExternalLink className="size-3.5 text-primary" /> Live Demo
            </a>
          </div>
        </div>
      )}

      {/* Pending View (Without editing) */}
      {existingSubmission && !isAccepted && !isEditing && (
        <div className="space-y-4 text-xs">
          {/* Feedback Section */}
          <div className="p-3 rounded-xl bg-base-300/30 border border-base-300 space-y-1">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-primary block">
              Instructor Feedback
            </span>
            <p className="text-neutral-content/80 italic font-sans leading-relaxed">
              {existingSubmission.feedback ||
                'Submission is in review. Feedback will appear here once graded.'}
            </p>
          </div>

          {/* Links View */}
          <div className="space-y-2 text-neutral-content/70">
            <div className="flex items-center gap-2 truncate">
              <LuGithub className="size-3.5 text-primary shrink-0" />
              <a
                href={existingSubmission.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:underline truncate text-white"
              >
                {existingSubmission.repoUrl}
              </a>
            </div>
            <div className="flex items-center gap-2 truncate">
              <LuExternalLink className="size-3.5 text-primary shrink-0" />
              <a
                href={existingSubmission.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:underline truncate text-white"
              >
                {existingSubmission.liveUrl}
              </a>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-base-300/50 hover:bg-base-300 border border-base-300 text-white font-medium transition-all active:scale-95 cursor-pointer"
          >
            <LuRefreshCw className="size-3.5" />
            <span>Update / Resubmit Work</span>
          </button>
        </div>
      )}

      {/* Submission & Resubmission Form (For New or Needs Improvement / Edit Mode) */}
      {(!existingSubmission || (isEditing && !isAccepted)) && (
        <form onSubmit={handleStudentSubmit} className="space-y-3.5 text-xs">
          {/* Needs Improvement Banner */}
          {isNeedsImprovement && existingSubmission?.feedback && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-1 text-neutral-content/90">
              <span className="text-[10px] uppercase tracking-wider font-bold text-rose-400 flex items-center gap-1">
                <FiAlertTriangle className="size-3" /> Requested Revisions:
              </span>
              <p className="text-[11px] leading-relaxed font-sans text-rose-200/90">
                {existingSubmission.feedback}
              </p>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-medium uppercase tracking-wider text-neutral-content/60 flex items-center gap-1.5">
              <LuGithub className="size-3.5 text-primary" />
              <span>Repository URL</span>
            </label>
            <input
              type="url"
              required
              value={submission.repoUrl}
              onChange={e =>
                setSubmission({ ...submission, repoUrl: e.target.value })
              }
              placeholder="https://github.com/user/project"
              className="w-full bg-base-300/30 border border-base-300/80 rounded-xl px-3.5 py-2.5 text-white placeholder:text-neutral-content/25 outline-none focus:border-primary/80 transition-all shadow-inner"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-medium uppercase tracking-wider text-neutral-content/60 flex items-center gap-1.5">
              <LuExternalLink className="size-3.5 text-primary" />
              <span>Live Deployment URL</span>
            </label>
            <input
              type="url"
              required
              value={submission.liveUrl}
              onChange={e =>
                setSubmission({ ...submission, liveUrl: e.target.value })
              }
              placeholder="https://assignment-demo.vercel.app"
              className="w-full bg-base-300/30 border border-base-300/80 rounded-xl px-3.5 py-2.5 text-white placeholder:text-neutral-content/25 outline-none focus:border-primary/80 transition-all shadow-inner"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-medium uppercase tracking-wider text-neutral-content/60">
              {existingSubmission ? 'Revision Notes' : 'Notes for Instructor'}
            </label>
            <textarea
              rows={3}
              required
              value={submission.notes}
              onChange={e =>
                setSubmission({ ...submission, notes: e.target.value })
              }
              placeholder={
                isNeedsImprovement
                  ? 'Describe what changes or fixes you made according to the feedback...'
                  : 'Brief note on approach, libraries, or edge cases...'
              }
              className="w-full bg-base-300/30 border border-base-300/80 rounded-xl p-3 text-white placeholder:text-neutral-content/25 outline-none focus:border-primary/80 transition-all resize-none shadow-inner"
            />
          </div>

          <div className="pt-1 flex items-center gap-2">
            {existingSubmission && !isNeedsImprovement && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-1/3 py-2.5 rounded-xl bg-base-300/40 hover:bg-base-300 text-neutral-content/70 font-medium transition-all"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold tracking-wide transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <LuSend className="size-3.5" />
              <span>
                {submitting
                  ? 'Saving...'
                  : existingSubmission
                    ? 'Resubmit Solution'
                    : 'Submit Assignment'}
              </span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
