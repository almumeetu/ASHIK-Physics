import React, { useState } from 'react';
import { LeaderboardEntry } from '../types';
import { Trophy, Search, School, Calendar, Flame, Sparkles, Filter } from 'lucide-react';
import { motion } from 'motion/react';

interface LeaderboardViewProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}

export default function LeaderboardView({ entries, currentUserId }: LeaderboardViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatchFilter, setSelectedBatchFilter] = useState('All');

  // Filter entries
  const filteredEntries = entries.filter((entry) => {
    const matchesSearch = entry.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          entry.institution.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBatch = selectedBatchFilter === 'All' || entry.batch.includes(selectedBatchFilter);
    return matchesSearch && matchesBatch;
  });

  // Sort by points descending
  const sortedEntries = [...filteredEntries].sort((a, b) => b.points - a.points);

  // Top 3 Podium spots
  const top1 = entries.find((e) => e.rank === 1);
  const top2 = entries.find((e) => e.rank === 2);
  const top3 = entries.find((e) => e.rank === 3);

  const batchesList = ['All', 'HSC 2026', 'Admission'];

  return (
    <div id="leaderboard-view-container" className="space-y-8">
      {/* Interactive Podium for top 3 Physics Students */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-6">
        
        {/* 2nd Place Podium */}
        {top2 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center relative order-2 md:order-1 hover:border-slate-700 transition duration-300 shadow-xl"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-800 text-slate-300 border border-slate-700 w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs">
              2
            </div>
            <div className="relative inline-block mt-2">
              <div className="w-14 h-14 rounded-full p-1 bg-gradient-to-tr from-slate-400 to-slate-200 overflow-hidden mx-auto shadow-lg">
                <img src={top2.avatar} alt={top2.name} className="w-full h-full object-cover rounded-full" />
              </div>
              <span className="absolute bottom-0 right-0 bg-slate-800 border border-slate-400 rounded-full px-1.5 py-0.5 text-[9px] font-mono font-bold text-slate-300">
                🥈
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-100 mt-3 truncate">{top2.name}</h4>
            <p className="text-[10px] text-slate-400 mt-0.5 truncate">{top2.institution}</p>
            <div className="bg-slate-950/80 px-3 py-1 rounded-full border border-slate-800 w-fit mx-auto mt-3 flex items-center gap-1 font-mono text-xs font-bold text-slate-300">
              <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
              {top2.points} Points
            </div>
          </motion.div>
        )}

        {/* 1st Place Podium (Centered & Elevated) */}
        {top1 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-b from-cyan-950/20 to-slate-900 border-2 border-cyan-500 rounded-2xl p-6 text-center relative order-1 md:order-2 hover:border-cyan-400 transition duration-300 shadow-2xl shadow-cyan-950/10"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-cyan-500 text-slate-950 border-2 border-cyan-300 w-8 h-8 rounded-full flex items-center justify-center font-mono font-black text-sm shadow-[0_0_15px_rgba(6,182,212,0.5)]">
              1
            </div>
            <div className="absolute top-3 right-3 text-cyan-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div className="relative inline-block mt-1">
              <div className="w-18 h-18 rounded-full p-1 bg-gradient-to-tr from-amber-500 to-yellow-300 overflow-hidden mx-auto shadow-xl ring-4 ring-cyan-500/10">
                <img src={top1.avatar} alt={top1.name} className="w-full h-full object-cover rounded-full" />
              </div>
              <span className="absolute bottom-0 right-0 bg-slate-800 border border-yellow-500 rounded-full px-1.5 py-0.5 text-[10px] font-mono font-bold text-yellow-400">
                👑
              </span>
            </div>
            <h4 className="text-base font-extrabold text-cyan-400 mt-3 truncate">{top1.name}</h4>
            <p className="text-xs text-slate-300 mt-0.5 truncate font-medium">{top1.institution}</p>
            <div className="bg-cyan-500 text-slate-950 px-4 py-1.5 rounded-full w-fit mx-auto mt-4 flex items-center gap-1 font-mono text-sm font-black shadow-md shadow-cyan-500/10">
              <Trophy className="w-4 h-4 fill-current text-slate-950" />
              {top1.points} Points
            </div>
          </motion.div>
        )}

        {/* 3rd Place Podium */}
        {top3 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center relative order-3 hover:border-slate-700 transition duration-300 shadow-xl"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-800 text-slate-300 border border-slate-700 w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs">
              3
            </div>
            <div className="relative inline-block mt-2">
              <div className="w-14 h-14 rounded-full p-1 bg-gradient-to-tr from-amber-700 to-amber-600 overflow-hidden mx-auto shadow-lg">
                <img src={top3.avatar} alt={top3.name} className="w-full h-full object-cover rounded-full" />
              </div>
              <span className="absolute bottom-0 right-0 bg-slate-800 border border-amber-600 rounded-full px-1.5 py-0.5 text-[9px] font-mono font-bold text-amber-500">
                🥉
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-100 mt-3 truncate">{top3.name}</h4>
            <p className="text-[10px] text-slate-400 mt-0.5 truncate">{top3.institution}</p>
            <div className="bg-slate-950/80 px-3 py-1 rounded-full border border-slate-800 w-fit mx-auto mt-3 flex items-center gap-1 font-mono text-xs font-bold text-amber-500">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              {top3.points} Points
            </div>
          </motion.div>
        )}

      </div>

      {/* Ranks search controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4.5 h-4.5" />
            <input 
              id="leaderboard-search-input"
              type="text" 
              placeholder="Search scholar name or college..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-100 pl-11 pr-4 py-2.5 rounded-xl text-xs focus:border-cyan-500 focus:outline-none transition-all placeholder:text-slate-600"
            />
          </div>

          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] text-slate-500 uppercase tracking-wide font-bold">Filter Batch:</span>
            <select
              id="leaderboard-batch-filter"
              value={selectedBatchFilter}
              onChange={(e) => setSelectedBatchFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-300 font-medium focus:outline-none cursor-pointer"
            >
              {batchesList.map((bt) => (
                <option key={bt} value={bt} className="bg-slate-950 text-slate-300">{bt === 'All' ? 'All Batches' : bt}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Ranks table list (Responsive layout with desktop table and mobile cards) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 md:p-5 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
          <h3 className="text-xs uppercase tracking-wider font-mono font-bold text-slate-400 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-cyan-400" /> Active Scholar Standings
          </h3>
          <span className="text-xs font-mono text-cyan-400 font-bold">{sortedEntries.length} Students Listed</span>
        </div>

        {/* Mobile View Ranks Cards */}
        <div className="block md:hidden divide-y divide-slate-800">
          {sortedEntries.map((entry, index) => {
            const isMe = entry.id === currentUserId;
            return (
              <div 
                key={entry.id} 
                className={`p-4 flex items-center justify-between gap-3 ${isMe ? 'bg-cyan-500/5' : ''}`}
              >
                <div className="flex items-center space-x-3 truncate">
                  <span className={`w-6 font-mono text-xs font-extrabold ${entry.rank === 1 ? 'text-yellow-400' : entry.rank === 2 ? 'text-slate-300' : entry.rank === 3 ? 'text-amber-600' : 'text-slate-500'}`}>
                    #{entry.rank}
                  </span>
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-800 shrink-0">
                    <img src={entry.avatar} alt={entry.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="truncate">
                    <p className={`text-xs font-bold truncate ${isMe ? 'text-cyan-400' : 'text-slate-200'}`}>
                      {entry.name} {isMe && '(You)'}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                      <School className="w-3 h-3 text-slate-500 shrink-0" /> {entry.institution}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-xs font-mono font-bold text-cyan-400">{entry.points} pts</p>
                  <p className="text-[9px] text-slate-500 font-mono mt-0.5">{entry.quizzesTaken} Exams</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop View Ranks Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] uppercase font-bold text-slate-500 tracking-wider font-mono bg-slate-950/25">
                <th className="py-3.5 px-6 w-20">Rank</th>
                <th className="py-3.5 px-4">Student Info</th>
                <th className="py-3.5 px-4">College/Institution</th>
                <th className="py-3.5 px-4">Active Batch</th>
                <th className="py-3.5 px-4 text-center">Quizzes Taken</th>
                <th className="py-3.5 px-6 text-right">Points Earned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {sortedEntries.map((entry) => {
                const isMe = entry.id === currentUserId;
                return (
                  <tr 
                    key={entry.id}
                    className={`hover:bg-slate-950/30 transition-all ${isMe ? 'bg-cyan-500/5' : ''}`}
                  >
                    <td className="py-4 px-6 font-mono text-sm font-extrabold">
                      {entry.rank === 1 ? (
                        <span className="text-yellow-400">🥇 #1</span>
                      ) : entry.rank === 2 ? (
                        <span className="text-slate-300">🥈 #2</span>
                      ) : entry.rank === 3 ? (
                        <span className="text-amber-500">🥉 #3</span>
                      ) : (
                        <span className="text-slate-500 font-semibold">#{entry.rank}</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-800 shadow-md shrink-0">
                          <img src={entry.avatar} alt={entry.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className={`text-xs font-bold ${isMe ? 'text-cyan-400' : 'text-slate-200'}`}>
                            {entry.name} {isMe && <span className="text-[10px] font-normal bg-cyan-950/50 text-cyan-400 border border-cyan-500/20 px-1.5 py-0.5 rounded ml-1">You</span>}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <School className="w-3.5 h-3.5 text-slate-500" />
                        <span>{entry.institution}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{entry.batch}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-xs font-mono text-center text-slate-400">
                      {entry.quizzesTaken}
                    </td>
                    <td className="py-4 px-6 text-right font-mono text-sm font-extrabold text-cyan-400">
                      {entry.points}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
