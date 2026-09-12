'use server';

import { getServerSession } from 'next-auth';
import { ObjectId } from 'mongodb';
import { authOptions } from '@/app/lib/authOption';
import { dbConnect, collections } from '@/app/lib/dbConnect';

export async function getStudentDashboardAnalytics() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return { success: false, message: 'Unauthorized' };
    }

    const assignmentsCol = dbConnect(collections.ASSIGNMENTS);
    const submissionsCol = dbConnect(collections.SUBMISSIONS);

    const studentObjectId = new ObjectId(session.user.id);

    // ১. মোট অ্যাসাইনমেন্ট সংখ্যা
    const totalAssignments = await assignmentsCol.countDocuments();

    // ২. স্টুডেন্টের নিজস্ব সব সাবমিশন
    const studentSubmissions = await submissionsCol
      .find({ studentId: studentObjectId })
      .toArray();

    const counts = {
      pending: 0,
      accepted: 0,
      needs_improvement: 0,
    };

    const submissionMap = new Map();
    studentSubmissions.forEach(sub => {
      if (counts[sub.status] !== undefined) {
        counts[sub.status] += 1;
      }
      submissionMap.set(sub.assignmentId.toString(), sub);
    });

    // ৩. সাম্প্রতিক ৫টি অ্যাসাইনমেন্ট এবং স্টুডেন্টের সাবমিশন স্ট্যাটাস ম্যাচ করা
    const recentAssignmentsRaw = await assignmentsCol
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    const recentTasks = recentAssignmentsRaw.map(task => {
      const sub = submissionMap.get(task._id.toString());

      let status = 'Not Submitted';
      let feedback = '';

      if (sub) {
        if (sub.status === 'accepted') status = 'Accepted';
        else if (sub.status === 'needs_improvement')
          status = 'Needs Improvement';
        else status = 'Pending';

        feedback = sub.feedback || '';
      }

      return {
        id: task._id.toString(),
        title: task.title || 'Untitled Assignment',
        difficulty: task.difficulty || 'Beginner',
        deadline: task.deadline
          ? new Date(task.deadline).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : 'No deadline',
        status,
        feedback,
      };
    });

    const stats = [
      {
        label: 'Available Assignments',
        count: totalAssignments,
        color: 'text-info',
        badge: 'Curriculum',
      },
      {
        label: 'Pending Reviews',
        count: counts.pending,
        color: 'text-warning',
        badge: 'In Review',
      },
      {
        label: 'Accepted Work',
        count: counts.accepted,
        color: 'text-success',
        badge: 'Completed',
      },
      {
        label: 'Needs Improvement',
        count: counts.needs_improvement,
        color: 'text-error',
        badge: 'Action Required',
      },
    ];

    return {
      success: true,
      data: {
        stats,
        recentTasks,
      },
    };
  } catch (error) {
    console.error('Student dashboard analytics error:', error);
    return { success: false, message: 'Failed to aggregate student analytics' };
  }
}
