
import React, { useState, useEffect } from 'react';
import { SavedQuiz, User } from '../types';
import { storageService } from '../services/storageService';

interface DashboardProps {
  user: User;
  onCreateNew: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onCreateNew }) => {
  const [quizzes, setQuizzes] = useState<SavedQuiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
        setIsLoading(true);
        const data = await storageService.getQuizzesByUser(user.id);
        setQuizzes(data);
        setIsLoading(false);
    };
    fetchQuizzes();
  }, [user.id]);

  const copyLink = (quizId: string) => {
    // In a real deployed app, this would be the actual URL
    const url = `${window.location.origin}?quizId=${quizId}`;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard! Share it anywhere.');
  };

  if (isLoading) {
      return (
          <div className="w-full text-center py-20">
              <div className="text-4xl animate-bounce mb-4">🦖</div>
              <p className="font-bold text-gray-500 dark:text-gray-400">Loading your awesome quizzes...</p>
          </div>
      );
  }

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-4xl font-black text-brand-dark dark:text-white">Your Dashboard</h2>
          <p className="text-xl text-gray-500 dark:text-gray-400 font-bold">Welcome back, {user.name}!</p>
        </div>
        <button 
          onClick={onCreateNew}
          className="bg-brand-secondary text-brand-dark border-4 border-black dark:border-white font-black py-3 px-6 rounded-2xl text-xl shadow-pop hover:shadow-pop-hover active:shadow-pop-active active:translate-y-1 transition-all"
        >
          + Create New Quiz
        </button>
      </div>

      {quizzes.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-[32px] border-4 border-black dark:border-white shadow-pop p-10 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-black text-brand-dark dark:text-white mb-2">No quizzes yet!</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 font-medium">Create your first personalized quiz to see it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="bg-white dark:bg-gray-800 rounded-[24px] border-4 border-black dark:border-white shadow-pop p-6 flex flex-col justify-between transition-colors hover:scale-[1.02] duration-200">
              <div>
                <div className="flex justify-between items-start mb-2">
                   <h3 className="text-2xl font-black text-brand-dark dark:text-white leading-tight">{quiz.title || 'Untitled Quiz'}</h3>
                   <span className="bg-brand-light dark:bg-gray-700 text-xs font-bold px-2 py-1 rounded border border-black dark:border-gray-500">
                     {new Date(quiz.createdAt).toLocaleDateString()}
                   </span>
                </div>
                <p className="text-brand-primary font-bold mb-4">For {quiz.childName}</p>
                <div className="flex gap-2 flex-wrap mb-6">
                   <span className="text-sm font-bold bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded border-2 border-black dark:border-gray-500">{quiz.questions.length} Qs</span>
                </div>
              </div>
              
              <button 
                onClick={() => copyLink(quiz.id)}
                className="w-full bg-brand-accent text-white border-4 border-black dark:border-white font-bold py-2 rounded-xl shadow-sm hover:shadow-pop active:translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Copy Link
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
