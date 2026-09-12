import Link from 'next/link';

export default function PendingSubmissionsQueue({ recentSubmissions }) {
  const formatRelativeTime = isoString => {
    if (!isoString) return 'Just now';
    const diff = Math.floor((new Date() - new Date(isoString)) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getDifficultyBadge = level => {
    switch ((level || '').toLowerCase()) {
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

  return (
    <div className="p-4 sm:p-6 rounded-xl bg-base-200 border border-base-300 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-white">
            Submissions Awaiting Review
          </h3>
          <p className="text-xs text-neutral-content/60">
            Verify student code deliverables and generate qualitative notes.
          </p>
        </div>
        <Link
          href="/assignments"
          className="text-xs text-primary hover:underline self-start sm:self-auto"
        >
          Manage assignments &rarr;
        </Link>
      </div>

      {recentSubmissions.length === 0 ? (
        <div className="py-8 text-center text-xs text-neutral-content/50">
          No pending submissions right now. All tasks have been evaluated!
        </div>
      ) : (
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
                  <tr key={sub.id} className="group  transition-colors">
                    <td className="py-3 pr-3 whitespace-nowrap">
                      <p className="font-medium text-white group-hover:text-primary transition-colors">
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
                        {formatRelativeTime(sub.submittedAt)}
                      </p>
                    </td>
                    <td className="py-3 pr-3 whitespace-nowrap">
                      <span
                        className={`text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded border capitalize ${getDifficultyBadge(sub.difficulty)}`}
                      >
                        {sub.difficulty}
                      </span>
                    </td>
                    <td className="py-3 pr-3 whitespace-nowrap">
                      <span className="text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded-md border bg-warning/15 text-warning border-warning/30">
                        Pending
                      </span>
                    </td>
                    <td className="py-3 text-right whitespace-nowrap">
                      <Link
                        href={`/assignments/${sub.assignmentId}`}
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
      )}
    </div>
  );
}
