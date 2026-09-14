'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  LuArrowLeft,
  LuSparkles,
  LuCalendar,
  LuInfo,
  LuLoader,
} from 'react-icons/lu';
import { createAssignment } from '@/actions/server/assignment';
import { enhanceAssignmentWithAI } from '@/actions/server/ai';

export default function CreateAssignmentPage() {
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();

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

  // রোল প্রোটেকশন: স্টুডেন্ট ঢুকলে বা লগআউট থাকলে বের করে দেওয়া
  useEffect(() => {
    if (authStatus === 'loading') return;
    if (!session?.user || session.user.role !== 'instructor') {
      router.replace('/assignments');
    }
  }, [session, authStatus, router]);

  const handleChange = e => {
    setErrorMessage('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAIEnhance = async () => {
    if (!formData.title.trim() && !formData.description.trim()) {
      setErrorMessage(
        'Please add a task title or draft notes before enhancing with AI.',
      );
      return;
    }

    setErrorMessage('');
    setAiGenerating(true);

    try {
      const res = await enhanceAssignmentWithAI({
        title: formData.title,
        description: formData.description,
        difficulty: formData.difficulty,
        deadline: formData.deadline,
      });

      if (res?.success) {
        setFormData(prev => ({
          ...prev,
          description: res.enhancedDescription,
        }));
      } else {
        setErrorMessage(res?.message || 'Failed to enhance assignment with AI');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Network or server error while connecting to Groq AI');
    } finally {
      setAiGenerating(false);
    }
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
        }, 1000);
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

  // অথ লোডিং বা স্টুডেন্ট রিডাইরেক্ট চলাকালে ব্ল্যাঙ্ক লোডার দেখানো
  if (authStatus === 'loading' || session?.user?.role !== 'instructor') {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center">
        <LuLoader className="size-6 animate-spin text-primary" />
      </div>
    );
  }

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
          <span>
            Pick a deadline first so AI includes it in the deliverables list.
          </span>
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

      {/* Main Form */}
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

          {/* Difficulty & Deadline */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
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

          {/* Task Instructions & AI Trigger */}
          <div className="space-y-3">
            <div className="flex flex-col">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-content/70">
                Task Guidelines & Evaluation Criteria
              </label>
              <span className="text-[11px] text-neutral-content/40">
                Type rough requirements, then auto-structure below
              </span>
            </div>

            <textarea
              name="description"
              required
              rows={11}
              value={formData.description}
              onChange={handleChange}
              placeholder="Outline project expectations, deliverables, or rough thoughts..."
              className="w-full bg-base-300/30 border border-base-300/80 rounded-xl p-4 text-xs sm:text-sm text-white placeholder:text-neutral-content/30 outline-none focus:border-primary/80 focus:bg-base-300/60 transition-all resize-y leading-relaxed font-sans shadow-inner"
            />

            {/* AI Assistant Banner */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-base-300/20 border border-base-300/50">
              <div className="flex items-center gap-2 text-xs text-neutral-content/70">
                <LuSparkles className="size-4 text-primary shrink-0" />
                <span>
                  Finished drafting? AI will clean, format, and embed your
                  deadline and links.
                </span>
              </div>

              <button
                type="button"
                onClick={handleAIEnhance}
                disabled={aiGenerating}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary/15 hover:bg-primary/25 border border-primary/30 text-primary hover:text-primary-focus text-xs font-medium transition-all active:scale-95 cursor-pointer disabled:opacity-50 shrink-0 w-full sm:w-auto justify-center"
              >
                {aiGenerating ? (
                  <>
                    <LuLoader className="size-3.5 animate-spin" />
                    <span>Structuring Guidelines...</span>
                  </>
                ) : (
                  <>
                    <LuSparkles className="size-3.5" />
                    <span>Polish & Structure with AI</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Form Action Footer */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/assignments"
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-neutral-content/60 hover:text-white transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading || aiGenerating}
            className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-md active:scale-95 cursor-pointer"
          >
            {loading ? 'Publishing...' : 'Publish Assignment'}
          </button>
        </div>
      </form>
    </div>
  );
}
