import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Share2, Copy, Check } from 'lucide-react';
import { getReadinessLevel } from '../data/questions';

interface Props {
  score: number;
  categoryScores: Record<string, number>;
}

export default function ShareCard({ score, categoryScores }: Props) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const level = getReadinessLevel(score);

  const shareText = `🎯 I just got my Interview Readiness Score: ${score}/100 (${level.label}) on AI CareerForge!\n\nTechnical: ${categoryScores.technical ?? 0} | Resume: ${categoryScores.resume ?? 0} | Communication: ${categoryScores.communication ?? 0} | Portfolio: ${categoryScores.portfolio ?? 0}\n\nFind out your score 👇`;
  const shareUrl = 'https://ai-careerforge.vercel.app';

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  const shareLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen(!open)}
        className="btn-secondary px-4 py-2 flex items-center gap-2 text-sm"
      >
        <Share2 className="w-4 h-4" />
        Share Score
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-12 z-50 w-72 glass-card p-4 shadow-2xl"
            style={{ border: '1px solid rgba(124,58,237,0.3)' }}
          >
            <h4 className="font-bold text-sm mb-3">Share Your Score</h4>
            
            {/* Preview card */}
            <div className="p-3 rounded-xl mb-4 text-xs"
              style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.1))', border: '1px solid rgba(124,58,237,0.2)' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{level.emoji}</span>
                <span className="font-bold" style={{ color: level.color }}>{level.label}</span>
                <span className="ml-auto text-2xl font-black" style={{ color: level.color }}>{score}/100</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(categoryScores).map(([key, val]) => (
                  <span key={key} className="px-2 py-0.5 rounded-full text-xs"
                    style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}>
                    {key.slice(0,4)}: {val}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={shareTwitter}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ background: 'rgba(29,161,242,0.1)', border: '1px solid rgba(29,161,242,0.2)', color: '#1da1f2' }}
              >
                <span>𝕏</span>
                Share on Twitter/X
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={shareLinkedIn}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ background: 'rgba(0,119,181,0.1)', border: '1px solid rgba(0,119,181,0.2)', color: '#0077b5' }}
              >
                <span>in</span>
                Share on LinkedIn
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={copyToClipboard}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
