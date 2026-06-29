import React, { useState } from 'react';
import { Notice, QuizSubmission, User, Course } from '../types';
import { 
  Users, 
  FileText, 
  PlusCircle, 
  Pin, 
  Megaphone, 
  Trash2, 
  Calendar, 
  ClipboardList, 
  CheckSquare, 
  Sparkles, 
  Search,
  Wallet, 
  BookOpen, 
  Check, 
  X, 
  Video, 
  Coins, 
  ShieldAlert, 
  ArrowRight,
  FolderPlus,
  Unlock,
  Lock,
  Phone,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminDashboardProps {
  notices: Notice[];
  onAddNotice: (notice: Omit<Notice, 'id' | 'date' | 'author'>) => void;
  onDeleteNotice: (id: string) => void;
  recentSubmissions: QuizSubmission[];
  students: User[];
  courses: Course[];
  onApprovePayment: (studentId: string, paymentId: string) => void;
  onRejectPayment: (studentId: string, paymentId: string) => void;
  onAddCourse: (newCourse: Omit<Course, 'chapters' | 'enrolledCount' | 'rating'>) => void;
  onAddLecture: (courseId: string, chapterId: string, topicId: string, lectureTitle: string, duration: string, videoUrl: string) => void;
}

type AdminTab = 'notices' | 'payments' | 'students' | 'lms';

export default function AdminDashboard({ 
  notices, 
  onAddNotice, 
  onDeleteNotice, 
  recentSubmissions, 
  students, 
  courses,
  onApprovePayment,
  onRejectPayment,
  onAddCourse,
  onAddLecture
}: AdminDashboardProps) {
  
  const [activeSubTab, setActiveSubTab] = useState<AdminTab>('notices');

  // Tab 1: Notice Composer states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'Exam' | 'Class Time' | 'Material' | 'General'>('General');
  const [isPinned, setIsPinned] = useState(false);
  const [targetBatch, setTargetBatch] = useState<'All' | 'HSC 1st Paper' | 'HSC 2nd Paper' | 'Admission'>('All');
  const [composerSuccess, setComposerSuccess] = useState(false);

  // Tab 3: Student Directory Search states
  const [studentSearch, setStudentSearch] = useState('');
  const [batchFilter, setBatchFilter] = useState('All');

  // Tab 4: LMS Manager states
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseTagline, setNewCourseTagline] = useState('');
  const [newCoursePrice, setNewCoursePrice] = useState('৳ 3,000');
  const [newCourseCategory, setNewCourseCategory] = useState<'HSC 1st Paper' | 'HSC 2nd Paper' | 'Admission'>('HSC 1st Paper');
  const [newCourseImage, setNewCourseImage] = useState('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80');
  const [newCourseDesc, setNewCourseDesc] = useState('');
  
  // Tab 4: Add lecture states
  const [selectedLmsCourseId, setSelectedLmsCourseId] = useState(courses[0]?.id || '');
  const [lectureTitle, setLectureTitle] = useState('');
  const [lectureDuration, setLectureDuration] = useState('45:00');
  const [lectureVideoUrl, setLectureVideoUrl] = useState('https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=1200&q=80');
  const [lectureSuccess, setLectureSuccess] = useState(false);

  const handleSubmitNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onAddNotice({
      title,
      content,
      category,
      isPinned,
      targetBatch
    });

    setTitle('');
    setContent('');
    setCategory('General');
    setIsPinned(false);
    setTargetBatch('All');
    setComposerSuccess(true);
    setTimeout(() => setComposerSuccess(false), 3000);
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim() || !newCourseTagline.trim()) return;

    onAddCourse({
      id: `course-${Date.now()}`,
      title: newCourseTitle,
      tagline: newCourseTagline,
      description: newCourseDesc || newCourseTagline,
      instructor: "Ashik Vai (BUET, ME '19)",
      category: newCourseCategory,
      price: newCoursePrice,
      duration: '40+ Hours',
      image: newCourseImage
    });

    setNewCourseTitle('');
    setNewCourseTagline('');
    setNewCoursePrice('৳ 3,000');
    setNewCourseDesc('');
    setShowCourseForm(false);
  };

  const handleCreateLecture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lectureTitle.trim()) return;

    // We can target the first chapter and topic of the selected course
    const targetCourse = courses.find(c => c.id === selectedLmsCourseId);
    if (!targetCourse || targetCourse.chapters.length === 0) return;

    const chapterId = targetCourse.chapters[0].id;
    if (targetCourse.chapters[0].topics.length === 0) return;
    const topicId = targetCourse.chapters[0].topics[0].id;

    onAddLecture(
      selectedLmsCourseId,
      chapterId,
      topicId,
      lectureTitle,
      lectureDuration,
      lectureVideoUrl
    );

    setLectureTitle('');
    setLectureDuration('45:00');
    setLectureSuccess(true);
    setTimeout(() => setLectureSuccess(false), 3000);
  };

  // Extract all payments pending or approved across all students
  const allPayments = students.flatMap(s => (s.payments || []).map(p => ({ ...p, student: s })));
  const pendingPayments = allPayments.filter(p => p.status === 'Pending');

  // Filtering student list
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
                          (s.institution && s.institution.toLowerCase().includes(studentSearch.toLowerCase())) ||
                          (s.phone && s.phone.includes(studentSearch));
    const matchesBatch = batchFilter === 'All' || s.batch?.includes(batchFilter);
    return matchesSearch && matchesBatch;
  });

  // Calculate dynamic statistics
  const totalEarned = allPayments.filter(p => p.status === 'Approved').reduce((acc, p) => acc + p.amount, 0);
  const outstandingDue = students.reduce((acc, s) => {
    const due = Math.max(0, (s.totalFees || 0) - (s.amountPaid || 0));
    return acc + due;
  }, 0);

  return (
    <div id="admin-dashboard-container" className="space-y-6">
      
      {/* Dynamic Header Badge Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/20 border border-slate-800 p-6 rounded-3xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-400 bg-indigo-950/40 border border-indigo-500/20 px-3 py-1 rounded-full">
            Faculty Admin Workspace
          </span>
          <h2 className="text-2xl font-extrabold text-slate-100 leading-tight">Ashik Vai's Coach Workspace</h2>
          <p className="text-xs text-slate-400 max-w-xl">
            Control accounts creation, approve tuition fee bKash logs, add course lecture archives, and manage announcements.
          </p>
        </div>

        <div className="bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-850 shrink-0 text-right">
          <span className="text-[10px] font-mono uppercase text-slate-500 block">Tuition Collections</span>
          <span className="text-xs font-bold text-cyan-400 font-mono flex items-center gap-1.5 mt-1 justify-end">
            ৳ {totalEarned.toLocaleString()} Received
          </span>
        </div>
      </div>

      {/* Admin Tab Switching Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveSubTab('notices')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'notices' 
              ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 shadow-md' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <Megaphone className="w-4 h-4" /> Notices & Bulletins
        </button>
        <button
          onClick={() => setActiveSubTab('payments')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 relative cursor-pointer ${
            activeSubTab === 'payments' 
              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-md' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <Wallet className="w-4 h-4" /> Pending Fees Approvals
          {pendingPayments.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-slate-950 font-black font-mono text-[9px] rounded-full flex items-center justify-center animate-bounce">
              {pendingPayments.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveSubTab('students')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'students' 
              ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-md' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <Users className="w-4 h-4" /> Student Directory ({students.length})
        </button>
        <button
          onClick={() => setActiveSubTab('lms')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'lms' 
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-md' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <BookOpen className="w-4 h-4" /> LMS Syllabus Manager
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          className="space-y-6"
        >
          {/* TAB 1: NOTICES & RECENT ACTIVITIES */}
          {activeSubTab === 'notices' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl">
                  <h3 className="text-xs uppercase tracking-wider font-mono font-bold text-slate-300 flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
                    <PlusCircle className="w-4.5 h-4.5 text-indigo-400" /> Draft Announcement Bulletin
                  </h3>

                  {composerSuccess && (
                    <div className="bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 text-xs p-3.5 rounded-xl mb-4 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" /> Notice uploaded successfully and broadcast to batch feeds!
                    </div>
                  )}

                  <form onSubmit={handleSubmitNotice} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400">Notice Title</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. 🔴 Physics 1st Paper Vector Exam rescheduled to Friday"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-100 px-3.5 py-2 rounded-xl text-xs focus:border-indigo-500 focus:outline-none transition placeholder:text-slate-700"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400">Bulletin Type</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value as any)}
                          className="w-full bg-slate-950 border border-slate-800 text-slate-300 px-3 py-2 rounded-xl text-xs focus:border-indigo-500 focus:outline-none cursor-pointer"
                        >
                          <option value="General">📢 General Notification</option>
                          <option value="Exam">📝 Exam Update</option>
                          <option value="Class Time">⏰ Class Timing</option>
                          <option value="Material">📚 Material/Sheet Release</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400">Target Student Batch</label>
                        <select
                          value={targetBatch}
                          onChange={(e) => setTargetBatch(e.target.value as any)}
                          className="w-full bg-slate-950 border border-slate-800 text-slate-300 px-3 py-2 rounded-xl text-xs focus:border-indigo-500 focus:outline-none cursor-pointer"
                        >
                          <option value="All">All Registered Students</option>
                          <option value="HSC 1st Paper">HSC 1st Paper Students</option>
                          <option value="HSC 2nd Paper">HSC 2nd Paper Students</option>
                          <option value="Admission">Admission Aspirants</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400">Detailed Message</label>
                      <textarea 
                        required
                        rows={4}
                        placeholder="Write class schedules, syllabus details, links..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-100 px-4 py-2.5 rounded-xl text-xs focus:border-indigo-500 focus:outline-none transition resize-none placeholder:text-slate-700"
                      />
                    </div>

                    <div className="flex items-center justify-between bg-slate-950/60 p-3 rounded-xl border border-slate-850">
                      <div className="flex items-center gap-2">
                        <Pin className="w-3.5 h-3.5 text-indigo-400 rotate-45" />
                        <div>
                          <p className="text-xs font-bold text-slate-300">Pin Announcement</p>
                          <p className="text-[10px] text-slate-500">Pinned notices are pinned statically to student home tabs.</p>
                        </div>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={isPinned}
                        onChange={(e) => setIsPinned(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-800 accent-indigo-500 cursor-pointer"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition shadow-lg cursor-pointer"
                    >
                      Publish Broadcasting Bulletin
                    </button>
                  </form>
                </div>
              </div>

              {/* Feed lists side column */}
              <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                  <h3 className="text-xs uppercase tracking-wider font-mono font-bold text-slate-400 flex items-center gap-2 mb-4">
                    <Megaphone className="w-4 h-4 text-indigo-400" /> Active Feed Posts ({notices.length})
                  </h3>

                  <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin">
                    {notices.map((notice) => (
                      <div key={notice.id} className="bg-slate-950 p-3 rounded-xl border border-slate-850 flex justify-between items-start gap-2 group">
                        <div className="truncate">
                          <p className="text-xs font-bold text-slate-300 truncate group-hover:text-cyan-400 transition">{notice.title}</p>
                          <p className="text-[9px] text-slate-500 font-mono mt-1">
                            {notice.date} • {notice.targetBatch}
                          </p>
                        </div>
                        <button
                          onClick={() => onDeleteNotice(notice.id)}
                          className="text-slate-600 hover:text-rose-400 p-1 rounded hover:bg-rose-500/10 transition shrink-0 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STUDENT FEES & APPROVALS */}
          {activeSubTab === 'payments' && (
            <div className="space-y-6">
              
              {/* Stats header bar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-md">
                  <p className="text-[10px] font-mono font-bold uppercase text-slate-500">Gross Collected Fees</p>
                  <p className="text-2xl font-black font-mono text-emerald-400 mt-1">৳ {totalEarned.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-500 mt-1">Approved tuition receipts</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-md">
                  <p className="text-[10px] font-mono font-bold uppercase text-slate-500">Pending Invoice Audit</p>
                  <p className="text-2xl font-black font-mono text-amber-400 mt-1">{pendingPayments.length} Tickets</p>
                  <p className="text-[10px] text-slate-500 mt-1">Needs verification</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-md">
                  <p className="text-[10px] font-mono font-bold uppercase text-slate-500">Outstanding Receivable</p>
                  <p className="text-2xl font-black font-mono text-rose-400 mt-1">৳ {outstandingDue.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-500 mt-1">Calculated outstanding dues</p>
                </div>
              </div>

              {/* Pending approval table cards */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
                    <Coins className="w-4.5 h-4.5 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} /> Pending Tuition Verification Queue
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Students send tuition fees via bKash/Nagad. Match their Transaction ID below and click Approve to unlock their course instantly.</p>
                </div>

                {pendingPayments.length === 0 ? (
                  <div className="text-center py-10 bg-slate-950/40 border border-dashed border-slate-800 rounded-2xl p-6">
                    <CheckSquare className="w-10 h-10 text-emerald-500 mx-auto mb-2.5 animate-pulse" />
                    <p className="text-xs font-bold text-slate-300">All payment audits cleared!</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">There are no pending bKash or Nagad invoices awaiting verification right now.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-slate-850">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-950 border-b border-slate-850 text-[10px] font-mono font-bold uppercase text-slate-500">
                          <th className="py-3 px-4">Student & Mobile</th>
                          <th className="py-3 px-4">Course Package</th>
                          <th className="py-3 px-4">Transaction ID (TrxID)</th>
                          <th className="py-3 px-4">Method & Amount</th>
                          <th className="py-3 px-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 bg-slate-950/20">
                        {pendingPayments.map((pay) => (
                          <tr key={pay.id} className="hover:bg-slate-950/40 transition">
                            <td className="py-3.5 px-4">
                              <p className="font-bold text-slate-200">{pay.studentName}</p>
                              <p className="text-[10px] font-mono text-slate-500 mt-0.5">📱 {pay.student?.phone || 'N/A'}</p>
                            </td>
                            <td className="py-3.5 px-4 font-medium text-slate-300">{pay.courseTitle}</td>
                            <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">{pay.txId}</td>
                            <td className="py-3.5 px-4">
                              <span className="bg-slate-900 border border-slate-850 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase text-slate-400 mr-2">{pay.paymentMethod}</span>
                              <strong className="font-mono text-slate-100">৳ {pay.amount}</strong>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => onApprovePayment(pay.studentId, pay.id)}
                                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-[11px] font-bold rounded-lg transition flex items-center gap-1 cursor-pointer"
                                  title="Approve transaction"
                                >
                                  <Check className="w-3.5 h-3.5" /> Approve
                                </button>
                                <button
                                  onClick={() => onRejectPayment(pay.studentId, pay.id)}
                                  className="px-2.5 py-1 bg-slate-800 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-slate-750 hover:border-rose-500/20 text-[11px] font-medium rounded-lg transition flex items-center gap-1 cursor-pointer"
                                  title="Decline receipt"
                                >
                                  <X className="w-3.5 h-3.5" /> Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Complete general history ledger of payments */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl space-y-4">
                <h3 className="text-xs uppercase tracking-wider font-mono font-bold text-slate-400">All Invoice Receipts Log ({allPayments.length})</h3>
                <div className="overflow-x-auto rounded-xl border border-slate-850">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-950 border-b border-slate-850 text-[10px] font-mono font-bold uppercase text-slate-500">
                        <th className="py-3 px-4">Student</th>
                        <th className="py-3 px-4">Course Package</th>
                        <th className="py-3 px-4 font-mono">TrxID</th>
                        <th className="py-3 px-4 text-right">Amount</th>
                        <th className="py-3 px-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850 bg-slate-950/10">
                      {allPayments.map((pay) => {
                        const statusBadge = pay.status === 'Approved'
                          ? 'text-emerald-400 bg-emerald-950/40 border-emerald-500/20'
                          : pay.status === 'Pending'
                            ? 'text-amber-400 bg-amber-950/40 border-amber-500/20'
                            : 'text-rose-400 bg-rose-950/40 border-rose-500/20';

                        return (
                          <tr key={pay.id} className="hover:bg-slate-950/20 transition">
                            <td className="py-3 px-4 font-bold text-slate-300">{pay.studentName}</td>
                            <td className="py-3 px-4 text-slate-400">{pay.courseTitle.substring(0, 32)}...</td>
                            <td className="py-3 px-4 font-mono text-slate-500">{pay.txId}</td>
                            <td className="py-3 px-4 text-right font-mono font-bold text-slate-200">৳ {pay.amount}</td>
                            <td className="py-3 px-4 text-right">
                              <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-mono font-extrabold border ${statusBadge}`}>
                                {pay.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: STUDENT DIRECTORY */}
          {activeSubTab === 'students' && (
            <div className="space-y-4">
              
              {/* Directory Filter Panel */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search by student name, college, or mobile number..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-100 pl-10 pr-4 py-2 rounded-xl text-xs focus:border-cyan-500 focus:outline-none transition placeholder:text-slate-600"
                  />
                </div>

                <div className="flex gap-2 text-xs">
                  <span className="text-slate-500 py-1.5 font-mono">Filter Batch:</span>
                  <select
                    value={batchFilter}
                    onChange={(e) => setBatchFilter(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-xl cursor-pointer"
                  >
                    <option value="All">All Batches</option>
                    <option value="HSC Batch 2026">HSC Batch 2026</option>
                    <option value="HSC Batch 2027">HSC Batch 2027</option>
                    <option value="Admission">Admission Aspirants</option>
                  </select>
                </div>
              </div>

              {/* Roster Directory Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-950 border-b border-slate-800 text-[10px] font-mono font-bold uppercase text-slate-500">
                        <th className="py-3.5 px-4">Student Info</th>
                        <th className="py-3.5 px-4">Academic Details</th>
                        <th className="py-3.5 px-4">Contact Phone</th>
                        <th className="py-3.5 px-4 text-center">Score points</th>
                        <th className="py-3.5 px-4 text-right">Billing Summary (Paid vs Due)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-slate-900/40">
                      {filteredStudents.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-10 text-center text-slate-500 font-mono">
                            No student profiles match your filters or search terms.
                          </td>
                        </tr>
                      ) : (
                        filteredStudents.map((st) => {
                          const due = Math.max(0, (st.totalFees || 0) - (st.amountPaid || 0));
                          const hasDue = due > 0;
                          
                          return (
                            <tr key={st.id} className="hover:bg-slate-950/35 transition">
                              <td className="py-3.5 px-4 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-800 shrink-0">
                                  <img src={st.avatar} alt={st.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                  <p className="font-bold text-slate-200">{st.name}</p>
                                  <p className="text-[10px] text-slate-500 font-mono">{st.email}</p>
                                </div>
                              </td>
                              <td className="py-3.5 px-4">
                                <p className="font-semibold text-slate-300">{st.institution || 'Notre Dame College'}</p>
                                <p className="text-[10px] text-slate-500 font-mono mt-0.5">{st.batch || 'Batch 2026'}</p>
                              </td>
                              <td className="py-3.5 px-4 font-mono text-slate-400">{st.phone || '01712-345678'}</td>
                              <td className="py-3.5 px-4 text-center font-mono font-bold text-cyan-400">{st.points} XP</td>
                              <td className="py-3.5 px-4 text-right">
                                <div className="space-y-0.5">
                                  <p className="font-mono font-bold text-slate-200">৳ {st.amountPaid || 0} Paid</p>
                                  <p className={`text-[10px] font-mono font-medium ${hasDue ? 'text-rose-400' : 'text-emerald-400 font-bold'}`}>
                                    {hasDue ? `৳ ${due} Due` : 'Fully Paid ✓'}
                                  </p>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: LMS SYLLABUS & CLASSES MANAGER */}
          {activeSubTab === 'lms' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Create course package block */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Publish Class Lecture form */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl">
                  <div className="pb-3 border-b border-slate-800 mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
                      <Video className="w-4.5 h-4.5 text-emerald-400" /> Upload Class Lecture (নতুন ভিডিও ক্লাস যোগ করুন)
                    </h3>
                    <span className="text-[9px] uppercase font-mono bg-emerald-950/50 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">LMS Console</span>
                  </div>

                  {lectureSuccess && (
                    <div className="bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 text-xs p-3.5 rounded-xl mb-4">
                      🎉 <strong>Lecture published successfully!</strong> Class is added inside the Course Syllabus and unlocked for all enrolled students.
                    </div>
                  )}

                  <form onSubmit={handleCreateLecture} className="space-y-4 text-xs">
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400">Target Physics Module Pack</label>
                      <select
                        value={selectedLmsCourseId}
                        onChange={(e) => setSelectedLmsCourseId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-300 px-3.5 py-2.5 rounded-xl text-xs focus:border-emerald-500 focus:outline-none cursor-pointer"
                      >
                        {courses.map(course => (
                          <option key={course.id} value={course.id}>
                            {course.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400">Lecture Title (ক্লাসের নাম)</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Lecture 04: Projectile Motion advanced BUET MCQ Hacks"
                        value={lectureTitle}
                        onChange={(e) => setLectureTitle(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-100 px-3.5 py-2.5 rounded-xl text-xs focus:border-emerald-500 focus:outline-none transition placeholder:text-slate-700"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400">Video Duration</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. 52:45"
                          value={lectureDuration}
                          onChange={(e) => setLectureDuration(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 text-slate-100 px-3.5 py-2.5 rounded-xl text-xs focus:border-emerald-500 focus:outline-none transition font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400">Mock Video Backdrop Image URL</label>
                        <input 
                          type="text" 
                          required
                          value={lectureVideoUrl}
                          onChange={(e) => setLectureVideoUrl(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 text-slate-100 px-3.5 py-2.5 rounded-xl text-xs focus:border-emerald-500 focus:outline-none transition font-mono"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl transition shadow-lg cursor-pointer text-center"
                    >
                      Publish to Student Study Console
                    </button>
                  </form>
                </div>

                {/* Show course lists with chapter indexes */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl space-y-4">
                  <h3 className="text-xs uppercase tracking-wider font-mono font-bold text-slate-400">Syllabus Class Outlines</h3>
                  
                  <div className="space-y-3">
                    {courses.map((course) => (
                      <div key={course.id} className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-slate-200">{course.title}</p>
                          <span className="text-[9px] font-mono font-bold uppercase bg-slate-900 px-2 py-0.5 rounded text-slate-400">{course.category}</span>
                        </div>
                        <div className="pl-3 border-l border-slate-800 mt-2 space-y-2">
                          {course.chapters.map((ch) => (
                            <div key={ch.id}>
                              <p className="text-xs font-semibold text-cyan-400">{ch.title}</p>
                              <div className="pl-2 space-y-1 mt-1">
                                {ch.topics.map((tp) => (
                                  <div key={tp.id} className="text-[11px] text-slate-500 flex justify-between items-center bg-slate-900/30 px-2 py-1 rounded">
                                    <span>{tp.title}</span>
                                    <span className="font-mono text-[10px] text-slate-400">({tp.lectures.length} Classes)</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Create new course sidebar */}
              <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                    <FolderPlus className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-xs uppercase tracking-wider font-mono font-bold text-slate-300">Add Study Module Package</h3>
                  </div>

                  <form onSubmit={handleCreateCourse} className="space-y-3.5 text-xs">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400">Module Package Title</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. HSC Physics 2nd Paper Crash Course"
                        value={newCourseTitle}
                        onChange={(e) => setNewCourseTitle(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-100 px-3 py-2 rounded-xl text-xs focus:border-emerald-500 focus:outline-none placeholder:text-slate-750"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400">Tagline Description</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Master Thermodynamics, Electromagnetism, Optics..."
                        value={newCourseTagline}
                        onChange={(e) => setNewCourseTagline(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-100 px-3 py-2 rounded-xl text-xs focus:border-emerald-500 focus:outline-none placeholder:text-slate-750"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400">Tuition Fee</label>
                        <input 
                          type="text" 
                          required
                          value={newCoursePrice}
                          onChange={(e) => setNewCoursePrice(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 text-slate-100 px-3 py-2 rounded-xl text-xs focus:border-emerald-500 focus:outline-none font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400">Category</label>
                        <select
                          value={newCourseCategory}
                          onChange={(e) => setNewCourseCategory(e.target.value as any)}
                          className="w-full bg-slate-950 border border-slate-800 text-slate-300 px-3 py-2 rounded-xl text-xs focus:border-emerald-500 focus:outline-none cursor-pointer"
                        >
                          <option value="HSC 1st Paper">HSC 1st Paper</option>
                          <option value="HSC 2nd Paper">HSC 2nd Paper</option>
                          <option value="Admission">Admission Standard</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-[11px] uppercase rounded-xl transition cursor-pointer text-center"
                    >
                      Publish Module Pack
                    </button>
                  </form>
                </div>
              </div>

            </div>
          )}
        </motion.div>
      </AnimatePresence>

    </div>
  );
}
