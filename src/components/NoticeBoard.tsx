import React, { useState } from 'react';
import { Notice, UserRole } from '../types';
import { Pin, Calendar, User, Search, Filter, Tag, BookOpen, Trash2, Megaphone, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NoticeBoardProps {
  notices: Notice[];
  userRole: UserRole;
  onDeleteNotice?: (id: string) => void;
}

export default function NoticeBoard({ notices, userRole, onDeleteNotice }: NoticeBoardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Exam' | 'Class Time' | 'Material' | 'General'>('All');
  const [selectedBatch, setSelectedBatch] = useState<'All' | 'HSC 1st Paper' | 'HSC 2nd Paper' | 'Admission'>('All');

  // Filter logic
  const filteredNotices = notices.filter((notice) => {
    const matchesSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          notice.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || notice.category === selectedCategory;
    const matchesBatch = selectedBatch === 'All' || notice.targetBatch === selectedBatch || notice.targetBatch === 'All';
    return matchesSearch && matchesCategory && matchesBatch;
  });

  const pinnedNotices = filteredNotices.filter((n) => n.isPinned);
  const regularNotices = filteredNotices.filter((n) => !n.isPinned);

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Exam': return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'Class Time': return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Material': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      default: return 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30';
    }
  };

  const categories: ('All' | 'Exam' | 'Class Time' | 'Material' | 'General')[] = ['All', 'Exam', 'Class Time', 'Material', 'General'];
  const batches: ('All' | 'HSC 1st Paper' | 'HSC 2nd Paper' | 'Admission')[] = ['All', 'HSC 1st Paper', 'HSC 2nd Paper', 'Admission'];

  return (
    <div id="notice-board-container" className="space-y-6">
      {/* Search & Filter Header block */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search bar input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4.5 h-4.5" />
            <input 
              id="notice-search-input"
              type="text" 
              placeholder="Search announcements, exams, or sheets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-100 pl-11 pr-4 py-2.5 rounded-xl text-xs focus:border-cyan-500 focus:outline-none transition-all placeholder:text-slate-600"
            />
          </div>

          {/* Batch Selector */}
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] text-slate-500 uppercase tracking-wide font-bold">Target Batch:</span>
            <select
              id="notice-batch-filter"
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value as any)}
              className="bg-transparent text-xs text-slate-300 font-medium focus:outline-none cursor-pointer"
            >
              {batches.map((b) => (
                <option key={b} value={b} className="bg-slate-950 text-slate-300">{b === 'All' ? 'All Batches' : b}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category horizontal scrolling selector tags */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-800">
          <span className="text-[10px] text-slate-500 uppercase tracking-wide font-bold shrink-0 flex items-center gap-1">
            <Tag className="w-3 h-3 text-cyan-400" /> Topic Filter:
          </span>
          <div className="flex gap-1.5 pl-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs transition shrink-0 border cursor-pointer ${
                  selectedCategory === cat 
                    ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 font-bold' 
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {cat === 'All' ? 'All Updates' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Announcements body feed */}
      {filteredNotices.length === 0 ? (
        <div className="text-center bg-slate-900 border border-slate-800/80 p-12 rounded-2xl">
          <div className="w-12 h-12 bg-slate-800 text-slate-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <p className="text-slate-300 font-semibold text-sm">No notices found</p>
          <p className="text-slate-500 text-xs mt-1 max-w-xs mx-auto">Try clearing your filters or searching with another keyword.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pinned Announcements Segment */}
          {pinnedNotices.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                <Pin className="w-3.5 h-3.5 text-cyan-400 rotate-45 fill-current" /> Pinned Notices
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {pinnedNotices.map((notice) => (
                  <NoticeCard 
                    key={notice.id} 
                    notice={notice} 
                    userRole={userRole} 
                    onDelete={onDeleteNotice} 
                    getCategoryColor={getCategoryColor} 
                  />
                ))}
              </div>
            </div>
          )}

          {/* Regular Announcements Segment */}
          {regularNotices.length > 0 && (
            <div className="space-y-3">
              {pinnedNotices.length > 0 && (
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 pt-2">
                  <Megaphone className="w-3.5 h-3.5" /> Recent Announcements
                </h3>
              )}
              <div className="grid grid-cols-1 gap-4">
                {regularNotices.map((notice) => (
                  <NoticeCard 
                    key={notice.id} 
                    notice={notice} 
                    userRole={userRole} 
                    onDelete={onDeleteNotice} 
                    getCategoryColor={getCategoryColor} 
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Notice Card Sub-component for clean animations and visual hierarchy
interface NoticeCardProps {
  key?: string;
  notice: Notice;
  userRole: UserRole;
  onDelete?: (id: string) => void;
  getCategoryColor: (cat: string) => string;
}

function NoticeCard({ notice, userRole, onDelete, getCategoryColor }: NoticeCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative bg-slate-900 border rounded-2xl p-5 md:p-6 shadow-xl transition-all hover:border-slate-700/80 group ${notice.isPinned ? 'border-cyan-500/20 shadow-cyan-950/5' : 'border-slate-800'}`}
    >
      {/* Pinned Glow Indicator */}
      {notice.isPinned && (
        <div className="absolute top-0 left-6 -translate-y-1/2 bg-cyan-500 text-slate-950 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-black uppercase tracking-wider flex items-center gap-1 shadow-md shadow-cyan-500/15">
          <Pin className="w-2.5 h-2.5 rotate-45 fill-current" /> PINNED
        </div>
      )}

      {/* Header Info blocks */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
          {/* Category Tag */}
          <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-extrabold uppercase border ${getCategoryColor(notice.category)}`}>
            {notice.category}
          </span>
          {/* Target Batch tag */}
          <span className="bg-slate-950 text-slate-400 border border-slate-800 px-2.5 py-0.5 rounded-lg text-[10px] font-medium flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-cyan-400" /> Batch: {notice.targetBatch}
          </span>
        </div>

        {/* Action Trash button for Admin */}
        {userRole === 'admin' && onDelete && (
          <button 
            id={`delete-notice-${notice.id}`}
            onClick={() => onDelete(notice.id)}
            className="text-slate-600 hover:text-rose-400 p-1 rounded-lg hover:bg-rose-500/10 transition cursor-pointer"
            title="Delete Announcement"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Notice Title and Paragraph Content */}
      <h4 className="text-base font-bold text-slate-100 group-hover:text-cyan-400 transition leading-snug">{notice.title}</h4>
      <p className="text-xs text-slate-400 mt-2.5 leading-relaxed whitespace-pre-wrap">{notice.content}</p>

      {/* Footer Details */}
      <div className="flex items-center space-x-4 mt-5 pt-4 border-t border-slate-800/60 text-[10px] font-mono text-slate-500">
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" /> {notice.date}
        </span>
        <span className="flex items-center gap-1">
          <User className="w-3.5 h-3.5 text-cyan-400" /> Post by: {notice.author}
        </span>
      </div>
    </motion.div>
  );
}
