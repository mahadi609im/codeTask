'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { LuArrowLeft } from 'react-icons/lu';
import { getAssignmentById } from '@/actions/server/assignment';
import AssignmentDetailsInfo from '@/app/components/assignments/AssignmentDetailsInfo';
import AssignmentSubmissionsSection from '@/app/components/assignments/AssignmentSubmissionsSection';

export default function AssignmentDetailsPage({ params }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const { data: session } = useSession();
  const isInstructor = session?.user?.role === 'instructor';

  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAssignment = async () => {
      setLoading(true);
      const res = await getAssignmentById(id);
      if (res?.success) {
        setAssignment(res.data);
      }
      setLoading(false);
    };

    if (id) loadAssignment();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto space-y-6">
        <div className="h-6 w-36 bg-base-200/50 rounded-lg animate-pulse" />
        <div className="h-96 rounded-2xl bg-base-200/40 border border-base-300/60 animate-pulse" />
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="w-full py-20 text-center space-y-3">
        <h2 className="text-xl font-semibold text-white">
          Assignment Not Found
        </h2>
        <p className="text-xs text-neutral-content/60">
          The task you are looking for does not exist or has been removed.
        </p>
        <Link
          href="/assignments"
          className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium pt-2"
        >
          <LuArrowLeft className="size-3.5" /> Return to list
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-7">
      {/* ইন্সট্রাক্টর হলে ফুল-উইডথ বিবরণী এবং নিচে টেবিল */}
      {isInstructor ? (
        <div className="space-y-7">
          <AssignmentDetailsInfo assignment={assignment} />
          <AssignmentSubmissionsSection
            assignmentId={assignment._id}
            isInstructor={true}
          />
        </div>
      ) : (
        /* স্টুডেন্ট হলে গ্রিড লেআউট (বামে বিবরণী, ডানে সাবমিশন ফর্ম) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7">
            <AssignmentDetailsInfo assignment={assignment} />
          </div>
          <div className="lg:col-span-5">
            <AssignmentSubmissionsSection
              assignmentId={assignment._id}
              isInstructor={false}
            />
          </div>
        </div>
      )}
    </div>
  );
}
