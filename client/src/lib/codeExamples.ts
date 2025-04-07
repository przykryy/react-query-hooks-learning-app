import { HookType, Module, QueryType } from "@/types";
import { tutorials } from "./tutorials";

// This file provides utility functions to fetch example code modules for 
// both React Hooks and TanStack Query tutorials

// Hooks modules
const hooksModules: Record<HookType, Module> = {
  useState: {
    id: 'useState',
    title: 'useState Hook',
    description: 'The useState hook is the most basic hook in React, allowing you to add state to functional components.',
    category: 'hooks',
    moduleOrder: 1,
    codeExamples: [],
    quiz: {
      id: 'useState-quiz',
      title: 'useState Quiz',
      questions: []
    }
  },
  useEffect: {
    id: 'useEffect',
    title: 'useEffect Hook',
    description: 'The useEffect hook lets you perform side effects in function components, similar to lifecycle methods in class components.',
    category: 'hooks',
    moduleOrder: 2,
    codeExamples: [],
    quiz: {
      id: 'useEffect-quiz',
      title: 'useEffect Quiz',
      questions: []
    }
  },
  useMemo: {
    id: 'useMemo',
    title: 'useMemo Hook',
    description: 'The useMemo hook lets you cache expensive calculations so they are only recomputed when dependencies change.',
    category: 'hooks',
    moduleOrder: 3,
    codeExamples: [],
    quiz: {
      id: 'useMemo-quiz',
      title: 'useMemo Quiz',
      questions: []
    }
  },
  useCallback: {
    id: 'useCallback',
    title: 'useCallback Hook',
    description: 'The useCallback hook returns a memoized version of a callback function, preventing unnecessary renders of child components.',
    category: 'hooks',
    moduleOrder: 4,
    codeExamples: [],
    quiz: {
      id: 'useCallback-quiz',
      title: 'useCallback Quiz',
      questions: []
    }
  },
  useRef: {
    id: 'useRef',
    title: 'useRef Hook',
    description: 'The useRef hook gives you a way to access and maintain references to DOM elements or persisted values across renders.',
    category: 'hooks',
    moduleOrder: 5,
    codeExamples: [],
    quiz: {
      id: 'useRef-quiz',
      title: 'useRef Quiz',
      questions: []
    }
  },
  useReducer: {
    id: 'useReducer',
    title: 'useReducer Hook',
    description: 'The useReducer hook is an alternative to useState for complex state logic, using a reducer function to update state.',
    category: 'hooks',
    moduleOrder: 6,
    codeExamples: [],
    quiz: {
      id: 'useReducer-quiz',
      title: 'useReducer Quiz',
      questions: []
    }
  },
  useContext: {
    id: 'useContext',
    title: 'useContext Hook',
    description: 'The useContext hook provides a way to pass data through the component tree without manually passing props down at every level.',
    category: 'hooks',
    moduleOrder: 7,
    codeExamples: [],
    quiz: {
      id: 'useContext-quiz',
      title: 'useContext Quiz',
      questions: []
    }
  }
};

// TanStack Query modules
const queryModules: Record<QueryType, Module> = {
  basics: {
    id: 'basics',
    title: 'TanStack Query Basics',
    description: 'Introduction to TanStack Query and its core concepts for data fetching in React applications.',
    category: 'query',
    moduleOrder: 1,
    codeExamples: [],
    quiz: {
      id: 'query-basics-quiz',
      title: 'TanStack Query Basics Quiz',
      questions: []
    }
  },
  useQuery: {
    id: 'useQuery',
    title: 'useQuery Hook',
    description: 'Learn how to fetch, cache, and manage asynchronous data in your React applications with the useQuery hook.',
    category: 'query',
    moduleOrder: 2,
    codeExamples: [],
    quiz: {
      id: 'useQuery-quiz',
      title: 'useQuery Quiz',
      questions: []
    }
  },
  useMutation: {
    id: 'useMutation',
    title: 'useMutation Hook',
    description: 'Learn how to handle create, update, and delete operations with optimistic updates using useMutation.',
    category: 'query',
    moduleOrder: 3,
    codeExamples: [],
    quiz: {
      id: 'useMutation-quiz',
      title: 'useMutation Quiz',
      questions: []
    }
  },
  caching: {
    id: 'caching',
    title: 'Caching & Stale Data',
    description: 'Understanding advanced caching strategies and stale data management with TanStack Query.',
    category: 'query',
    moduleOrder: 4,
    codeExamples: [],
    quiz: {
      id: 'caching-quiz',
      title: 'Caching Quiz',
      questions: []
    }
  },
  refetching: {
    id: 'refetching',
    title: 'Refetching Strategies',
    description: 'Learn different ways to refetch data automatically and manually in TanStack Query.',
    category: 'query',
    moduleOrder: 5,
    codeExamples: [],
    quiz: {
      id: 'refetching-quiz',
      title: 'Refetching Quiz',
      questions: []
    }
  }
};

// Helper functions for Hooks modules
export function getHookModule(hookId: HookType): Module | null {
  return hooksModules[hookId] || null;
}

export function getPreviousHook(currentHookId: HookType): HookType | null {
  const currentOrder = hooksModules[currentHookId]?.moduleOrder;
  if (!currentOrder || currentOrder <= 1) return null;
  
  const previousHook = Object.values(hooksModules).find(
    module => module.moduleOrder === currentOrder - 1
  );
  
  return previousHook?.id as HookType || null;
}

export function getNextHook(currentHookId: HookType): HookType | null {
  const currentOrder = hooksModules[currentHookId]?.moduleOrder;
  if (!currentOrder) return null;
  
  const nextHook = Object.values(hooksModules).find(
    module => module.moduleOrder === currentOrder + 1
  );
  
  return nextHook?.id as HookType || null;
}

// Helper functions for Query modules
export function getQueryModule(queryId: QueryType): Module | null {
  return queryModules[queryId] || null;
}

export function getPreviousQuery(currentQueryId: QueryType): QueryType | null {
  const currentOrder = queryModules[currentQueryId]?.moduleOrder;
  if (!currentOrder || currentOrder <= 1) return null;
  
  const previousQuery = Object.values(queryModules).find(
    module => module.moduleOrder === currentOrder - 1
  );
  
  return previousQuery?.id as QueryType || null;
}

export function getNextQuery(currentQueryId: QueryType): QueryType | null {
  const currentOrder = queryModules[currentQueryId]?.moduleOrder;
  if (!currentOrder) return null;
  
  const nextQuery = Object.values(queryModules).find(
    module => module.moduleOrder === currentOrder + 1
  );
  
  return nextQuery?.id as QueryType || null;
}

// Function to get all hooks modules
export function getAllHookModules(): Module[] {
  return Object.values(hooksModules).sort((a, b) => a.moduleOrder - b.moduleOrder);
}

// Function to get all query modules
export function getAllQueryModules(): Module[] {
  return Object.values(queryModules).sort((a, b) => a.moduleOrder - b.moduleOrder);
}