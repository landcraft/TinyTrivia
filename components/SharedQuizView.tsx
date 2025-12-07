
import React, { useState, useEffect } from 'react';
import { SavedQuiz } from '../types';
import { Quiz } from './Quiz';
import { QuizSummary } from './QuizSummary';
import { storageService } from '../services/storageService';

interface SharedQuizViewProps {
  quizId: string;
  onHomeClick: () => void;
}

export const SharedQuizView: React.FC<SharedQuizViewProps> = ({ quizId, onHomeClick }) => {
  const [quiz, setQuiz] = useState<SavedQuiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
        setLoading(true);
        const data = await storageService.getQuizById(quizId);
        if (data) {
            setQuiz(data);
        } else {
            setError("Oops! We couldn't find this quiz. It might have been deleted.");
        }
        setLoading(false);
    };
    fetchQuiz();
  }, [quizId]);

  const handleComplete = (finalScore: number) => {
    setScore(finalScore);
    setIsComplete(true);
  };

  const handleReplay = () => {
    setIsComplete(false);
    setScore(0);
  };

  if (loading) {
      return (
        <div className="w-full max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-[32px] border-4 border-black dark:border-white shadow-pop p-10 text-center mt-20">
            <div className="text-4xl animate-bounce mb-4">🤔</div>
            <p className="font-bold text-gray-500 dark:text-gray-400">Fetching the quiz...</p>
        </div>
      );
  }

  if (error || !quiz) {
      return (
        <div className="w-full max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-[32px] border-4 border-black dark:border-white shadow-pop p-10 text-center mt-20">
            <div className="text-6xl mb-4">🔦</div>
            <h2 className="text-3xl font-black text-brand-dark dark:text-white mb-4">Quiz Not Found</h2>
            <p className="font-bold text-gray-500 dark:text-gray-400 mb-8">{error}</p>
            <button onClick={onHomeClick} className="bg-brand-primary text-white font-black px-6 py-3 rounded-2xl border-4 border-black dark:border-white shadow-pop hover:shadow-pop-hover">Go Home</button>
        </div>
      );
  }

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center py-8 px-4 min-h-screen">
      
      {/* Minimal Header for Shared View */}
      <div className="mb-8 text-center animate-fade-in">
        <h1 className="text-4xl font-black text-brand-dark dark:text-white mb-1">{quiz.title}</h1>
        <p className="text-xl font-bold text-brand-primary">For {quiz.childName}</p>
      </div>

      <div className="w-full flex-grow">
        {!isComplete ? (
          <Quiz questions={quiz.questions} onQuizComplete={handleComplete} />
        ) : (
          <QuizSummary score={score} totalQuestions={quiz.questions.length} onPlayAgain={handleReplay} />
        )}
      </div>

      {/* Footer Linking Back */}
      <div className="mt-12 text-center animate-slide-in-up">
        <p className="text-gray-500 dark:text-gray-400 font-bold text-sm mb-2">Enjoyed this quiz?</p>
        <button onClick={onHomeClick} className="group flex items-center gap-2 mx-auto bg-white dark:bg-gray-800 px-6 py-3 rounded-full border-2 border-black dark:border-white shadow-sm hover:shadow-pop transition-all">
          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Created by</span>
          <span className="font-black text-xl tracking-tight">
             <span className="text-[#FF477E]">Tiny</span><span className="text-[#3A86FF]">Trivia</span>
          </span>
        </button>
      </div>

    </div>
  );
};
