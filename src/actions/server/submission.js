'use server';

import { getServerSession } from 'next-auth';
import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';
import { authOptions } from '@/app/lib/authOption';
import { dbConnect, collections } from '@/app/lib/dbConnect';

// ১. স্টুডেন্ট সাবমিশন সেভ করা
export async function submitAssignment(payload) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return { success: false, message: 'You must be logged in to submit' };
    }

    const { assignmentId, repoUrl, liveUrl, notes } = payload;

    if (!assignmentId || !repoUrl || !liveUrl || !notes) {
      return { success: false, message: 'All submission fields are required' };
    }

    const submissionsCollection = dbConnect(collections.SUBMISSIONS);

    // একজন স্টুডেন্ট একবারের বেশি সাবমিট করলে আগেরটাই আপডেট হবে (upsert)
    const filter = {
      assignmentId: new ObjectId(assignmentId),
      studentId: new ObjectId(session.user.id),
    };

    const updateDoc = {
      $set: {
        assignmentId: new ObjectId(assignmentId),
        studentId: new ObjectId(session.user.id),
        studentName: session.user.name || 'Anonymous Student',
        studentEmail: session.user.email,
        repoUrl: repoUrl.trim(),
        liveUrl: liveUrl.trim(),
        notes: notes.trim(),
        status: 'pending', // 'pending' | 'accepted' | 'needs_improvement'
        updatedAt: new Date(),
      },
      $setOnInsert: {
        feedback: '',
        createdAt: new Date(),
      },
    };

    await submissionsCollection.updateOne(filter, updateDoc, { upsert: true });

    revalidatePath('/');
    revalidatePath('/assignments');
    revalidatePath('/my-submissions');

    return { success: true, message: 'Assignment submitted successfully!' };
  } catch (error) {
    console.error('Submission error:', error);
    return { success: false, message: 'Failed to submit assignment' };
  }
}

// ২. নির্দিষ্ট অ্যাসাইনমেন্টের সব সাবমিশন ফেচ করা (ইন্সট্রাক্টর) অথবা নিজের সাবমিশন দেখা (স্টুডেন্ট)
export async function getSubmissionsByAssignment(assignmentId) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return { success: false, data: [] };
    }

    const submissionsCollection = dbConnect(collections.SUBMISSIONS);
    const isInstructor = session.user.role === 'instructor';

    let query = { assignmentId: new ObjectId(assignmentId) };

    // স্টুডেন্ট হলে সে শুধু নিজের সাবমিশন দেখতে পারবে
    if (!isInstructor) {
      query.studentId = new ObjectId(session.user.id);
    }

    const rawData = await submissionsCollection
      .find(query)
      .sort({ updatedAt: -1 })
      .toArray();

    const data = rawData.map(item => ({
      ...item,
      _id: item._id.toString(),
      assignmentId: item.assignmentId.toString(),
      studentId: item.studentId.toString(),
      createdAt: item.createdAt ? new Date(item.createdAt).toISOString() : null,
      updatedAt: item.updatedAt ? new Date(item.updatedAt).toISOString() : null,
    }));

    return { success: true, data };
  } catch (error) {
    console.error('Fetch submissions error:', error);
    return { success: false, data: [] };
  }
}

// ৩. লগড-ইন স্টুডেন্টের সব সাবমিশন নিয়ে আসা (My Submissions পেজের জন্য)
export async function getStudentSubmissions() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return { success: false, data: [] };
    }

    const submissionsCollection = dbConnect(collections.SUBMISSIONS);

    const rawData = await submissionsCollection
      .aggregate([
        { $match: { studentId: new ObjectId(session.user.id) } },
        {
          $lookup: {
            from: 'assignments',
            localField: 'assignmentId',
            foreignField: '_id',
            as: 'assignmentDetails',
          },
        },
        {
          $unwind: {
            path: '$assignmentDetails',
            preserveNullAndEmptyArrays: true,
          },
        },
        { $sort: { updatedAt: -1 } },
      ])
      .toArray();

    const data = rawData.map(item => ({
      ...item,
      _id: item._id.toString(),
      assignmentId: item.assignmentId.toString(),
      studentId: item.studentId.toString(),
      assignmentTitle: item.assignmentDetails?.title || 'Untitled Task',
      assignmentDifficulty: item.assignmentDetails?.difficulty || 'beginner',
      submittedAt: item.updatedAt
        ? new Date(item.updatedAt).toISOString()
        : null,
    }));

    return { success: true, data };
  } catch (error) {
    console.error('Fetch student submissions error:', error);
    return { success: false, data: [] };
  }
}

// ৪. ইন্সট্রাক্টর রিভিউ ও স্ট্যাটাস আপডেট করা
export async function reviewSubmission({ submissionId, status, feedback }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'instructor') {
      return {
        success: false,
        message: 'Unauthorized: Instructor access only',
      };
    }

    if (!submissionId || !status || !feedback) {
      return { success: false, message: 'Status and feedback are required' };
    }

    const submissionsCollection = dbConnect(collections.SUBMISSIONS);

    const result = await submissionsCollection.updateOne(
      { _id: new ObjectId(submissionId) },
      {
        $set: {
          status, // 'pending' | 'accepted' | 'needs_improvement'
          feedback: feedback.trim(),
          reviewedAt: new Date(),
          reviewedBy: new ObjectId(session.user.id),
        },
      },
    );

    // matchedCount চেক করা হলো যেন ডকুমেন্ট অপরিবর্তিত বা সামান্য স্পেস চেঞ্জেও এরর না দেয়
    if (result.matchedCount === 1) {
      revalidatePath('/');
      revalidatePath('/assignments');
      revalidatePath('/my-submissions');

      return { success: true, message: 'Review published successfully' };
    }

    return { success: false, message: 'Submission not found' };
  } catch (error) {
    console.error('Review update error:', error);
    return { success: false, message: 'Failed to update review' };
  }
}

// ৫. সাবমিশন আপডেট/রি-সাবমিট করা (স্টুডেন্টের নিজের সাবমিশন)
export async function updateSubmission(payload) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return { success: false, message: 'Unauthorized' };
    }

    const { submissionId, repoUrl, liveUrl, notes } = payload;
    if (!submissionId || !repoUrl || !liveUrl || !notes) {
      return { success: false, message: 'All fields are required' };
    }

    const submissionsCollection = dbConnect(collections.SUBMISSIONS);

    // শুধু নিজের সাবমিশনই আপডেট করতে পারবে
    const result = await submissionsCollection.updateOne(
      {
        _id: new ObjectId(submissionId),
        studentId: new ObjectId(session.user.id),
      },
      {
        $set: {
          repoUrl: repoUrl.trim(),
          liveUrl: liveUrl.trim(),
          notes: notes.trim(),
          status: 'pending', // আপডেট করলে স্ট্যাটাস আবার pending হবে
          updatedAt: new Date(),
        },
      },
    );

    if (result.matchedCount === 1) {
      revalidatePath('/');
      revalidatePath('/assignments');
      revalidatePath('/my-submissions');

      return { success: true, message: 'Submission updated successfully' };
    }
    return { success: false, message: 'Could not update submission' };
  } catch (error) {
    console.error('Update submission error:', error);
    return { success: false, message: 'Internal server error' };
  }
}

// ৬. সাবমিশন ডিলিট করা
export async function deleteSubmission(submissionId) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return { success: false, message: 'Unauthorized' };
    }

    const submissionsCollection = dbConnect(collections.SUBMISSIONS);

    const result = await submissionsCollection.deleteOne({
      _id: new ObjectId(submissionId),
      studentId: new ObjectId(session.user.id),
    });

    if (result.deletedCount === 1) {
      revalidatePath('/');
      revalidatePath('/assignments');
      revalidatePath('/my-submissions');

      return { success: true, message: 'Submission removed successfully' };
    }
    return { success: false, message: 'Failed to delete submission' };
  } catch (error) {
    console.error('Delete submission error:', error);
    return { success: false, message: 'Internal server error' };
  }
}
