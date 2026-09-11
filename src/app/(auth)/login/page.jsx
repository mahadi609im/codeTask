'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = e => {
    setErrorMessage('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setErrorMessage('Invalid email or password');
      } else if (result?.ok) {
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
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
          {errorMessage && (
            <div className="p-3 text-xs text-error bg-error/10 border border-error/20 rounded-lg text-center">
              {errorMessage}
            </div>
          )}

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
              <div className="relative border-b border-base-300 group-focus-within:border-primary transition-colors flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-transparent py-2 pr-8 text-sm text-white placeholder:text-neutral-content/25 outline-none"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1 text-neutral-content/50 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-4"
                    >
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" y1="2" x2="22" y2="22" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-4"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-md active:scale-[0.99] cursor-pointer"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="pt-4 border-t border-base-300 text-center">
            <p className="text-xs text-neutral-content/60">
              Don&rsquo;t have an account?{' '}
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
