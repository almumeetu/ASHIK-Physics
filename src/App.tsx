import React, { useState, useEffect } from 'react';
import { User, Course, Quiz, LeaderboardEntry, Notice, QuizSubmission, Lecture } from './types';
import { 
  INITIAL_COURSES, 
  INITIAL_QUIZZES, 
  INITIAL_LEADERBOARD, 
  INITIAL_NOTICES 
} from './data';

// Components
import VideoPlayer from './components/VideoPlayer';
import QuizEngine from './components/QuizEngine';
import NoticeBoard from './components/NoticeBoard';
import LeaderboardView from './components/LeaderboardView';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';

// Icons
import { 
  Home, 
  BookOpen, 
  Award, 
  Megaphone, 
  Trophy, 
  LogOut, 
  User as UserIcon, 
  Lock, 
  Sparkles, 
  Menu, 
  X, 
  Atom, 
  ChevronRight, 
  CheckCircle2, 
  Play, 
  ShieldCheck,
  ChevronDown,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Demo Logged-In Users
const MOCK_STUDENT_USER: User = {
  id: 'st3', // matches Fahim Faisal / Samiur in data.ts
  name: 'Samiur Rahman',
  email: 'samiur.ndc@gmail.com',
  role: 'student',
  batch: 'Admission Varsity Intensive 2026',
  institution: 'Notre Dame College (NDC)',
  phone: '01712-345678',
  avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80',
  points: 1040,
  enrolledCourses: ['phy-1st-hsc', 'phy-admission'],
  quizScores: {}
};

const MOCK_ADMIN_USER: User = {
  id: 'admin-ashik',
  name: 'Ashik Vai',
  email: 'ashik.physics.buet@gmail.com',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
  points: 9999,
  enrolledCourses: [],
  quizScores: {}
};

export default function App() {
  // Authentication & State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [notices, setNotices] = useState<Notice[]>(INITIAL_NOTICES);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(INITIAL_LEADERBOARD);
  
  // Quiz submissions made during the active session
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([
    {
      quizId: 'quiz-vector-daily',
      quizTitle: 'Daily Quiz: Vector Dot/Cross & River boat physics',
      score: 4,
      totalQuestions: 5,
      percentage: 80,
      date: 'Jun 28, 2026',
      answers: { 'q1_1': 1, 'q1_2': 0, 'q1_3': 0, 'q1_4': 3, 'q1_5': 1 }
    },
    {
      quizId: 'quiz-mechanics-mega',
      quizTitle: 'Mega Exam: Newtonian Mechanics (BUET Standard)',
      score: 2,
      totalQuestions: 3,
      percentage: 67,
      date: 'Jun 26, 2026',
      answers: { 'q2_1': 2, 'q2_2': 1, 'q2_3': 1 }
    },
    {
      quizId: 'quiz-thermo-admission',
      quizTitle: 'Engineering Special: Carnot Engine & Entropy Concepts',
      score: 1,
      totalQuestions: 2,
      percentage: 50,
      date: 'Jun 24, 2026',
      answers: { 'q3_1': 1, 'q3_2': 2 }
    },
    {
      quizId: 'quiz-vector-practice',
      quizTitle: 'Practice Set: Vector components & Calculus',
      score: 3,
      totalQuestions: 5,
      percentage: 60,
      date: 'Jun 20, 2026',
      answers: { 'qp_1': 1, 'qp_2': 1, 'qp_3': 2, 'qp_4': 0, 'qp_5': 4 }
    }
  ]);

  // UI Navigation State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Active Studying state (Inside Course Syllabus viewer)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeLecture, setActiveLecture] = useState<Lecture | null>(null);

  // Active Quiz State
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);

  // Set default course and lecture when viewing Syllabus Console
  useEffect(() => {
    if (selectedCourse && selectedCourse.chapters.length > 0) {
      const firstChapter = selectedCourse.chapters[0];
      if (firstChapter.topics.length > 0) {
        const firstTopic = firstChapter.topics[0];
        if (firstTopic.lectures.length > 0) {
          // Find first unlocked lecture
          const firstUnlocked = firstTopic.lectures.find(l => !l.isLocked);
          setActiveLecture(firstUnlocked || firstTopic.lectures[0]);
        }
      }
    } else {
      setActiveLecture(null);
    }
  }, [selectedCourse]);

  // Handle Logins
  const loginAsStudent = () => {
    setCurrentUser(MOCK_STUDENT_USER);
    setActiveTab('dashboard');
  };

  const loginAsAdmin = () => {
    setCurrentUser(MOCK_ADMIN_USER);
    setActiveTab('dashboard');
  };

  const logout = () => {
    setCurrentUser(null);
    setSelectedCourse(null);
    setActiveLecture(null);
    setActiveQuiz(null);
  };

  // Student marks a video lecture as completed
  const handleLectureComplete = (lectureId: string) => {
    if (!selectedCourse) return;

    // Update Courses completion status state
    const updatedCourses = courses.map((course) => {
      if (course.id !== selectedCourse.id) return course;

      const updatedChapters = course.chapters.map((chapter) => {
        const updatedTopics = chapter.topics.map((topic) => {
          const updatedLectures = topic.lectures.map((lec) => {
            if (lec.id === lectureId && !lec.isCompleted) {
              // Award XP points once to student
              if (currentUser && currentUser.role === 'student') {
                setCurrentUser(prev => prev ? { ...prev, points: prev.points + 20 } : null);
                
                // Update leaderboard state in real-time
                setLeaderboard(prevLeader => {
                  return prevLeader.map((entry) => {
                    if (entry.id === currentUser.id) {
                      return { ...entry, points: entry.points + 20 };
                    }
                    return entry;
                  });
                });
              }
              return { ...lec, isCompleted: true };
            }
            return lec;
          });
          return { ...topic, lectures: updatedLectures };
        });
        return { ...chapter, topics: updatedTopics };
      });

      const updated = { ...course, chapters: updatedChapters };
      // Sync selectedCourse state so view re-renders
      setTimeout(() => setSelectedCourse(updated), 50);
      return updated;
    });

    setCourses(updatedCourses);
  };

  // Student Submits an MCQ exam
  const handleQuizSubmit = (submission: QuizSubmission) => {
    // Save to submissions log
    setSubmissions((prev) => [submission, ...prev]);

    if (currentUser && currentUser.role === 'student') {
      const scorePoints = submission.score * 15; // 15 points per correct answer
      
      // Update student overall points locally
      setCurrentUser((prev) => prev ? {
        ...prev,
        points: prev.points + scorePoints,
        quizScores: {
          ...prev.quizScores,
          [submission.quizId]: submission.score
        }
      } : null);

      // Dynamically insert or update student on the leaderboard!
      setLeaderboard((prevLeader) => {
        const existingIdx = prevLeader.findIndex(entry => entry.id === currentUser.id);
        let updatedList = [...prevLeader];

        if (existingIdx !== -1) {
          // Update existing
          updatedList[existingIdx] = {
            ...updatedList[existingIdx],
            points: updatedList[existingIdx].points + scorePoints,
            quizzesTaken: updatedList[existingIdx].quizzesTaken + 1
          };
        } else {
          // Add new student
          updatedList.push({
            rank: 99, // dynamic recalculation below
            id: currentUser.id,
            name: currentUser.name,
            institution: currentUser.institution || 'Notre Dame College',
            batch: currentUser.batch || 'HSC 2026',
            points: currentUser.points + scorePoints,
            quizzesTaken: 1,
            avatar: currentUser.avatar
          });
        }

        // Re-sort descending and assign rank sequentially
        return updatedList
          .sort((a, b) => b.points - a.points)
          .map((item, idx) => ({ ...item, rank: idx + 1 }));
      });
    }
  };

  // Admin posts a notice
  const handleAddNotice = (newNoticeData: Omit<Notice, 'id' | 'date' | 'author'>) => {
    const notice: Notice = {
      ...newNoticeData,
      id: `notice-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      author: 'Ashik Vai'
    };
    setNotices((prev) => [notice, ...prev]);
  };

  // Admin deletes a notice
  const handleDeleteNotice = (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  };

  // Fast navigation utilities
  const handleResumeCourse = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    if (course) {
      setSelectedCourse(course);
      setActiveTab('syllabus');
    }
  };

  const handleNavigateTab = (tab: string) => {
    setActiveTab(tab);
    setSelectedCourse(null);
    setMobileMenuOpen(false);
  };

  // Sidebar items
  const menuItems = [
    { id: 'dashboard', label: 'Home Dashboard', icon: Home, visibleFor: ['student', 'admin'] },
    { id: 'courses', label: 'Course Catalog', icon: BookOpen, visibleFor: ['student', 'admin'] },
    { id: 'exams', label: 'MCQ Quiz Engine', icon: Award, visibleFor: ['student'] },
    { id: 'notices', label: 'Notice Board', icon: Megaphone, visibleFor: ['student', 'admin'] },
    { id: 'leaderboard', label: 'Live Leaderboard', icon: Trophy, visibleFor: ['student', 'admin'] },
  ];

  // Landing/Login page if not authenticated
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-between relative overflow-hidden font-sans">
        
        {/* Abstract Physics Orbit Vector Backdrops */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg className="absolute w-[600px] h-[600px] -top-48 -left-48 text-cyan-500 animate-spin" style={{ animationDuration: '60s' }} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.1" strokeDasharray="5, 10" />
            <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.1" />
            <ellipse cx="50" cy="50" rx="45" ry="15" fill="none" stroke="currentColor" strokeWidth="0.15" transform="rotate(30 50 50)" />
            <ellipse cx="50" cy="50" rx="45" ry="15" fill="none" stroke="currentColor" strokeWidth="0.15" transform="rotate(120 50 50)" />
          </svg>
          <svg className="absolute w-[800px] h-[800px] -bottom-96 -right-48 text-indigo-500 animate-spin" style={{ animationDuration: '80s' }} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.08" />
            <ellipse cx="50" cy="50" rx="40" ry="10" fill="none" stroke="currentColor" strokeWidth="0.1" transform="rotate(45 50 50)" />
            <ellipse cx="50" cy="50" rx="40" ry="10" fill="none" stroke="currentColor" strokeWidth="0.1" transform="rotate(135 50 50)" />
          </svg>
        </div>

        {/* Global branding text head */}
        <div className="p-6 max-w-7xl mx-auto w-full flex items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/20">
              <Atom className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight font-display text-slate-100 uppercase">
                ASHIK <span className="text-cyan-400">PHYSICS</span>
              </h1>
              <p className="text-[9px] font-mono tracking-widest text-slate-500 font-bold uppercase">Concept • Solve • Rank</p>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-500 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
            HSC & Admission LMS v2.1
          </span>
        </div>

        {/* Dynamic Glassmorphism Auth Card */}
        <div className="flex-1 flex items-center justify-center p-4 z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative"
          >
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-gradient-to-tr from-cyan-500 to-indigo-500 rounded-3xl opacity-20 blur-xl pointer-events-none" />

            <div className="text-center space-y-3 mb-8">
              <span className="text-[10px] uppercase font-mono font-extrabold text-cyan-400 tracking-widest bg-cyan-950/40 border border-cyan-500/25 px-3 py-1 rounded-full">
                PREMIUM DIGITAL CLASSROOM
              </span>
              <h2 className="text-2xl md:text-3xl font-black font-display text-slate-100 tracking-tight leading-none">
                Interactive Portal
              </h2>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                Connect with the premier physics platform designed for HSC & Admission aspirants in Bangladesh.
              </p>
            </div>

            {/* Simulated Fast Login Gateways */}
            <div className="space-y-4">
              <button 
                id="btn-login-student"
                onClick={loginAsStudent}
                className="w-full p-4 rounded-2xl border border-slate-800 bg-slate-950 hover:bg-slate-900 hover:border-cyan-500/50 text-left transition transform hover:scale-[1.01] active:scale-[0.99] group flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-800 shrink-0">
                    <img src={MOCK_STUDENT_USER.avatar} alt="Student" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono font-bold uppercase text-cyan-400 tracking-wider">ENTER AS</span>
                    <h4 className="text-sm font-bold text-slate-200 mt-0.5 group-hover:text-cyan-400 transition">Samiur Rahman (Student)</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Notre Dame College • Batch 26</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-cyan-400 transition translate-x-0 group-hover:translate-x-1" />
              </button>

              <button 
                id="btn-login-admin"
                onClick={loginAsAdmin}
                className="w-full p-4 rounded-2xl border border-slate-800 bg-slate-950 hover:bg-slate-900 hover:border-indigo-500/50 text-left transition transform hover:scale-[1.01] active:scale-[0.99] group flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 font-bold">
                    🎓
                  </div>
                  <div>
                    <span className="text-[9px] font-mono font-bold uppercase text-indigo-400 tracking-wider">ENTER AS</span>
                    <h4 className="text-sm font-bold text-slate-200 mt-0.5 group-hover:text-indigo-400 transition">Ashik Vai (Admin / Coach)</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">BUET ME '19 • Principal Faculty</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-indigo-400 transition translate-x-0 group-hover:translate-x-1" />
              </button>
            </div>

            {/* Quick spec checklist */}
            <div className="mt-8 border-t border-slate-800/60 pt-5 space-y-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>Simulated speed-revision video player (0.5x - 2.0x)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>HSC & Admission Standard exam simulator with timer</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>Stateful real-time notice writer and standings board</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bangladesh Physics center credit footer */}
        <div className="p-6 text-center text-xs text-slate-600 font-mono z-10 border-t border-slate-900/50">
          © 2026 ASHIK PHYSICS Coaching Center, Dhaka, Bangladesh. All Rights Reserved.
        </div>
      </div>
    );
  }

  // Active Quiz taking layout
  if (activeQuiz) {
    return (
      <div className="min-h-screen bg-slate-950 p-4 md:p-12 flex items-center justify-center font-sans">
        <div className="w-full max-w-3xl">
          <QuizEngine 
            quiz={activeQuiz} 
            onSubmit={handleQuizSubmit} 
            onClose={() => setActiveQuiz(null)} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* SIDEBAR NAVIGATION (Desktop View - Left Fixed Side) */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-slate-900 border-r border-slate-800 min-h-screen p-5 justify-between">
        <div className="space-y-8">
          {/* Brand header */}
          <div className="flex items-center space-x-3 px-1.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-md">
              <Atom className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-sm font-black font-display tracking-tight text-slate-100 uppercase leading-none">
                ASHIK <span className="text-cyan-400 font-bold">PHYSICS</span>
              </h1>
              <span className="text-[8px] font-mono font-bold tracking-widest text-slate-500 uppercase block mt-1">Concept • Solve • Rank</span>
            </div>
          </div>

          {/* Nav Items list */}
          <nav className="space-y-1.5">
            {menuItems
              .filter(item => item.visibleFor.includes(currentUser.role))
              .map((item) => {
                const IconComp = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    id={`sidebar-tab-${item.id}`}
                    onClick={() => handleNavigateTab(item.id)}
                    className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      isActive 
                        ? 'bg-cyan-500/10 text-cyan-400 border-l-2 border-cyan-500' 
                        : 'text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                    }`}
                  >
                    <IconComp className={`w-4.5 h-4.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </button>
                );
            })}
          </nav>
        </div>

        {/* User context footer */}
        <div className="space-y-4">
          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-slate-800 shrink-0">
              <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-200 truncate">{currentUser.name}</p>
              <span className="text-[10px] font-mono text-slate-500 uppercase font-black tracking-wider flex items-center gap-1 mt-0.5">
                {currentUser.role === 'admin' ? (
                  <span className="text-indigo-400 flex items-center gap-0.5"><ShieldCheck className="w-3 h-3" /> Admin</span>
                ) : (
                  <span className="text-cyan-400">Student</span>
                )}
              </span>
            </div>
          </div>

          {/* Quick Role-swapper in Sidebar to ease demonstration */}
          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800/50 space-y-1.5 text-center">
            <p className="text-[8px] font-mono font-bold uppercase tracking-wider text-slate-500">Fast Demo Control</p>
            <button
              id="btn-sidebar-role-swap"
              onClick={() => {
                setCurrentUser(currentUser.role === 'student' ? MOCK_ADMIN_USER : MOCK_STUDENT_USER);
                setActiveTab('dashboard');
                setSelectedCourse(null);
                setActiveLecture(null);
              }}
              className="w-full py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[10px] font-mono font-bold rounded-lg transition text-slate-400 hover:text-cyan-400 cursor-pointer"
            >
              🔄 Swap to {currentUser.role === 'student' ? 'Ashik Vai (Admin)' : 'Samiur (Student)'}
            </button>
          </div>

          <button
            id="btn-logout"
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-slate-800 hover:border-rose-500/30 hover:bg-rose-500/5 rounded-xl text-xs font-bold text-slate-400 hover:text-rose-400 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER & BOTTOM NAV BAR (Mobile View - Bottom Anchor) */}
      <div className="block md:hidden bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          {/* Logo brand */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-md">
              <Atom className="w-4.5 h-4.5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xs font-black font-display tracking-tight text-slate-100 uppercase">
                ASHIK <span className="text-cyan-400 font-bold">PHYSICS</span>
              </h1>
            </div>
          </div>

          {/* Quick Swap and Menu bar */}
          <div className="flex items-center space-x-2">
            <button
              id="btn-mobile-role-swap"
              onClick={() => {
                setCurrentUser(currentUser.role === 'student' ? MOCK_ADMIN_USER : MOCK_STUDENT_USER);
                setActiveTab('dashboard');
                setSelectedCourse(null);
                setActiveLecture(null);
              }}
              className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-[9px] font-mono text-slate-400 hover:text-cyan-400 transition flex items-center gap-1 cursor-pointer"
              title="Fast role toggle"
            >
              Swap Role
            </button>
            <button 
              id="btn-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-slate-400 bg-slate-950 rounded-lg border border-slate-800 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
            </button>
          </div>
        </div>

        {/* Floating Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="absolute top-full left-0 inset-x-0 bg-slate-900 border-b border-slate-800 p-4 space-y-4 z-50 shadow-2xl"
            >
              <div className="space-y-1">
                {menuItems
                  .filter(item => item.visibleFor.includes(currentUser.role))
                  .map((item) => {
                    const IconComp = item.icon;
                    const isActive = activeTab === item.id;
                    
                    return (
                      <button
                        key={item.id}
                        id={`mobile-tab-${item.id}`}
                        onClick={() => handleNavigateTab(item.id)}
                        className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl text-xs font-semibold transition cursor-pointer ${
                          isActive 
                            ? 'bg-cyan-500/10 text-cyan-400' 
                            : 'text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                        }`}
                      >
                        <IconComp className="w-4.5 h-4.5" />
                        <span>{item.label}</span>
                      </button>
                    );
                })}
              </div>

              <div className="border-t border-slate-800 pt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-800">
                    <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-200">{currentUser.name}</p>
                    <p className="text-[9px] text-slate-500 uppercase font-bold">{currentUser.role} Account</p>
                  </div>
                </div>
                <button
                  id="btn-mobile-logout"
                  onClick={logout}
                  className="px-3 py-1.5 border border-slate-800 text-rose-400 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* MAIN VIEW CONTENT AREA (Full Flex Scroll Grid) */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 max-w-7xl mx-auto w-full pb-20 md:pb-8">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* 1. HOME DASHBOARD TAB */}
            {activeTab === 'dashboard' && (
              currentUser.role === 'student' ? (
                <StudentDashboard 
                  student={currentUser} 
                  courses={courses} 
                  submissions={submissions} 
                  onResumeCourse={handleResumeCourse}
                  onNavigateTab={handleNavigateTab}
                />
              ) : (
                <AdminDashboard 
                  notices={notices} 
                  onAddNotice={handleAddNotice} 
                  onDeleteNotice={handleDeleteNotice}
                  recentSubmissions={submissions}
                />
              )
            )}

            {/* 2. COURSE CATALOG TAB */}
            {activeTab === 'courses' && (
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <h2 className="text-xl md:text-2xl font-black font-display text-slate-100 tracking-tight uppercase">
                    Physics Elite Course Packages
                  </h2>
                  <p className="text-xs text-slate-400">
                    Explore our premier modules curated by Ashik Vai, covering advanced formulas, deep concepts, and admission hacks.
                  </p>
                </div>

                {/* Courses Grid view */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => {
                    const isEnrolled = currentUser.role === 'admin' || currentUser.enrolledCourses.includes(course.id);
                    
                    return (
                      <div 
                        key={course.id} 
                        className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between group hover:border-slate-700/80 transition-all"
                      >
                        {/* Course visual banner */}
                        <div className="relative aspect-video overflow-hidden">
                          <img 
                            src={course.image} 
                            alt={course.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
                          <span className="absolute top-3 left-3 bg-slate-950/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono font-extrabold text-cyan-400 border border-slate-800 shadow-md uppercase">
                            {course.category}
                          </span>
                          <span className="absolute bottom-3 right-3 bg-cyan-500 text-slate-950 text-[10px] font-mono font-black px-2.5 py-1 rounded-lg shadow-lg">
                            {course.price}
                          </span>
                        </div>

                        {/* Text description */}
                        <div className="p-5 space-y-2.5 flex-1 flex flex-col justify-between">
                          <div className="space-y-2">
                            <h4 className="text-sm font-bold text-slate-100 leading-snug group-hover:text-cyan-400 transition">{course.title}</h4>
                            <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{course.tagline}</p>
                          </div>

                          {/* spec lists */}
                          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-500 pt-3 border-t border-slate-850">
                            <div>👥 {course.enrolledCount}+ Students</div>
                            <div className="text-right">⏱️ {course.duration}</div>
                          </div>
                        </div>

                        {/* Interactive Syllabus / Watch button */}
                        <div className="bg-slate-950/40 px-5 py-4 border-t border-slate-850 flex items-center justify-between">
                          <span className="text-[10px] font-mono text-slate-500 font-bold">BY ASHIK VAI (BUET)</span>
                          
                          {isEnrolled ? (
                            <button
                              id={`view-syllabus-${course.id}`}
                              onClick={() => {
                                setSelectedCourse(course);
                                setActiveTab('syllabus');
                              }}
                              className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-xl transition cursor-pointer"
                            >
                              Syllabus & Classes
                            </button>
                          ) : (
                            <button
                              id={`enroll-${course.id}`}
                              onClick={() => {
                                // Enroll in real-time
                                if (currentUser.role === 'student') {
                                  setCurrentUser(prev => prev ? {
                                    ...prev,
                                    enrolledCourses: [...prev.enrolledCourses, course.id]
                                  } : null);
                                }
                              }}
                              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold rounded-xl transition border border-slate-700 cursor-pointer"
                            >
                              Enroll Pack
                            </button>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. SYLLABUS DETAIL & CLASS ARCHIVE STUDY CONSOLE */}
            {activeTab === 'syllabus' && selectedCourse && (
              <div className="space-y-6">
                
                {/* Header title navigation back to list */}
                <div className="flex items-center space-x-3">
                  <button 
                    id="btn-back-to-courses"
                    onClick={() => {
                      setSelectedCourse(null);
                      setActiveTab('courses');
                    }}
                    className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition cursor-pointer text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div>
                    <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">STUDY CONSOLE</span>
                    <h2 className="text-base md:text-lg font-bold text-slate-200 line-clamp-1 leading-tight">{selectedCourse.title}</h2>
                  </div>
                </div>

                {/* Left (Player) & Right (Syllabus tree) Grid split */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Player column */}
                  <div className="lg:col-span-2 space-y-4">
                    {activeLecture ? (
                      <div className="space-y-4">
                        <VideoPlayer 
                          lecture={activeLecture} 
                          onComplete={() => handleLectureComplete(activeLecture.id)} 
                        />
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 space-y-3 shadow-md">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono uppercase bg-cyan-950/40 text-cyan-400 border border-cyan-500/10 px-2.5 py-0.5 rounded">
                              Current Lecture
                            </span>
                            <span className="text-xs text-slate-500 font-mono">Duration: {activeLecture.duration}</span>
                          </div>
                          <h3 className="text-base font-bold text-slate-100 leading-snug">{activeLecture.title}</h3>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            Watch this video entirely to clear your foundation. Adjust playback speeds using the gear menu if you are revising fast. On final completion, you will earn <strong className="text-cyan-400 font-mono">+20 XP</strong> in standings.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-video bg-slate-900 border border-slate-800/80 rounded-2xl flex flex-col justify-center items-center text-center p-6 shadow-inner">
                        <Play className="w-10 h-10 text-slate-600 animate-pulse mb-3" />
                        <p className="text-slate-300 font-bold text-sm">No lecture active</p>
                        <p className="text-slate-500 text-xs max-w-xs mt-1">Please select an unlocked video lecture from the syllabus archive to start studying.</p>
                      </div>
                    )}
                  </div>

                  {/* Syllabus Tree column */}
                  <div className="space-y-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col max-h-[500px] md:max-h-[600px]">
                      <h3 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-400 border-b border-slate-800 pb-3 mb-3">
                        📚 Class Archive & Chapters
                      </h3>

                      <div className="flex-1 overflow-y-auto pr-1 space-y-3.5 scrollbar-thin">
                        {selectedCourse.chapters.map((chapter) => (
                          <div key={chapter.id} className="space-y-2">
                            {/* Chapter heading */}
                            <p className="text-xs font-black font-display text-cyan-400 leading-tight bg-slate-950/40 p-2 rounded-lg border border-slate-800/60">
                              {chapter.title}
                            </p>

                            {/* Nested Topics */}
                            {chapter.topics.map((topic) => (
                              <div key={topic.id} className="pl-1.5 space-y-1.5">
                                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wide">
                                  {topic.title}
                                </p>

                                {/* Lectures list */}
                                <div className="space-y-1 pl-1">
                                  {topic.lectures.map((lecture) => {
                                    const isSelected = activeLecture?.id === lecture.id;
                                    
                                    return (
                                      <button
                                        key={lecture.id}
                                        id={`syllabus-lec-${lecture.id}`}
                                        disabled={lecture.isLocked && currentUser.role !== 'admin'}
                                        onClick={() => setActiveLecture(lecture)}
                                        className={`w-full text-left p-2.5 rounded-xl border text-xs flex items-center justify-between transition cursor-pointer ${
                                          isSelected 
                                            ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300 font-semibold' 
                                            : lecture.isLocked && currentUser.role !== 'admin'
                                              ? 'bg-slate-950/10 border-slate-900 text-slate-600 cursor-not-allowed'
                                              : 'bg-slate-950/40 border-slate-850 text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                                        }`}
                                      >
                                        <div className="flex items-center space-x-2 truncate pr-1">
                                          {lecture.isCompleted ? (
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 fill-emerald-950/20" />
                                          ) : lecture.isLocked && currentUser.role !== 'admin' ? (
                                            <Lock className="w-4 h-4 text-slate-700 shrink-0" />
                                          ) : (
                                            <Play className="w-3.5 h-3.5 text-cyan-500 shrink-0 fill-current" />
                                          )}
                                          <span className="truncate">{lecture.title}</span>
                                        </div>
                                        <span className="text-[9px] font-mono font-medium text-slate-500 shrink-0">{lecture.duration}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* 4. MCQ QUIZ ENGINE SELECTION TAB */}
            {activeTab === 'exams' && (
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <h2 className="text-xl md:text-2xl font-black font-display text-slate-100 tracking-tight uppercase">
                    Daily Quiz & Mega Exams
                  </h2>
                  <p className="text-xs text-slate-400">
                    Verify your physics formulas and conceptual leaps. Top the boards, get instant solutions, and climb the scoreboard.
                  </p>
                </div>

                {/* Quizzes List grids */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {INITIAL_QUIZZES.map((quiz) => {
                    // Check if already taken this session
                    const takenSubmission = submissions.find((sub) => sub.quizId === quiz.id);
                    
                    return (
                      <div 
                        key={quiz.id} 
                        className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl flex flex-col justify-between hover:border-slate-700 transition"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="bg-slate-950 border border-slate-800 text-[10px] font-mono px-2.5 py-1 rounded-lg text-slate-400 uppercase font-black tracking-wider">
                              {quiz.category} • {quiz.difficulty}
                            </span>
                            {takenSubmission ? (
                              <span className="bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono px-2.5 py-1 rounded-lg font-bold">
                                Taken: {takenSubmission.percentage}% Marks
                              </span>
                            ) : (
                              <span className="bg-cyan-950/40 text-cyan-400 border border-cyan-500/20 text-[10px] font-mono px-2.5 py-1 rounded-lg font-bold">
                                Active
                              </span>
                            )}
                          </div>

                          <h3 className="text-base font-bold text-slate-100 leading-snug">{quiz.title}</h3>
                          <p className="text-xs text-slate-500 leading-snug">Paper: <strong>{quiz.courseTitle}</strong></p>
                          
                          <div className="grid grid-cols-3 gap-2 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60 text-center text-xs">
                            <div>
                              <p className="text-[9px] uppercase font-bold text-slate-500">MCQs</p>
                              <p className="font-bold text-slate-300 mt-0.5">{quiz.questions.length}</p>
                            </div>
                            <div className="border-x border-slate-850">
                              <p className="text-[9px] uppercase font-bold text-slate-500">Duration</p>
                              <p className="font-bold text-slate-300 mt-0.5">{quiz.durationMinutes}m</p>
                            </div>
                            <div>
                              <p className="text-[9px] uppercase font-bold text-slate-500">Points</p>
                              <p className="font-bold text-slate-300 mt-0.5">{quiz.totalPoints}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-850">
                          <span className="text-[10px] text-slate-500 font-mono">BUET standard MCQs</span>
                          <button
                            id={`start-quiz-btn-${quiz.id}`}
                            onClick={() => setActiveQuiz(quiz)}
                            className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-xl transition cursor-pointer shadow-md hover:shadow-cyan-500/10"
                          >
                            {takenSubmission ? 'Retake Quiz' : 'Start Quiz Exam'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 5. NOTICE BOARD TAB */}
            {activeTab === 'notices' && (
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <h2 className="text-xl md:text-2xl font-black font-display text-slate-100 tracking-tight uppercase">
                    Coaching Notices & Class Schedules
                  </h2>
                  <p className="text-xs text-slate-400">
                    Stay updated with real-time class cancellations, mega exams, handwritten PDF releases, and live sessions.
                  </p>
                </div>

                <NoticeBoard 
                  notices={notices} 
                  userRole={currentUser.role} 
                  onDeleteNotice={handleDeleteNotice} 
                />
              </div>
            )}

            {/* 6. LIVE STANDINGS LEADERBOARD TAB */}
            {activeTab === 'leaderboard' && (
              <div className="space-y-6">
                <div className="space-y-1.5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div>
                    <h2 className="text-xl md:text-2xl font-black font-display text-slate-100 tracking-tight uppercase">
                      Live Top Scholars (মেধাতালিকা)
                    </h2>
                    <p className="text-xs text-slate-400">
                      Healthy competitive board for engineering and medical admission seekers. Secure daily quiz points to rise!
                    </p>
                  </div>
                  <div className="bg-cyan-950/40 border border-cyan-500/15 p-2.5 rounded-xl flex items-center gap-2 max-w-sm text-[11px] text-slate-300">
                    <Info className="w-4.5 h-4.5 text-cyan-400 shrink-0" />
                    <span>Points are updated dynamically whenever you complete exams or video sessions.</span>
                  </div>
                </div>

                <LeaderboardView 
                  entries={leaderboard} 
                  currentUserId={currentUser.id} 
                />
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* Touch-optimized Mobile Bottom Nav bar */}
      <nav className="block md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 p-2.5 z-40 shadow-2xl">
        <div className="flex items-center justify-around">
          {menuItems
            .filter(item => item.visibleFor.includes(currentUser.role))
            .map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id || (item.id === 'courses' && activeTab === 'syllabus');
              
              return (
                <button
                  key={item.id}
                  id={`mobile-bottom-${item.id}`}
                  onClick={() => handleNavigateTab(item.id)}
                  className={`flex flex-col items-center justify-center p-1.5 transition cursor-pointer ${
                    isActive ? 'text-cyan-400' : 'text-slate-500'
                  }`}
                >
                  <IconComp className="w-5 h-5" />
                  <span className="text-[9px] font-medium mt-1 font-sans">{item.label.split(' ')[0]}</span>
                </button>
              );
          })}
        </div>
      </nav>

    </div>
  );
}
