'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  // সেশন লোড না হওয়া পর্যন্ত অথবা আনঅথেন্টিকেটেড থাকলে সাইডবার/লেআউটের কিছুই স্ক্রিনে আঁকা হবে না
  if (status === 'loading' || status === 'unauthenticated') {
    return null;
  }

  const user = session?.user;

  return (
    <div className="drawer lg:drawer-open h-screen w-full overflow-hidden bg-base-100">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* Main Content Area */}
      <div className="drawer-content flex flex-col h-screen w-full min-w-0 overflow-hidden">
        {/* Navbar */}
        <Navbar drawerId="dashboard-drawer" />

        {/* Scrollable Container */}
        <main className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-6 md:p-8">
          <div className="max-w-7xl w-full mx-auto pb-12">{children}</div>
        </main>
      </div>

      {/* Drawer Sidebar */}
      <div className="drawer-side h-screen overflow-y-auto z-40">
        <label
          htmlFor="dashboard-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <Sidebar role={user?.role} drawerId="dashboard-drawer" />
      </div>
    </div>
  );
}
