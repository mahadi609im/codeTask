'use client';

import { useSession } from 'next-auth/react';
import InstructorDashboard from '../components/instructor/InstructorDashboard';
import StudentDashboard from '../components/student/StudentDashboard';

export default function HomePage() {
  const { data: session } = useSession();

  const currentRole = session?.user?.role || 'student';

  return (
    <>
      {currentRole === 'instructor' ? (
        <InstructorDashboard />
      ) : (
        <StudentDashboard />
      )}
    </>
  );
}
