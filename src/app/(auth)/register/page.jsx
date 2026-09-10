'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    instructorKey: '',
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (role === 'instructor' && !formData.instructorKey.trim()) {
      alert('Please provide the Instructor Secret Key');
      return;
    }

    console.log({ ...formData, role });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-base-100 px-4 py-12 selection:bg-primary/20 selection:text-primary">
      <div className="w-full max-w-105 space-y-7">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <Link
            href="/"
            className="text-3xl font-extrabold tracking-tight text-white transition-transform active:scale-95"
          >
            Code<span className="text-primary">Task</span>
          </Link>
          <p className="text-xs text-neutral-content/60 tracking-wide font-normal">
            Create an account to get started
          </p>
        </div>

        {/* Form Card */}
        <div className="p-8 rounded-2xl bg-base-200 border border-base-300 shadow-xl space-y-6">
          {/* Role Switcher */}
          <div className="grid grid-cols-2 p-1 bg-base-100 rounded-xl border border-base-300">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                role === 'student'
                  ? 'bg-base-200 text-white shadow-sm'
                  : 'text-neutral-content/60 hover:text-white'
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole('instructor')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                role === 'instructor'
                  ? 'bg-base-200 text-white shadow-sm'
                  : 'text-neutral-content/60 hover:text-white'
              }`}
            >
              Instructor
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-1 group">
              <label className="text-[11px] font-medium uppercase tracking-wider text-neutral-content/60 group-focus-within:text-primary transition-colors">
                Full Name
              </label>
              <div className="border-b border-base-300 group-focus-within:border-primary transition-colors">
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Alex Johnson"
                  className="w-full bg-transparent py-2 text-sm text-white placeholder:text-neutral-content/25 outline-none"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1 group">
              <label className="text-[11px] font-medium uppercase tracking-wider text-neutral-content/60 group-focus-within:text-primary transition-colors">
                Email Address
              </label>
              <div className="border-b border-base-300 group-focus-within:border-primary transition-colors">
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@domain.com"
                  className="w-full bg-transparent py-2 text-sm text-white placeholder:text-neutral-content/25 outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1 group">
              <label className="text-[11px] font-medium uppercase tracking-wider text-neutral-content/60 group-focus-within:text-primary transition-colors">
                Password
              </label>
              <div className="border-b border-base-300 group-focus-within:border-primary transition-colors">
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-transparent py-2 text-sm text-white placeholder:text-neutral-content/25 outline-none"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1 group">
              <label className="text-[11px] font-medium uppercase tracking-wider text-neutral-content/60 group-focus-within:text-primary transition-colors">
                Confirm Password
              </label>
              <div className="border-b border-base-300 group-focus-within:border-primary transition-colors">
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-transparent py-2 text-sm text-white placeholder:text-neutral-content/25 outline-none"
                />
              </div>
            </div>

            {/* Instructor Secret Key (Conditional) */}
            {role === 'instructor' && (
              <div className="space-y-1 group">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-medium uppercase tracking-wider text-warning group-focus-within:text-warning transition-colors">
                    Instructor Secret Key
                  </label>
                  <span className="text-[10px] text-neutral-content/40">
                    Required
                  </span>
                </div>
                <div className="border-b border-warning/40 group-focus-within:border-warning transition-colors">
                  <input
                    type="password"
                    name="instructorKey"
                    required={role === 'instructor'}
                    value={formData.instructorKey}
                    onChange={handleChange}
                    placeholder="Enter institutional secret key"
                    className="w-full bg-transparent py-2 text-sm text-white placeholder:text-neutral-content/25 outline-none"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-2 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-md active:scale-[0.99] cursor-pointer"
            >
              Register as {role === 'instructor' ? 'Instructor' : 'Student'}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="pt-4 border-t border-base-300 text-center">
            <p className="text-xs text-neutral-content/60">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-primary hover:underline font-semibold ml-0.5"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
