'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/authOption';
import { dbConnect, collections } from '@/app/lib/dbConnect';

export async function getInstructorDashboardAnalytics() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'instructor') {
      return {
        success: false,
        message: 'Unauthorized: Instructor access only',
      };
    }

    const assignmentsCol = dbConnect(collections.ASSIGNMENTS);
    const submissionsCol = dbConnect(collections.SUBMISSIONS);

    // ১. মোট অ্যাসাইনমেন্ট সংখ্যা
    const totalAssignments = await assignmentsCol.countDocuments();

    // ২. স্ট্যাটাস ডিস্ট্রিবিউশন
    const statusAgg = await submissionsCol
      .aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }])
      .toArray();

    const counts = { pending: 0, accepted: 0, needs_improvement: 0 };
    let totalSubmissions = 0;

    statusAgg.forEach(item => {
      if (counts[item._id] !== undefined) {
        counts[item._id] = item.count;
      }
      totalSubmissions += item.count;
    });

    const statusDistribution = [
      { name: 'Accepted', value: counts.accepted, color: '#10b981' },
      { name: 'Pending', value: counts.pending, color: '#f59e0b' },
      {
        name: 'Needs Improvement',
        value: counts.needs_improvement,
        color: '#ef4444',
      },
    ];

    // ৩. অ্যাকসেপ্টেন্স রেট হিসাব
    const acceptanceRate =
      totalSubmissions > 0
        ? ((counts.accepted / totalSubmissions) * 100).toFixed(1)
        : '0.0';

    // ৪. ডিফিকাল্টি অনুযায়ী অ্যানালিটিক্স
    const difficultyAgg = await submissionsCol
      .aggregate([
        {
          $lookup: {
            from: 'assignments',
            localField: 'assignmentId',
            foreignField: '_id',
            as: 'assignment',
          },
        },
        { $unwind: '$assignment' },
        {
          $group: {
            _id: { $toLower: '$assignment.difficulty' },
            accepted: {
              $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] },
            },
            revisions: {
              $sum: {
                $cond: [{ $eq: ['$status', 'needs_improvement'] }, 1, 0],
              },
            },
          },
        },
      ])
      .toArray();

    const difficultyMap = {
      beginner: { accepted: 0, revisions: 0 },
      intermediate: { accepted: 0, revisions: 0 },
      advanced: { accepted: 0, revisions: 0 },
    };
    difficultyAgg.forEach(item => {
      if (difficultyMap[item._id]) {
        difficultyMap[item._id] = {
          accepted: item.accepted,
          revisions: item.revisions,
        };
      }
    });

    const difficultyAnalytics = [
      {
        difficulty: 'Beginner',
        accepted: difficultyMap.beginner.accepted,
        revisions: difficultyMap.beginner.revisions,
      },
      {
        difficulty: 'Intermediate',
        accepted: difficultyMap.intermediate.accepted,
        revisions: difficultyMap.intermediate.revisions,
      },
      {
        difficulty: 'Advanced',
        accepted: difficultyMap.advanced.accepted,
        revisions: difficultyMap.advanced.revisions,
      },
    ];

    // ৫. রিভিউয়ের অপেক্ষায় থাকা সাবমিশন তালিকা
    const recentSubsRaw = await submissionsCol
      .aggregate([
        { $match: { status: 'pending' } },
        {
          $lookup: {
            from: 'assignments',
            localField: 'assignmentId',
            foreignField: '_id',
            as: 'assignment',
          },
        },
        { $unwind: '$assignment' },
        { $sort: { updatedAt: -1 } },
        { $limit: 5 },
      ])
      .toArray();

    const recentSubmissions = recentSubsRaw.map(sub => ({
      id: sub._id.toString(),
      assignmentId: sub.assignmentId.toString(),
      studentName: sub.studentName || 'Student',
      email: sub.studentEmail || 'No email',
      assignmentTitle: sub.assignment?.title || 'Untitled Task',
      difficulty: sub.assignment?.difficulty || 'Beginner',
      submittedAt: sub.updatedAt
        ? new Date(sub.updatedAt).toISOString()
        : new Date().toISOString(),
      status: 'Pending',
    }));

    // ৬. ফোকাস এরিয়া: যেসব শিক্ষার্থীর সাহায্য প্রয়োজন (Struggling Students)
    const strugglingAgg = await submissionsCol
      .aggregate([
        { $match: { status: 'needs_improvement' } },
        {
          $lookup: {
            from: 'assignments',
            localField: 'assignmentId',
            foreignField: '_id',
            as: 'assignment',
          },
        },
        { $unwind: { path: '$assignment', preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: '$studentEmail',
            studentName: { $first: '$studentName' },
            email: { $first: '$studentEmail' },
            flaggedCount: { $sum: 1 },
            flaggedTasks: { $push: '$assignment.title' },
            lastNote: { $first: '$notes' },
          },
        },
        { $sort: { flaggedCount: -1 } },
        { $limit: 6 },
      ])
      .toArray();

    const strugglingStudents = strugglingAgg.map(item => ({
      email: item.email,
      studentName: item.studentName || 'Anonymous Student',
      flaggedCount: item.flaggedCount,
      tasks: (item.flaggedTasks || []).filter(Boolean),
      lastNote: item.lastNote || 'No student notes recorded',
    }));

    return {
      success: true,
      data: {
        metrics: {
          totalAssignments,
          pendingSubmissions: counts.pending,
          acceptanceRate: `${acceptanceRate}%`,
          needsImprovement: counts.needs_improvement,
        },
        statusDistribution,
        difficultyAnalytics,
        recentSubmissions,
        strugglingStudents,
      },
    };
  } catch (error) {
    console.error('Instructor dashboard analytics error:', error);
    return { success: false, message: 'Failed to load analytics data' };
  }
}
