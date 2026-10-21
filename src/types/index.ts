export type PracticeMode = 
  | 'lotto' 
  | 'sentence' 
  | 'verb' 
  | 'toto' 
  | 'group' 
  | 'quote' 
  | 'mock-exam' 
  | 'guide' 
  | 'mistakes';

export interface LottoItem {
  id: number;
  word: string;
  isError: boolean;
  correction?: string;
  ruleExplanation: string;
}

export interface LottoSet {
  id: string;
  title: string;
  description: string;
  items: LottoItem[]; // 15 words, exactly 5 erroneous
}

export interface SentenceTask {
  id: string;
  originalSentence: string;
  hasError: boolean;
  errorWord?: string;
  correctedWord?: string;
  fullCorrectedSentence: string;
  ruleCategory: string;
  ruleExplanation: string;
  hint: string;
}

export interface VerbGapItem {
  promptVerb: string;
  formRequired: string;
  correctAnswers: string[]; // e.g. ["játssza"]
  ruleExplanation: string;
}

export interface VerbTask {
  id: string;
  templateParts: string[]; // parts before, between, and after gaps
  gaps: VerbGapItem[];
  fullSentence: string;
  ruleCategory: string;
}

export type TotoChoice = '1' | '2' | 'x' | '0';

export interface TotoTask {
  id: string;
  word1: string;
  word2: string;
  correctAnswer: TotoChoice;
  explanation1: string;
  explanation2: string;
  summaryRule: string;
}

export interface GroupWordItem {
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface GroupTask {
  id: string;
  category: string;
  options: GroupWordItem[];
  ruleTip: string;
}

export interface QuoteTask {
  id: string;
  authorOrSource?: string;
  segments: {
    text: string; // before gap
    gapExpected: string; // the letters to fill, e.g. "i", "í", "lj", "tj", "s", "ő", "ssz"
    acceptedAlternatives?: string[];
    hint: string;
    explanation: string;
  }[];
  trailingText?: string;
  fullText: string;
}

export interface MistakeRecord {
  id: string;
  type: string;
  questionTitle: string;
  yourAnswer: string;
  correctAnswer: string;
  ruleExplanation: string;
  timestamp: number;
}

export interface UserStats {
  xp: number;
  streak: number;
  bestStreak: number;
  completedTasksCount: number;
  correctCount: number;
  totalAttempts: number;
  soundEnabled: boolean;
  mistakes: MistakeRecord[];
}
