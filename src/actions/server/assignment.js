'use server';

import { getServerSession } from 'next-auth';
import { ObjectId } from 'mongodb';
import { authOptions } from '@/app/lib/authOption';
import { dbConnect, collections } from '@/app/lib/dbConnect';

// ১. নতুন অ্যাসাইনমেন্ট তৈরি
export async function createAssignment(payload) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'instructor') {
      return {
        success: false,
        message: 'Unauthorized: Instructor access required',
      };
    }

    const { title, description, deadline, difficulty } = payload;

    if (!title || !description || !deadline || !difficulty) {
      return { success: false, message: 'All fields are required' };
    }

    const assignmentsCollection = dbConnect(collections.ASSIGNMENTS);

    const newAssignment = {
      title: title.trim(),
      description: description.trim(),
      deadline: new Date(deadline),
      difficulty,
      createdBy: new ObjectId(session.user.id),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await assignmentsCollection.insertOne(newAssignment);

    return {
      success: true,
      message: 'Assignment created successfully',
      assignmentId: result.insertedId.toString(),
    };
  } catch (error) {
    console.error('Failed to create assignment:', error);
    return {
      success: false,
      message: 'Internal server error while creating assignment',
    };
  }
}

// ২. সব অ্যাসাইনমেন্ট তুলে আনা
export async function getAssignments() {
  try {
    const assignmentsCollection = dbConnect(collections.ASSIGNMENTS);
    const rawAssignments = await assignmentsCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Next.js serialization-এর জন্য ObjectId ও Date অবজেক্ট স্ট্রিংয়ে রূপান্তর
    const assignments = rawAssignments.map(item => ({
      ...item,
      _id: item._id.toString(),
      createdBy: item.createdBy ? item.createdBy.toString() : null,
      deadline: item.deadline ? new Date(item.deadline).toISOString() : null,
      createdAt: item.createdAt ? new Date(item.createdAt).toISOString() : null,
      updatedAt: item.updatedAt ? new Date(item.updatedAt).toISOString() : null,
    }));

    return { success: true, data: assignments };
  } catch (error) {
    console.error('Failed to get assignments:', error);
    return { success: false, data: [] };
  }
}

// ৩. অ্যাসাইনমেন্ট ডিলিট করা
export async function deleteAssignment(id) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'instructor') {
      return {
        success: false,
        message: 'Unauthorized: Instructor access required',
      };
    }

    const assignmentsCollection = dbConnect(collections.ASSIGNMENTS);
    const result = await assignmentsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 1) {
      return { success: true, message: 'Assignment deleted successfully' };
    }

    return { success: false, message: 'Assignment not found' };
  } catch (error) {
    console.error('Delete error:', error);
    return { success: false, message: 'Failed to delete assignment' };
  }
}

// ৪. আইডি দিয়ে নির্দিষ্ট একটি অ্যাসাইনমেন্ট তুলে আনা
export async function getAssignmentById(id) {
  try {
    const assignmentsCollection = dbConnect(collections.ASSIGNMENTS);
    const item = await assignmentsCollection.findOne({ _id: new ObjectId(id) });

    if (!item) {
      return { success: false, data: null, message: 'Assignment not found' };
    }

    const assignment = {
      ...item,
      _id: item._id.toString(),
      createdBy: item.createdBy ? item.createdBy.toString() : null,
      deadline: item.deadline ? new Date(item.deadline).toISOString() : null,
      createdAt: item.createdAt ? new Date(item.createdAt).toISOString() : null,
      updatedAt: item.updatedAt ? new Date(item.updatedAt).toISOString() : null,
    };

    return { success: true, data: assignment };
  } catch (error) {
    console.error('Failed to get assignment details:', error);
    return { success: false, data: null, message: 'Failed to fetch details' };
  }
}
