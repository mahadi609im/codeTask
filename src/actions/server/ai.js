'use server';

import Groq from 'groq-sdk';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/authOption';

const productionModels = ['openai/gpt-oss-20b', 'openai/gpt-oss-120b'];

// ১. অ্যাসাইনমেন্ট রিকোয়ারমেন্ট ড্রাফট করার অ্যাকশন
export async function enhanceAssignmentWithAI({
  title,
  description,
  difficulty,
  deadline,
}) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'instructor') {
      return {
        success: false,
        message: 'Unauthorized: Instructor access required',
      };
    }

    if (!title?.trim() && !description?.trim()) {
      return {
        success: false,
        message: 'Please provide at least a title or draft description',
      };
    }

    const apiKey = process.env.GROQ_API_KEY?.trim();
    if (!apiKey) {
      return {
        success: false,
        message: 'GROQ_API_KEY not found in environment variables.',
      };
    }

    const groq = new Groq({ apiKey });

    const formattedDeadline = deadline
      ? new Date(deadline).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      : 'To be announced by instructor';

    const systemPrompt = `You are a Lead Technical Instructor at a software engineering academy.
Transform draft notes into clean, natural plain text for student guidelines.

STRICT FORMATTING RULES:
1. NEVER USE ASTERISKS: Do NOT use any stars (* or **) anywhere. Absolutely NO bold asterisks.
2. NO MARKDOWN TABLES, CODE BLOCKS, OR HASHTAGS (#): Write headers in PLAIN CAPITAL LETTERS followed by a colon.
3. LIST FORMAT: Use a simple hyphen (-) for bullet points.
4. TEXTAREA COMPATIBILITY: Output pure, human-readable plain text that looks neat inside a basic textarea.

REQUIRED STRUCTURE:

OBJECTIVE:
(1-2 clear, direct sentences describing what students will build)

KEY REQUIREMENTS:
- Point 1
- Point 2
- Point 3
- Point 4

IMPLEMENTATION GUIDELINES:
- Best practices and code structure guidelines suited for ${difficulty || 'Beginner'} level.
- Defensive validation and clean code standards.

SUBMISSION & DELIVERABLES:
- Working Live Deployment URL (e.g. Vercel, Netlify).
- Public GitHub Repository with complete source code.
- Submission Notes detailing features or credentials if required.
- Strict Deadline: ${formattedDeadline} (late submissions will not be evaluated).`;

    const userPrompt = `Title: ${title || 'Fullstack Assignment'}
Difficulty: ${difficulty || 'Beginner'}
Target Deadline: ${formattedDeadline}
Instructor Notes:
${description || 'Build a scalable module with proper validations.'}`;

    let generatedText = '';
    let lastError = null;

    for (const modelId of productionModels) {
      try {
        const chatCompletion = await groq.chat.completions.create({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          model: modelId,
          temperature: 0.3,
          max_tokens: 2048,
        });

        generatedText =
          chatCompletion.choices[0]?.message?.content?.trim() || '';
        if (generatedText) break;
      } catch (err) {
        lastError = err;
      }
    }

    if (!generatedText) {
      throw lastError || new Error('Failed to generate assignment guidelines');
    }

    return {
      success: true,
      enhancedDescription: generatedText.replace(/\*/g, ''),
    };
  } catch (error) {
    console.error('Groq AI Assignment Error:', error);
    return {
      success: false,
      message: error?.message || 'Failed to communicate with Groq AI API.',
    };
  }
}

// ২. স্টুডেন্ট সাবমিশন রিভিউ ও ফিডব্যাক তৈরির অ্যাকশন
export async function generateAIEvaluationFeedback({
  studentName,
  notes,
  status,
  command,
}) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'instructor') {
      return {
        success: false,
        message: 'Unauthorized: Instructor access required',
      };
    }

    const apiKey = process.env.GROQ_API_KEY?.trim();
    if (!apiKey) {
      return {
        success: false,
        message: 'GROQ_API_KEY not found in environment variables.',
      };
    }

    const groq = new Groq({ apiKey });

    const systemPrompt = `You are a Lead Code Reviewer and Engineering Instructor.
Write concise, constructive evaluation feedback (2 to 4 sentences) for a student's project submission.

RULES:
1. Tone must be encouraging, technical, and precise.
2. If status is "accepted", acknowledge their accomplishments, clean implementation, and adherence to requirements.
3. If status is "needs_improvement", pinpoint specific architectural gaps, bugs, or missing requirements they must fix before re-evaluating.
4. If status is "pending", provide an initial review observation.
5. Strictly incorporate any specific custom instructor command/instruction provided.
6. Return PURE PLAIN TEXT only. Do not use any asterisks (*), markdown formatting, or labels.`;

    const userPrompt = `Student Name: ${studentName || 'Student'}
Evaluation Verdict: ${status}
Student's Implementation Note: "${notes || 'No notes provided'}"
Instructor's Specific Command/Guidance: "${command || 'Standard constructive feedback'}"`;

    let feedbackText = '';
    let lastError = null;

    for (const modelId of productionModels) {
      try {
        const chatCompletion = await groq.chat.completions.create({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          model: modelId,
          temperature: 0.4,
          max_tokens: 300,
        });

        feedbackText =
          chatCompletion.choices[0]?.message?.content?.trim() || '';
        if (feedbackText) break;
      } catch (err) {
        lastError = err;
      }
    }

    if (!feedbackText) {
      throw lastError || new Error('Failed to generate review feedback');
    }

    return {
      success: true,
      feedback: feedbackText.replace(/[*#]/g, '').trim(),
    };
  } catch (error) {
    console.error('Groq AI Feedback Error:', error);
    return {
      success: false,
      message: error?.message || 'Failed to generate feedback with AI',
    };
  }
}
