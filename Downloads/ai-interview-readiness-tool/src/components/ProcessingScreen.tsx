import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onComplete: () => void;
}

const steps = [
  { label: 'Analyzing technical profile...', icon: '💻', color: '#7c3aed' },
  { label: 'Scanning resume quality signals...', icon: '📄', color: '#06b6d4' },
  { label: 'Evaluating communication readiness...', icon: '🎤', color: '#ec4899' },
  { label: 'Assessing portfolio strength...', icon: '🌐', color: '#10b981' },
  { label: 'Generating personalized roadmap...', icon: '🗺️', color: '#f59e0b' },
  { label: 'Compiling your readiness score...', icon: '⚡', color: '#7c3aed' },
];

export default function ProcessingScreen({ onComplete }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setCompletedSteps((prev: number[]) => [...prev, stepIndex]);
        stepIndex++;
        if (stepIndex < steps.length) {
          setCurrentStep(stepIndex);
        }
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 400);
      }
    }, 380);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="min-h-screen gradient-bg flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated bg */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-10 blur-3xl"
            style={{
              width: 300 + i * 50,
              height: 300 + i * 50,
              left: `${10 + i * 15}%`,
              top: `${5 + i * 10}%`,
              background: `radial-gradient(circle, ${steps[i].color}, transparent)`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 max-w-md w-full"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="inline-block text-5xl mb-4"
          >
            ⚡
          </motion.div>
          <h2 className="text-2xl font-black mb-2">Analyzing Your Profile</h2>
          <p className="text-white/40 text-sm">Our AI is computing your readiness score...</p>
        </div>

        {/* Neural network visual */}
        <div className="flex justify-center mb-8">
          <svg width="200" height="100" viewBox="0 0 200 100">
            {/* Nodes */}
            {[
              { x: 20, y: 20 }, { x: 20, y: 50 }, { x: 20, y: 80 },
              { x: 80, y: 10 }, { x: 80, y: 35 }, { x: 80, y: 60 }, { x: 80, y: 85 },
              { x: 140, y: 25 }, { x: 140, y: 50 }, { x: 140, y: 75 },
              { x: 180, y: 50 },
            ].map((node, i) => (
              <motion.circle
                key={i}
                cx={node.x}
                cy={node.y}
                r="5"
                fill={steps[Math.min(i % steps.length, steps.length - 1)].color}
                opacity={0.6}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  r: [4, 6, 4],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
              />
            ))}
            {/* Lines (simplified) */}
            {[
              [20, 20, 80, 10], [20, 20, 80, 35], [20, 50, 80, 35],
              [20, 50, 80, 60], [20, 80, 80, 60], [20, 80, 80, 85],
              [80, 10, 140, 25], [80, 35, 140, 25], [80, 35, 140, 50],
              [80, 60, 140, 50], [80, 60, 140, 75], [80, 85, 140, 75],
              [140, 25, 180, 50], [140, 50, 180, 50], [140, 75, 180, 50],
            ].map(([x1, y1, x2, y2], i) => (
              <motion.line
                key={i}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="rgba(124,58,237,0.3)"
                strokeWidth="1"
                animate={{ opacity: [0.1, 0.5, 0.1] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.08 }}
              />
            ))}
          </svg>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {steps.map((step, i) => {
            const isDone = completedSteps.includes(i);
            const isCurrent = i === currentStep && !isDone;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isDone || isCurrent ? 1 : 0.3, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-xl transition-all"
                style={{
                  background: isCurrent ? `${step.color}15` : isDone ? 'rgba(16,185,129,0.08)' : 'transparent',
                  border: isCurrent ? `1px solid ${step.color}30` : isDone ? '1px solid rgba(16,185,129,0.2)' : '1px solid transparent',
                }}
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-base"
                  style={{ background: isDone ? 'rgba(16,185,129,0.2)' : isCurrent ? `${step.color}20` : 'rgba(255,255,255,0.05)' }}>
                  {isDone ? (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring' }}
                    >
                      ✅
                    </motion.span>
                  ) : isCurrent ? (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      {step.icon}
                    </motion.span>
                  ) : (
                    <span className="opacity-30">{step.icon}</span>
                  )}
                </div>
                <span className={`text-sm font-medium ${isDone ? 'text-emerald-400' : isCurrent ? 'text-white' : 'text-white/30'}`}>
                  {step.label}
                </span>
                {isCurrent && (
                  <div className="ml-auto flex gap-0.5">
                    {[0, 1, 2].map((j) => (
                      <motion.div
                        key={j}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: step.color }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: j * 0.2 }}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="flex justify-between text-xs text-white/40 mb-2">
            <span>Processing...</span>
            <span>{Math.round((completedSteps.length / steps.length) * 100)}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
                width: `${(completedSteps.length / steps.length) * 100}%`,
              }}
              animate={{ width: `${(completedSteps.length / steps.length) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
