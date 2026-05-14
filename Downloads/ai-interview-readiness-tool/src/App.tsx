import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LandingPage from './components/LandingPage';
import AssessmentQuiz from './components/AssessmentQuiz';
import ProcessingScreen from './components/ProcessingScreen';
import ScoreReveal from './components/ScoreReveal';
import ResultsDashboard from './components/ResultsDashboard';
import ParticleField from './components/ParticleField';
import { computeScores, computeOverallScore } from './data/questions';

type AppState = 'landing' | 'quiz' | 'processing' | 'reveal' | 'results';

export default function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [categoryScores, setCategoryScores] = useState<Record<string, number>>({});
  const [overallScore, setOverallScore] = useState(0);

  const handleQuizComplete = useCallback((quizAnswers: Record<string, string | string[]>) => {
    setAnswers(quizAnswers);
    const scores = computeScores(quizAnswers);
    setCategoryScores(scores);
    setOverallScore(computeOverallScore(scores));
    setAppState('processing');
  }, []);

  const handleProcessingComplete = useCallback(() => {
    setAppState('reveal');
  }, []);

  const handleRevealContinue = useCallback(() => {
    setAppState('results');
  }, []);

  const handleRetake = useCallback(() => {
    setAnswers({});
    setCategoryScores({});
    setOverallScore(0);
    setAppState('landing');
  }, []);

  return (
    <>
    <ParticleField />
    <AnimatePresence mode="wait">
      {appState === 'landing' && (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.4 }}
        >
          <LandingPage onStart={() => setAppState('quiz')} />
        </motion.div>
      )}

      {appState === 'quiz' && (
        <motion.div
          key="quiz"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.4 }}
        >
          <AssessmentQuiz
            onComplete={handleQuizComplete}
            onBack={() => setAppState('landing')}
          />
        </motion.div>
      )}

      {appState === 'processing' && (
        <motion.div
          key="processing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ProcessingScreen onComplete={handleProcessingComplete} />
        </motion.div>
      )}

      {appState === 'reveal' && (
        <motion.div
          key="reveal"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.4 }}
        >
          <ScoreReveal score={overallScore} onContinue={handleRevealContinue} />
        </motion.div>
      )}

      {appState === 'results' && (
        <motion.div
          key="results"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.4 }}
        >
          <ResultsDashboard
            categoryScores={categoryScores}
            answers={answers}
            onRetake={handleRetake}
          />
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
