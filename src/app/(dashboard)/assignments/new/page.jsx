'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LuArrowLeft, LuSparkles, LuCalendar, LuInfo } from 'react-icons/lu';
import { createAssignment } from '@/actions/server/assignment';

export default function CreateAssignmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    difficulty: 'beginner',
  });

  const difficultyOptions = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  const handleChange = e => {
    setErrorMessage('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAIEnhance = () => {
    if (!formData.title && !formData.description) {
      setErrorMessage('Please add a task title or a rough note first!');
      return;
    }
    setAiGenerating(true);
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        description: `### Assessment Objective\nBuild a scalable, role-aware full-stack module demonstrating clean data flow and defensive state validation.\n\n### Deliverables & Scope\n- Implement authenticated routing gated by verified token roles.\n- Build validated endpoints with MongoDB schema constraints.\n- Provide an accessible, responsive dashboard view.\n\n### Verification Criteria\nProvide a valid public GitHub repository and live deployment URL with verification notes.`,
      }));
      setAiGenerating(false);
    }, 850);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await createAssignment(formData);

      if (res?.success) {
        setSuccessMessage('Assignment published successfully! Redirecting...');
        setTimeout(() => {
          router.push('/assignments');
          router.refresh();
        }, 1100);
      } else {
        setErrorMessage(res?.message || 'Failed to publish assignment');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="space-y-1">
          <Link
            href="/assignments"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-content/60 hover:text-primary transition-colors cursor-pointer group mb-1"
          >
            <LuArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back to assignments
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Create Assignment
          </h1>
          <p className="text-xs text-neutral-content/60">
            Publish assessment parameters, target difficulty, and submission
            deadlines.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-base-200/80 border border-base-300/60 text-[11px] text-neutral-content/60">
          <LuInfo className="size-3.5 text-primary shrink-0" />
          <span>Instructors can edit details before deadlines.</span>
        </div>
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div className="p-3 text-xs text-error bg-error/10 border border-error/20 rounded-xl text-center font-medium">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="p-3 text-xs text-success bg-success/10 border border-success/20 rounded-xl text-center font-medium">
          {successMessage}
        </div>
      )}

      {/* Main Panel */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl bg-base-200/50 border border-base-300 p-6 sm:p-8 space-y-7 backdrop-blur-sm">
          {/* Assignment Title */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-content/70">
                Title
              </label>
              <span className="text-[11px] text-neutral-content/40">
                Required
              </span>
            </div>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. NextAuth Credential Pipeline & RBAC Storage"
              className="w-full bg-base-300/30 border border-base-300/80 rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-content/30 outline-none focus:border-primary/80 focus:bg-base-300/60 transition-all shadow-inner"
            />
          </div>

          {/* Difficulty & Deadline Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Difficulty Segmented Selector */}
            <div className="lg:col-span-7 space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-content/70">
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 p-1 rounded-xl bg-base-300/40 border border-base-300/80 gap-1">
                {difficultyOptions.map(item => {
                  const isActive = formData.difficulty === item.value;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, difficulty: item.value })
                      }
                      className={`py-2.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center cursor-pointer ${
                        isActive
                          ? 'bg-base-100 text-white shadow-sm border border-base-300'
                          : 'text-neutral-content/60 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submission Deadline */}
            <div className="lg:col-span-5 space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-content/70 flex items-center justify-between">
                <span>Submission Due Date</span>
                <LuCalendar className="size-3.5 text-neutral-content/40" />
              </label>
              <input
                type="date"
                name="deadline"
                required
                value={formData.deadline}
                onChange={handleChange}
                className="w-full bg-base-300/30 border border-base-300/80 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-primary/80 focus:bg-base-300/60 transition-all cursor-pointer scheme-dark shadow-inner"
              />
            </div>
          </div>

          {/* Task Instructions */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-content/70">
                Task Guidelines & Evaluation Criteria
              </label>
              <button
                type="button"
                onClick={handleAIEnhance}
                disabled={aiGenerating}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-focus bg-primary/10 border border-primary/20 hover:border-primary/40 px-2.5 py-1 rounded-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <LuSparkles
                  className={`size-3.5 ${aiGenerating ? 'animate-spin' : ''}`}
                />
                {aiGenerating ? 'Generating...' : 'Enhance with AI'}
              </button>
            </div>

            <textarea
              name="description"
              required
              rows={9}
              value={formData.description}
              onChange={handleChange}
              placeholder="Outline project expectations, deliverables, constraints, and submission formats..."
              className="w-full bg-base-300/30 border border-base-300/80 rounded-xl p-4 text-sm text-white placeholder:text-neutral-content/30 outline-none focus:border-primary/80 focus:bg-base-300/60 transition-all resize-y leading-relaxed font-mono shadow-inner"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/assignments"
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-neutral-content/60 hover:text-white transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-md active:scale-95 cursor-pointer"
          >
            {loading ? 'Publishing...' : 'Publish Assignment'}
          </button>
        </div>
      </form>
    </div>
  );
}
