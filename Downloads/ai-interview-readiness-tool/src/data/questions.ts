export type QuestionType = 'single' | 'multi' | 'scale' | 'input' | 'role-select';

export interface Option {
  id: string;
  label: string;
  score: number;
  emoji?: string;
}

export interface Question {
  id: string;
  category: 'technical' | 'resume' | 'communication' | 'portfolio' | 'behavioral' | 'profile';
  question: string;
  subtext?: string;
  type: QuestionType;
  options?: Option[];
  min?: number;
  max?: number;
  placeholder?: string;
  weight: number; // contribution to category score
  timeEstimate: number; // seconds
}

export const questions: Question[] = [
  // ── PROFILE SETUP ──────────────────────────────────────────────────────────
  {
    id: 'q_role',
    category: 'profile',
    question: 'What role are you targeting?',
    subtext: 'We\'ll tailor your readiness assessment to your specific field',
    type: 'role-select',
    options: [
      { id: 'swe', label: 'Software Engineer', score: 0, emoji: '💻' },
      { id: 'ds', label: 'Data Scientist / ML', score: 0, emoji: '🤖' },
      { id: 'pm', label: 'Product Manager', score: 0, emoji: '📋' },
      { id: 'design', label: 'UX/UI Designer', score: 0, emoji: '🎨' },
      { id: 'finance', label: 'Finance / Analyst', score: 0, emoji: '📊' },
      { id: 'marketing', label: 'Marketing', score: 0, emoji: '📣' },
      { id: 'other', label: 'Other', score: 0, emoji: '🌟' },
    ],
    weight: 0,
    timeEstimate: 10,
  },
  {
    id: 'q_exp',
    category: 'profile',
    question: 'What\'s your current experience level?',
    subtext: 'Be honest — this helps calibrate your score accurately',
    type: 'single',
    options: [
      { id: 'fresh', label: 'Fresh Graduate / No Experience', score: 0, emoji: '🌱' },
      { id: 'intern', label: '1 Internship', score: 1, emoji: '🚀' },
      { id: 'multi', label: '2+ Internships', score: 2, emoji: '⚡' },
      { id: 'junior', label: '1-2 Years Full-time', score: 3, emoji: '🔥' },
    ],
    weight: 5,
    timeEstimate: 8,
  },

  // ── TECHNICAL SKILLS ───────────────────────────────────────────────────────
  {
    id: 'q_dsa',
    category: 'technical',
    question: 'How comfortable are you with Data Structures & Algorithms?',
    subtext: 'Coding problems, LeetCode-style questions',
    type: 'single',
    options: [
      { id: 'none', label: 'Never practiced DSA problems', score: 5, emoji: '😰' },
      { id: 'basic', label: 'Solved < 20 problems (Easy only)', score: 25, emoji: '🤔' },
      { id: 'mid', label: 'Solved 20-100 problems (Easy + Medium)', score: 55, emoji: '💪' },
      { id: 'strong', label: 'Solved 100+ problems (including Hard)', score: 90, emoji: '🧠' },
    ],
    weight: 25,
    timeEstimate: 10,
  },
  {
    id: 'q_system',
    category: 'technical',
    question: 'Can you discuss System Design concepts?',
    subtext: 'Load balancers, databases, microservices, scalability',
    type: 'single',
    options: [
      { id: 'none', label: 'Never heard of / Can\'t explain', score: 5, emoji: '❓' },
      { id: 'basic', label: 'Basic understanding only', score: 30, emoji: '📖' },
      { id: 'good', label: 'Can design simple systems', score: 65, emoji: '🏗️' },
      { id: 'expert', label: 'Designed complex, scalable systems', score: 95, emoji: '🚀' },
    ],
    weight: 20,
    timeEstimate: 10,
  },
  {
    id: 'q_projects',
    category: 'technical',
    question: 'How many significant technical projects have you built?',
    subtext: 'Projects you can demo and explain deeply',
    type: 'single',
    options: [
      { id: 'none', label: 'None', score: 5, emoji: '😬' },
      { id: 'one', label: '1 project', score: 35, emoji: '🔨' },
      { id: 'two', label: '2-3 projects', score: 65, emoji: '⚙️' },
      { id: 'many', label: '4+ solid projects', score: 90, emoji: '🏆' },
    ],
    weight: 30,
    timeEstimate: 8,
  },
  {
    id: 'q_stack',
    category: 'technical',
    question: 'Which technologies do you have solid experience in?',
    subtext: 'Select all that apply — be honest about your depth',
    type: 'multi',
    options: [
      { id: 'py', label: 'Python', score: 10, emoji: '🐍' },
      { id: 'js', label: 'JavaScript / TypeScript', score: 10, emoji: '⚡' },
      { id: 'java', label: 'Java / C++', score: 10, emoji: '☕' },
      { id: 'react', label: 'React / Vue / Angular', score: 8, emoji: '⚛️' },
      { id: 'sql', label: 'SQL / Databases', score: 8, emoji: '🗄️' },
      { id: 'ml', label: 'ML / AI Frameworks', score: 10, emoji: '🤖' },
      { id: 'cloud', label: 'AWS / GCP / Azure', score: 9, emoji: '☁️' },
      { id: 'docker', label: 'Docker / K8s / DevOps', score: 10, emoji: '🐳' },
      { id: 'none', label: 'None of the above', score: 0, emoji: '❌' },
    ],
    weight: 25,
    timeEstimate: 12,
  },

  // ── RESUME ─────────────────────────────────────────────────────────────────
  {
    id: 'q_resume_quality',
    category: 'resume',
    question: 'How would you rate your resume right now?',
    subtext: 'Think about format, keywords, and impact statements',
    type: 'single',
    options: [
      { id: 'none', label: 'I don\'t have one / Very rough draft', score: 5, emoji: '😅' },
      { id: 'basic', label: 'Basic template, not tailored', score: 30, emoji: '📄' },
      { id: 'decent', label: 'Decent — reviewed by peers', score: 60, emoji: '✅' },
      { id: 'polished', label: 'ATS-optimized, professionally reviewed', score: 90, emoji: '💎' },
    ],
    weight: 30,
    timeEstimate: 8,
  },
  {
    id: 'q_resume_bullets',
    category: 'resume',
    question: 'Do your resume bullets use metrics/numbers?',
    subtext: 'E.g., "Improved performance by 40%" vs "Improved performance"',
    type: 'single',
    options: [
      { id: 'none', label: 'No numbers, just descriptions', score: 10, emoji: '📝' },
      { id: 'some', label: 'A few numbers here and there', score: 45, emoji: '🔢' },
      { id: 'most', label: 'Most bullets have quantified impact', score: 80, emoji: '📊' },
      { id: 'all', label: 'Every achievement is data-driven', score: 100, emoji: '🎯' },
    ],
    weight: 35,
    timeEstimate: 8,
  },
  {
    id: 'q_resume_tailored',
    category: 'resume',
    question: 'Do you tailor your resume for each application?',
    subtext: 'Matching keywords to job descriptions',
    type: 'single',
    options: [
      { id: 'never', label: 'Never — same resume everywhere', score: 10, emoji: '😴' },
      { id: 'rarely', label: 'Rarely — minor tweaks', score: 35, emoji: '🔄' },
      { id: 'sometimes', label: 'Sometimes — for important roles', score: 65, emoji: '🎯' },
      { id: 'always', label: 'Always — ATS keyword-matched', score: 100, emoji: '🏹' },
    ],
    weight: 35,
    timeEstimate: 8,
  },

  // ── COMMUNICATION ──────────────────────────────────────────────────────────
  {
    id: 'q_star',
    category: 'communication',
    question: 'Can you confidently answer behavioral questions using STAR format?',
    subtext: 'Situation, Task, Action, Result — structured storytelling',
    type: 'single',
    options: [
      { id: 'never', label: 'What\'s STAR format?', score: 5, emoji: '❓' },
      { id: 'know', label: 'I know it but haven\'t practiced', score: 25, emoji: '📚' },
      { id: 'practiced', label: 'Practiced a few times', score: 60, emoji: '🎤' },
      { id: 'fluent', label: 'Naturally use it, feel confident', score: 95, emoji: '⭐' },
    ],
    weight: 35,
    timeEstimate: 10,
  },
  {
    id: 'q_mock',
    category: 'communication',
    question: 'How many mock interviews have you done?',
    subtext: 'With a friend, mentor, Pramp, Interviewing.io, etc.',
    type: 'single',
    options: [
      { id: 'zero', label: 'Zero', score: 5, emoji: '🙈' },
      { id: 'one', label: '1-2 mock interviews', score: 30, emoji: '👶' },
      { id: 'few', label: '3-5 mock interviews', score: 65, emoji: '🏃' },
      { id: 'many', label: '6+ mock interviews', score: 95, emoji: '🏆' },
    ],
    weight: 30,
    timeEstimate: 8,
  },
  {
    id: 'q_nervousness',
    category: 'communication',
    question: 'How do you handle nervousness during interviews?',
    subtext: 'Honest self-assessment of your composure under pressure',
    type: 'single',
    options: [
      { id: 'freeze', label: 'I freeze / blank out completely', score: 10, emoji: '🥶' },
      { id: 'stumble', label: 'I stumble but recover slowly', score: 35, emoji: '😓' },
      { id: 'manage', label: 'I manage well after initial nerves', score: 70, emoji: '😤' },
      { id: 'calm', label: 'I stay calm and think clearly', score: 95, emoji: '🧘' },
    ],
    weight: 20,
    timeEstimate: 8,
  },
  {
    id: 'q_questions',
    category: 'communication',
    question: 'Do you prepare thoughtful questions to ask interviewers?',
    subtext: '"Do you have any questions for us?" — this matters a lot!',
    type: 'single',
    options: [
      { id: 'never', label: 'Never — I say "nothing, thanks"', score: 5, emoji: '😶' },
      { id: 'generic', label: 'Generic questions like "What\'s culture like?"', score: 40, emoji: '🤷' },
      { id: 'specific', label: 'Role-specific, thoughtful questions', score: 80, emoji: '🤔' },
      { id: 'strategic', label: 'Strategic questions showing deep research', score: 100, emoji: '🎯' },
    ],
    weight: 15,
    timeEstimate: 8,
  },

  // ── PORTFOLIO ──────────────────────────────────────────────────────────────
  {
    id: 'q_github',
    category: 'portfolio',
    question: 'How active is your GitHub / public portfolio?',
    subtext: 'Recruiters check this — green squares matter',
    type: 'single',
    options: [
      { id: 'none', label: 'No GitHub / empty profile', score: 5, emoji: '👻' },
      { id: 'inactive', label: 'Exists but barely updated', score: 20, emoji: '🕸️' },
      { id: 'some', label: 'A few good repos, sporadic commits', score: 55, emoji: '📁' },
      { id: 'active', label: 'Consistent commits, well-documented', score: 90, emoji: '🟢' },
    ],
    weight: 35,
    timeEstimate: 8,
  },
  {
    id: 'q_linkedin',
    category: 'portfolio',
    question: 'How complete and optimized is your LinkedIn?',
    subtext: 'Photo, headline, about, experience, skills, recommendations',
    type: 'single',
    options: [
      { id: 'none', label: 'No LinkedIn / basic setup', score: 5, emoji: '🚫' },
      { id: 'partial', label: 'Partial — missing many sections', score: 25, emoji: '🔨' },
      { id: 'good', label: 'Complete but not keyword-optimized', score: 60, emoji: '✔️' },
      { id: 'optimized', label: 'All-Star profile, 500+ connections', score: 95, emoji: '💼' },
    ],
    weight: 30,
    timeEstimate: 8,
  },
  {
    id: 'q_online_presence',
    category: 'portfolio',
    question: 'Do you have any other online presence?',
    subtext: 'Personal website, blog, open-source contributions, publications',
    type: 'multi',
    options: [
      { id: 'website', label: 'Personal website / portfolio', score: 20, emoji: '🌐' },
      { id: 'blog', label: 'Blog or articles (Medium, Dev.to)', score: 15, emoji: '✍️' },
      { id: 'oss', label: 'Open-source contributions', score: 20, emoji: '🔓' },
      { id: 'kaggle', label: 'Kaggle / competitive platforms', score: 15, emoji: '🥇' },
      { id: 'none', label: 'None', score: 0, emoji: '❌' },
    ],
    weight: 35,
    timeEstimate: 10,
  },

  // ── BEHAVIORAL / RESEARCH ──────────────────────────────────────────────────
  {
    id: 'q_research',
    category: 'behavioral',
    question: 'How thoroughly do you research companies before interviews?',
    subtext: 'Products, culture, recent news, team structure',
    type: 'single',
    options: [
      { id: 'none', label: 'Barely — just the job description', score: 10, emoji: '😬' },
      { id: 'basic', label: 'Website + Wikipedia level', score: 30, emoji: '🔍' },
      { id: 'good', label: 'Products, culture, Glassdoor reviews', score: 70, emoji: '📰' },
      { id: 'deep', label: 'Deep research: financials, news, team, tech stack', score: 100, emoji: '🕵️' },
    ],
    weight: 50,
    timeEstimate: 8,
  },
  {
    id: 'q_offer',
    category: 'behavioral',
    question: 'Are you prepared to negotiate your offer?',
    subtext: 'Salary benchmarks, competing offers, negotiation scripts',
    type: 'single',
    options: [
      { id: 'no', label: 'I\'d accept whatever they offer', score: 10, emoji: '😰' },
      { id: 'maybe', label: 'I\'d try but don\'t know how', score: 40, emoji: '🤞' },
      { id: 'yes', label: 'I know market rates and would negotiate', score: 80, emoji: '💪' },
      { id: 'expert', label: 'I have a full negotiation strategy ready', score: 100, emoji: '🎯' },
    ],
    weight: 50,
    timeEstimate: 8,
  },
];

export interface CategoryInfo {
  key: string;
  label: string;
  icon: string;
  color: string;
  gradient: string;
  description: string;
}

export const categories: CategoryInfo[] = [
  {
    key: 'technical',
    label: 'Technical Skills',
    icon: '💻',
    color: '#7c3aed',
    gradient: 'from-purple-600 to-purple-900',
    description: 'DSA, system design, projects, stack depth',
  },
  {
    key: 'resume',
    label: 'Resume Strength',
    icon: '📄',
    color: '#06b6d4',
    gradient: 'from-cyan-500 to-cyan-900',
    description: 'Format, metrics, ATS optimization, tailoring',
  },
  {
    key: 'communication',
    label: 'Communication',
    icon: '🎤',
    color: '#ec4899',
    gradient: 'from-pink-500 to-pink-900',
    description: 'STAR method, mock interviews, composure',
  },
  {
    key: 'portfolio',
    label: 'Portfolio & Presence',
    icon: '🌐',
    color: '#10b981',
    gradient: 'from-emerald-500 to-emerald-900',
    description: 'GitHub, LinkedIn, personal brand',
  },
  {
    key: 'behavioral',
    label: 'Strategy & Research',
    icon: '🎯',
    color: '#f59e0b',
    gradient: 'from-amber-500 to-amber-900',
    description: 'Company research, offer negotiation',
  },
];

export interface ImprovementTip {
  category: string;
  minScore: number;
  maxScore: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  action: string;
  resource: string;
  timeToFix: string;
  impact: string;
}

export const improvementTips: ImprovementTip[] = [
  // Technical
  {
    category: 'technical', minScore: 0, maxScore: 40, priority: 'critical',
    title: 'Start LeetCode Practice — TODAY',
    action: 'Commit to solving 3 problems per day. Start with Easy, then Medium. Use NeetCode 150 roadmap.',
    resource: 'neetcode.io / leetcode.com',
    timeToFix: '4-6 weeks',
    impact: '+35 Technical Score',
  },
  {
    category: 'technical', minScore: 40, maxScore: 70, priority: 'high',
    title: 'Level Up to System Design',
    action: 'Study "Designing Data-Intensive Applications" + watch Gaurav Sen on YouTube. Practice designing 1 system per week.',
    resource: 'systemdesign.one / youtube @GauravSen',
    timeToFix: '3-4 weeks',
    impact: '+20 Technical Score',
  },
  {
    category: 'technical', minScore: 70, maxScore: 100, priority: 'medium',
    title: 'Add Open-Source Contributions',
    action: 'Find a project on GitHub with "good-first-issue" label. Contribute a meaningful PR to showcase real-world code.',
    resource: 'goodfirstissue.dev',
    timeToFix: '2-3 weeks',
    impact: '+10 Technical Score',
  },
  // Resume
  {
    category: 'resume', minScore: 0, maxScore: 40, priority: 'critical',
    title: 'Rebuild Your Resume From Scratch',
    action: 'Use Jake\'s Resume template. Write every bullet as: "Accomplished [X] by doing [Y] resulting in [Z measurable outcome]."',
    resource: 'overleaf.com (Jake\'s template)',
    timeToFix: '1-2 days',
    impact: '+40 Resume Score',
  },
  {
    category: 'resume', minScore: 40, maxScore: 70, priority: 'high',
    title: 'Quantify Every Achievement',
    action: 'Go through each bullet and ask "So what? By how much?" Add percentages, time saved, users impacted, revenue generated.',
    resource: 'resumeworded.com (free ATS scan)',
    timeToFix: '2-3 hours',
    impact: '+25 Resume Score',
  },
  {
    category: 'resume', minScore: 70, maxScore: 100, priority: 'low',
    title: 'Run ATS Optimization',
    action: 'Use Jobscan to match resume to job descriptions. Ensure 80%+ keyword match for target roles.',
    resource: 'jobscan.co',
    timeToFix: '30 minutes per application',
    impact: '+10 Resume Score',
  },
  // Communication
  {
    category: 'communication', minScore: 0, maxScore: 40, priority: 'critical',
    title: 'Master the STAR Framework NOW',
    action: 'Write out 10 STAR stories from your experiences. Practice each story out loud 3 times. Record yourself.',
    resource: 'Big Interview (biginterview.com)',
    timeToFix: '1 week',
    impact: '+45 Communication Score',
  },
  {
    category: 'communication', minScore: 40, maxScore: 70, priority: 'high',
    title: 'Book 3 Mock Interviews This Week',
    action: 'Use Pramp.com (free peer mocks) or Interviewing.io. Focus on feedback, not passing. Record and watch yourself.',
    resource: 'pramp.com (free) / interviewing.io',
    timeToFix: '1 week',
    impact: '+30 Communication Score',
  },
  {
    category: 'communication', minScore: 70, maxScore: 100, priority: 'medium',
    title: 'Polish Your "Tell Me About Yourself" Pitch',
    action: 'Craft a 90-second compelling narrative arc: past → present → future. Practice until it feels natural, not rehearsed.',
    resource: 'YouTube: Jeff H Sipe (ex-Google recruiter)',
    timeToFix: '3-5 days',
    impact: '+10 Communication Score',
  },
  // Portfolio
  {
    category: 'portfolio', minScore: 0, maxScore: 40, priority: 'critical',
    title: 'Create Your GitHub + LinkedIn TODAY',
    action: 'Pin 3 best projects on GitHub. Complete LinkedIn with photo, headline, and about section. Connect with 50+ people.',
    resource: 'github.com / linkedin.com',
    timeToFix: '2-3 days',
    impact: '+45 Portfolio Score',
  },
  {
    category: 'portfolio', minScore: 40, maxScore: 70, priority: 'high',
    title: 'Build a Personal Portfolio Website',
    action: 'Use Next.js + Vercel or GitHub Pages. Include projects with live demos, tech stack, and impact. Add a blog section.',
    resource: 'vercel.com / netlify.com (free hosting)',
    timeToFix: '1-2 weeks',
    impact: '+25 Portfolio Score',
  },
  {
    category: 'portfolio', minScore: 70, maxScore: 100, priority: 'low',
    title: 'Start Thought Leadership',
    action: 'Write 1 technical blog post per week on Dev.to or Medium. Share on LinkedIn. Build an audience and credibility.',
    resource: 'dev.to / hashnode.com',
    timeToFix: 'Ongoing (30 min/week)',
    impact: '+10 Portfolio Score',
  },
  // Behavioral
  {
    category: 'behavioral', minScore: 0, maxScore: 50, priority: 'high',
    title: 'Deep-Dive Company Research Protocol',
    action: 'For each company: Read last 4 earnings calls, 10 recent news articles, all Glassdoor reviews, follow 5 employees on LinkedIn.',
    resource: 'glassdoor.com / seekingalpha.com',
    timeToFix: '2 hours per company',
    impact: '+35 Strategy Score',
  },
  {
    category: 'behavioral', minScore: 50, maxScore: 100, priority: 'medium',
    title: 'Negotiate — You\'re Leaving Money on the Table',
    action: 'Research salary bands on levels.fyi. Always counter with 15-20% above offer. Scripts: "I\'m very excited but was hoping for..."',
    resource: 'levels.fyi / glassdoor salary / Haseeb Qureshi\'s guide',
    timeToFix: '1-2 hours prep',
    impact: '+$10-20k per year',
  },
];

// Helper: compute category score from answers
export function computeScores(answers: Record<string, string | string[]>): Record<string, number> {
  const categoryScores: Record<string, { total: number; maxTotal: number }> = {
    technical: { total: 0, maxTotal: 0 },
    resume: { total: 0, maxTotal: 0 },
    communication: { total: 0, maxTotal: 0 },
    portfolio: { total: 0, maxTotal: 0 },
    behavioral: { total: 0, maxTotal: 0 },
  };

  questions.forEach((q) => {
    if (q.category === 'profile' || q.weight === 0) return;
    const ans = answers[q.id];
    if (!ans) return;

    const cat = categoryScores[q.category];
    if (!cat) return;

    if (q.type === 'multi') {
      const selected = ans as string[];
      // Multi-select: cap at 100
      const rawScore = selected.reduce((acc, id) => {
        const opt = q.options?.find((o) => o.id === id);
        return acc + (opt?.score ?? 0);
      }, 0);
      const optScore = Math.min(100, rawScore);
      cat.total += optScore * q.weight;
      cat.maxTotal += 100 * q.weight;
    } else {
      const opt = q.options?.find((o) => o.id === (ans as string));
      const score = opt?.score ?? 0;
      cat.total += score * q.weight;
      cat.maxTotal += 100 * q.weight;
    }
  });

  const result: Record<string, number> = {};
  Object.entries(categoryScores).forEach(([key, val]) => {
    result[key] = val.maxTotal > 0 ? Math.round((val.total / val.maxTotal) * 100) : 0;
  });

  return result;
}

export function computeOverallScore(categoryScores: Record<string, number>): number {
  const weights: Record<string, number> = {
    technical: 30,
    resume: 25,
    communication: 25,
    portfolio: 12,
    behavioral: 8,
  };
  let total = 0;
  let totalWeight = 0;
  Object.entries(weights).forEach(([key, w]) => {
    total += (categoryScores[key] ?? 0) * w;
    totalWeight += w;
  });
  return Math.round(total / totalWeight);
}

export function getReadinessLevel(score: number): {
  level: string;
  label: string;
  color: string;
  emoji: string;
  message: string;
} {
  if (score >= 80) return {
    level: 'expert',
    label: 'Interview Ready',
    color: '#10b981',
    emoji: '🏆',
    message: 'You\'re in the top tier of candidates. Apply confidently!',
  };
  if (score >= 60) return {
    level: 'intermediate',
    label: 'Almost Ready',
    color: '#06b6d4',
    emoji: '⚡',
    message: 'A few focused improvements will get you there. You\'re close!',
  };
  if (score >= 40) return {
    level: 'developing',
    label: 'Developing',
    color: '#f59e0b',
    emoji: '🚀',
    message: 'Good foundation. Targeted effort in key areas will transform your readiness.',
  };
  return {
    level: 'beginner',
    label: 'Early Stage',
    color: '#ec4899',
    emoji: '🌱',
    message: 'Everyone starts here. A focused 30-day plan will dramatically change your trajectory.',
  };
}

export function getTopImprovements(categoryScores: Record<string, number>): ImprovementTip[] {
  const tips: ImprovementTip[] = [];

  Object.entries(categoryScores).forEach(([cat, score]) => {
    const catTips = improvementTips.filter(
      (t) => t.category === cat && score >= t.minScore && score < t.maxScore
    );
    if (catTips.length > 0) {
      // Pick the most relevant tip
      tips.push(catTips[0]);
    }
  });

  // Sort by priority
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  tips.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return tips.slice(0, 5);
}
