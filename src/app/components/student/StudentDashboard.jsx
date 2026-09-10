import Link from 'next/link';

export default function StudentDashboard() {
  const stats = [
    {
      label: 'Available Assignments',
      count: 6,
      color: 'text-info',
      badge: 'Active',
    },
    {
      label: 'Pending Reviews',
      count: 2,
      color: 'text-warning',
      badge: 'Under Review',
    },
    {
      label: 'Accepted Work',
      count: 8,
      color: 'text-success',
      badge: 'Completed',
    },
    {
      label: 'Needs Improvement',
      count: 1,
      color: 'text-error',
      badge: 'Action Required',
    },
  ];

  const recentTasks = [
    {
      id: 'task-1',
      title: 'Build a Fullstack Authentication System',
      difficulty: 'Intermediate',
      deadline: 'Sep 15, 2026',
      status: 'Pending',
    },
    {
      id: 'task-2',
      title: 'Responsive Dashboard with Tailwind & DaisyUI',
      difficulty: 'Beginner',
      deadline: 'Sep 18, 2026',
      status: 'Not Submitted',
    },
    {
      id: 'task-3',
      title: 'Next.js Dynamic API Routes & Error Handling',
      difficulty: 'Advanced',
      deadline: 'Sep 12, 2026',
      status: 'Needs Improvement',
      feedback: 'Check your try-catch block inside the POST route handler.',
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
        return 'bg-success/20 text-success border border-success/30';
      case 'pending':
        return 'bg-warning/20 text-warning border border-warning/30';
      case 'needs improvement':
        return 'bg-error/20 text-error border border-error/30';
      default:
        return 'bg-base-300 text-neutral-content/80';
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
            My Learning Space
          </h2>
          <p className="text-xs sm:text-sm text-neutral-content/70 mt-1">
            Track your tasks, submit assignments, and review instructor
            feedback.
          </p>
        </div>
        <Link
          href="/assignments"
          className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs sm:text-sm font-medium transition-colors shadow-sm"
        >
          Browse All Assignments
        </Link>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className="p-3.5 sm:p-5 rounded-xl bg-base-200 border border-base-300 flex flex-col justify-between"
          >
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-1.5">
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-content/60 truncate">
                {item.label}
              </span>
              <span className="self-start xl:self-auto text-[9px] sm:text-[10px] font-medium px-2 py-0.5 rounded-full bg-base-300 text-neutral-content/80 whitespace-nowrap">
                {item.badge}
              </span>
            </div>
            <p
              className={`text-2xl sm:text-3xl font-bold mt-2 sm:mt-3 ${item.color}`}
            >
              {item.count}
            </p>
          </div>
        ))}
      </div>

      {/* Task & Feedback List */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-semibold text-white">
            Recent Activities
          </h3>
          <Link
            href="/my-submissions"
            className="text-xs text-primary hover:underline"
          >
            View full history &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {recentTasks.map(task => (
            <div
              key={task.id}
              className="p-4 sm:p-5 rounded-xl bg-base-200 border border-base-300 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors"
            >
              <div className="space-y-2.5 max-w-2xl min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-[10px] sm:text-[11px] font-medium px-2.5 py-0.5 rounded-md border ${getDifficultyBadge(
                      task.difficulty,
                    )}`}
                  >
                    {task.difficulty}
                  </span>
                  <span
                    className={`text-[10px] sm:text-[11px] font-medium px-2.5 py-0.5 rounded-md ${getStatusBadge(
                      task.status,
                    )}`}
                  >
                    {task.status}
                  </span>
                  <span className="text-[11px] sm:text-xs text-neutral-content/60">
                    Due: {task.deadline}
                  </span>
                </div>

                <h4 className="text-sm sm:text-base font-semibold text-white leading-snug wrap-break-word">
                  {task.title}
                </h4>

                {task.feedback && (
                  <div className="p-3 rounded-lg bg-base-300/60 border border-error/20 text-xs text-neutral-content/90">
                    <span className="font-semibold text-error">
                      Instructor Note:
                    </span>{' '}
                    {task.feedback}
                  </div>
                )}
              </div>

              <div className="w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-base-300/60">
                {task.status === 'Not Submitted' ||
                task.status === 'Needs Improvement' ? (
                  <Link
                    href={`/assignments/${task.id}`}
                    className="w-full md:w-auto text-center inline-block px-4 py-2 text-xs font-medium rounded-lg bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 transition-colors"
                  >
                    {task.status === 'Needs Improvement'
                      ? 'Resubmit Solution'
                      : 'Submit Task'}
                  </Link>
                ) : (
                  <Link
                    href={`/my-submissions/${task.id}`}
                    className="w-full md:w-auto text-center inline-block px-4 py-2 text-xs font-medium rounded-lg bg-base-300 hover:bg-base-300/80 text-white transition-colors"
                  >
                    View Submission
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
