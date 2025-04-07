import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

/**
 * A hook for executing React code in a safe environment
 * using Function constructor to create isolated scope.
 * This is for educational purposes and provides a simplified 
 * code execution environment for the tutorial examples.
 */
export function useCodeExecution() {
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const executeCode = useCallback((code: string) => {
    try {
      // First clear any previous result
      setResult(null);

      // Extract JSX from the code 
      // We're assuming most examples return a component at the end
      // This is a simplified approach for educational purposes
      const React = require('react');
      
      // Create a sandbox environment for evaluation
      // This is simplified and would need more work for production
      // with proper sandboxing and security measures
      const sandboxedEval = new Function('React', `
        ${code}
        try {
          // We try to get the default export as our component
          if (typeof App !== 'undefined') {
            return React.createElement(App);
          }
          return "No App component found in the code example.";
        } catch (error) {
          throw new Error(error);
        }
      `);

      // Execute the code
      const output = sandboxedEval(React);
      setResult(output);
    } catch (error) {
      console.error('Code execution error:', error);
      setResult("Error executing code: " + (error as Error).message);
      
      toast({
        title: "Code Execution Failed",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  }, [toast]);

  return { executeCode, result };
}
