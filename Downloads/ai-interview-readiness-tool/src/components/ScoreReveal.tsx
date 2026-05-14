import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getReadinessLevel } from '../data/questions';
import confetti from 'canvas-confetti';

interface Props {
  score: number;
  onContinue: () => void;
}

function useCountUp(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return count;
}

export default function ScoreReveal({ score, onContinue }: Props) {
  const displayScore = useCountUp(score, 2200);
  const level = getReadinessLevel(score);
  const [showContinue, setShowContinue] = useState(false);

  useEffect(() => {
    // Fire confetti for good scores
    if (score >= 70) {
      const timer = setTimeout(() => {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#7c3aed', '#06b6d4', '#ec4899', '#10b981', '#f59e0b'],
        });
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [score]);

  useEffect(() => {
    const timer = setTimeout(() => setShowContinue(true), 2800);
    return () => clearTimeout(timer);
  }, []);

  // SVG circle
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreGradient = () => {
    if (score >= 80) return ['#10b981', '#06b6d4'];
    if (score >= 60) return ['#06b6d4', '#7c3aed'];
    if (score >= 40) return ['#f59e0b', '#f97316'];
    return ['#ec4899', '#ef4444'];
  };
  const [c1, c2] = getScoreGradient();

  return (
    <div className="min-h-screen gradient-bg flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* BG orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.15 }}
          transition={{ duration: 1.5 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl"
          style={{ background: `radial-gradient(circle, ${c1}, transparent)` }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center max-w-md w-full"
      >
        {/* Processing text */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#7c3aed" strokeWidth="2" strokeDasharray="31.4" strokeDashoffset="10" />
              </svg>
            </motion.div>
            <span className="text-sm text-white/60">Analyzing your profile...</span>
          </div>
        </motion.div>

        {/* Score Ring */}
        <div className="relative flex items-center justify-center mb-8">
          {/* Pulse rings */}
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border"
              style={{ borderColor: `${c1}30` }}
              initial={{ width: 200, height: 200, opacity: 0 }}
              animate={{ width: 200 + i * 50, height: 200 + i * 50, opacity: [0, 0.3, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.4, ease: 'easeOut' }}
            />
          ))}

          <svg width="220" height="220" viewBox="0 0 220 220" className="relative z-10">
            <defs>
              <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={c1} />
                <stop offset="100%" stopColor={c2} />
              </linearGradient>
            </defs>
            {/* Background circle */}
            <circle cx="110" cy="110" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="14" />
            {/* Score arc */}
            <motion.circle
              cx="110"
              cy="110"
              r={radius}
              fill="none"
              stroke="url(#scoreGrad)"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 2.2, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
              style={{ transform: 'rotate(-90deg)', transformOrigin: '110px 110px' }}
            />
            {/* Glow */}
            <motion.circle
              cx="110"
              cy="110"
              r={radius}
              fill="none"
              stroke={c1}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 2.2, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
              style={{
                transform: 'rotate(-90deg)',
                transformOrigin: '110px 110px',
                filter: `blur(6px)`,
                opacity: 0.6,
              }}
            />
          </svg>

          {/* Score number */}
          <div className="absolute text-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
              className="text-6xl font-black"
              style={{ color: c1 }}
            >
              {displayScore}
            </motion.div>
            <div className="text-white/40 text-sm font-medium">out of 100</div>
          </div>
        </div>

        {/* Level Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, type: 'spring' }}
          className="mb-4"
        >
          <div className="text-5xl mb-2">{level.emoji}</div>
          <div className="text-3xl font-black mb-2" style={{ color: level.color }}>
            {level.label}
          </div>
          <p className="text-white/50 text-sm leading-relaxed px-4">
            {level.message}
          </p>
        </motion.div>

        {/* Level meter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="mb-8 glass-card p-4"
        >
          <div className="flex justify-between text-xs text-white/40 mb-2">
            <span>🌱 Beginner</span>
            <span>🚀 Developing</span>
            <span>⚡ Almost Ready</span>
            <span>🏆 Expert</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${c1}, ${c2})` }}
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ delay: 2, duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between text-xs text-white/20 mt-1">
            <span>0</span>
            <span>25</span>
            <span>50</span>
            <span>75</span>
            <span>100</span>
          </div>
        </motion.div>

        {/* CTA */}
        <AnimatePresence>
          {showContinue && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={onContinue}
                className="btn-primary px-12 py-5 text-lg font-bold w-full flex items-center justify-center gap-3 glow-purple"
              >
                <span>View Detailed Analysis</span>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  →
                </motion.span>
              </motion.button>
              <p className="text-white/25 text-xs mt-3">
                Personalized roadmap with specific action steps
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
