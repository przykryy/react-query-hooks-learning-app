export type HookType = 
  | 'useState'
  | 'useEffect'
  | 'useMemo'
  | 'useCallback'
  | 'useRef'
  | 'useReducer'
  | 'useContext';

export type QueryType = 
  | 'basics'
  | 'useQuery'
  | 'useMutation'
  | 'caching'
  | 'refetching';

export type ModuleType = HookType | QueryType;

export interface CodeTab {
  id: string;
  title: string;
  code: string;
}

export interface CodeExample {
  id: string;
  title: string;
  description: string;
  tabs: CodeTab[];
  defaultTabId: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
}

export interface Module {
  id: ModuleType;
  title: string;
  description: string;
  category: 'hooks' | 'query';
  moduleOrder: number;
  codeExamples: CodeExample[];
  quiz: Quiz;
}

export interface UserProgressData {
  moduleId: string;
  completed: boolean;
  quizScore: number | null;
}

export interface ModuleProgress {
  total: number;
  completed: number;
  percentage: number;
}
