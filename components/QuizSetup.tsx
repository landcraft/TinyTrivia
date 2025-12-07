
import React, { useState, useMemo } from 'react';
import { MAX_QUESTIONS, TOPICS, INTERESTS, SUPPORTED_LANGUAGES } from '../constants';
import type { QuizQuestion, QuizSetupData } from '../types';
import { generateQuiz } from '../services/geminiService';
import { CheckIcon } from './icons/CheckIcon';
import { XIcon } from './icons/XIcon';

interface QuizSetupProps {
  onQuizGenerated: (quiz: QuizQuestion[], data: QuizSetupData) => void;
  setGenerating: (isGenerating: boolean) => void;
  setChildName: (name: string) => void;
}

type Step = 'details' | 'interests' | 'custom-interests' | 'topics' | 'finalize';

// Helper component with fixed layout
const InterestCard: React.FC<{ interest: { id: string; name: string; emoji: string; }; onSwipe: (liked: boolean) => void; }> = ({ interest, onSwipe }) => {
  return (
    <div className="w-full max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-3xl border-4 border-black dark:border-white shadow-pop flex flex-col items-center justify-between p-8 text-center animate-pop-in h-[450px] transition-colors duration-300">
      <div className="flex-1 flex flex-col items-center justify-center">
         <span className="text-9xl mb-6 filter drop-shadow-lg transform hover:scale-110 transition-transform cursor-pointer">{interest.emoji}</span>
         <h3 className="text-4xl font-extrabold text-brand-dark dark:text-white tracking-tight">{interest.name}</h3>
      </div>
      
      <div className="flex justify-center w-full gap-8 mt-6">
        <button 
          onClick={() => onSwipe(false)} 
          className="group w-20 h-20 rounded-full bg-white dark:bg-gray-700 border-4 border-black dark:border-white text-red-500 flex items-center justify-center shadow-pop hover:shadow-pop-hover active:shadow-pop-active active:translate-y-1 transition-all"
          aria-label="No"
        >
          <XIcon className="w-10 h-10 stroke-[3px] group-hover:scale-110 transition-transform" />
        </button>
        <button 
          onClick={() => onSwipe(true)} 
          className="group w-20 h-20 rounded-full bg-brand-secondary border-4 border-black dark:border-white text-brand-dark flex items-center justify-center shadow-pop hover:shadow-pop-hover active:shadow-pop-active active:translate-y-1 transition-all"
          aria-label="Yes"
        >
          <CheckIcon className="w-10 h-10 stroke-[3px] group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
};


export const QuizSetup: React.FC<QuizSetupProps> = ({ onQuizGenerated, setGenerating, setChildName }) => {
  const [step, setStep] = useState<Step>('details');
  const [localChildName, setLocalChildName] = useState('');
  const [childAge, setChildAge] = useState(5);
  const [language, setLanguage] = useState(navigator.language || 'en-US'); 
  
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [currentInterestIndex, setCurrentInterestIndex] = useState(0);
  
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  
  // Custom Interests (Personalization)
  const [customInterestInput, setCustomInterestInput] = useState('');
  const [customInterests, setCustomInterests] = useState<string[]>([]);

  // Custom Subjects (Learning)
  const [customSubjectInput, setCustomSubjectInput] = useState('');
  const [customSubjects, setCustomSubjects] = useState<string[]>([]);

  const [questionCount, setQuestionCount] = useState(10);
  const [quizTitle, setQuizTitle] = useState('');
  
  const [error, setError] = useState<string | null>(null);

  // Filter interests based on age
  const visibleInterests = useMemo(() => {
    return INTERESTS.filter(i => {
      const minOK = i.minAge === undefined || childAge >= i.minAge;
      const maxOK = i.maxAge === undefined || childAge <= i.maxAge;
      return minOK && maxOK;
    });
  }, [childAge]);

  const handleInterestSwipe = (liked: boolean) => {
    if (liked) {
      setSelectedInterests(prev => [...prev, visibleInterests[currentInterestIndex].name]);
    }
    if (currentInterestIndex < visibleInterests.length - 1) {
      setCurrentInterestIndex(currentInterestIndex + 1);
    } else {
      setStep('custom-interests');
    }
  };

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev =>
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };

  const addCustomInterest = () => {
    if (customInterestInput.trim() && customInterests.length < 5) {
      setCustomInterests([...customInterests, customInterestInput.trim()]);
      setCustomInterestInput('');
    }
  };

  const removeCustomInterest = (item: string) => {
    setCustomInterests(customInterests.filter(t => t !== item));
  };

  const addCustomSubject = () => {
    if (customSubjectInput.trim() && customSubjects.length < 5) {
      setCustomSubjects([...customSubjects, customSubjectInput.trim()]);
      setCustomSubjectInput('');
    }
  };

  const removeCustomSubject = (item: string) => {
    setCustomSubjects(customSubjects.filter(t => t !== item));
  };

  const handleGenerateQuiz = async () => {
    if (!localChildName.trim()) {
      setError('Please enter your child\'s name.');
      setStep('details');
      return;
    }
    const finalQuizTitle = quizTitle.trim() || `${localChildName}'s Quiz`;

    setError(null);
    setChildName(localChildName); // Update parent state with name
    setGenerating(true);
    
    const setupData: QuizSetupData = {
        childName: localChildName,
        childAge,
        interests: selectedInterests,
        topics: selectedTopics,
        customTopics: customInterests,
        customSubjects: customSubjects,
        questionCount,
        language, 
        quizTitle: finalQuizTitle
    };

    try {
      const quizQuestions = await generateQuiz(setupData);
      onQuizGenerated(quizQuestions, setupData);
    } catch (e) {
      setError((e as Error).message);
      setGenerating(false);
    }
  };
  
  const progressPercentage = useMemo(() => {
    const steps: Step[] = ['details', 'interests', 'custom-interests', 'topics', 'finalize'];
    const currentStepIndex = steps.indexOf(step);
    return ((currentStepIndex + 1) / (steps.length + 1)) * 100;
  }, [step]);


  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
        <div className="bg-white dark:bg-gray-800 rounded-[32px] border-4 border-black dark:border-white shadow-pop overflow-hidden transition-colors duration-300">
            <div className="w-full bg-brand-light dark:bg-gray-700 border-b-4 border-black dark:border-white h-6">
                <div className="bg-brand-secondary h-full" style={{ width: `${progressPercentage}%`, transition: 'width 0.5s ease-in-out' }}></div>
            </div>

            <div className="p-6 md:p-10">
                {error && (
                  <div className="bg-red-100 dark:bg-red-900 border-4 border-red-500 text-red-700 dark:text-red-200 p-4 mb-6 rounded-2xl animate-pop-in shadow-sm font-bold flex items-center gap-2" role="alert">
                    <XIcon className="w-6 h-6" />
                    <p>{error}</p>
                  </div>
                )}

                {step === 'details' && (
                <div className="animate-slide-in-up flex flex-col gap-6">
                    <div className="text-center">
                        <h2 className="text-4xl font-black text-brand-dark dark:text-white mb-2">Let's Get Started!</h2>
                        <p className="text-xl text-gray-500 dark:text-gray-400 font-medium">Tell us about the lucky kid.</p>
                    </div>
                    
                    <div className="space-y-6 bg-brand-light dark:bg-gray-700 p-6 rounded-3xl border-2 border-gray-200 dark:border-gray-600">
                        <div>
                            <label htmlFor="childName" className="block text-xl font-bold text-brand-dark dark:text-white mb-2">Child's Name</label>
                            <input 
                                type="text" 
                                id="childName" 
                                value={localChildName} 
                                onChange={e => setLocalChildName(e.target.value)} 
                                className="w-full px-4 py-4 border-4 border-black dark:border-white dark:bg-gray-800 dark:text-white rounded-xl text-xl font-medium focus:ring-0 focus:border-brand-primary outline-none shadow-sm transition-all placeholder-gray-400" 
                                placeholder="e.g., Alex"
                            />
                        </div>
                        <div>
                            <label htmlFor="childAge" className="block text-xl font-bold text-brand-dark dark:text-white mb-2">Child's Age: <span className="text-3xl text-brand-primary ml-2">{childAge}</span></label>
                            <input 
                                type="range" 
                                id="childAge" 
                                min="3" 
                                max="12" 
                                value={childAge} 
                                onChange={e => {
                                  setChildAge(parseInt(e.target.value));
                                  setCurrentInterestIndex(0); // Reset interests if age changes
                                  setSelectedInterests([]); 
                                }} 
                                className="w-full h-6 bg-gray-200 dark:bg-gray-600 rounded-full appearance-none cursor-pointer accent-brand-primary border-2 border-black dark:border-white"
                            />
                            <div className="flex justify-between text-gray-500 dark:text-gray-400 font-bold mt-2 px-1">
                                <span>3</span>
                                <span>12</span>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="language" className="block text-xl font-bold text-brand-dark dark:text-white mb-2">Quiz Language</label>
                            <div className="relative">
                              <select 
                                  id="language"
                                  value={language}
                                  onChange={(e) => setLanguage(e.target.value)}
                                  className="w-full px-4 py-4 border-4 border-black dark:border-white dark:bg-gray-800 dark:text-white rounded-xl text-xl font-medium focus:ring-0 focus:border-brand-primary outline-none shadow-sm transition-all appearance-none cursor-pointer"
                              >
                                  {SUPPORTED_LANGUAGES.map((lang) => (
                                      <option key={lang.code} value={lang.code}>{lang.name}</option>
                                  ))}
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brand-dark dark:text-white">
                                <svg className="fill-current h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                              </div>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => { if(localChildName.trim()){ setStep('interests'); setError(null)} else {setError("Child's name can't be empty!")} }} 
                        className="w-full mt-4 bg-brand-primary text-white border-4 border-black dark:border-white font-black py-4 px-6 rounded-2xl text-2xl shadow-pop hover:shadow-pop-hover active:shadow-pop-active active:translate-y-1 transition-all"
                    >
                        Next: Interests ➜
                    </button>
                </div>
                )}

                {step === 'interests' && (
                <div className="animate-slide-in-up">
                    <div className="text-center mb-6">
                        <h2 className="text-4xl font-black text-brand-dark dark:text-white mb-2">Does {localChildName} like...</h2>
                        <p className="text-xl text-gray-500 dark:text-gray-400 font-medium">Swipe or click to choose!</p>
                    </div>
                    {visibleInterests.length > 0 && currentInterestIndex < visibleInterests.length ? (
                      <InterestCard interest={visibleInterests[currentInterestIndex]} onSwipe={handleInterestSwipe} />
                    ) : (
                      // Fallback if no interests match (unlikely) or finished
                      <div className="text-center p-10">
                        <p className="text-2xl font-bold mb-4 dark:text-white">All done with generic interests!</p>
                        <button onClick={() => setStep('custom-interests')} className="bg-brand-primary text-white border-4 border-black dark:border-white font-black py-4 px-6 rounded-2xl text-xl shadow-pop">Continue</button>
                      </div>
                    )}
                </div>
                )}

                {step === 'custom-interests' && (
                  <div className="animate-slide-in-up flex flex-col gap-6">
                    <div className="text-center">
                        <h2 className="text-4xl font-black text-brand-dark dark:text-white mb-2">Anything Else?</h2>
                        <p className="text-xl text-gray-500 dark:text-gray-400 font-medium">Add up to 5 special words, characters, or hobbies!</p>
                    </div>

                    <div className="bg-brand-light dark:bg-gray-700 p-6 rounded-3xl border-2 border-gray-200 dark:border-gray-600">
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={customInterestInput}
                          onChange={(e) => setCustomInterestInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && addCustomInterest()}
                          placeholder="e.g. Bluey, Piano, Spiderman..."
                          className="flex-1 px-4 py-4 border-4 border-black dark:border-white dark:bg-gray-800 dark:text-white rounded-xl text-xl font-medium focus:ring-0 focus:border-brand-primary outline-none shadow-sm transition-all placeholder-gray-400"
                          disabled={customInterests.length >= 5}
                        />
                        <button 
                          onClick={addCustomInterest}
                          disabled={!customInterestInput.trim() || customInterests.length >= 5}
                          className="bg-brand-secondary text-brand-dark border-4 border-black dark:border-white font-black px-6 rounded-xl text-xl shadow-sm hover:shadow-pop disabled:opacity-50 disabled:shadow-none transition-all"
                        >
                          Add
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-bold text-right">{customInterests.length}/5</p>

                      <div className="flex flex-wrap gap-3 mt-4">
                        {customInterests.map((item, idx) => (
                          <div key={idx} className="bg-white dark:bg-gray-800 border-4 border-black dark:border-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm animate-pop-in">
                            <span className="font-bold text-brand-dark dark:text-white">{item}</span>
                            <button onClick={() => removeCustomInterest(item)} className="text-red-500 hover:text-red-700 bg-gray-100 dark:bg-gray-700 rounded-full p-1">
                              <XIcon className="w-4 h-4 stroke-[3]" />
                            </button>
                          </div>
                        ))}
                         {customInterests.length === 0 && (
                           <div className="w-full text-center py-4 text-gray-400 dark:text-gray-500 italic font-medium">No custom interests added yet.</div>
                         )}
                      </div>
                    </div>

                    <button 
                        onClick={() => setStep('topics')} 
                        className="w-full mt-4 bg-brand-primary text-white border-4 border-black dark:border-white font-black py-4 px-6 rounded-2xl text-2xl shadow-pop hover:shadow-pop-hover active:shadow-pop-active active:translate-y-1 transition-all"
                    >
                        Next: Topics ➜
                    </button>
                  </div>
                )}

                {step === 'topics' && (
                <div className="animate-slide-in-up">
                    <div className="text-center mb-8">
                        <h2 className="text-4xl font-black text-brand-dark dark:text-white mb-2">Learning Time!</h2>
                        <p className="text-xl text-gray-500 dark:text-gray-400 font-medium">Pick the subjects for the quiz.</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                    {TOPICS.map(topic => (
                        <button 
                            key={topic} 
                            onClick={() => toggleTopic(topic)} 
                            className={`p-4 rounded-2xl text-lg font-bold border-4 border-black dark:border-white transition-all shadow-sm ${selectedTopics.includes(topic) ? 'bg-brand-accent text-white shadow-pop translate-x-[-2px] translate-y-[-2px]' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                        >
                        {topic}
                        {selectedTopics.includes(topic) && <span className="ml-2 inline-block">✨</span>}
                        </button>
                    ))}
                    </div>

                    {/* Custom Subjects Section */}
                    <div className="bg-brand-light dark:bg-gray-700 p-5 rounded-2xl border-2 border-gray-200 dark:border-gray-600 mb-6">
                        <h3 className="text-lg font-bold text-brand-dark dark:text-white mb-3">Add Custom Subject (Optional)</h3>
                         <div className="flex gap-2">
                            <input 
                            type="text" 
                            value={customSubjectInput}
                            onChange={(e) => setCustomSubjectInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addCustomSubject()}
                            placeholder="e.g. French, Fractions..."
                            className="flex-1 px-4 py-3 border-4 border-black dark:border-white dark:bg-gray-800 dark:text-white rounded-xl text-lg font-medium focus:ring-0 focus:border-brand-primary outline-none shadow-sm transition-all placeholder-gray-400"
                            disabled={customSubjects.length >= 5}
                            />
                            <button 
                            onClick={addCustomSubject}
                            disabled={!customSubjectInput.trim() || customSubjects.length >= 5}
                            className="bg-brand-secondary text-brand-dark border-4 border-black dark:border-white font-black px-4 rounded-xl text-lg shadow-sm hover:shadow-pop disabled:opacity-50 disabled:shadow-none transition-all"
                            >
                            Add
                            </button>
                        </div>
                        
                         <div className="flex flex-wrap gap-2 mt-3">
                            {customSubjects.map((item, idx) => (
                            <div key={idx} className="bg-white dark:bg-gray-800 border-2 border-black dark:border-white px-3 py-1 rounded-lg flex items-center gap-2 shadow-sm animate-pop-in">
                                <span className="font-bold text-brand-dark dark:text-white text-sm">{item}</span>
                                <button onClick={() => removeCustomSubject(item)} className="text-red-500 hover:text-red-700">
                                <XIcon className="w-3 h-3 stroke-[3]" />
                                </button>
                            </div>
                            ))}
                        </div>
                    </div>


                     <button 
                        onClick={() => { if(selectedTopics.length > 0 || customSubjects.length > 0) {setStep('finalize'); setError(null)} else {setError('Please choose at least one topic or add a custom subject.')} }} 
                        className="w-full bg-brand-primary text-white border-4 border-black dark:border-white font-black py-4 px-6 rounded-2xl text-2xl shadow-pop hover:shadow-pop-hover active:shadow-pop-active active:translate-y-1 transition-all"
                    >
                        Next: Final Details ➜
                    </button>
                </div>
                )}


                {step === 'finalize' && (
                <div className="animate-slide-in-up flex flex-col gap-6">
                    <div className="text-center">
                        <h2 className="text-4xl font-black text-brand-dark dark:text-white mb-2">Almost Done!</h2>
                        <p className="text-xl text-gray-500 dark:text-gray-400 font-medium">Just one last thing.</p>
                    </div>

                    <div className="bg-brand-light dark:bg-gray-700 p-8 rounded-3xl border-2 border-gray-200 dark:border-gray-600 space-y-6">
                        <div>
                           <label htmlFor="quizTitle" className="block text-xl font-bold text-brand-dark dark:text-white mb-2">Name this Quiz <span className="text-sm text-gray-500 font-normal">(Optional)</span></label>
                            <input 
                                type="text" 
                                id="quizTitle" 
                                value={quizTitle} 
                                onChange={e => setQuizTitle(e.target.value)} 
                                className="w-full px-4 py-4 border-4 border-black dark:border-white dark:bg-gray-800 dark:text-white rounded-xl text-xl font-medium focus:ring-0 focus:border-brand-primary outline-none shadow-sm transition-all placeholder-gray-400" 
                                placeholder={`${localChildName}'s Awesome Quiz`}
                            />
                        </div>

                        <div>
                          <label htmlFor="questionCount" className="block text-xl font-bold text-brand-dark dark:text-white mb-4">Number of Questions: <span className="text-4xl text-brand-secondary ml-2">{questionCount}</span></label>
                          <input 
                              type="range" 
                              id="questionCount" 
                              min="5" 
                              max={MAX_QUESTIONS} 
                              value={questionCount} 
                              onChange={e => setQuestionCount(parseInt(e.target.value))} 
                              className="w-full h-6 bg-gray-200 dark:bg-gray-600 rounded-full appearance-none cursor-pointer accent-brand-secondary border-2 border-black dark:border-white"
                          />
                          <div className="flex justify-between text-gray-500 dark:text-gray-400 font-bold mt-2 px-1">
                              <span>5</span>
                              <span>{MAX_QUESTIONS}</span>
                          </div>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleGenerateQuiz} 
                        className="w-full mt-4 bg-brand-secondary text-brand-dark border-4 border-black dark:border-white font-black py-5 px-6 rounded-2xl text-2xl shadow-pop hover:shadow-pop-hover active:shadow-pop-active active:translate-y-1 transition-all flex items-center justify-center gap-3"
                    >
                        ✨ Create My Quiz! ✨
                    </button>
                </div>
                )}
            </div>
        </div>
    </div>
  );
};
