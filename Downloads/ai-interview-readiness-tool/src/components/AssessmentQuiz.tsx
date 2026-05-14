import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Clock, Zap } from 'lucide-react';
import { questions, Question } from '../data/questions';

interface Props {
  onComplete: (answers: Record<string, string | string[]>) => void;
  onBack: () => void;
}

// Filter questions to stay under ~90 seconds
const quizQuestions = questions.filter((q) => q.id !== 'q_exp');

const TOTAL_TIME = 120; // 2 minutes

export default function AssessmentQuiz({ onComplete, onBack }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [direction, setDirection] = useState(1);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentQuestion = quizQuestions[currentIndex];
  const progress = ((currentIndex) / quizQuestions.length) * 100;

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          // Auto-submit with current answers
          onComplete(answers);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [answers, onComplete]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSingleSelect = useCallback((questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  }, []);

  const handleMultiSelect = useCallback((questionId: string, optionId: string) => {
    setAnswers((prev) => {
      const current = (prev[questionId] as string[]) || [];
      if (optionId === 'none') {
        return { ...prev, [questionId]: current.includes('none') ? [] : ['none'] };
      }
      const withoutNone = current.filter((id) => id !== 'none');
      if (withoutNone.includes(optionId)) {
        return { ...prev, [questionId]: withoutNone.filter((id) => id !== optionId) };
      }
      return { ...prev, [questionId]: [...withoutNone, optionId] };
    });
  }, []);

  const goNext = useCallback(() => {
    if (isAnimating) return;
    if (currentIndex < quizQuestions.length - 1) {
      setIsAnimating(true);
      setDirection(1);
      setTimeout(() => {
        setCurrentIndex((i) => i + 1);
        setIsAnimating(false);
      }, 50);
    } else {
      onComplete(answers);
    }
  }, [isAnimating, currentIndex, answers, onComplete]);

  const goPrev = useCallback(() => {
    if (isAnimating || currentIndex === 0) return;
    setIsAnimating(true);
    setDirection(-1);
    setTimeout(() => {
      setCurrentIndex((i) => i - 1);
      setIsAnimating(false);
    }, 50);
  }, [isAnimating, currentIndex]);

  const hasAnswer = (q: Question): boolean => {
    const ans = answers[q.id];
    if (!ans) return false;
    if (q.type === 'multi') return (ans as string[]).length > 0;
    return true;
  };

  // Auto advance for single select
  const handleSingleSelectAndAdvance = useCallback((questionId: string, optionId: string) => {
    handleSingleSelect(questionId, optionId);
    setTimeout(() => {
      goNext();
    }, 350);
  }, [handleSingleSelect, goNext]);

  const timerColor = timeLeft <= 30 ? '#ef4444' : timeLeft <= 60 ? '#f59e0b' : '#10b981';
  const timerPercentage = (timeLeft / TOTAL_TIME) * 100;

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden flex flex-col">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }} />

      <div className="relative z-10 max-w-2xl mx-auto w-full px-4 py-6 flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 rounded-lg btn-secondary text-white/60 hover:text-white">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
                ⚡
              </div>
              <span className="font-bold text-sm">AI CareerForge</span>
            </div>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-card"
            style={{ borderColor: `${timerColor}40` }}>
            <Clock className="w-4 h-4" style={{ color: timerColor }} />
            <span className="font-mono font-bold text-sm" style={{ color: timerColor }}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/40 text-xs font-medium">
              Question {currentIndex + 1} of {quizQuestions.length}
            </span>
            <span className="text-white/40 text-xs font-medium">
              {Math.round(progress)}% complete
            </span>
          </div>
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          {/* Step dots */}
          <div className="flex items-center gap-1 mt-3 justify-center flex-wrap">
            {quizQuestions.map((_, i) => (
              <motion.div
                key={i}
                className={`step-dot ${i === currentIndex ? 'active' : i < currentIndex ? 'done' : ''}`}
                animate={{
                  width: i === currentIndex ? 28 : 10,
                }}
              />
            ))}
          </div>
        </div>

        {/* Timer bar */}
        <div className="mb-6 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <motion.div
            className="h-full rounded-full transition-all"
            style={{ background: timerColor, width: `${timerPercentage}%`, transition: 'width 1s linear' }}
          />
        </div>

        {/* Category tag */}
        <div className="flex items-center gap-2 mb-4">
          <span className="tag-pill">
            {currentQuestion.category === 'technical' && '💻 Technical'}
            {currentQuestion.category === 'resume' && '📄 Resume'}
            {currentQuestion.category === 'communication' && '🎤 Communication'}
            {currentQuestion.category === 'portfolio' && '🌐 Portfolio'}
            {currentQuestion.category === 'behavioral' && '🎯 Strategy'}
            {currentQuestion.category === 'profile' && '👤 Profile'}
          </span>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: direction * 60, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -direction * 60, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="flex-1"
          >
            <div className="glass-card p-6 sm:p-8 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-2 leading-snug">
                {currentQuestion.question}
              </h2>
              {currentQuestion.subtext && (
                <p className="text-white/40 text-sm mb-6 leading-relaxed">
                  {currentQuestion.subtext}
                </p>
              )}

              {/* Single / Role Select */}
              {(currentQuestion.type === 'single' || currentQuestion.type === 'role-select') && (
                <div className="space-y-3">
                  {currentQuestion.options?.map((option) => {
                    const isSelected = answers[currentQuestion.id] === option.id;
                    return (
                      <motion.button
                        key={option.id}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSingleSelectAndAdvance(currentQuestion.id, option.id)}
                        className={`option-card flex items-center gap-3 ${isSelected ? 'selected' : ''}`}
                      >
                        {option.emoji && (
                          <span className="text-xl flex-shrink-0">{option.emoji}</span>
                        )}
                        <span className="font-medium">{option.label}</span>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ background: '#7c3aed' }}
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {/* Multi Select */}
              {currentQuestion.type === 'multi' && (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs text-white/40 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                      Select all that apply
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentQuestion.options?.map((option) => {
                      const selected = (answers[currentQuestion.id] as string[]) || [];
                      const isSelected = selected.includes(option.id);
                      return (
                        <motion.button
                          key={option.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleMultiSelect(currentQuestion.id, option.id)}
                          className={`option-card flex items-center gap-3 ${isSelected ? 'selected' : ''}`}
                        >
                          <div className={`w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border-2 transition-all ${
                            isSelected
                              ? 'bg-purple-600 border-purple-600'
                              : 'border-white/20 bg-transparent'
                          }`}>
                            {isSelected && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          {option.emoji && <span className="text-lg">{option.emoji}</span>}
                          <span className="font-medium text-sm">{option.label}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={goPrev}
                disabled={currentIndex === 0}
                className="btn-secondary px-6 py-3 flex items-center gap-2 text-sm disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </motion.button>

              {currentQuestion.type === 'multi' && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={goNext}
                  className="btn-primary px-8 py-3 flex items-center gap-2 text-sm font-semibold flex-1 justify-center"
                >
                  {currentIndex === quizQuestions.length - 1 ? (
                    <>
                      <Zap className="w-4 h-4" />
                      Get My Score
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              )}

              {currentQuestion.type === 'single' || currentQuestion.type === 'role-select' ? (
                <div className="text-white/30 text-xs text-right flex-1">
                  {hasAnswer(currentQuestion) ? '✓ Tap to continue' : 'Select an option'}
                </div>
              ) : null}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom hint */}
        <div className="mt-4 text-center">
          <p className="text-white/20 text-xs">
            💡 Your answers are analyzed in real-time for maximum accuracy
          </p>
        </div>
      </div>
    </div>
  );
}
