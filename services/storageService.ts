
import { SavedQuiz, User, QuizQuestion } from '../types';
import { supabase } from '../supabaseClient';

export const storageService = {
  // --- Auth Management ---

  // Get the current session user
  getCurrentUser: async (): Promise<User | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      return {
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User'
      };
    }
    return null;
  },

  // Listen for auth state changes
  onAuthStateChange: (callback: (user: User | null) => void) => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        callback({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User'
        });
      } else {
        callback(null);
      }
    });
    return subscription;
  },

  signIn: async (email: string, password: string): Promise<{ user: User | null; error: string | null }> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { user: null, error: error.message };
    
    if (data.user) {
      return {
        user: {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.email?.split('@')[0] || 'User'
        },
        error: null
      };
    }
    return { user: null, error: 'Unknown error' };
  },

  signUp: async (email: string, password: string): Promise<{ user: User | null; error: string | null }> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) return { user: null, error: error.message };

    if (data.user) {
       return {
        user: {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.email?.split('@')[0] || 'User'
        },
        error: null
      };
    }
    return { user: null, error: 'Unknown error' };
  },

  signOut: async () => {
    await supabase.auth.signOut();
  },

  // --- Quiz Management ---

  saveQuiz: async (quiz: Omit<SavedQuiz, 'id' | 'createdAt'>): Promise<{ data: SavedQuiz | null; error: string | null }> => {
    const { data, error } = await supabase
      .from('quizzes')
      .insert([
        {
          user_id: quiz.userId,
          title: quiz.title,
          child_name: quiz.childName,
          questions: quiz.questions
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error saving quiz:', error);
      return { data: null, error: error.message };
    }

    // Map DB response to frontend type
    const savedQuiz: SavedQuiz = {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      childName: data.child_name,
      questions: data.questions,
      createdAt: new Date(data.created_at).getTime()
    };

    return { data: savedQuiz, error: null };
  },

  getQuizzesByUser: async (userId: string): Promise<SavedQuiz[]> => {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching quizzes:', error);
      return [];
    }

    return data.map((q: any) => ({
      id: q.id,
      userId: q.user_id,
      title: q.title,
      childName: q.child_name,
      questions: q.questions,
      createdAt: new Date(q.created_at).getTime()
    }));
  },

  getQuizById: async (quizId: string): Promise<SavedQuiz | null> => {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', quizId)
      .single();

    if (error) {
      console.error('Error fetching quiz by ID:', error);
      return null;
    }

    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      childName: data.child_name,
      questions: data.questions,
      createdAt: new Date(data.created_at).getTime()
    };
  }
};
