'use server';

import { collections, dbConnect } from '@/app/lib/dbConnect';
import bcrypt from 'bcryptjs';

const INSTRUCTOR_SECRET = process.env.INSTRUCTOR_SECRET_KEY;

export const postUser = async payload => {
  const { email, password, name, role = 'student', instructorKey } = payload;

  if (!email || !password || !name) {
    return { success: false, message: 'All fields are required' };
  }

  // Instructor Key Verification
  if (role === 'instructor') {
    if (!instructorKey || instructorKey !== INSTRUCTOR_SECRET) {
      return { success: false, message: 'Invalid Instructor Secret Key' };
    }
  }

  // Check if user already exists
  const isExist = await dbConnect(collections.USERS).findOne({ email });
  if (isExist) {
    return { success: false, message: 'User with this email already exists' };
  }

  // Hash Password
  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = {
    name,
    email,
    password: hashedPassword,
    role: role === 'instructor' ? 'instructor' : 'student',
    createdAt: new Date(),
  };

  const result = await dbConnect(collections.USERS).insertOne(newUser);

  if (result.acknowledged) {
    return {
      success: true,
      message: 'Registration successful',
      insertedId: result.insertedId.toString(),
    };
  }

  return { success: false, message: 'Registration failed. Please try again.' };
};

export const loginUser = async payload => {
  const { email, password } = payload;

  if (!email || !password) {
    return null;
  }

  const user = await dbConnect(collections.USERS).findOne({
    email: email.toLowerCase(),
  });

  if (!user) {
    return null;
  }

  const isMatched = await bcrypt.compare(password, user.password);

  if (isMatched) {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role || 'student',
    };
  }

  return null;
};
