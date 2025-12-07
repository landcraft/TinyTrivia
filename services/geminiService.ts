
import { GoogleGenAI, Type } from '@google/genai';
import type { QuizSetupData, QuizQuestion } from '../types';
import { getEnv } from '../utils/env';

const apiKey = getEnv('API_KEY');

if (!apiKey) {
  console.warn("API_KEY environment variable not set. Quiz generation will fail.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key-to-prevent-crash-on-load' });

export async function generateQuiz(setupData: QuizSetupData): Promise<QuizQuestion[]> {
  const { childName, childAge, interests, topics, customTopics, customSubjects, questionCount, language } = setupData;

  const prompt = `
    You are an expert in creating fun, educational, and age-appropriate quizzes for children.
    Your task is to generate a quiz based on the following specifications. 
    
    **Child's Profile:**
    - Name: ${childName}
    - Age: ${childAge}
    - Language/Locale: ${language}

    **Interests & Personalization:**
    The child enjoys: ${interests.join(', ')}.
    ${customTopics.length > 0 ? `Additionally, you MUST incorporate these specific custom topics provided by the parent: ${customTopics.join(', ')}.` : ''}

    **Learning Topics:**
    The quiz must cover: ${topics.join(', ')}.
    ${customSubjects && customSubjects.length > 0 ? `Additionally, include these specific learning subjects/areas: ${customSubjects.join(', ')}.` : ''}

    **Difficulty & Tone:**
    - The quiz should be engaging and positive.
    - **CRITICAL**: The difficulty must be CHALLENGING for a ${childAge}-year-old. Do not make it too easy or boring. 
    - If the child is older (e.g., 8-12), ensure the questions require actual thought, calculation, or knowledge (e.g., multi-step math, specific science facts).
    - If the child is younger (e.g., 3-6), focus on recognition and simple logic, but still ensure it requires them to think.
    - Weave the child's name (${childName}) and interests (${interests.join(', ')}) into the questions to make them personal.

    **Language Requirement:**
    - The user's system locale is "${language}".
    - You MUST generate the questions, options, and any specific text in the language that corresponds to this locale.
    - If the locale is different from English, translate the context of the interests/topics (which might be provided in English) into the target language for the quiz content.

    **Quiz Format:**
    - Number of questions: ${questionCount}
    - Each question must be multiple-choice with 4 distinct options.
    - Please generate the quiz and return it as a JSON object that matches the provided schema.
  `;

  const quizSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        question: {
          type: Type.STRING,
          description: "The question text, personalized for the child and in the specified language.",
        },
        options: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "An array of 4 possible string answers in the specified language.",
        },
        correctAnswerIndex: {
          type: Type.INTEGER,
          description: "The 0-based index of the correct answer in the options array.",
        },
      },
      required: ["question", "options", "correctAnswerIndex"],
    },
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: quizSchema,
      },
    });

    const jsonText = response.text.trim();
    const quizData = JSON.parse(jsonText) as QuizQuestion[];

    // Basic validation
    if (!Array.isArray(quizData) || quizData.length === 0) {
      throw new Error('AI returned invalid quiz data format.');
    }

    return quizData;
  } catch (error) {
    console.error("Error generating quiz with Gemini:", error);
    throw new Error("Failed to generate the quiz. Please try again.");
  }
}
