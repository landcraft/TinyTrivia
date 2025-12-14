import React, { useState } from 'react';
import { XIcon } from './icons/XIcon';
import { getEnv } from '../utils/env';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, userEmail }) => {
  const [email, setEmail] = useState(userEmail || '');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'IDLE' | 'SENDING' | 'SUCCESS' | 'ERROR'>('IDLE');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('SENDING');

    const botToken = getEnv('VITE_TELEGRAM_BOT_TOKEN');
    const chatId = getEnv('VITE_TELEGRAM_CHAT_ID');

    if (!botToken || !chatId) {
        // Fallback if environment variables are not set
        setTimeout(() => {
            window.location.href = `mailto:help@tinytrivia.com?subject=Support Request&body=From: ${email}%0D%0A%0D%0A${message}`;
            setStatus('IDLE');
            onClose();
        }, 1000);
        return;
    }

    try {
      const text = `📩 *New Support Message*\n\n*From:* ${email}\n*Message:* ${message}`;
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'Markdown'
        })
      });

      if (response.ok) {
        setStatus('SUCCESS');
        setTimeout(() => {
            onClose();
            setStatus('IDLE');
            setMessage('');
        }, 2000);
      } else {
        throw new Error('Failed to send');
      }
    } catch (error) {
      console.error(error);
      setStatus('ERROR');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-[32px] border-4 border-black dark:border-white shadow-pop p-8 relative animate-pop-in">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
          <XIcon className="w-6 h-6 text-black dark:text-white" />
        </button>
        
        <h2 className="text-3xl font-black text-brand-dark dark:text-white mb-2">Contact Us</h2>
        <p className="text-gray-500 dark:text-gray-400 font-bold mb-6">We'd love to hear from you!</p>

        {status === 'SUCCESS' ? (
            <div className="bg-green-100 border-4 border-green-500 text-green-700 p-6 rounded-2xl text-center font-bold animate-pop-in">
                <p className="text-xl">Message Sent! 🚀</p>
                <p className="text-sm mt-2">We'll get back to you soon.</p>
            </div>
        ) : (
            <form onSubmit={handleSubmit}>
            <label className="block text-lg font-bold text-brand-dark dark:text-white mb-2">Your Email</label>
            <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-4 border-black dark:border-white dark:bg-gray-700 dark:text-white rounded-xl text-lg font-medium focus:ring-0 focus:border-brand-primary outline-none shadow-sm mb-4 placeholder-gray-400"
                placeholder="you@example.com"
            />

            <label className="block text-lg font-bold text-brand-dark dark:text-white mb-2">Message</label>
            <textarea 
                required 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border-4 border-black dark:border-white dark:bg-gray-700 dark:text-white rounded-xl text-lg font-medium focus:ring-0 focus:border-brand-primary outline-none shadow-sm mb-6 placeholder-gray-400 resize-none"
                placeholder="What's on your mind?"
            />
            
            <button 
                type="submit" 
                disabled={status === 'SENDING'}
                className="w-full bg-brand-accent text-white border-4 border-black dark:border-white font-black py-3 rounded-2xl text-xl shadow-pop hover:shadow-pop-hover active:shadow-pop-active active:translate-y-1 transition-all disabled:opacity-50"
            >
                {status === 'SENDING' ? "Sending..." : "Send Message"}
            </button>
            {status === 'ERROR' && <p className="text-red-500 font-bold text-center mt-2">Oops! Something went wrong. Try again.</p>}
            </form>
        )}
      </div>
    </div>
  );
};