'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getInstructorDashboardAnalytics } from '@/actions/server/analytics';
import PerformanceOverviewSection from '@/app/components/analytics/PerformanceOverviewSection';
import StrugglingStudentsSection from '@/app/components/analytics/StrugglingStudentsSection';
import PendingSubmissionsQueue from '@/app/components/analytics/PendingSubmissionsQueue';

export default function InstructorDashboard() {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    metrics: {
      totalAssignments: 0,
      pendingSubmissions: 0,
      acceptanceRate: '0%',
      needsImprovement: 0,
    },
    statusDistribution: [],
    difficultyAnalytics: [],
    recentSubmissions: [],
    strugglingStudents: [],
  });

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const res = await getInstructorDashboardAnalytics();
      if (res?.success && res.data) {
        setAnalyticsData(res.data);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 sm:space-y-8 w-full animate-pulse">
        <div className="h-10 bg-base-300/40 rounded-xl w-1/3" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[1, 2, 3, 4].map(n => (
            <div
              key={n}
              className="h-28 bg-base-200 border border-base-300 rounded-xl"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          <div className="lg:col-span-5 h-72 bg-base-200 border border-base-300 rounded-xl" />
          <div className="lg:col-span-7 h-72 bg-base-200 border border-base-300 rounded-xl" />
        </div>
        <div className="h-64 bg-base-200 border border-base-300 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
            Performance Overview
          </h2>
          <p className="text-xs sm:text-sm text-neutral-content/70 mt-1">
            Real-time assignment metrics, acceptance rates, and student
            performance tracking.
          </p>
        </div>
        <Link
          href="/assignments/new"
          className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs sm:text-sm font-medium transition-colors shadow-sm"
        >
          + Create Assignment
        </Link>
      </div>

      {/* ১. পারফরম্যান্স ওভারভিউ (মেট্রিক কার্ডস + Recharts ডোনাট ও বার চার্ট) */}
      <PerformanceOverviewSection
        metrics={analyticsData.metrics}
        statusDistribution={analyticsData.statusDistribution}
        difficultyAnalytics={analyticsData.difficultyAnalytics}
      />

      {/* ২. মেন্টরশিপ দরকার এমন শিক্ষার্থী (Struggling Students) */}
      <StrugglingStudentsSection
        strugglingStudents={analyticsData.strugglingStudents}
      />

      {/* ৩. পর্যালোচনার অপেক্ষায় থাকা সাবমিশন তালিকা (Pending Review Queue) */}
      <PendingSubmissionsQueue
        recentSubmissions={analyticsData.recentSubmissions}
      />
    </div>
  );
}
