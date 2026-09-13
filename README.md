# Assignment & Learning Analytics Platform

A modern, role-based education management system designed for Programming Hero
to bridge the gap between technical instruction and iterative student
evaluation. Built with Next.js App Router, Tailwind CSS, MongoDB, and Groq AI.

---

## 🔗 Project Links & Credentials

- **Live Deployment:**
  [https://codetask-two.vercel.app/](https://codetask-two.vercel.app/)
- **GitHub Repository:**
  [https://github.com/mahadi609im/codeTask](https://github.com/mahadi609im/codeTask)

### Demo Credentials

| Role           | Name          | Email                     | Password    | Instructor Secret Key |
| :------------- | :------------ | :------------------------ | :---------- | :-------------------- |
| **Instructor** | PH Instructor | `instructor.ph@gmail.com` | `ph.1234`   | `ph.2026`             |
| **Student**    | Mahadi hasan  | `maha609im@gmail.com`     | `maha609im` | _N/A_                 |

---

## 🚀 Key Features

### 1. Instructor Workflow

- **Assignment Management:** Create, list, and delete assignments with title,
  description, deadline, and difficulty level (`beginner`, `intermediate`,
  `advanced`).
- **Comprehensive Review System:** View student submissions, test GitHub & Live
  preview links, update verdict (`Accepted`, `Pending`, `Needs Improvement`),
  and provide qualitative feedback.
- **Smart Submission Locking:** Submissions marked as `Accepted` are permanently
  locked from modifications.
- **Learning Analytics Dashboard:** Visual insights using charts to monitor
  acceptance rates, submission distributions, and performance trends.

### 2. Student Workflow

- **Curriculum Exploration:** Search and filter active assignments by difficulty
  level.
- **Submission Portal:** Submit code repository URL, live preview URL, and
  descriptive notes.
- **Iterative Learning & Resubmission:** Instant access to instructor feedback.
  If marked `Needs Improvement`, the feedback is highlighted and an automated
  resubmission form is provided.
- **Progress Tracking (`My Submissions`):** View personal progress, active
  statuses, and past evaluations.

### 3. Security & Access Control

- **NextAuth RBAC:** Role-based access control protecting instructor-only routes
  (e.g., assignment creation, submission evaluations, analytics) from student
  accounts and vice-versa.
- **Protected Signup:** Instructor account creation requires a verified
  server-side secret key (`ph.2026`).

---

## 🤖 AI Implementation (Groq SDK)

The platform integrates ultra-fast inference via the **Groq SDK** (utilizing
`openai/gpt-oss-20b` with a fallback to `openai/gpt-oss-120b`):

1. **Auto-Draft Curriculum Guidelines:**
   - Converts instructor draft notes, difficulty levels, and deadlines into
     professional, clean plain-text requirements and deliverables rubrics
     directly in the creation form.
   - Guardrailed to output pure plain-text without markdown table artifacts or
     raw asterisks for optimal textarea rendering.
2. **Context-Aware Evaluation Feedback:**
   - In the review modal, instructors can generate qualitative, constructive
     feedback with one click.
   - The AI dynamically evaluates the student's submission note, the verdict
     status (`Accepted` vs `Needs Improvement`), and custom teacher instructions
     to write actionable, precise advice.

---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router, Server Actions)
- **Database:** MongoDB Atlas (Native Mongoose ODM)
- **Authentication:** NextAuth.js
- **AI Integration:** Groq Cloud SDK (`openai/gpt-oss-20b`,
  `openai/gpt-oss-120b`)
- **Styling:** Tailwind CSS, DaisyUI
- **Icons & Charts:** React Icons, Recharts / Chart.js

---
