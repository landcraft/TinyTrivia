
import React, { useState, useEffect } from 'react';
import type { AppState, QuizQuestion, QuizSetupData, User, SavedQuiz } from './types';
import { QuizSetup } from './components/QuizSetup';
import { Quiz } from './components/Quiz';
import { QuizSummary } from './components/QuizSummary';
import { MenuDropdown } from './components/MenuDropdown';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { Dashboard } from './components/Dashboard';
import { SharedQuizView } from './components/SharedQuizView';
import { storageService } from './services/storageService';

const GeneratingView: React.FC<{ childName: string }> = ({ childName }) => {
  const [msgIndex, setMsgIndex] = useState(0);
  const messages = [
    `Building a quiz for ${childName ? childName : 'you'}...`,
    "Consulting the Wise Owl...",
    "Mixing in some fun facts...",
    "Double-checking the difficult bits...",
    "Adding extra sparkles...",
    "Waking up the fun monsters...",
    "Polishing the trophies..."
  ];

  const emojis = ["🧠", "🦖", "🚀", "👑", "⚽", "🎨", "🐼"];
  const [emojiIndex, setEmojiIndex] = useState(0);

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 2000);

    const emojiInterval = setInterval(() => {
        setEmojiIndex((prev) => (prev + 1) % emojis.length);
    }, 500);

    return () => {
        clearInterval(msgInterval);
        clearInterval(emojiInterval);
    };
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-[32px] border-4 border-black dark:border-white shadow-pop text-center relative overflow-hidden animate-pop-in transition-colors duration-300">
       <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5">
           <div className="w-full h-full bg-brand-secondary rounded-full transform scale-150 translate-x-10 translate-y-10"></div>
       </div>

       <div className="flex justify-center mb-8 pt-10">
          <div className="relative w-32 h-32 flex items-center justify-center">
             <div className="text-8xl animate-bounce transform transition-all duration-500">
                {emojis[emojiIndex]}
             </div>
             <div className="absolute -top-4 -right-6 text-5xl animate-pulse-fast delay-75">✨</div>
             <div className="absolute bottom-0 -left-6 text-5xl animate-pulse-fast delay-150">⚡</div>
             <div className="absolute top-1/2 -right-10 text-3xl animate-spin-slow">⭐</div>
          </div>
       </div>

       <h2 className="text-3xl font-black text-brand-dark dark:text-white mb-6 min-h-[80px] flex items-center justify-center leading-tight px-4">
         {messages[msgIndex]}
       </h2>

       <div className="w-full bg-gray-200 dark:bg-gray-700 h-8 rounded-full border-t-4 border-black dark:border-white overflow-hidden relative">
          <div className="absolute top-0 left-0 h-full bg-brand-primary w-full bg-stripes"></div>
       </div>
       <p className="mt-4 mb-8 text-gray-500 dark:text-gray-300 font-bold">Please wait, magic in progress!</p>
    </div>
  );
}

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('LANDING');
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentSetupData, setCurrentSetupData] = useState<QuizSetupData | null>(null);
  const [finalScore, setFinalScore] = useState(0);
  const [childName, setChildName] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Shared Quiz State
  const [sharedQuizId, setSharedQuizId] = useState<string | null>(null);

  // Initialize
  useEffect(() => {
    // 1. Theme Check
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme) {
        if (mediaQuery.matches) {
           setIsDarkMode(true);
           document.documentElement.classList.add('dark');
        } else {
           setIsDarkMode(false);
           document.documentElement.classList.remove('dark');
        }
      }
    };
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && mediaQuery.matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    // 2. Auth Check (Async)
    const initAuth = async () => {
        const currentUser = await storageService.getCurrentUser();
        if (currentUser) setUser(currentUser);
        
        // Listen for auth changes
        const subscription = storageService.onAuthStateChange((updatedUser) => {
            setUser(updatedUser);
        });
    };
    initAuth();

    // 3. Shared Link Check
    const params = new URLSearchParams(window.location.search);
    const quizId = params.get('quizId');
    if (quizId) {
      setSharedQuizId(quizId);
      setAppState('SHARED_QUIZ');
    }

    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  // Auth Handlers
  const handleLoginSuccess = (user: User) => {
    setUser(user);
    setIsAuthModalOpen(false);
  };

  const handleLogout = async () => {
    await storageService.signOut();
    setUser(null);
    setAppState('LANDING');
  };

  // Quiz Logic Handlers
  const handleQuizGenerated = (quiz: QuizQuestion[], data: QuizSetupData) => {
    if (quiz && quiz.length > 0) {
      setQuizQuestions(quiz);
      setCurrentSetupData(data);
      setAppState('QUIZ');
    } else {
      setAppState('SETUP');
    }
  };

  const handleQuizComplete = (score: number) => {
    setFinalScore(score);
    setAppState('SUMMARY');
  };

  const handlePlayAgain = () => {
    setQuizQuestions([]);
    setFinalScore(0);
    setAppState('SETUP');
    setChildName('');
  };

  const handleSaveQuiz = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    if (currentSetupData && quizQuestions.length > 0) {
      const { error } = await storageService.saveQuiz({
        userId: user.id,
        title: currentSetupData.quizTitle,
        childName: currentSetupData.childName,
        questions: quizQuestions,
      });
      
      if (error) {
          alert('Failed to save quiz: ' + error);
      } else {
          alert('Quiz Saved to Dashboard!');
      }
    }
  };

  const setGenerating = (isGenerating: boolean) => {
    if (isGenerating) {
      setAppState('GENERATING');
    }
  };

  const renderContent = () => {
    switch (appState) {
      case 'LANDING':
        return <LandingPage onCreateQuiz={() => setAppState('SETUP')} />;
      case 'DASHBOARD':
        return user ? <Dashboard user={user} onCreateNew={() => setAppState('SETUP')} /> : <LandingPage onCreateQuiz={() => setAppState('SETUP')} />;
      case 'SETUP':
        return <QuizSetup onQuizGenerated={handleQuizGenerated} setGenerating={setGenerating} setChildName={setChildName} />;
      case 'GENERATING':
        return <GeneratingView childName={childName} />;
      case 'QUIZ':
        return <Quiz questions={quizQuestions} onQuizComplete={handleQuizComplete} />;
      case 'SUMMARY':
        return (
          <div className="flex flex-col gap-4">
             <QuizSummary score={finalScore} totalQuestions={quizQuestions.length} onPlayAgain={handlePlayAgain} />
             
             {/* Save Button for Summary View */}
             <div className="w-full max-w-lg mx-auto text-center animate-fade-in">
               {!sharedQuizId && (
                 <button 
                  onClick={handleSaveQuiz}
                  className="bg-brand-secondary text-brand-dark font-black px-6 py-3 rounded-2xl border-4 border-black dark:border-white shadow-pop hover:shadow-pop-hover active:translate-y-1 transition-all"
                 >
                   {user ? "💾 Save to My Dashboard" : "💾 Sign In to Save Quiz"}
                 </button>
               )}
             </div>
          </div>
        );
      case 'SHARED_QUIZ':
        return sharedQuizId ? <SharedQuizView quizId={sharedQuizId} onHomeClick={() => {
            window.history.pushState({}, '', window.location.pathname); // Clear URL params
            setSharedQuizId(null);
            setAppState('LANDING');
        }} /> : <div>Loading...</div>;
      default:
        return <div>Something went wrong.</div>;
    }
  };

  // Hide main header for shared view to make it "Standalone"
  const isSharedView = appState === 'SHARED_QUIZ';

  return (
    <div className="min-h-screen font-sans flex flex-col items-center justify-start p-4 transition-colors duration-300 bg-[#83e1ff] dark:bg-gray-950 bg-[radial-gradient(#ffffff33_1px,#83e1ff_1px)] dark:bg-[radial-gradient(#ffffff15_1px,#030712_1px)] bg-[size:20px_20px]">
      
      {/* Global Navigation */}
      <MenuDropdown 
        user={user}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        onLoginClick={() => setIsAuthModalOpen(true)}
        onLogoutClick={handleLogout}
        onDashboardClick={() => setAppState('DASHBOARD')}
        onHomeClick={() => setAppState('LANDING')}
      />

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onLoginSuccess={handleLoginSuccess} 
      />

      {!isSharedView && (
        <header className="text-center my-8 animate-bounce-slight relative z-10">
          <h1 className="text-6xl md:text-7xl font-extrabold text-white drop-shadow-[4px_4px_0_rgba(0,0,0,1)] dark:drop-shadow-[4px_4px_0_rgba(255,255,255,0.2)] tracking-wide cursor-pointer" onClick={() => setAppState('LANDING')}>
            <span className="text-[#FF477E] stroke-black">Tiny</span>
            <span className="text-[#3A86FF] stroke-black">Trivia</span>
          </h1>
          <p className="text-brand-dark dark:text-gray-900 font-bold text-xl mt-2 bg-white/50 dark:bg-white/80 inline-block px-4 py-1 rounded-full border-2 border-brand-dark shadow-sm">Big Fun for Bright Minds</p>
        </header>
      )}

      <main className="w-full max-w-4xl relative z-10 flex-grow">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
