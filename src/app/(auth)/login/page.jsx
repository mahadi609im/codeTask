'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log(formData);
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
            Sign in to access your dashboard
          </p>
        </div>

        {/* Form Card */}
        <div className="p-8 rounded-2xl bg-base-200 border border-base-300 shadow-xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
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

            {/* Password Field */}
            <div className="space-y-1 group">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-medium uppercase tracking-wider text-neutral-content/60 group-focus-within:text-primary transition-colors">
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs text-neutral-content/60 hover:text-primary transition-colors font-medium"
                >
                  Forgot?
                </a>
              </div>
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

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-2 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-md active:scale-[0.99] cursor-pointer"
            >
              Sign In
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="pt-4 border-t border-base-300 text-center">
            <p className="text-xs text-neutral-content/60">
              Don't have an account?{' '}
              <Link
                href="/register"
                className="text-primary hover:underline font-semibold ml-0.5"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
