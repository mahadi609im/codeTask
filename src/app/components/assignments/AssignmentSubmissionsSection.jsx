'use client';

import { useState } from 'react';
import {
  LuGithub,
  LuExternalLink,
  LuSend,
  LuUsers,
  LuLayers,
  LuClock,
} from 'react-icons/lu';
import { BiCheckCircle } from 'react-icons/bi';

export default function AssignmentSubmissionsSection({
  assignmentId,
  isInstructor,
}) {
  // স্টুডেন্ট স্টেট
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

  // ইন্সট্রাক্টর ডামি ডেটা
  const [submissionsList] = useState([
    {
      _id: 'sub_1',
      studentName: 'Shafin Ahmed',
      studentEmail: 'shafin@example.com',
      repoUrl: 'https://github.com/shafin/assignment-rbac',
      liveUrl: 'https://rbac-demo.vercel.app',
      submittedAt: new Date().toISOString(),
      status: 'pending',
    },
  ]);

  const handleStudentSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitStatus({
        success: true,
        message: 'Assignment submitted successfully for review!',
      });
    }, 900);
  };

  // ১. ইন্সট্রাক্টর ভিউ: সাবমিশন টেবিল
  if (isInstructor) {
    return (
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

        {submissionsList.length === 0 ? (
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
                          {new Date(sub.submittedAt).toLocaleDateString(
                            'en-US',
                            {
                              month: 'short',
                              day: 'numeric',
                            },
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-3.5 pl-4 text-right">
                      <button className="px-3 py-1 rounded-lg bg-base-100 hover:bg-base-300 border border-base-300 text-neutral-content/80 hover:text-white transition-colors cursor-pointer">
                        Grade
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // ২. স্টুডেন্ট ভিউ: সাবমিশন ফর্ম
  return (
    <div className="rounded-2xl bg-base-200/50 border border-base-300 p-6 space-y-5 backdrop-blur-sm sticky top-6">
      <div>
        <h3 className="text-sm font-semibold text-white">Submit Deliverable</h3>
        <p className="text-[11px] text-neutral-content/50 mt-0.5">
          Provide verified repository and live preview links before the
          deadline.
        </p>
      </div>

      {submitStatus.success ? (
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
