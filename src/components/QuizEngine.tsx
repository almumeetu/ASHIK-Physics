import React, { useState, useEffect, useRef } from 'react';
import { Quiz, Question, QuizSubmission } from '../types';
import { Play, Timer, ArrowLeft, ArrowRight, CheckCircle, XCircle, Award, RefreshCw, AlertTriangle, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface QuizEngineProps {
  quiz: Quiz;
  onSubmit: (submission: QuizSubmission) => void;
  onClose: () => void;
}

export default function QuizEngine({ quiz, onSubmit, onClose }: QuizEngineProps) {
  const [examStarted, setExamStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: string]: number }>({});
  const [timeLeft, setTimeLeft] = useState(quiz.durationMinutes * 60);
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<QuizSubmission | null>(null);
  const [expandedExplanations, setExpandedExplanations] = useState<{ [questionId: string]: boolean }>({});

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start timer when exam starts
  useEffect(() => {
    if (examStarted && !isExamSubmitted) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [examStarted, isExamSubmitted]);

  const handleStartExam = () => {
    setExamStarted(true);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setTimeLeft(quiz.durationMinutes * 60);
    setIsExamSubmitted(false);
    setSubmissionResult(null);
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (isExamSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const calculateResults = (): QuizSubmission => {
    let correctCount = 0;
    quiz.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOptionIndex) {
        correctCount++;
      }
    });

    const scorePercent = Math.round((correctCount / quiz.questions.length) * 100);
    
    return {
      quizId: quiz.id,
      quizTitle: quiz.title,
      score: correctCount,
      totalQuestions: quiz.questions.length,
      percentage: scorePercent,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      answers: selectedAnswers
    };
  };

  const handleSubmitExam = () => {
    const result = calculateResults();
    setIsExamSubmitted(true);
    setSubmissionResult(result);
    if (timerRef.current) clearInterval(timerRef.current);
    onSubmit(result);
  };

  const handleAutoSubmit = () => {
    handleSubmitExam();
  };

  const toggleExplanation = (qId: string) => {
    setExpandedExplanations((prev) => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Pre-calculations for summary metrics
  const answeredCount = Object.keys(selectedAnswers).length;
  const unansweredCount = quiz.questions.length - answeredCount;

  // Render welcome screen
  if (!examStarted) {
    return (
      <div id="quiz-intro-card" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 text-center max-w-2xl mx-auto shadow-2xl">
        <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Award className="w-8 h-8" />
        </div>
        
        <span className="text-xs uppercase tracking-widest font-mono font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-3 py-1 rounded-full">
          {quiz.category} Quiz • {quiz.difficulty}
        </span>

        <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mt-4 leading-tight">{quiz.title}</h2>
        <p className="text-sm text-slate-400 mt-3 max-w-lg mx-auto">
          Test your preparation with this high-yield physics paper. Ready to secure your marks? Make sure you have a notepad and calculator with you!
        </p>

        {/* Exam Quick Specs */}
        <div className="grid grid-cols-3 gap-3 my-8 bg-slate-950/50 p-4 rounded-xl border border-slate-800/80">
          <div className="text-center">
            <p className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Questions</p>
            <p className="text-lg font-bold text-slate-200 mt-1">{quiz.questions.length} MCQs</p>
          </div>
          <div className="text-center border-x border-slate-800">
            <p className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Time Limit</p>
            <p className="text-lg font-bold text-slate-200 mt-1">{quiz.durationMinutes} Mins</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Total Marks</p>
            <p className="text-lg font-bold text-slate-200 mt-1">{quiz.totalPoints} pts</p>
          </div>
        </div>

        {/* Tips list */}
        <div className="text-left bg-slate-950/30 border border-slate-800/40 p-4 rounded-xl mb-8 space-y-2.5 max-w-md mx-auto">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5 mb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Exam Rules:
          </h4>
          <p className="text-xs text-slate-400 flex items-start gap-2">
            <span className="text-cyan-400">•</span> Timer runs in real-time. Closing the tab or leaving will auto-submit.
          </p>
          <p className="text-xs text-slate-400 flex items-start gap-2">
            <span className="text-cyan-400">•</span> Each MCQ has 4 options with exactly one correct solution. No negative marking.
          </p>
          <p className="text-xs text-slate-400 flex items-start gap-2">
            <span className="text-cyan-400">•</span> Correct answers and detailed physics explanations will be displayed instantly on submission.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <button 
            id="btn-close-quiz-intro"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium text-sm transition order-2 sm:order-1 cursor-pointer"
          >
            Go Back
          </button>
          <button 
            id="btn-start-exam"
            onClick={handleStartExam}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-sm transition transform hover:scale-[1.02] shadow-[0_4px_20px_rgba(6,182,212,0.25)] flex items-center justify-center gap-2 order-1 sm:order-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current text-slate-950" /> Start Exam Now
          </button>
        </div>
      </div>
    );
  }

  // Render results screen
  if (isExamSubmitted && submissionResult) {
    return (
      <div id="quiz-results-card" className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-8 max-w-3xl mx-auto shadow-2xl">
        {/* Results Header Banner */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8" />
          </div>
          <p className="text-xs uppercase tracking-wider font-mono font-bold text-slate-500">EXAM RESULTS SUMMARY</p>
          <h2 className="text-2xl font-bold text-slate-100 mt-1">{quiz.title}</h2>
          
          {/* Circular Score display */}
          <div className="flex justify-center items-center mt-6">
            <div className="relative flex items-center justify-center w-36 h-36 rounded-full bg-slate-950 border-4 border-slate-800">
              {/* Custom SVG Circle representation */}
              <svg className="absolute w-full h-full transform -rotate-90">
                <circle 
                  cx="72" cy="72" r="64" 
                  className="stroke-slate-800 fill-none" 
                  strokeWidth="8"
                />
                <circle 
                  cx="72" cy="72" r="64" 
                  className="stroke-cyan-500 fill-none transition-all duration-1000" 
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 64}
                  strokeDashoffset={2 * Math.PI * 64 * (1 - submissionResult.percentage / 100)}
                />
              </svg>
              <div className="text-center z-10">
                <p className="text-3xl font-extrabold text-cyan-400 font-mono">{submissionResult.percentage}%</p>
                <p className="text-[10px] uppercase text-slate-500 tracking-wider font-bold mt-0.5">
                  {submissionResult.score} / {submissionResult.totalQuestions} Correct
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 mb-8 text-center">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Score</span>
            <span className="text-base font-bold text-emerald-400 mt-1 block">{(submissionResult.score * 10)} / {quiz.totalPoints} Pts</span>
          </div>
          <div className="border-l border-slate-800/60">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Answered</span>
            <span className="text-base font-bold text-cyan-400 mt-1 block">{answeredCount} of {quiz.questions.length}</span>
          </div>
          <div className="border-l border-slate-800/60">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Accuracy</span>
            <span className="text-base font-bold text-indigo-400 mt-1 block">{submissionResult.percentage}%</span>
          </div>
          <div className="border-l border-slate-800/60">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Batch Earned</span>
            <span className="text-base font-bold text-amber-400 mt-1 block">+{submissionResult.score * 15} LP</span>
          </div>
        </div>

        {/* Question Review Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
            <HelpCircle className="w-5 h-5 text-cyan-400" /> Detail Question Explanations
          </h3>

          {quiz.questions.map((q, index) => {
            const selectedOpt = selectedAnswers[q.id];
            const isCorrect = selectedOpt === q.correctOptionIndex;
            const isOpen = expandedExplanations[q.id] !== false; // Default expanded for easy viewing

            return (
              <div 
                key={q.id} 
                className={`bg-slate-950/40 border rounded-xl overflow-hidden transition-all duration-300 ${isCorrect ? 'border-emerald-500/20' : selectedOpt === undefined ? 'border-slate-800' : 'border-rose-500/20'}`}
              >
                {/* Header Title bar */}
                <div 
                  onClick={() => toggleExplanation(q.id)}
                  className="flex items-start justify-between p-4 cursor-pointer hover:bg-slate-900/30 transition"
                >
                  <div className="flex gap-3">
                    <span className="font-mono text-xs font-extrabold text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800 h-fit mt-0.5">
                      Q {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-slate-200 pr-2 leading-relaxed">{q.text}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {selectedOpt === undefined ? (
                          <span className="text-[10px] bg-slate-900 text-slate-500 border border-slate-800 px-2 py-0.5 rounded font-medium">Unanswered</span>
                        ) : isCorrect ? (
                          <span className="text-[10px] bg-emerald-950/55 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Correct Answer
                          </span>
                        ) : (
                          <span className="text-[10px] bg-rose-950/55 text-rose-400 border border-rose-500/25 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                            <XCircle className="w-3 h-3" /> Incorrect Answer
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button className="text-slate-500 hover:text-slate-300 mt-1">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Dropdown Solution Details */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-900 bg-slate-950/80 p-4 text-xs font-sans text-slate-300 space-y-4"
                    >
                      {/* MCQ Option Blocks with Indicators */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {q.options.map((opt, optIdx) => {
                          const isOptCorrect = optIdx === q.correctOptionIndex;
                          const isOptSelected = optIdx === selectedOpt;
                          
                          let bgClass = 'bg-slate-900/60 border-slate-800/80 text-slate-400';
                          if (isOptCorrect) {
                            bgClass = 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300 font-medium';
                          } else if (isOptSelected && !isCorrect) {
                            bgClass = 'bg-rose-950/30 border-rose-500/40 text-rose-300 font-medium';
                          }

                          return (
                            <div key={optIdx} className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${bgClass}`}>
                              <span>{opt}</span>
                              <div className="flex items-center">
                                {isOptCorrect && <CheckCircle className="w-4 h-4 text-emerald-400 fill-current" />}
                                {isOptSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 fill-current" />}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation card */}
                      <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800/50 space-y-1.5">
                        <p className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-cyan-400" /> Explanation (ব্যাখ্যা):
                        </p>
                        <p className="text-slate-300 leading-relaxed text-xs font-sans whitespace-pre-wrap">{q.explanation}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Results Footer Panel */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-8 border-t border-slate-800 pt-6">
          <button 
            id="btn-close-quiz-results"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium text-xs transition cursor-pointer"
          >
            Close Summary
          </button>
          <button 
            id="btn-retry-quiz"
            onClick={handleStartExam}
            className="w-full sm:w-auto px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/10"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Re-take Exam
          </button>
        </div>
      </div>
    );
  }

  // Active quiz playing interface
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progressPercentValue = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div id="quiz-playing-interface" className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden max-w-3xl mx-auto shadow-2xl flex flex-col h-[650px] md:h-[600px]">
      {/* Quiz Playing Header */}
      <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
            {quiz.difficulty}
          </span>
          <h3 className="text-sm font-bold text-slate-200 mt-1 line-clamp-1">{quiz.title}</h3>
        </div>

        {/* Real-time Timer Block */}
        <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 shadow-md">
          <Timer className={`w-4 h-4 ${timeLeft < 60 ? 'text-rose-500 animate-pulse' : 'text-cyan-400'}`} />
          <span className={`font-mono text-sm font-bold ${timeLeft < 60 ? 'text-rose-500' : 'text-slate-100'}`}>
            {formatTimer(timeLeft)}
          </span>
        </div>
      </div>

      {/* Progress timeline bar */}
      <div className="h-1 bg-slate-800 w-full relative">
        <div 
          className="absolute h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300" 
          style={{ width: `${progressPercentValue}%` }}
        />
      </div>

      {/* Main active question view panel */}
      <div className="flex-1 overflow-y-auto p-5 md:p-8 flex flex-col justify-between">
        
        {/* Question text block */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-mono font-bold uppercase tracking-wider">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </span>
            <span className="text-xs text-slate-400">
              {Object.keys(selectedAnswers).length} / {quiz.questions.length} Answered
            </span>
          </div>

          <div className="bg-slate-950/40 p-4 md:p-6 rounded-2xl border border-slate-800/60 shadow-inner">
            <h4 className="text-base md:text-lg font-semibold text-slate-100 leading-relaxed">
              {currentQuestion.text}
            </h4>
          </div>

          {/* Option grids */}
          <div className="grid grid-cols-1 gap-3">
            {currentQuestion.options.map((optionText, index) => {
              const isSelected = selectedAnswers[currentQuestion.id] === index;
              
              return (
                <button
                  key={index}
                  id={`option-${index}`}
                  onClick={() => handleSelectOption(currentQuestion.id, index)}
                  className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition duration-250 flex items-center justify-between cursor-pointer transform active:scale-[0.99] ${
                    isSelected 
                      ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300 font-bold shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                      : 'bg-slate-950/20 border-slate-800/80 text-slate-300 hover:bg-slate-850 hover:border-slate-700 hover:text-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold transition ${
                      isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{optionText}</span>
                  </div>
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-cyan-500/20 border border-cyan-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-cyan-500" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action controls button footer */}
        <div className="flex items-center justify-between mt-8 border-t border-slate-800/60 pt-5">
          <button
            id="btn-quiz-prev"
            disabled={currentQuestionIndex === 0}
            onClick={handlePrev}
            className={`px-4 py-2 text-xs rounded-xl border flex items-center gap-1.5 transition ${
              currentQuestionIndex === 0 
                ? 'opacity-30 cursor-not-allowed border-slate-800 text-slate-600' 
                : 'border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Previous
          </button>

          {currentQuestionIndex === quiz.questions.length - 1 ? (
            <button
              id="btn-submit-exam"
              onClick={handleSubmitExam}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-xs transition transform hover:scale-105 shadow-lg shadow-emerald-500/10 cursor-pointer"
            >
              Submit Exam
            </button>
          ) : (
            <button
              id="btn-quiz-next"
              onClick={handleNext}
              className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              Next <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
