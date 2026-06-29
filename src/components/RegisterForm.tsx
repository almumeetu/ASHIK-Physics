import React, { useState } from 'react';
import { Course, User } from '../types';
import { UserPlus, ArrowLeft, Building2, Phone, Mail, User as UserIcon, BookOpen, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface RegisterFormProps {
  courses: Course[];
  onRegister: (newUser: User, initialPaymentTxId?: string, paidAmount?: number, paymentMethod?: 'bKash' | 'Nagad' | 'Rocket' | 'Bank') => void;
  onBack: () => void;
}

export default function RegisterForm({ courses, onRegister, onBack }: RegisterFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [institution, setInstitution] = useState('');
  const [batch, setBatch] = useState('Admission Varsity Intensive 2026');
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '');
  
  // Payment Details for initial course enrollment
  const [paidAmount, setPaidAmount] = useState<number>(1500); // Partial or full BDT
  const [txId, setTxId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Bank'>('bKash');
  const [showPayment, setShowPayment] = useState(false);

  const selectedCourse = courses.find(c => c.id === selectedCourseId);
  const coursePriceNumeric = selectedCourse ? parseInt(selectedCourse.price.replace(/[^0-9]/g, '')) : 3000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !institution.trim()) return;

    // Create unique dynamic student ID
    const studentId = `st-${Date.now()}`;

    // Create user object
    const newUser: User = {
      id: studentId,
      name,
      email,
      role: 'student',
      batch,
      institution,
      phone,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 999999)}?auto=format&fit=crop&w=120&q=80`,
      points: 100, // 100 registration bonus points
      enrolledCourses: showPayment && txId ? [] : [selectedCourseId], // if paying, wait for admin approval. If not paying (or bypass), enroll directly
      quizScores: {},
      totalFees: coursePriceNumeric,
      amountPaid: 0,
      payments: []
    };

    onRegister(
      newUser, 
      showPayment && txId ? txId : undefined, 
      showPayment ? paidAmount : undefined,
      showPayment ? paymentMethod : undefined
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-lg bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative"
    >
      {/* Back to select profiles button */}
      <button 
        onClick={onBack}
        className="absolute top-6 left-6 flex items-center gap-1.5 text-slate-400 hover:text-slate-200 text-xs font-semibold font-mono cursor-pointer transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Login
      </button>

      <div className="text-center space-y-2 mt-4 mb-6">
        <span className="text-[9px] uppercase font-mono font-extrabold text-cyan-400 tracking-widest bg-cyan-950/40 border border-cyan-500/20 px-3 py-1 rounded-full inline-block">
          Join Ashik Physics
        </span>
        <h2 className="text-xl md:text-2xl font-black font-display text-slate-100 tracking-tight leading-none">
          Create Student Account
        </h2>
        <p className="text-xs text-slate-400 max-w-xs mx-auto">
          Get registered in minutes and start tracking your concept solving progress in real-time.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {!showPayment ? (
          <div className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-400 font-mono flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5 text-cyan-500" /> Full Name (পূর্ণ নাম)
              </label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Samin Yasar"
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 px-3.5 py-2 rounded-xl text-xs focus:border-cyan-500 focus:outline-none transition placeholder:text-slate-700"
              />
            </div>

            {/* Email & Phone Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 font-mono flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyan-500" /> Email Address
                </label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 px-3.5 py-2 rounded-xl text-xs focus:border-cyan-500 focus:outline-none transition placeholder:text-slate-700"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 font-mono flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-cyan-500" /> Phone (bKash/Mobile)
                </label>
                <input 
                  type="tel" 
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="017XX-XXXXXX"
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 px-3.5 py-2 rounded-xl text-xs focus:border-cyan-500 focus:outline-none transition placeholder:text-slate-700"
                />
              </div>
            </div>

            {/* Institution College */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-400 font-mono flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-cyan-500" /> College / Institution
              </label>
              <input 
                type="text" 
                required
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="e.g. Notre Dame College (NDC)"
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 px-3.5 py-2 rounded-xl text-xs focus:border-cyan-500 focus:outline-none transition placeholder:text-slate-700"
              />
            </div>

            {/* Batch & Select Course Package Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 font-mono">Academic Batch</label>
                <select
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-300 px-3 py-2 rounded-xl text-xs focus:border-cyan-500 focus:outline-none cursor-pointer"
                >
                  <option value="HSC Batch 2026">HSC Batch 2026</option>
                  <option value="HSC Batch 2027">HSC Batch 2027</option>
                  <option value="Admission Varsity Intensive 2026">Admission Varsity 2026</option>
                  <option value="Engineering Special BUET Care">Engineering BUET Special</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 font-mono flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-cyan-500" /> Target Study Pack
                </label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-300 px-3 py-2 rounded-xl text-xs focus:border-cyan-500 focus:outline-none cursor-pointer"
                >
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.title.substring(0, 18)}... ({course.price})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price tag summary */}
            {selectedCourse && (
              <div className="bg-slate-950 border border-slate-800/80 p-3.5 rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-mono font-bold">Course Tuition Fee</p>
                  <p className="text-slate-200 font-bold mt-0.5">{selectedCourse.title}</p>
                </div>
                <span className="text-sm font-extrabold font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/20 px-3 py-1 rounded-lg">
                  {selectedCourse.price}
                </span>
              </div>
            )}

            {/* Toggle Payment details or register as demo */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowPayment(true)}
                className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-extrabold rounded-xl transition shadow-lg shadow-cyan-500/10 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Proceed to Payment Verification (বিকাশ/নগদ পেমেন্ট করুন) <ArrowLeft className="w-4 h-4 rotate-180" />
              </button>
              
              <button
                type="submit"
                className="w-full mt-2.5 py-2 border border-dashed border-slate-800 hover:border-slate-700 text-[11px] font-mono font-bold text-slate-500 hover:text-slate-300 bg-slate-950/40 rounded-xl transition cursor-pointer"
              >
                Skip Payment Verification (Access Free Trial Pack)
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <span className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-wider block">Tuition Fee Ledger Receipt</span>
            
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Selected Module:</span>
                <span className="text-slate-200 font-semibold">{selectedCourse?.title}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Total BDT Price:</span>
                <span className="text-cyan-400 font-extrabold font-mono">{selectedCourse?.price}</span>
              </div>
              <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-900">
                <span className="text-slate-400">Payable amount today:</span>
                <span className="text-amber-400 font-extrabold font-mono">Min ৳ 1,000 / Full {selectedCourse?.price}</span>
              </div>
            </div>

            {/* Instruction block */}
            <div className="bg-slate-950/50 border border-amber-500/15 p-3 rounded-xl space-y-1 text-[11px] text-slate-400 leading-relaxed">
              <span className="font-bold text-amber-400 flex items-center gap-1 uppercase tracking-wider font-mono">
                <Sparkles className="w-3.5 h-3.5" /> bKash / Nagad Personal: 01712-345678
              </span>
              <span>টাকা পাঠিয়ে নিচের বক্সে পেমেন্ট মেথড সিলেক্ট করুন, কত টাকা পাঠিয়েছেন তা লিখুন এবং TrxID (Transaction ID) বসিয়ে সাবমিট করুন। এডমিন ১ মিনিটের মধ্যে আপনার পেমেন্ট ভেরিফাই করে ক্লাস আনলক করবে।</span>
            </div>

            {/* Inputs Row for Payment details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 font-mono">Payment Gateway</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-300 px-3 py-2 rounded-xl text-xs focus:border-cyan-500 focus:outline-none cursor-pointer"
                >
                  <option value="bKash">bKash (বিকাশ)</option>
                  <option value="Nagad">Nagad (নগদ)</option>
                  <option value="Rocket">Rocket (রকেট)</option>
                  <option value="Bank">Bank Transfer</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 font-mono">Amount Sent (৳)</label>
                <input 
                  type="number" 
                  required
                  min={100}
                  max={10000}
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(parseInt(e.target.value) || 0)}
                  placeholder="e.g. 1500"
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 px-3.5 py-2 rounded-xl text-xs focus:border-cyan-500 focus:outline-none transition"
                />
              </div>
            </div>

            {/* Transaction ID */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-400 font-mono">Transaction ID (TrxID)</label>
              <input 
                type="text" 
                required
                value={txId}
                onChange={(e) => setTxId(e.target.value)}
                placeholder="e.g. BKX10398274"
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 px-3.5 py-2 rounded-xl text-xs focus:border-cyan-500 focus:outline-none transition font-mono uppercase"
              />
            </div>

            {/* Proceed Actions */}
            <div className="flex gap-3.5 pt-2">
              <button
                type="button"
                onClick={() => setShowPayment(false)}
                className="w-1/3 py-2.5 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Back
              </button>
              
              <button
                type="submit"
                disabled={!txId.trim()}
                className={`w-2/3 py-2.5 text-slate-950 text-xs font-extrabold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  txId.trim() 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 shadow-lg shadow-orange-500/10' 
                    : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-850'
                }`}
              >
                <UserPlus className="w-4 h-4" /> Register & Submit Payment
              </button>
            </div>
          </div>
        )}

      </form>

    </motion.div>
  );
}
