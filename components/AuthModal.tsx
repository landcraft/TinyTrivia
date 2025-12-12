
import React, { useState } from 'react';
import { XIcon } from './icons/XIcon';
import { GoogleIcon } from './icons/GoogleIcon';
import { storageService } from '../services/storageService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        const { user, error } = await storageService.signIn(email, password);
        if (error) throw new Error(error);
        if (user) {
            onLoginSuccess(user);
            onClose();
        }
      } else {
        const { user, error } = await storageService.signUp(email, password);
        if (error) throw new Error(error);
        if (user) {
            onLoginSuccess(user);
            onClose();
        } else {
            // Usually check email confirmation here, but for this app assuming auto-confirm or login required
            setError("Account created! Please sign in.");
            setIsLogin(true); 
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    const { error } = await storageService.signInWithGoogle();
    if (error) {
        setError(error);
        setLoading(false);
    }
    // If successful, supabase redirects the page, so no need to stop loading or close modal manually here
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-[32px] border-4 border-black dark:border-white shadow-pop p-8 relative animate-pop-in">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
          <XIcon className="w-6 h-6 text-black dark:text-white" />
        </button>
        
        <h2 className="text-3xl font-black text-brand-dark dark:text-white mb-2">
            {isLogin ? "Welcome Back!" : "Join the Club! 🚀"}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 font-bold mb-6">
            {isLogin ? "Sign in to access your quizzes." : "Save quizzes and share them with friends."}
        </p>

        {error && (
            <div className="bg-red-100 border-2 border-red-500 text-red-700 p-3 rounded-xl mb-4 font-bold text-sm">
                {error}
            </div>
        )}

        <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white dark:bg-gray-700 text-gray-700 dark:text-white border-4 border-black dark:border-white font-bold py-3 rounded-2xl text-xl shadow-sm hover:shadow-pop active:shadow-pop-active active:translate-y-1 transition-all flex items-center justify-center gap-3 mb-6 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed"
        >
            <GoogleIcon className="w-6 h-6" />
            <span>{loading ? "Redirecting..." : "Sign in with Google"}</span>
        </button>

        <div className="flex items-center gap-4 mb-6">
            <div className="h-0.5 bg-gray-200 dark:bg-gray-600 flex-1"></div>
            <span className="text-gray-400 font-bold text-sm">OR</span>
            <div className="h-0.5 bg-gray-200 dark:bg-gray-600 flex-1"></div>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="block text-lg font-bold text-brand-dark dark:text-white mb-2">Email Address</label>
          <input 
            type="email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border-4 border-black dark:border-white dark:bg-gray-700 dark:text-white rounded-xl text-lg font-medium focus:ring-0 focus:border-brand-primary outline-none shadow-sm mb-4 placeholder-gray-400"
            placeholder="parent@example.com"
          />

          <label className="block text-lg font-bold text-brand-dark dark:text-white mb-2">Password</label>
          <input 
            type="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border-4 border-black dark:border-white dark:bg-gray-700 dark:text-white rounded-xl text-lg font-medium focus:ring-0 focus:border-brand-primary outline-none shadow-sm mb-6 placeholder-gray-400"
            placeholder="••••••••"
            minLength={6}
          />
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-primary text-white border-4 border-black dark:border-white font-black py-3 rounded-2xl text-xl shadow-pop hover:shadow-pop-hover active:shadow-pop-active active:translate-y-1 transition-all disabled:opacity-50"
          >
            {loading ? "Please wait..." : (isLogin ? "Sign In" : "Sign Up")}
          </button>
        </form>

        <div className="mt-4 text-center">
            <button 
                onClick={() => { setIsLogin(!isLogin); setError(null); }}
                className="text-brand-accent font-bold underline hover:text-brand-dark dark:hover:text-white"
            >
                {isLogin ? "Need an account? Sign Up" : "Already have an account? Sign In"}
            </button>
        </div>
      </div>
    </div>
  );
};
