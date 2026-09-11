'use client';

import { useState, useEffect } from 'react';
import { getSubmissionsByAssignment } from '@/actions/server/submission';
import InstructorSubmissionsView from './InstructorSubmissionsView';
import StudentSubmissionView from './StudentSubmissionView';

export default function AssignmentSubmissionsSection({
  assignmentId,
  isInstructor,
}) {
  const [submissionsList, setSubmissionsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSubmissions = async () => {
    if (!assignmentId) return;
    setLoading(true);
    const res = await getSubmissionsByAssignment(assignmentId);
    if (res?.success) {
      setSubmissionsList(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadSubmissions();
  }, [assignmentId]);

  if (isInstructor) {
    return (
      <InstructorSubmissionsView
        submissionsList={submissionsList}
        setSubmissionsList={setSubmissionsList}
        loading={loading}
      />
    );
  }

  const existingSubmission =
    submissionsList.length > 0 ? submissionsList[0] : null;

  return (
    <StudentSubmissionView
      assignmentId={assignmentId}
      existingSubmission={existingSubmission}
      onSubmissionSuccess={loadSubmissions}
      loading={loading}
    />
  );
}
