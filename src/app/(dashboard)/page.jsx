import InstructorDashboard from '../components/instructor/InstructorDashboard';
import StudentDashboard from '../components/student/StudentDashboard';

export default function HomePage() {
  const currentRole = 'instructor';

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
