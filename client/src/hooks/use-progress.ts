import { useCallback } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Structure for overall progress percentages
interface ProgressPercentages {
  reactHooksBasics: number;
  advancedHooks: number;
  tanstackQuery: number;
}

// Default progress state
const defaultProgress: ProgressPercentages = {
  reactHooksBasics: 0,
  advancedHooks: 0,
  tanstackQuery: 0
};

// For demo purposes, use a fixed user ID
const DEMO_USER_ID = 1;

export function useProgress() {
  const queryClient = useQueryClient();

  
  // Fetch current progress data
  const { data: progressData, isLoading } = useQuery({
    queryKey: [`/api/progress/${DEMO_USER_ID}`],
    throwOnError(error, query) {
      console.error('Error fetching progress data:', error);
      throw error;
    },
  });
  
  // Calculate progress percentages
  const calculateProgressPercentages = useCallback((progressItems: any[] = []): ProgressPercentages => {
    if (!progressItems || progressItems.length === 0) {
      return defaultProgress;
    }
    
    // Define which tutorials belong to which category
    const basicHooks = ['useState', 'useEffect', 'useContext', 'useRef'];
    const advancedHooks = ['useMemo', 'useCallback', 'useReducer', 'customHooks'];
    const tanstackTutorials = [
      'introduction', 'queryClientProvider', 'useQuery', 
      'useMutation', 'invalidation', 'caching', 'pagination'
    ];
    
    // Count completed tutorials in each category
    const completed = {
      basics: progressItems.filter(item => 
        basicHooks.includes(item.tutorialId) && item.completed
      ).length,
      advanced: progressItems.filter(item => 
        advancedHooks.includes(item.tutorialId) && item.completed
      ).length,
      tanstack: progressItems.filter(item => 
        tanstackTutorials.includes(item.tutorialId) && item.completed
      ).length
    };
    
    // Calculate percentages
    return {
      reactHooksBasics: Math.round((completed.basics / basicHooks.length) * 100),
      advancedHooks: Math.round((completed.advanced / advancedHooks.length) * 100),
      tanstackQuery: Math.round((completed.tanstack / tanstackTutorials.length) * 100)
    };
  }, []);
  
  // Current progress percentages
  const progress = calculateProgressPercentages(progressData as any[]);
  
  // Mark a tutorial as viewed
  const markTutorialViewedMutation = useMutation({
    mutationFn: async (tutorialId: string) => {
      try {
        return await apiRequest('POST', '/api/progress', {
          userId: DEMO_USER_ID,
          tutorialId,
          completed: true,
          quizCompleted: false,
          lastViewed: new Date().toISOString()
        });
      } catch (error) {
        console.error('Failed to update progress:', error);
        // Return a success response anyway to not block the UI
        return new Response(JSON.stringify({}), { status: 200 });
      }
    },
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: [`/api/progress/${DEMO_USER_ID}`] });
    }
  });
  
  // Update quiz progress
  const updateQuizProgressMutation = useMutation({
    mutationFn: async (data: { tutorialId: string, score: number, answers: Record<string, string> }) => {
      try {
        return await apiRequest('POST', '/api/quiz/attempt', {
          userId: DEMO_USER_ID,
          tutorialId: data.tutorialId,
          score: data.score,
          answers: data.answers,
          attemptedAt: new Date().toISOString()
        });
      } catch (error) {
        console.error('Failed to save quiz attempt:', error);
        // Return a success response anyway to not block the UI
        return new Response(JSON.stringify({}), { status: 200 });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/progress/${DEMO_USER_ID}`] });
    }
  });
  
  const markTutorialViewed = useCallback((tutorialId: string) => {
    markTutorialViewedMutation.mutate(tutorialId);
  }, []);
  
  const updateQuizProgress = useCallback((tutorialId: string, score: number, answers: Record<string, string>) => {
    updateQuizProgressMutation.mutate({ tutorialId, score, answers });
  }, []);
  
  return {
    progress,
    isLoading,
    markTutorialViewed,
    updateQuizProgress
  };
}
