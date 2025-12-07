
import React from 'react';

interface LandingPageProps {
  onCreateQuiz: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onCreateQuiz }) => {
  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center text-center animate-fade-in py-8">
      
      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-800 rounded-[40px] border-4 border-black dark:border-white shadow-pop p-8 md:p-16 mb-12 relative overflow-hidden">
         {/* Decorative Blobs */}
         <div className="absolute top-0 right-0 w-32 h-32 bg-brand-secondary rounded-bl-full border-l-4 border-b-4 border-black dark:border-white z-0"></div>
         <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand-primary rounded-tr-full border-r-4 border-t-4 border-black dark:border-white z-0"></div>

         <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-brand-dark dark:text-white mb-6 leading-tight">
              Turn Screen Time into <br/>
              <span className="text-brand-primary drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">Learning Time!</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-300 font-bold mb-10 max-w-2xl mx-auto">
              Create AI-powered quizzes tailored to your child's favorite characters, hobbies, and learning level in seconds.
            </p>
            
            <button 
              onClick={onCreateQuiz}
              className="bg-brand-secondary text-brand-dark border-4 border-black dark:border-white font-black py-6 px-10 rounded-3xl text-3xl shadow-pop hover:shadow-pop-hover active:shadow-pop-active active:translate-y-1 transition-all transform hover:rotate-1"
            >
              🚀 Create a Quiz Now
            </button>
         </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full px-4">
        <div className="bg-brand-light dark:bg-gray-800 p-8 rounded-3xl border-4 border-black dark:border-white shadow-sm flex flex-col items-center">
          <span className="text-6xl mb-4">🎨</span>
          <h3 className="text-2xl font-black text-brand-dark dark:text-white mb-2">Totally Custom</h3>
          <p className="text-gray-600 dark:text-gray-400 font-medium">From Dinosaurs to Division, you choose exactly what goes in.</p>
        </div>
        <div className="bg-brand-light dark:bg-gray-800 p-8 rounded-3xl border-4 border-black dark:border-white shadow-sm flex flex-col items-center">
          <span className="text-6xl mb-4">🤖</span>
          <h3 className="text-2xl font-black text-brand-dark dark:text-white mb-2">AI Powered</h3>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Questions generated instantly specifically for your child's age.</p>
        </div>
         <div className="bg-brand-light dark:bg-gray-800 p-8 rounded-3xl border-4 border-black dark:border-white shadow-sm flex flex-col items-center">
          <span className="text-6xl mb-4">💾</span>
          <h3 className="text-2xl font-black text-brand-dark dark:text-white mb-2">Save & Share</h3>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Create an account to save quizzes and send links to family.</p>
        </div>
      </div>

    </div>
  );
};
