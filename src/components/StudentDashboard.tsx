import React from 'react';
import { User, Course, QuizSubmission } from '../types';
import { 
  BookOpen, 
  Award, 
  Flame, 
  CheckSquare, 
  ArrowRight, 
  Play, 
  ExternalLink, 
  Calendar, 
  Hourglass, 
  Trophy, 
  Clock, 
  TrendingUp, 
  Sparkles, 
  AlertCircle,
  Wallet,
  Send,
  Receipt
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';

// Custom Tooltip for premium visual chart rendering
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl shadow-2xl max-w-xs space-y-1">
        <p className="text-[10px] font-mono text-cyan-400 font-extrabold uppercase">{data.date}</p>
        <p className="text-xs font-bold text-slate-100 leading-tight">{data.quizTitle}</p>
        <div className="flex justify-between items-center pt-1 border-t border-slate-900 mt-1 text-[11px] font-mono">
          <span className="text-slate-400">Accuracy:</span>
          <span className="text-cyan-400 font-bold">{data.percentage}%</span>
        </div>
        <div className="flex justify-between items-center text-[10px] font-mono">
          <span className="text-slate-500">Correct:</span>
          <span className="text-slate-300">{data.scoreText}</span>
        </div>
      </div>
    );
  }
  return null;
};

interface StudentDashboardProps {
  student: User;
  courses: Course[];
  submissions: QuizSubmission[];
  onResumeCourse: (courseId: string) => void;
  onNavigateTab: (tab: string) => void;
  onSubmitPayment: (courseId: string, amount: number, method: 'bKash' | 'Nagad' | 'Rocket' | 'Bank', txId: string) => void;
}

export default function StudentDashboard({ student, courses, submissions, onResumeCourse, onNavigateTab, onSubmitPayment }: StudentDashboardProps) {
  // Local states for bKash/Nagad receipt submitter inside Student Dashboard
  const [payCourseId, setPayCourseId] = React.useState(courses[0]?.id || '');
  const [payAmount, setPayAmount] = React.useState<number>(1500);
  const [payMethod, setPayMethod] = React.useState<'bKash' | 'Nagad' | 'Rocket' | 'Bank'>('bKash');
  const [payTxId, setPayTxId] = React.useState('');
  const [showPayForm, setShowPayForm] = React.useState(false);
  const [paySuccess, setPaySuccess] = React.useState(false);

  const handlePostPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payTxId.trim() || payAmount <= 0) return;
    
    onSubmitPayment(payCourseId, payAmount, payMethod, payTxId);
    
    setPayTxId('');
    setPaySuccess(true);
    setTimeout(() => setPaySuccess(false), 4000);
  };

  // Get courses enrolled by student
  const enrolledCoursesList = courses.filter((c) => student.enrolledCourses.includes(c.id));

  // Calculate generic completion rate
  const totalXP = student.points;
  const completedLecturesCount = enrolledCoursesList.reduce((acc, c) => {
    let completed = 0;
    c.chapters.forEach((ch) => {
      ch.topics.forEach((t) => {
        t.lectures.forEach((l) => {
          if (l.isCompleted) completed++;
        });
      });
    });
    return acc + completed;
  }, 0);

  return (
    <div id="student-dashboard-container" className="space-y-8">
      {/* Dynamic Welcome Greeting Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/20 border border-slate-800 p-6 md:p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-2 max-w-xl">
          <span className="text-xs uppercase tracking-widest font-mono font-bold text-cyan-400 bg-cyan-950/50 px-3 py-1 rounded-full border border-cyan-500/20">
            Welcome Back, Scholar
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 leading-tight">
            আসসালামু আলাইকুম, {student.name}!
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Your HSC & Admission journey is fully synced. Continue practicing your formulas, revise tough physics topics, and stay ahead in the leaderboards!
          </p>
          <div className="flex flex-wrap gap-2.5 pt-2">
            <span className="text-[11px] font-medium bg-slate-950 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-xl">
              🏫 College: <strong>{student.institution || 'N/A'}</strong>
            </span>
            <span className="text-[11px] font-medium bg-slate-950 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-xl">
              🎓 Batch: <strong>{student.batch || 'N/A'}</strong>
            </span>
          </div>
        </div>

        {/* Gamified Level & XP Badging circle */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 flex items-center gap-4 shrink-0 shadow-lg min-w-[200px]">
          <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total XP Points</p>
            <p className="text-xl font-mono font-extrabold text-cyan-400 mt-0.5">{totalXP} pts</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Ranked #2 on Notre Dame</p>
          </div>
        </div>
      </div>

      {/* Stats Bento Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Solved Exams */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl hover:border-slate-700/80 transition shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-500 tracking-wider">Quiz Submissions</span>
            <span className="text-emerald-400 text-xs font-mono bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-500/10">Active</span>
          </div>
          <p className="text-2xl font-bold font-mono text-slate-100 mt-2">{submissions.length}</p>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <CheckSquare className="w-3.5 h-3.5 text-emerald-400" /> Avg Accuracy: {submissions.length > 0 ? Math.round(submissions.reduce((acc, s) => acc + s.percentage, 0) / submissions.length) : 0}%
          </p>
        </div>

        {/* Stat 2: Active Day Streak */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl hover:border-slate-700/80 transition shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-500 tracking-wider">Study Streak</span>
            <span className="text-orange-400 text-xs font-mono bg-orange-950/50 px-2 py-0.5 rounded-full border border-orange-500/10">Fire</span>
          </div>
          <p className="text-2xl font-bold font-mono text-slate-100 mt-2">7 Days</p>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" /> Keep learning daily!
          </p>
        </div>

        {/* Stat 3: Completed Lectures */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl hover:border-slate-700/80 transition shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-500 tracking-wider">Videos Watched</span>
            <span className="text-cyan-400 text-xs font-mono bg-cyan-950/50 px-2 py-0.5 rounded-full border border-cyan-500/10">Completed</span>
          </div>
          <p className="text-2xl font-bold font-mono text-slate-100 mt-2">{completedLecturesCount}</p>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <Play className="w-3.5 h-3.5 text-cyan-400" /> Across enrolled packs
          </p>
        </div>

        {/* Stat 4: Leaderboard Standings */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl hover:border-slate-700/80 transition shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-500 tracking-wider">My Standing</span>
            <span className="text-amber-400 text-xs font-mono bg-amber-950/50 px-2 py-0.5 rounded-full border border-amber-500/10">Elite</span>
          </div>
          <p className="text-2xl font-bold font-mono text-slate-100 mt-2">#2 Rank</p>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-amber-500" /> View current standings
          </p>
        </div>
      </div>

      {/* Upcoming Schedule / Live doubt clearing notice bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-200">LIVE Doubt Clearing Session (লাইভ ক্লাস)</p>
            <p className="text-xs text-slate-400 mt-1">Topic: <strong className="text-cyan-400">Circular Banking & Spring cutting math shortcuts</strong> by Ashik Vai.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-orange-400 bg-orange-950/40 border border-orange-500/20 px-3 py-1.5 rounded-xl shrink-0 w-full sm:w-auto justify-center">
          <Hourglass className="w-3.5 h-3.5 animate-spin" /> Starts Tonight at 8:30 PM
        </div>
      </div>

      {/* My Courses Track List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
            <BookOpen className="w-4.5 h-4.5 text-cyan-400" /> My Enrolled Study Packs
          </h3>
          <button 
            onClick={() => onNavigateTab('courses')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
          >
            Explore Catalog <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {enrolledCoursesList.length === 0 ? (
          <div className="text-center bg-slate-900 border border-slate-800 p-8 rounded-2xl">
            <p className="text-sm text-slate-400">You are not enrolled in any study packs yet.</p>
            <button 
              onClick={() => onNavigateTab('courses')}
              className="mt-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs px-4 py-2 rounded-xl font-bold transition"
            >
              Browse Course Packs
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {enrolledCoursesList.map((course) => {
              // Calculate custom simulated progress or use 45% default
              const progress = course.id === 'phy-1st-hsc' ? 35 : 0;
              
              return (
                <div 
                  key={course.id} 
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md flex flex-col justify-between hover:border-slate-700/80 transition group"
                >
                  <div className="p-5 space-y-3">
                    <span className="bg-slate-950 border border-slate-800 text-[10px] font-mono px-2.5 py-1 rounded-lg text-slate-400">
                      {course.category}
                    </span>
                    <h4 className="text-base font-bold text-slate-200 mt-2 leading-tight group-hover:text-cyan-400 transition truncate">{course.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{course.tagline}</p>
                    
                    {/* Linear Progress Rail */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex items-center justify-between text-[11px] font-mono font-medium text-slate-500">
                        <span>Course Completion:</span>
                        <span className="text-cyan-400 font-bold">{progress}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden relative">
                        <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-blue-500" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-950/40 p-4 border-t border-slate-800/60 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">{course.duration} Contents</span>
                    <button 
                      id={`resume-course-${course.id}`}
                      onClick={() => onResumeCourse(course.id)}
                      className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-xl transition flex items-center gap-1 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" /> Resume Class
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Tuition Fees & Financial Ledger Section (টাকা-পয়সার হিসাব-নিকাশ) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
            <Wallet className="w-4.5 h-4.5 text-cyan-400" /> Accounts & Tuition Fee Ledger (আমার হিসাব-নিকাশ)
          </h3>
          <span className="text-xs font-mono text-slate-500 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
            Billing & Invoices
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Billing Overview Cards */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850">
                  <p className="text-[9px] uppercase font-bold text-slate-500 font-mono">Total Fees</p>
                  <p className="text-lg md:text-xl font-extrabold text-slate-100 mt-1 font-mono">৳ {student.totalFees || 0}</p>
                  <p className="text-[9px] text-slate-500 mt-1">Calculated tuition</p>
                </div>
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850">
                  <p className="text-[9px] uppercase font-bold text-slate-500 font-mono">Paid Amount</p>
                  <p className="text-lg md:text-xl font-extrabold text-emerald-400 mt-1 font-mono">৳ {student.amountPaid || 0}</p>
                  <p className="text-[9px] text-slate-500 mt-1">Verified receipts</p>
                </div>
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850">
                  <p className="text-[9px] uppercase font-bold text-slate-500 font-mono">Total Due (বাকি)</p>
                  <p className="text-lg md:text-xl font-extrabold text-rose-400 mt-1 font-mono">
                    ৳ {Math.max(0, (student.totalFees || 0) - (student.amountPaid || 0))}
                  </p>
                  <p className="text-[9px] text-slate-500 mt-1">Payable balance</p>
                </div>
              </div>

              {/* Verified payments log list */}
              <div className="space-y-3 pt-2">
                <p className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">Payment Transaction History ({student.payments?.length || 0})</p>
                
                {!student.payments || student.payments.length === 0 ? (
                  <div className="text-center py-6 text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl bg-slate-950/20">
                    No billing history found. Use the right-side form to file your first receipt!
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1 scrollbar-thin">
                    {student.payments.map((pay) => {
                      const statusStyles = pay.status === 'Approved'
                        ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20'
                        : pay.status === 'Pending'
                          ? 'bg-amber-950/40 text-amber-400 border-amber-500/20 animate-pulse'
                          : 'bg-rose-950/40 text-rose-400 border-rose-500/20';

                      return (
                        <div key={pay.id} className="bg-slate-950 p-3 rounded-xl border border-slate-850 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-200">{pay.courseTitle.substring(0, 32)}...</span>
                              <span className="text-[10px] font-mono bg-slate-900 border border-slate-800 px-1.5 py-0.2 rounded text-slate-400 uppercase font-bold">{pay.paymentMethod}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 font-mono mt-1">TrxID: <strong className="text-slate-400">{pay.txId}</strong> • Date: {pay.date}</p>
                          </div>
                          <div className="flex items-center justify-between md:justify-end gap-3">
                            <span className="font-mono font-black text-slate-300">৳ {pay.amount}</span>
                            <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-mono font-bold border ${statusStyles}`}>
                              {pay.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pay tuition fees form */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <h4 className="text-xs font-mono font-bold uppercase text-slate-300 flex items-center gap-1.5">
                  <Receipt className="w-4 h-4 text-cyan-400" /> Submit payment receipt
                </h4>
                <span className="text-[9px] font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded-md">bKash Personal</span>
              </div>

              {paySuccess && (
                <div className="bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 text-[11px] p-3 rounded-xl mb-4 leading-relaxed">
                  📢 <strong>Receipt filed successfully!</strong> Ashik Vai will verify your Transaction ID and approve the class access within minutes.
                </div>
              )}

              <form onSubmit={handlePostPayment} className="space-y-3.5 text-xs">
                {/* Module selection */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400">Target Study Module</label>
                  <select
                    value={payCourseId}
                    onChange={(e) => setPayCourseId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-300 px-3 py-2 rounded-xl text-xs focus:border-cyan-500 focus:outline-none cursor-pointer"
                  >
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.title.length > 28 ? course.title.substring(0, 28) + '...' : course.title} ({course.price})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Gateway & Amount sent */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400">Gateway</label>
                    <select
                      value={payMethod}
                      onChange={(e) => setPayMethod(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-300 px-3 py-2 rounded-xl text-xs focus:border-cyan-500 focus:outline-none cursor-pointer"
                    >
                      <option value="bKash">bKash (বিকাশ)</option>
                      <option value="Nagad">Nagad (নগদ)</option>
                      <option value="Rocket">Rocket (রকেট)</option>
                      <option value="Bank">Bank</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400">Amount Sent (৳)</label>
                    <input 
                      type="number" 
                      required
                      min={100}
                      value={payAmount}
                      onChange={(e) => setPayAmount(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-100 px-3 py-2 rounded-xl text-xs focus:border-cyan-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                {/* Transaction ID */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400">Transaction ID (TrxID)</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. BKX928410293"
                    value={payTxId}
                    onChange={(e) => setPayTxId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-100 px-3 py-2 rounded-xl text-xs focus:border-cyan-500 focus:outline-none transition font-mono uppercase"
                  />
                </div>

                {/* Instructions */}
                <p className="text-[10px] text-slate-500 leading-snug bg-slate-950/40 p-2.5 rounded-xl border border-slate-850">
                  ⚠️ Send Money to: <strong className="text-cyan-400 font-mono">01712-345678</strong>. Mention your student ID in the reference.
                </p>

                <button
                  type="submit"
                  disabled={!payTxId.trim()}
                  className={`w-full py-2.5 text-slate-950 font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    payTxId.trim()
                      ? 'bg-cyan-400 hover:bg-cyan-300 shadow-md shadow-cyan-500/10'
                      : 'bg-slate-850 text-slate-600 border border-slate-900 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" /> Submit Invoice Ticket
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* My Performance section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
            <TrendingUp className="w-4.5 h-4.5 text-cyan-400" /> My Performance & Progress Tracker
          </h3>
          <span className="text-xs font-mono text-slate-500 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
            Real-time analytics
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Card */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl flex flex-col justify-between">
            <div className="space-y-1.5 mb-4">
              <h4 className="text-sm font-bold text-slate-200">Score Progression Trend</h4>
              <p className="text-xs text-slate-400">Visualizing your score percentages chronologically across your taken exams.</p>
            </div>

            <div className="h-64 w-full">
              {submissions.length === 0 ? (
                <div className="w-full h-full bg-slate-950/40 rounded-xl border border-slate-850 border-dashed flex flex-col items-center justify-center text-center p-6">
                  <TrendingUp className="w-8 h-8 text-slate-700 animate-bounce mb-2" />
                  <p className="text-xs text-slate-400 font-bold">No performance history yet</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Submit your first physics MCQ quiz and your progress line will appear instantly.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart 
                    data={[...submissions].reverse().map((sub, idx) => ({
                      index: idx + 1,
                      quizTitle: sub.quizTitle,
                      shortTitle: sub.quizTitle.length > 20 ? sub.quizTitle.slice(0, 20) + '...' : sub.quizTitle,
                      percentage: sub.percentage,
                      date: sub.date,
                      scoreText: `${sub.score}/${sub.totalQuestions}`,
                    }))} 
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorPercentage" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#475569" 
                      fontSize={10} 
                      tickLine={false}
                      axisLine={false}
                      dy={10}
                    />
                    <YAxis 
                      stroke="#475569" 
                      fontSize={10} 
                      tickLine={false}
                      axisLine={false}
                      domain={[0, 100]}
                      tickFormatter={(val) => `${val}%`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="percentage" 
                      stroke="#06b6d4" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorPercentage)"
                      activeDot={{ r: 6, stroke: '#0e7490', strokeWidth: 2, fill: '#22d3ee' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Performance Insights Sidebar Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800/80">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-mono font-bold uppercase text-slate-300">Ashik Vai's Insights</h4>
              </div>

              {/* Motivational Bubble */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 relative">
                <div className="absolute top-3 right-3 text-lg opacity-40">💡</div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {submissions.length > 0 ? (
                    (() => {
                      const avg = Math.round(submissions.reduce((acc, s) => acc + s.percentage, 0) / submissions.length);
                      if (avg >= 80) {
                        return "উজ্জ্বল ভবিষ্যৎ দেখতে পাচ্ছি! Your BUET and top-tier Varsity admission standards are fully on track. Keep up this brilliant streak of conceptual mastery.";
                      } else if (avg >= 60) {
                        return "ভালো করছ, তবে সন্তুষ্ট হলে চলবে না! To crack BUET standard mathematics in physics, increase daily revision and solve previous years' admission question banks.";
                      } else {
                        return "ভয়ের কিছু নেই, চর্চা বাড়াতে হবে! Ashik Vai's shortcuts and hand-written notes are your secret weapon. Focus on vector and thermodynamics concepts first.";
                      }
                    })()
                  ) : (
                    "পরীক্ষা দেওয়া শুরু করো! Verify your knowledge by taking a quick daily physics MCQ quiz right now in the Exam Console."
                  )}
                </p>
              </div>

              {/* Focus Recommendations */}
              <div className="space-y-2.5 pt-1">
                <p className="text-[10px] font-mono font-bold uppercase text-slate-500 tracking-wider">Recommended Revision Topics:</p>
                <div className="space-y-2">
                  {(() => {
                    const focusItems = [];
                    const vectorSubs = submissions.filter(s => s.quizTitle.toLowerCase().includes('vector'));
                    const lowVector = vectorSubs.some(s => s.percentage < 80);
                    if (lowVector || vectorSubs.length === 0) {
                      focusItems.push({
                        topic: "Vector Crossing Shortcuts (নদী-নৌকা ও বৃষ্টি-ছাতা)",
                        action: "Watch Lecture 2 & 3",
                        badge: "Essential"
                      });
                    }

                    const mechanicsSubs = submissions.filter(s => s.quizTitle.toLowerCase().includes('mechanic') || s.quizTitle.toLowerCase().includes('motion'));
                    const lowMechanics = mechanicsSubs.some(s => s.percentage < 80);
                    if (lowMechanics || mechanicsSubs.length === 0) {
                      focusItems.push({
                        topic: "Moment of Inertia & Road Banking with Friction",
                        action: "Revise Lecture 6 & 8",
                        badge: "High Weightage"
                      });
                    }

                    const thermoSubs = submissions.filter(s => s.quizTitle.toLowerCase().includes('thermo') || s.quizTitle.toLowerCase().includes('carnot'));
                    const lowThermo = thermoSubs.some(s => s.percentage < 80);
                    if (lowThermo || thermoSubs.length === 0) {
                      focusItems.push({
                        topic: "Entropy of Reversible & Irreversible Carnot Engines",
                        action: "Watch Lecture 10 PDF Notes",
                        badge: "Admission Standard"
                      });
                    }

                    return focusItems.slice(0, 2).map((rec, rIdx) => (
                      <div key={rIdx} className="bg-slate-950 border border-slate-850 p-2.5 rounded-xl flex items-start gap-2.5">
                        <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-slate-200 leading-tight">{rec.topic}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] text-slate-400 font-mono">{rec.action}</span>
                            <span className="text-[8px] uppercase font-bold text-cyan-400 font-mono bg-cyan-950/50 border border-cyan-500/20 px-1.5 py-0.2 rounded">
                              {rec.badge}
                            </span>
                          </div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>

            {/* Quick action button */}
            <button
              onClick={() => onNavigateTab('exams')}
              className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold rounded-xl transition shadow-lg shadow-cyan-500/10 cursor-pointer text-center"
            >
              Launch Exam Center & Practice
            </button>
          </div>
        </div>
      </div>

      {/* Recent quiz scores register logs */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
          <Clock className="w-4.5 h-4.5 text-cyan-400" /> Recent Quiz Performance Register
        </h3>

        {submissions.length === 0 ? (
          <div className="text-center bg-slate-900 border border-slate-800 p-8 rounded-2xl">
            <p className="text-xs text-slate-500">No quizzes taken in this session. Jump to the Exam tab to take your first paper!</p>
            <button 
              onClick={() => onNavigateTab('exams')}
              className="mt-3 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 text-xs px-4 py-2 rounded-xl transition"
            >
              Go to Quiz Engine
            </button>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] font-mono font-bold uppercase text-slate-500 tracking-wider bg-slate-950/20">
                    <th className="py-3 px-4">Exam Sheet Title</th>
                    <th className="py-3 px-4">Submission Date</th>
                    <th className="py-3 px-4 text-center">Score</th>
                    <th className="py-3 px-4 text-right">Result status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {submissions.map((sub, sIdx) => {
                    const statusClass = sub.percentage >= 80 
                      ? 'text-emerald-400 bg-emerald-950/40 border-emerald-500/20' 
                      : sub.percentage >= 50 
                        ? 'text-amber-400 bg-amber-950/40 border-amber-500/20' 
                        : 'text-rose-400 bg-rose-950/40 border-rose-500/20';

                    return (
                      <tr key={sIdx} className="hover:bg-slate-950/20 transition">
                        <td className="py-3.5 px-4 font-medium text-slate-200">{sub.quizTitle}</td>
                        <td className="py-3.5 px-4 text-slate-500 font-mono">{sub.date}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-center text-cyan-400">
                          {sub.score} / {sub.totalQuestions}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className={`px-2.5 py-0.5 rounded-lg border font-bold text-[10px] uppercase font-mono ${statusClass}`}>
                            {sub.percentage}% Marks
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
