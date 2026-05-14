import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp, Download, RefreshCw, ChevronDown, ChevronUp,
  Target, Clock, Zap, CheckCircle, AlertTriangle, XCircle, Star,
  BookOpen, ExternalLink
} from 'lucide-react';
import ShareCard from './ShareCard';
import {
  categories, getReadinessLevel, getTopImprovements, computeOverallScore,
  ImprovementTip,
} from '../data/questions';

interface Props {
  categoryScores: Record<string, number>;
  answers: Record<string, string | string[]>;
  onRetake: () => void;
}

const priorityConfig = {
  critical: { label: '🚨 Critical', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)' },
  high: { label: '⚠️ High Priority', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)' },
  medium: { label: '📈 Medium', color: '#06b6d4', bg: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.3)' },
  low: { label: '✨ Nice to Have', color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)' },
};

function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
        />
      </div>
      <span className="text-sm font-bold w-8 text-right" style={{ color }}>{score}</span>
    </div>
  );
}

function TipCard({ tip, index }: { tip: ImprovementTip; index: number }) {
  const [expanded, setExpanded] = useState(index === 0);
  const config = priorityConfig[tip.priority];
  const cat = categories.find((c) => c.key === tip.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      className="rounded-2xl overflow-hidden"
      style={{ background: config.bg, border: `1px solid ${config.border}` }}
    >
      <button
        className="w-full p-5 text-left flex items-start gap-4"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-shrink-0 text-2xl">{cat?.icon ?? '🎯'}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: config.bg, color: config.color, border: `1px solid ${config.border}` }}>
              {config.label}
            </span>
            <span className="text-xs text-white/40">{cat?.label}</span>
          </div>
          <h3 className="font-bold text-base leading-snug">{tip.title}</h3>
        </div>
        <div className="flex-shrink-0 text-white/40">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-3">
              <div className="p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.2)' }}>
                <p className="text-white/70 text-sm leading-relaxed">{tip.action}</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <Clock className="w-4 h-4 mx-auto mb-1 text-white/40" />
                  <div className="text-xs text-white/40 mb-0.5">Time</div>
                  <div className="text-xs font-bold text-white/70">{tip.timeToFix}</div>
                </div>
                <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <TrendingUp className="w-4 h-4 mx-auto mb-1 text-white/40" />
                  <div className="text-xs text-white/40 mb-0.5">Impact</div>
                  <div className="text-xs font-bold" style={{ color: config.color }}>{tip.impact}</div>
                </div>
                <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <BookOpen className="w-4 h-4 mx-auto mb-1 text-white/40" />
                  <div className="text-xs text-white/40 mb-0.5">Resource</div>
                  <div className="text-xs font-bold text-purple-400 truncate">{tip.resource.split(' ')[0]}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/40">
                <ExternalLink className="w-3 h-3" />
                <span>{tip.resource}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function MiniGauge({ score, color }: { score: number; color: string }) {
  const r = 28;
  const circ = Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <svg width="70" height="40" viewBox="0 0 70 40">
      <defs>
        <linearGradient id={`g${color.replace('#','')}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0.5" />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
      </defs>
      <path d={`M 6 36 A ${r} ${r} 0 0 1 64 36`} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" strokeLinecap="round" />
      <motion.path
        d={`M 6 36 A ${r} ${r} 0 0 1 64 36`}
        fill="none"
        stroke={`url(#g${color.replace('#','')})`}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
      />
    </svg>
  );
}

export default function ResultsDashboard({ categoryScores, onRetake }: Props) {
  const overallScore = computeOverallScore(categoryScores);
  const level = getReadinessLevel(overallScore);
  const tips = getTopImprovements(categoryScores);
  const [activeTab, setActiveTab] = useState<'overview' | 'breakdown' | 'roadmap'>('overview');

  const radarData = categories.map((cat) => ({
    subject: cat.label.split(' ')[0],
    score: categoryScores[cat.key] ?? 0,
    fullMark: 100,
  }));

  const getScoreIcon = (score: number) => {
    if (score >= 70) return <CheckCircle className="w-4 h-4 text-emerald-400" />;
    if (score >= 40) return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    return <XCircle className="w-4 h-4 text-red-400" />;
  };

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      {/* BG blobs */}
      <div className="absolute top-20 left-10 w-96 h-96 opacity-10 blur-3xl pointer-events-none rounded-full"
        style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
      <div className="absolute bottom-20 right-10 w-80 h-80 opacity-10 blur-3xl pointer-events-none rounded-full"
        style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6 flex-wrap gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
              ⚡
            </div>
            <div>
              <div className="font-bold">AI CareerForge</div>
              <div className="text-xs text-white/40">Interview Readiness Report</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onRetake}
              className="btn-secondary px-4 py-2 flex items-center gap-2 text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Retake
            </motion.button>
            <ShareCard score={overallScore} categoryScores={categoryScores} />
          </div>
        </motion.div>

        {/* Hero Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 sm:p-8 mb-6"
          style={{
            background: `linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(6,182,212,0.08) 100%)`,
            border: '1px solid rgba(124,58,237,0.25)',
          }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Score Circle */}
            <div className="flex-shrink-0 relative">
              <svg width="140" height="140" viewBox="0 0 140 140">
                <defs>
                  <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={level.color} />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
                <circle cx="70" cy="70" r="58" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                <motion.circle
                  cx="70" cy="70" r="58"
                  fill="none"
                  stroke="url(#heroGrad)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 58}
                  initial={{ strokeDashoffset: 2 * Math.PI * 58 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 58 - (overallScore / 100) * 2 * Math.PI * 58 }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  style={{ transform: 'rotate(-90deg)', transformOrigin: '70px 70px' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-4xl font-black" style={{ color: level.color }}>{overallScore}</div>
                <div className="text-xs text-white/40">/ 100</div>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
                <span className="text-3xl">{level.emoji}</span>
                <span className="text-2xl font-black" style={{ color: level.color }}>{level.label}</span>
              </div>
              <p className="text-white/60 text-sm mb-4 leading-relaxed">{level.message}</p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {categories.map((cat) => {
                  const score = categoryScores[cat.key] ?? 0;
                  return (
                    <div key={cat.key}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                      style={{ background: `${cat.color}15`, border: `1px solid ${cat.color}30`, color: cat.color }}
                    >
                      <span>{cat.icon}</span>
                      <span>{score}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Percentile */}
            <div className="flex-shrink-0 text-center glass-card p-4 rounded-xl">
              <div className="text-3xl font-black gradient-text mb-1">
                Top {Math.max(5, 100 - overallScore)}%
              </div>
              <div className="text-xs text-white/40">of candidates</div>
              <div className="mt-3 flex justify-center">
                {[1,2,3,4,5].map(i => (
                  <Star key={i}
                    className={`w-4 h-4 ${i <= Math.round(overallScore / 20) ? 'text-amber-400 fill-amber-400' : 'text-white/10'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 p-1 rounded-xl glass-card">
          {(['overview', 'breakdown', 'roadmap'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all capitalize ${
                activeTab === tab
                  ? 'text-white'
                  : 'text-white/40 hover:text-white/60'
              }`}
              style={activeTab === tab ? {
                background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                boxShadow: '0 4px 20px rgba(124,58,237,0.3)',
              } : {}}
            >
              {tab === 'overview' && '📊 Overview'}
              {tab === 'breakdown' && '🔍 Breakdown'}
              {tab === 'roadmap' && '🗺️ Roadmap'}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Radar Chart */}
              <div className="glass-card p-6">
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  Skills Radar
                </h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                      <PolarGrid stroke="rgba(255,255,255,0.08)" />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 600 }}
                      />
                      <Radar
                        name="Score"
                        dataKey="score"
                        stroke="#7c3aed"
                        fill="#7c3aed"
                        fillOpacity={0.25}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Gauges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {categories.map((cat, i) => {
                  const score = categoryScores[cat.key] ?? 0;
                  return (
                    <motion.div
                      key={cat.key}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * i }}
                      className="glass-card p-4 text-center"
                    >
                      <div className="flex justify-center mb-1">
                        <MiniGauge score={score} color={cat.color} />
                      </div>
                      <div className="text-xl font-black mb-0.5" style={{ color: cat.color }}>{score}</div>
                      <div className="text-xs text-white/50 leading-snug">{cat.label}</div>
                      <div className="mt-2">
                        {getScoreIcon(score)}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Quick insights */}
              <div className="glass-card p-5">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Quick Insights
                </h3>
                <div className="space-y-3">
                  {categories.map((cat) => {
                    const score = categoryScores[cat.key] ?? 0;
                    const insight = score >= 70 ? '✅ Strong' : score >= 40 ? '⚠️ Needs Work' : '🚨 Critical Gap';
                    const insightColor = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';
                    return (
                      <div key={cat.key} className="flex items-center gap-3">
                        <span className="text-lg">{cat.icon}</span>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">{cat.label}</span>
                            <span className="text-xs font-bold" style={{ color: insightColor }}>{insight}</span>
                          </div>
                          <ScoreBar score={score} color={cat.color} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* BREAKDOWN TAB */}
          {activeTab === 'breakdown' && (
            <motion.div
              key="breakdown"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {categories.map((cat, i) => {
                const score = categoryScores[cat.key] ?? 0;
                const statusColor = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';
                const statusLabel = score >= 70 ? 'Strong' : score >= 40 ? 'Developing' : 'Needs Focus';

                return (
                  <motion.div
                    key={cat.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card p-5"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                          style={{ background: `${cat.color}15`, border: `1px solid ${cat.color}30` }}>
                          {cat.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{cat.label}</h3>
                          <p className="text-white/40 text-xs">{cat.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-black" style={{ color: cat.color }}>{score}</div>
                        <div className="text-xs font-medium" style={{ color: statusColor }}>{statusLabel}</div>
                      </div>
                    </div>

                    {/* Visual bar */}
                    <div className="h-3 rounded-full overflow-hidden mb-3" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${cat.color}88, ${cat.color})` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 + i * 0.1 }}
                      />
                    </div>

                    {/* Score breakdown ticks */}
                    <div className="flex justify-between text-xs text-white/25">
                      {[0, 25, 50, 75, 100].map((v) => (
                        <span key={v} className={score >= v ? 'text-white/40' : ''}>{v}</span>
                      ))}
                    </div>

                    {/* Level labels */}
                    <div className="flex justify-between mt-2">
                      {['Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert'].map((l, idx) => (
                        <div key={l} className={`text-xs px-1 py-0.5 rounded text-center transition-all ${
                          Math.floor(score / 25) >= idx ? '' : 'opacity-20'
                        }`}
                          style={Math.floor(score / 25) >= idx ? { color: cat.color } : {}}
                        >
                          {l.slice(0, 3)}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* ROADMAP TAB */}
          {activeTab === 'roadmap' && (
            <motion.div
              key="roadmap"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Header */}
              <div className="glass-card p-5 mb-2"
                style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.08))' }}>
                <h2 className="font-bold text-lg mb-1 flex items-center gap-2">
                  🗺️ Your Personalized 30-Day Action Plan
                </h2>
                <p className="text-white/50 text-sm">
                  Based on your profile, here are your highest-impact improvements, ranked by priority.
                  Follow this order for maximum ROI.
                </p>
                <div className="flex gap-3 mt-3 flex-wrap">
                  <div className="flex items-center gap-1.5 text-xs text-white/50">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    Critical (Do Now)
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-white/50">
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                    High (This Week)
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-white/50">
                    <div className="w-2 h-2 rounded-full bg-cyan-400" />
                    Medium (This Month)
                  </div>
                </div>
              </div>

              {tips.length === 0 ? (
                <div className="glass-card p-8 text-center">
                  <div className="text-5xl mb-4">🏆</div>
                  <h3 className="text-xl font-bold mb-2 gradient-text-green">Outstanding Performance!</h3>
                  <p className="text-white/50">You're scoring high across all dimensions. Focus on interview practice and networking to secure offers!</p>
                </div>
              ) : (
                tips.map((tip, i) => <TipCard key={i} tip={tip} index={i} />)
              )}

              {/* 30-day plan */}
              <div className="glass-card p-5 mt-4">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-400" />
                  Your 30-Day Sprint Plan
                </h3>
                <div className="space-y-3">
                  {[
                    { week: 'Week 1', label: 'Foundation', tasks: ['Rebuild/update resume with metrics', 'Optimize LinkedIn to All-Star', 'Solve 21 Easy LeetCode problems (3/day)'], color: '#ef4444' },
                    { week: 'Week 2', label: 'Practice', tasks: ['Write 10 STAR behavioral stories', 'Book 2 mock interviews on Pramp', 'Start system design study (1 design/day)'], color: '#f59e0b' },
                    { week: 'Week 3', label: 'Polish', tasks: ['Solve 14 Medium LeetCode problems (2/day)', 'Complete 2 more mock interviews', 'Build/update portfolio project'], color: '#06b6d4' },
                    { week: 'Week 4', label: 'Apply & Negotiate', tasks: ['Apply to 20+ companies with tailored resumes', 'Research each company deeply (2 hrs each)', 'Prepare offer negotiation scripts'], color: '#10b981' },
                  ].map((week, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      className="flex gap-4"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ background: `${week.color}20`, border: `2px solid ${week.color}`, color: week.color }}>
                          {i + 1}
                        </div>
                        {i < 3 && <div className="flex-1 w-0.5 mt-2" style={{ background: `${week.color}30`, minHeight: '40px' }} />}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold text-sm" style={{ color: week.color }}>{week.week}</span>
                          <span className="tag-pill" style={{ color: week.color, borderColor: `${week.color}30`, background: `${week.color}10` }}>{week.label}</span>
                        </div>
                        <div className="space-y-1.5">
                          {week.tasks.map((task, j) => (
                            <div key={j} className="flex items-start gap-2 text-sm text-white/60">
                              <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: week.color }} />
                              {task}
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Resources */}
              <div className="glass-card p-5">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  Top Resources Curated for You
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { name: 'NeetCode 150', desc: 'Best DSA roadmap', url: 'neetcode.io', icon: '💻', color: '#7c3aed' },
                    { name: 'Pramp', desc: 'Free mock interviews', url: 'pramp.com', icon: '🎤', color: '#06b6d4' },
                    { name: 'Levels.fyi', desc: 'Salary benchmarks', url: 'levels.fyi', icon: '💰', color: '#10b981' },
                    { name: 'Gaurav Sen', desc: 'System design videos', url: 'youtube.com', icon: '🏗️', color: '#f59e0b' },
                    { name: 'Jake\'s Resume', desc: 'Best resume template', url: 'overleaf.com', icon: '📄', color: '#ec4899' },
                    { name: 'Glassdoor', desc: 'Company research', url: 'glassdoor.com', icon: '🔍', color: '#8b5cf6' },
                  ].map((r, i) => (
                    <motion.a
                      key={i}
                      href={`https://${r.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.05 * i }}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-3 p-3 rounded-xl transition-all"
                      style={{ background: `${r.color}10`, border: `1px solid ${r.color}25` }}
                    >
                      <span className="text-xl">{r.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm" style={{ color: r.color }}>{r.name}</div>
                        <div className="text-xs text-white/40 truncate">{r.desc}</div>
                      </div>
                      <ExternalLink className="w-3 h-3 text-white/30 flex-shrink-0" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sticky bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <div className="glass-card p-5 flex flex-col sm:flex-row items-center gap-4 justify-between">
            <div className="text-left">
              <div className="font-bold">Ready to improve your score?</div>
              <div className="text-white/40 text-sm">Retake after 2 weeks of focused prep to track growth</div>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onRetake}
                className="btn-primary px-6 py-3 flex items-center gap-2 text-sm font-semibold"
              >
                <RefreshCw className="w-4 h-4" />
                Retake Assessment
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => window.print()}
                className="btn-secondary px-6 py-3 flex items-center gap-2 text-sm font-semibold"
              >
                <Download className="w-4 h-4" />
                Export
              </motion.button>
            </div>
          </div>
        </motion.div>

        <div className="text-center mt-8 text-white/20 text-xs">
          Built for AI CareerForge Hackathon 2025 • © AI CareerForge Team
        </div>
      </div>
    </div>
  );
}
