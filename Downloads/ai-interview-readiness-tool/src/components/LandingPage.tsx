import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Zap, Clock, TrendingUp, ChevronRight, Star, Users, Award, Shield, Brain, BarChart3 } from 'lucide-react';

interface Props {
  onStart: () => void;
}

// Animated counter
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 1500;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    const rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// Mock score preview card
function ScorePreview() {
  const [animating, setAnimating] = useState(false);
  const [score, setScore] = useState(62);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setScore(prev => prev === 62 ? 88 : 62);
        setAnimating(false);
      }, 500);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const r = 70;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? '#10b981' : '#06b6d4';

  return (
    <div className="glass-card p-6 w-full max-w-sm mx-auto"
      style={{ border: '1px solid rgba(124,58,237,0.3)' }}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-xs text-white/50 font-medium">Live Preview</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <svg width="100" height="100" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
            <motion.circle
              cx="80" cy="80" r={r}
              fill="none"
              stroke={color}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circ}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{ transform: 'rotate(-90deg)', transformOrigin: '80px 80px' }}
            />
          </svg>
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ opacity: animating ? 0 : 1 }}
          >
            <div className="text-2xl font-black" style={{ color }}>{score}</div>
          </motion.div>
        </div>

        <div className="flex-1 space-y-2">
          {[
            { label: '💻 Technical', val: score >= 80 ? 85 : 55, color: '#7c3aed' },
            { label: '📄 Resume', val: score >= 80 ? 90 : 60, color: '#06b6d4' },
            { label: '🎤 Communication', val: score >= 80 ? 88 : 65, color: '#ec4899' },
            { label: '🌐 Portfolio', val: score >= 80 ? 82 : 70, color: '#10b981' },
          ].map((item, i) => (
            <div key={i}>
              <div className="flex justify-between text-xs mb-0.5">
                <span className="text-white/50">{item.label}</span>
                <span className="font-bold" style={{ color: item.color }}>{item.val}</span>
              </div>
              <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: item.color }}
                  animate={{ width: `${item.val}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 rounded-xl text-xs"
        style={{ background: score >= 80 ? 'rgba(16,185,129,0.1)' : 'rgba(6,182,212,0.1)', border: `1px solid ${score >= 80 ? 'rgba(16,185,129,0.2)' : 'rgba(6,182,212,0.2)'}` }}>
        <span style={{ color: score >= 80 ? '#10b981' : '#06b6d4' }}>
          {score >= 80 ? '🏆 Interview Ready — Apply with confidence!' : '⚡ Almost Ready — 2 focused weeks will get you there'}
        </span>
      </div>
    </div>
  );
}

const howItWorks = [
  { step: '01', icon: '📋', title: 'Answer 12 smart questions', desc: 'Carefully crafted to assess your true readiness — not just surface-level knowledge', time: '~90 sec' },
  { step: '02', icon: '🧠', title: 'AI scores your profile', desc: 'Our engine analyses 5 critical dimensions with weighted scoring and cross-correlation', time: '~15 sec' },
  { step: '03', icon: '🎯', title: 'Get your personalized plan', desc: 'Specific action steps, curated resources, and a 30-day sprint plan to maximize growth', time: 'Instant' },
];

const dimensions = [
  { icon: '💻', label: 'Technical Skills', desc: 'DSA, System Design, Projects', color: '#7c3aed', weight: '30%' },
  { icon: '📄', label: 'Resume Strength', desc: 'Format, Metrics, ATS-Score', color: '#06b6d4', weight: '25%' },
  { icon: '🎤', label: 'Communication', desc: 'STAR, Mock Interviews, Clarity', color: '#ec4899', weight: '25%' },
  { icon: '🌐', label: 'Portfolio & Brand', desc: 'GitHub, LinkedIn, Website', color: '#10b981', weight: '12%' },
  { icon: '🎯', label: 'Strategy', desc: 'Company Research, Negotiation', color: '#f59e0b', weight: '8%' },
];

export default function LandingPage({ onStart }: Props) {
  return (
    <div className="min-h-screen gradient-bg grid-bg relative overflow-hidden">
      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
      <div className="absolute top-40 right-20 w-64 h-64 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }} />
      <div className="absolute bottom-40 left-1/3 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #ec4899, transparent)' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Nav */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-16"
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
            >
              ⚡
            </motion.div>
            <div>
              <span className="font-black text-lg tracking-tight">AI CareerForge</span>
              <div className="text-xs text-white/30 -mt-0.5">Interview Readiness Platform</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="tag-pill hidden sm:block">🏆 Hackathon 2025</span>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={onStart}
              className="btn-primary px-5 py-2.5 text-sm font-semibold flex items-center gap-2"
            >
              Start Free
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.nav>

        {/* HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          {/* Left: Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{
                background: 'rgba(124, 58, 237, 0.12)',
                border: '1px solid rgba(124, 58, 237, 0.3)',
              }}
            >
              <Brain className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-semibold text-purple-300">AI-Powered • Free • Under 2 Minutes</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl sm:text-6xl font-black leading-[1.08] mb-6"
            >
              Stop failing
              <br />
              interviews
              <br />
              <span className="gradient-text">you could've</span>
              <br />
              <span className="gradient-text">aced.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-white/50 mb-8 leading-relaxed max-w-lg"
            >
              Every year, <strong className="text-white/70">millions of students</strong> discover their interview gaps
              only after they've failed. AI CareerForge gives you an honest,{' '}
              <strong className="text-white/70">AI-generated readiness score</strong> before you face real recruiters —
              with an exact plan to fix every gap.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-start gap-4 mb-8"
            >
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={onStart}
                className="btn-primary px-10 py-5 text-lg font-bold flex items-center gap-3 glow-purple"
              >
                <Zap className="w-5 h-5" />
                Get My Score — It's Free
              </motion.button>
              <div className="flex items-center gap-2 text-white/40 text-sm pt-1">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>No sign-up. No email. Just answers.</span>
              </div>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-4"
            >
              <div className="flex -space-x-2">
                {['🧑‍💻', '👩‍💼', '🧑‍🎓', '👨‍🔬', '👩‍💻'].map((emoji, i) => (
                  <div key={i}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm border border-white/10"
                    style={{ background: 'rgba(124,58,237,0.2)' }}>
                    {emoji}
                  </div>
                ))}
              </div>
              <div className="text-sm text-white/40">
                <span className="text-white/60 font-semibold">1,247</span> students assessed today
                <div className="flex items-center gap-1 mt-0.5">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
                  <span className="text-xs ml-1">4.9/5 rating</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Live Preview */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
          >
            <ScorePreview />
            <div className="text-center mt-3 text-white/30 text-xs">
              ↑ Live demo — watch your score change with preparation
            </div>
          </motion.div>
        </div>

        {/* STATS BANNER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6 mb-20 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center"
          style={{ border: '1px solid rgba(124,58,237,0.2)' }}
        >
          {[
            { icon: Users, value: 50000, suffix: '+', label: 'Students Assessed', color: '#7c3aed' },
            { icon: TrendingUp, value: 40, suffix: '%', label: 'Avg Score Improvement', color: '#10b981' },
            { icon: Clock, value: 90, suffix: 's', label: 'Time to Complete', color: '#06b6d4' },
            { icon: BarChart3, value: 30, suffix: '+', label: 'Actionable Insights', color: '#ec4899' },
          ].map((stat, i) => (
            <motion.div key={i} whileHover={{ scale: 1.05 }}>
              <stat.icon className="w-5 h-5 mx-auto mb-2" style={{ color: stat.color }} />
              <div className="text-3xl font-black mb-1" style={{ color: stat.color }}>
                <Counter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-white/40 text-xs font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* HOW IT WORKS */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="tag-pill mb-4 inline-block">Process</span>
            <h2 className="text-3xl font-black mb-3">How it works</h2>
            <p className="text-white/40 max-w-md mx-auto">3 simple steps. Under 2 minutes. A lifetime of clearer direction.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {howItWorks.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass-card p-6 relative"
                whileHover={{ y: -4 }}
              >
                {/* Connector line */}
                {i < 2 && (
                  <div className="hidden sm:block absolute top-1/2 -right-2 w-4 h-0.5 z-10"
                    style={{ background: 'rgba(124,58,237,0.3)' }} />
                )}
                <div className="text-4xl font-black mb-3"
                  style={{ color: 'rgba(124,58,237,0.2)', fontFamily: 'Space Grotesk' }}>
                  {step.step}
                </div>
                <div className="text-3xl mb-3">{step.icon}</div>
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed mb-3">{step.desc}</p>
                <div className="inline-flex items-center gap-1.5 text-xs font-medium"
                  style={{ color: '#7c3aed' }}>
                  <Clock className="w-3 h-3" />
                  {step.time}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* DIMENSIONS */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="tag-pill mb-4 inline-block">What We Measure</span>
            <h2 className="text-3xl font-black mb-3">5 dimensions that define your readiness</h2>
            <p className="text-white/40 max-w-lg mx-auto">
              Weighted by what actually matters to recruiters. Not a vanity metric — a real assessment.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dimensions.map((dim, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="glass-card p-5"
                style={{ border: `1px solid ${dim.color}20` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ background: `${dim.color}15` }}>
                    {dim.icon}
                  </div>
                  <span className="text-xs font-bold px-2 py-1 rounded-full"
                    style={{ background: `${dim.color}20`, color: dim.color }}>
                    {dim.weight}
                  </span>
                </div>
                <h3 className="font-bold mb-1" style={{ color: dim.color }}>{dim.label}</h3>
                <p className="text-white/40 text-sm">{dim.desc}</p>
              </motion.div>
            ))}

            {/* CTA card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              onClick={onStart}
              className="glass-card p-5 cursor-pointer flex flex-col items-center justify-center text-center"
              style={{ border: '1px solid rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.08)' }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="text-3xl mb-2">🚀</div>
              <div className="font-bold text-purple-400 mb-1">See your scores</div>
              <div className="text-white/40 text-xs">Take the free assessment now</div>
              <div className="mt-3 flex items-center gap-1 text-purple-400 text-sm font-semibold">
                Start <ChevronRight className="w-4 h-4" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* TESTIMONIALS */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="tag-pill mb-4 inline-block">Social Proof</span>
            <h2 className="text-3xl font-black mb-3">Real stories. Real results.</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                quote: '"I got a 34/100 and thought I was totally ready. The detailed breakdown showed exactly what I was missing. Fixed it all in 3 weeks and got an offer from Google."',
                name: 'Priya S.',
                role: 'SWE @ Google',
                emoji: '🧑‍💻',
                before: 34,
                after: 87,
                color: '#7c3aed',
              },
              {
                quote: '"My communication score was 22/100 — brutal but honest. Did 6 mock interviews after and cracked 4 out of 5 final rounds. This tool is insanely accurate."',
                name: 'Rahul M.',
                role: 'PM @ Flipkart',
                emoji: '👨‍💼',
                before: 22,
                after: 79,
                color: '#ec4899',
              },
              {
                quote: '"Resume score: 28. Rebuilt it completely using the tips. Within a week, my callback rate went from 2% to 23%. I wish I found this earlier."',
                name: 'Ananya K.',
                role: 'Data Scientist @ Amazon',
                emoji: '👩‍🔬',
                before: 28,
                after: 82,
                color: '#10b981',
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-5"
                style={{ border: `1px solid ${t.color}20` }}
                whileHover={{ y: -2 }}
              >
                <div className="flex gap-1 mb-3">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-white/60 text-sm italic mb-4 leading-relaxed">{t.quote}</p>

                {/* Before/after */}
                <div className="flex items-center gap-3 mb-4 p-3 rounded-xl"
                  style={{ background: `${t.color}08` }}>
                  <div className="text-center">
                    <div className="text-xl font-black text-red-400">{t.before}</div>
                    <div className="text-xs text-white/30">Before</div>
                  </div>
                  <div className="flex-1 h-0.5 rounded-full" style={{ background: `${t.color}40` }}>
                    <motion.div className="h-full rounded-full" style={{ background: t.color, width: '70%' }} />
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-black" style={{ color: t.color }}>{t.after}</div>
                    <div className="text-xs text-white/30">After</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
                    style={{ background: `${t.color}20` }}>
                    {t.emoji}
                  </div>
                  <div>
                    <div className="text-sm font-bold">{t.name}</div>
                    <div className="text-xs text-white/40">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FINAL CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="gradient-border p-10 text-center">
            <Award className="w-14 h-14 mx-auto mb-4 text-purple-400" />
            <h2 className="text-4xl font-black mb-3">
              Your score is waiting.
            </h2>
            <p className="text-white/50 mb-2 text-lg">
              12 questions. 90 seconds. Complete interview clarity.
            </p>
            <p className="text-white/30 text-sm mb-8">
              Join 50,000+ students who stopped guessing and started preparing with purpose.
            </p>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={onStart}
              className="btn-primary px-14 py-5 text-xl font-black inline-flex items-center gap-3 glow-purple"
            >
              <Zap className="w-6 h-6" />
              Start My Free Assessment
              <ChevronRight className="w-6 h-6" />
            </motion.button>
            <div className="mt-4 flex items-center justify-center gap-2 text-white/25 text-xs">
              <Shield className="w-3 h-3" />
              <span>No email. No credit card. No BS. Just your honest score.</span>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center text-white/20 text-xs pb-4">
          Built with ❤️ for AI CareerForge Hackathon 2025 •{' '}
          <span className="text-white/30">Helping students interview smarter</span>
        </div>
      </div>
    </div>
  );
}
