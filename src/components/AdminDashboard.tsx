import React, { useState } from 'react';
import { Notice, QuizSubmission } from '../types';
import { Users, FileText, PlusCircle, Pin, Megaphone, Trash2, Calendar, ClipboardList, CheckSquare, Sparkles, MessageSquare, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

interface AdminDashboardProps {
  notices: Notice[];
  onAddNotice: (notice: Omit<Notice, 'id' | 'date' | 'author'>) => void;
  onDeleteNotice: (id: string) => void;
  recentSubmissions: QuizSubmission[];
}

export default function AdminDashboard({ notices, onAddNotice, onDeleteNotice, recentSubmissions }: AdminDashboardProps) {
  // Local states for Notice composer
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'Exam' | 'Class Time' | 'Material' | 'General'>('General');
  const [isPinned, setIsPinned] = useState(false);
  const [targetBatch, setTargetBatch] = useState<'All' | 'HSC 1st Paper' | 'HSC 2nd Paper' | 'Admission'>('All');
  const [composerSuccess, setComposerSuccess] = useState(false);

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

    // Reset composer state
    setTitle('');
    setContent('');
    setCategory('General');
    setIsPinned(false);
    setTargetBatch('All');
    
    // Show success feedback
    setComposerSuccess(true);
    setTimeout(() => setComposerSuccess(false), 3000);
  };

  return (
    <div id="admin-dashboard-container" className="space-y-8">
      
      {/* Admin Greetings Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/20 border-2 border-indigo-500/20 p-6 md:p-8 rounded-3xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-400 bg-indigo-950/40 border border-indigo-500/20 px-3 py-1 rounded-full">
            Faculty Admin Workspace
          </span>
          <h2 className="text-2xl font-extrabold text-slate-100 leading-tight">Welcome back, Ashik Vai!</h2>
          <p className="text-xs text-slate-400 max-w-xl">
            Manage your Physics Coaching, publish daily lecture notes, configure admission-standard kash-exams, and notify your 2,000+ students instantly in real-time.
          </p>
        </div>

        <div className="bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800/80 shrink-0 text-right">
          <span className="text-[10px] font-mono uppercase text-slate-500 block">System Authority</span>
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mt-1 justify-end">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Verified Server (Ashik Physics)
          </span>
        </div>
      </div>

      {/* Global Metrics Statistics cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-md">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Total Registered Students</span>
          <p className="text-3xl font-extrabold font-mono text-slate-100 mt-2">1,420</p>
          <p className="text-[11px] text-slate-400 mt-1">Across HSC & Admission batches</p>
        </div>
        {/* Metric 2 */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-md">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Active Packages</span>
          <p className="text-3xl font-extrabold font-mono text-slate-100 mt-2">3 Modules</p>
          <p className="text-[11px] text-slate-400 mt-1">HSC 1st, 2nd, and Varsity pack</p>
        </div>
        {/* Metric 3 */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-md">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Session Submissions</span>
          <p className="text-3xl font-extrabold font-mono text-slate-100 mt-2">{recentSubmissions.length} Exams</p>
          <p className="text-[11px] text-slate-400 mt-1">Completed in current session</p>
        </div>
        {/* Metric 4 */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-md">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Published Announcements</span>
          <p className="text-3xl font-extrabold font-mono text-slate-100 mt-2">{notices.length} Posts</p>
          <p className="text-[11px] text-slate-400 mt-1">{notices.filter(n => n.isPinned).length} Pinned announcements</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMN 1 & 2: Notice Board Composer */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
              <PlusCircle className="w-5 h-5 text-indigo-400" /> Create Announcement / Notice (নতুন নোটিশ লিখুন)
            </h3>

            {composerSuccess && (
              <div className="bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 text-xs p-3.5 rounded-xl mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" /> Announcement published successfully! Students are notified.
              </div>
            )}

            <form onSubmit={handleSubmitNotice} className="space-y-4">
              {/* Title field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400">Notice Title (শিরোনাম)</label>
                <input 
                  id="admin-notice-title"
                  type="text" 
                  required
                  placeholder="e.g. 🔴 Physics 1st Paper Vector Exam Postponed to Friday!"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 px-4 py-2.5 rounded-xl text-xs focus:border-indigo-500 focus:outline-none transition placeholder:text-slate-600"
                />
              </div>

              {/* Form Grid Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400">Topic Category</label>
                  <select
                    id="admin-notice-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-300 px-3.5 py-2.5 rounded-xl text-xs focus:border-indigo-500 focus:outline-none cursor-pointer"
                  >
                    <option value="General">📢 General Notification</option>
                    <option value="Exam">📝 Exam Update</option>
                    <option value="Class Time">⏰ Class Timing</option>
                    <option value="Material">📚 Material/Sheet Release</option>
                  </select>
                </div>

                {/* Target batch selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400">Target Student Batch</label>
                  <select
                    id="admin-notice-batch"
                    value={targetBatch}
                    onChange={(e) => setTargetBatch(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-300 px-3.5 py-2.5 rounded-xl text-xs focus:border-indigo-500 focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Registered Students</option>
                    <option value="HSC 1st Paper">HSC 1st Paper Students</option>
                    <option value="HSC 2nd Paper">HSC 2nd Paper Students</option>
                    <option value="Admission">Admission Aspirants</option>
                  </select>
                </div>
              </div>

              {/* Text content details */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400">Detailed Message (বিস্তারিত নোটিশটি লিখুন)</label>
                <textarea 
                  id="admin-notice-content"
                  required
                  rows={4}
                  placeholder="Draft your announcement text here. Clearly state instructions, links, times, and steps for the students..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 px-4 py-2.5 rounded-xl text-xs focus:border-indigo-500 focus:outline-none transition resize-none placeholder:text-slate-600 font-sans"
                />
              </div>

              {/* Pin switch */}
              <div className="flex items-center justify-between bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Pin className="w-4 h-4 text-indigo-400 rotate-45" />
                  <div>
                    <p className="text-xs font-bold text-slate-200">Pin to Top of Dashboard</p>
                    <p className="text-[10px] text-slate-500">Pinned posts are highlighted and stay visible at the top of the feed.</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    id="admin-notice-pin-toggle"
                    type="checkbox" 
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500 peer-checked:after:bg-slate-950 peer-checked:after:border-indigo-200" />
                </label>
              </div>

              {/* Submit Button */}
              <button
                id="btn-admin-submit-notice"
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-indigo-600/10 cursor-pointer text-center"
              >
                Publish Notice Board Update
              </button>
            </form>
          </div>
        </div>

        {/* COLUMN 3: Live Submissions & Fast Notices Control */}
        <div className="space-y-6">
          {/* Quick Active Notice Feed manager */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-xs uppercase tracking-wider font-mono font-bold text-slate-400 flex items-center gap-2 mb-4">
              <Megaphone className="w-4 h-4 text-indigo-400" /> Feed Manager ({notices.length} Posts)
            </h3>

            <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1 scrollbar-thin">
              {notices.map((notice) => (
                <div key={notice.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex justify-between items-start gap-2 group">
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-300 truncate group-hover:text-cyan-400 transition">{notice.title}</p>
                    <p className="text-[9px] text-slate-500 font-mono mt-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {notice.date} • Batch: {notice.targetBatch}
                    </p>
                  </div>
                  <button
                    id={`delete-notice-quick-${notice.id}`}
                    onClick={() => onDeleteNotice(notice.id)}
                    className="text-slate-600 hover:text-rose-400 p-1 rounded hover:bg-rose-500/10 transition shrink-0 cursor-pointer"
                    title="Delete Notice"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time submissions tracker */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-xs uppercase tracking-wider font-mono font-bold text-slate-400 flex items-center gap-2 mb-4">
              <ClipboardList className="w-4 h-4 text-emerald-400" /> Live Session Activity
            </h3>

            {recentSubmissions.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl bg-slate-950/20">
                No active exam submissions in this coaching session. Take some exams in student mode to see them log here.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1 scrollbar-thin">
                {recentSubmissions.map((sub, sIdx) => (
                  <div key={sIdx} className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1 bg-emerald-950/30 px-1.5 py-0.5 rounded border border-emerald-500/10">
                        <CheckSquare className="w-3 h-3 text-emerald-400" /> SUBMITTED
                      </p>
                      <span className="text-[10px] text-slate-500 font-mono">{sub.date}</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-200 line-clamp-1">{sub.quizTitle}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Score: <strong className="text-cyan-400 font-mono font-bold">{sub.score}/{sub.totalQuestions} ({sub.percentage}%)</strong></p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
