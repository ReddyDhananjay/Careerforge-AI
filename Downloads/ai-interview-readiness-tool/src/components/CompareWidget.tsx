import { motion } from 'framer-motion';

const metrics = [
  { label: 'Without AI CareerForge', value: '67%', desc: 'fail first round interviews', color: '#ef4444' },
  { label: 'With AI CareerForge', value: '89%', desc: 'report improved confidence', color: '#10b981' },
  { label: 'Average time to job offer', old: '6.2 months', new: '2.8 months', improvement: '55% faster', color: '#7c3aed' },
];

export default function CompareWidget() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
      {metrics.map((m, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15 }}
          className="glass-card p-5 text-center"
        >
          {m.value ? (
            <>
              <div className="text-4xl font-black mb-1" style={{ color: m.color }}>{m.value}</div>
              <div className="text-white/50 text-sm">{m.label}</div>
              <div className="text-white/30 text-xs mt-1">{m.desc}</div>
            </>
          ) : (
            <>
              <div className="text-2xl font-black mb-1" style={{ color: m.color }}>{m.improvement}</div>
              <div className="flex justify-between text-xs mt-2">
                <div className="text-red-400">{m.old}</div>
                <div className="text-emerald-400">{m.new}</div>
              </div>
              <div className="text-white/40 text-xs mt-1">{m.label}</div>
            </>
          )}
        </motion.div>
      ))}
    </div>
  );
}
