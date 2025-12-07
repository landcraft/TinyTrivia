import React from 'react';

interface QuizSummaryProps {
  score: number;
  totalQuestions: number;
  onPlayAgain: () => void;
}

export const QuizSummary: React.FC<QuizSummaryProps> = ({ score, totalQuestions, onPlayAgain }) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  const message = percentage >= 80 ? "You're a Superstar! 🌟" :
                  percentage >= 50 ? "Great Job! ✨" :
                  "Nice Try! 🚀";

  return (
    <div className="w-full max-w-lg mx-auto p-4 text-center animate-fade-in">
        <div className="bg-white dark:bg-gray-800 rounded-[32px] border-4 border-black dark:border-white shadow-pop p-8 md:p-12 transform scale-100 animate-pop-in relative overflow-hidden transition-colors duration-300">
            
            {/* Confetti decoration (simple css circles) */}
            <div className="absolute top-4 left-4 w-6 h-6 rounded-full bg-brand-secondary border-2 border-black dark:border-white"></div>
            <div className="absolute top-10 right-10 w-4 h-4 rounded-full bg-brand-primary border-2 border-black dark:border-white"></div>
            <div className="absolute bottom-8 left-10 w-8 h-8 rounded-full bg-brand-accent border-2 border-black dark:border-white"></div>

            <h2 className="text-4xl md:text-5xl font-black text-brand-dark dark:text-white mb-4 leading-tight">{message}</h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 font-bold mb-8">Quiz Complete!</p>
            
            <div className="bg-brand-light dark:bg-gray-700 rounded-3xl border-4 border-black dark:border-white p-8 mb-10 transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <p className="text-xl font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Your Score</p>
                <div className="flex items-baseline justify-center gap-2 my-2">
                    <span className="text-8xl font-black text-brand-primary drop-shadow-sm">{score}</span>
                    <span className="text-4xl font-bold text-gray-400 dark:text-gray-500">/ {totalQuestions}</span>
                </div>
                <div className="inline-block bg-brand-secondary text-brand-dark px-4 py-1 rounded-lg border-2 border-black dark:border-white font-bold text-lg mt-2">
                    {percentage}% Correct
                </div>
            </div>

            <button onClick={onPlayAgain} className="w-full bg-brand-accent text-white border-4 border-black dark:border-white font-black py-4 px-6 rounded-2xl text-2xl shadow-pop hover:shadow-pop-hover active:shadow-pop-active active:translate-y-1 transition-all">
                Play Again! 🔄
            </button>
        </div>
    </div>
  );
};