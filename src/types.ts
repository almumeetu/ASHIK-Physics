export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  batch?: string; // e.g. "HSC 2026", "Admission Intensive Care"
  institution?: string; // e.g. "Dhaka College", "Notre Dame College"
  phone?: string;
  avatar: string;
  points: number;
  enrolledCourses: string[]; // Course IDs
  quizScores: { [quizId: string]: number }; // Score percentage or score
}

export interface Lecture {
  id: string;
  title: string;
  videoUrl: string; // Embed or mock video URL
  duration: string; // e.g., "45:20"
  isCompleted: boolean;
  isLocked: boolean;
}

export interface Topic {
  id: string;
  title: string;
  lectures: Lecture[];
}

export interface Chapter {
  id: string;
  title: string;
  topics: Topic[];
}

export interface Course {
  id: string;
  title: string;
  tagline: string;
  description: string;
  instructor: string;
  category: 'HSC 1st Paper' | 'HSC 2nd Paper' | 'Admission';
  price: string;
  duration: string;
  enrolledCount: number;
  image: string;
  chapters: Chapter[];
  rating: number;
  isFeatured?: boolean;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  courseId: string;
  courseTitle: string;
  durationMinutes: number;
  questions: Question[];
  totalPoints: number;
  category: 'Daily' | 'Mega';
  difficulty: 'Medium' | 'Hard' | 'Admission Standard';
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  institution: string;
  batch: string;
  points: number;
  quizzesTaken: number;
  avatar: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'Exam' | 'Class Time' | 'Material' | 'General';
  isPinned: boolean;
  targetBatch: 'All' | 'HSC 1st Paper' | 'HSC 2nd Paper' | 'Admission';
  author: string;
}

export interface QuizSubmission {
  quizId: string;
  quizTitle: string;
  score: number; // Correct answers
  totalQuestions: number;
  percentage: number;
  date: string;
  answers: { [questionId: string]: number }; // Selected index
}
