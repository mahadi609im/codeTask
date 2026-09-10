'use client';

import Link from 'next/link';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export default function InstructorDashboard() {
  const metricStats = [
    {
      label: 'Total Assignments',
      value: '14',
      change: '+2 this week',
      color: 'text-primary',
    },
    {
      label: 'Pending Submissions',
      value: '28',
      change: '8 high priority',
      color: 'text-warning',
    },
    {
      label: 'Acceptance Rate',
      value: '78.4%',
      change: '+4.1% overall',
      color: 'text-success',
    },
    {
      label: 'Needs Improvement',
      value: '12',
      change: 'Action required',
      color: 'text-error',
    },
  ];

  const statusDistribution = [
    { name: 'Accepted', value: 142, color: '#10b981' },
    { name: 'Pending', value: 28, color: '#f59e0b' },
    { name: 'Needs Improvement', value: 24, color: '#ef4444' },
  ];

  const difficultyAnalytics = [
    { difficulty: 'Beginner', accepted: 65, revisions: 4 },
    { difficulty: 'Intermediate', accepted: 52, revisions: 11 },
    { difficulty: 'Advanced', accepted: 25, revisions: 9 },
  ];

  const recentSubmissions = [
    {
      id: 'sub-101',
      studentName: 'Rahim Ahmed',
      email: 'rahim.dev@gmail.com',
      assignmentTitle: 'Next.js App Router Auth with Middleware',
      difficulty: 'Advanced',
      submittedAt: '12 mins ago',
      status: 'Pending',
    },
    {
      id: 'sub-102',
      studentName: 'Samira Khan',
      email: 'samira.ui@outlook.com',
      assignmentTitle: 'Tailwind Responsive Dashboard Layout',
      difficulty: 'Beginner',
      submittedAt: '45 mins ago',
      status: 'Accepted',
    },
    {
      id: 'sub-103',
      studentName: 'Tanvir Hossain',
      email: 'tanvir@code.io',
      assignmentTitle: 'MongoDB Schema Optimization & Indexing',
      difficulty: 'Intermediate',
      submittedAt: '2 hours ago',
      status: 'Needs Improvement',
    },
  ];

  const getDifficultyBadge = level => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-success/15 text-success border-success/30';
      case 'intermediate':
        return 'bg-warning/15 text-warning border-warning/30';
      case 'advanced':
        return 'bg-error/15 text-error border-error/30';
      default:
        return 'bg-base-300 text-neutral-content';
    }
  };

  const getStatusBadge = status => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return 'bg-success/15 text-success border-success/30';
      case 'pending':
        return 'bg-warning/15 text-warning border-warning/30';
      case 'needs improvement':
        return 'bg-error/15 text-error border-error/30';
      default:
        return 'bg-base-300 text-neutral-content';
    }
  };

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
            submissions.
          </p>
        </div>
        <Link
          href="/assignments/new"
          className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs sm:text-sm font-medium transition-colors shadow-sm"
        >
          + Create Assignment
        </Link>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {metricStats.map((item, idx) => (
          <div
            key={idx}
            className="p-3.5 sm:p-5 rounded-xl bg-base-200 border border-base-300 flex flex-col justify-between"
          >
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-content/60 truncate">
              {item.label}
            </span>
            <p className={`text-2xl sm:text-3xl font-bold mt-2 ${item.color}`}>
              {item.value}
            </p>
            <span className="text-[10px] sm:text-xs text-neutral-content/60 mt-1 truncate">
              {item.change}
            </span>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Donut Chart */}
        <div className="lg:col-span-5 p-4 sm:p-6 rounded-xl bg-base-200 border border-base-300 flex flex-col">
          <h3 className="text-sm sm:text-base font-semibold text-white">
            Submission Distribution
          </h3>
          <p className="text-xs text-neutral-content/60 mt-0.5">
            Breakdown across current evaluation statuses
          </p>

          <div className="h-56 sm:h-64 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-base-300 text-[11px] sm:text-xs">
            {statusDistribution.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-neutral-content/80">
                  {item.name}:{' '}
                  <strong className="text-white">{item.value}</strong>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="lg:col-span-7 p-4 sm:p-6 rounded-xl bg-base-200 border border-base-300 flex flex-col">
          <h3 className="text-sm sm:text-base font-semibold text-white">
            Performance by Difficulty
          </h3>
          <p className="text-xs text-neutral-content/60 mt-0.5">
            Accepted submissions versus flagged revisions
          </p>

          <div className="h-56 sm:h-64 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={difficultyAnalytics}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#334155"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="difficulty"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar
                  dataKey="accepted"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                  name="Accepted"
                />
                <Bar
                  dataKey="revisions"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                  name="Needs Revision"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-end gap-4 pt-3 border-t border-base-300 text-[11px] sm:text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded bg-primary" />
              <span className="text-neutral-content/80">Accepted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded bg-error" />
              <span className="text-neutral-content/80">Needs Revision</span>
            </div>
          </div>
        </div>
      </div>

      {/* Submissions Queue Table */}
      <div className="p-4 sm:p-6 rounded-xl bg-base-200 border border-base-300 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-white">
              Submissions Awaiting Review
            </h3>
            <p className="text-xs text-neutral-content/60">
              Verify student code deliverables and generate AI feedback notes.
            </p>
          </div>
          <Link
            href="/submissions"
            className="text-xs text-primary hover:underline self-start sm:self-auto"
          >
            View all submissions &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle px-4 sm:px-0">
            <table className="min-w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-base-300 text-neutral-content/60 text-[11px] uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Student</th>
                  <th className="pb-3 font-semibold">Assignment</th>
                  <th className="pb-3 font-semibold">Difficulty</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-300/60">
                {recentSubmissions.map(sub => (
                  <tr
                    key={sub.id}
                    className="hover:bg-base-300/30 transition-colors"
                  >
                    <td className="py-3 pr-3 whitespace-nowrap">
                      <p className="font-medium text-white">
                        {sub.studentName}
                      </p>
                      <p className="text-[11px] text-neutral-content/60">
                        {sub.email}
                      </p>
                    </td>
                    <td className="py-3 pr-3 min-w-[180px] sm:min-w-0">
                      <p className="text-white font-medium sm:font-normal truncate max-w-[200px] sm:max-w-xs">
                        {sub.assignmentTitle}
                      </p>
                      <p className="text-[11px] text-neutral-content/60">
                        {sub.submittedAt}
                      </p>
                    </td>
                    <td className="py-3 pr-3 whitespace-nowrap">
                      <span
                        className={`text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded border ${getDifficultyBadge(sub.difficulty)}`}
                      >
                        {sub.difficulty}
                      </span>
                    </td>
                    <td className="py-3 pr-3 whitespace-nowrap">
                      <span
                        className={`text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded-md border ${getStatusBadge(sub.status)}`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-3 text-right whitespace-nowrap">
                      <Link
                        href={`/submissions/${sub.id}`}
                        className="inline-block px-3 py-1.5 rounded-md bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 text-xs font-medium transition-colors"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
