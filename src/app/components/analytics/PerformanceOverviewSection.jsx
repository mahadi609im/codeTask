'use client';

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

export default function PerformanceOverviewSection({
  metrics,
  statusDistribution,
  difficultyAnalytics,
}) {
  const metricStats = [
    {
      label: 'Total Assignments',
      value: metrics.totalAssignments,
      change: 'Active in curriculum',
      color: 'text-primary',
    },
    {
      label: 'Pending Submissions',
      value: metrics.pendingSubmissions,
      change:
        metrics.pendingSubmissions > 0 ? 'Requires evaluation' : 'All clear',
      color: 'text-warning',
    },
    {
      label: 'Acceptance Rate',
      value: metrics.acceptanceRate,
      change: 'Overall performance',
      color: 'text-success',
    },
    {
      label: 'Needs Improvement',
      value: metrics.needsImprovement,
      change: 'Action required',
      color: 'text-error',
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* ৪টি মূল স্ট্যাট কার্ড */}
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

      {/* Donut ও Bar Chart গ্রিড */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Donut Chart: Submission Distribution */}
        <div className="lg:col-span-5 p-4 sm:p-6 rounded-xl bg-base-200 border border-base-300 flex flex-col justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-white">
              Submission Distribution
            </h3>
            <p className="text-xs text-neutral-content/60 mt-0.5">
              Breakdown across current evaluation statuses
            </p>
          </div>

          <div className="h-56 sm:h-64 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={78}
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

        {/* Bar Chart: Performance by Difficulty */}
        <div className="lg:col-span-7 p-4 sm:p-6 rounded-xl bg-base-200 border border-base-300 flex flex-col justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-white">
              Performance by Difficulty
            </h3>
            <p className="text-xs text-neutral-content/60 mt-0.5">
              Accepted submissions versus flagged revisions
            </p>
          </div>

          <div className="h-56 sm:h-64 w-full my-2">
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
    </div>
  );
}
