
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface QuizSetupData {
  childName: string;
  childAge: number;
  interests: string[];
  topics: string[];
  customTopics: string[];
  customSubjects: string[];
  questionCount: number;
  language: string;
  quizTitle: string; 
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface SavedQuiz {
  id: string;
  userId: string;
  title: string;
  childName: string;
  questions: QuizQuestion[];
  createdAt: number;
  score?: number; // Last played score
}

export type AppState = 'LANDING' | 'DASHBOARD' | 'SETUP' | 'GENERATING' | 'QUIZ' | 'SUMMARY' | 'SHARED_QUIZ';
