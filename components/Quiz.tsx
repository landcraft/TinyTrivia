import React, { useState } from 'react';
import type { QuizQuestion } from '../types';
import { CheckIcon } from './icons/CheckIcon';
import { XIcon } from './icons/XIcon';

interface QuizProps {
  questions: QuizQuestion[];
  onQuizComplete: (score: number) => void;
}

export const Quiz: React.FC<QuizProps> = ({ questions, onQuizComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerClick = (answerIndex: number) => {
    if (isAnswered) return;

    setSelectedAnswer(answerIndex);
    setIsAnswered(true);

    if (answerIndex === currentQuestion.correctAnswerIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNextQuestion = () => {
    setIsAnswered(false);
    setSelectedAnswer(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
    } else {
      onQuizComplete(score);
    }
  };

  const getButtonClass = (index: number) => {
    const baseClass = "p-6 rounded-2xl text-xl font-bold border-4 border-black dark:border-white transition-all duration-200 transform text-left relative overflow-hidden";
    
    if (!isAnswered) {
      return `${baseClass} bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 hover:scale-[1.02] hover:shadow-pop cursor-pointer text-brand-dark dark:text-white`;
    }
    
    if (index === currentQuestion.correctAnswerIndex) {
      return `${baseClass} bg-green-400 text-black shadow-pop scale-[1.02]`;
    }
    
    if (index === selectedAnswer && index !== currentQuestion.correctAnswerIndex) {
      return `${baseClass} bg-red-400 text-black opacity-90`;
    }
    
    return `${baseClass} bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 opacity-60`;
  };

  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto p-4 animate-fade-in">
        <div className="bg-white dark:bg-gray-800 rounded-[32px] border-4 border-black dark:border-white shadow-pop p-6 md:p-10 relative transition-colors duration-300">
            
            {/* Header / Stats */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <span className="bg-brand-accent text-white px-4 py-1 rounded-full border-2 border-black dark:border-white font-bold shadow-sm">
                        Q {currentQuestionIndex + 1}/{questions.length}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="bg-brand-secondary text-brand-dark px-4 py-1 rounded-full border-2 border-black dark:border-white font-bold shadow-sm">
                        ⭐ Score: {score}
                    </span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-8 border-2 border-black dark:border-white overflow-hidden">
                <div className="bg-brand-primary h-full rounded-full" style={{ width: `${progressPercentage}%`, transition: 'width 0.5s ease-in-out' }}></div>
            </div>

            {/* Question */}
            <div className="mb-8">
                <h2 className="text-2xl md:text-4xl font-black text-brand-dark dark:text-white leading-tight text-center">
                    {currentQuestion.question}
                </h2>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 gap-4">
                {currentQuestion.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleAnswerClick(index)}
                        disabled={isAnswered}
                        className={getButtonClass(index)}
                    >
                        <span className="flex items-center justify-between w-full">
                            <span>{option}</span>
                            {isAnswered && index === currentQuestion.correctAnswerIndex && <CheckIcon className="w-8 h-8 text-black" />}
                            {isAnswered && index === selectedAnswer && index !== currentQuestion.correctAnswerIndex && <XIcon className="w-8 h-8 text-black" />}
                        </span>
                    </button>
                ))}
            </div>

            {/* Next Button */}
            {isAnswered && (
                 <div className="mt-8 text-center animate-pop-in">
                    <button onClick={handleNextQuestion} className="w-full md:w-auto bg-brand-primary text-white border-4 border-black dark:border-white font-black py-4 px-12 rounded-2xl text-2xl shadow-pop hover:shadow-pop-hover active:shadow-pop-active active:translate-y-1 transition-all">
                        {currentQuestionIndex < questions.length - 1 ? 'Next Question ➜' : 'See Results 🏆'}
                    </button>
                </div>
            )}
        </div>
    </div>
  );
};