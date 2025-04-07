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
      
      // Add shared mock data for all examples
      const mockData = `
        // Define global mock data used by various examples
        
        // Sample products data for shopping cart and useMemo examples
        const product = { id: 1, name: 'React Hoodie', price: 45.99 };
        const cartItem = { id: 1, name: 'React Hoodie', price: 45.99 };
        const cartTotal = 45.99;
        
        // Generate a products array for all examples that need it
        const generateProducts = () => {
          return [
            { id: 1, name: 'React Hoodie', price: 45.99 },
            { id: 2, name: 'JavaScript Mug', price: 12.99 },
            { id: 3, name: 'TypeScript Hat', price: 22.50 }
          ];
        };
        
        // Define or overwrite products in the current scope
        const products = generateProducts();
        
        // Helper function to generate product list for useMemo examples
        const generateProductList = (count) => {
          return Array.from({ length: count }, (_, i) => ({
            id: i,
            name: \`Product \${i + 1}\`,
            price: Math.round((Math.random() * 100 + 1) * 100) / 100
          }));
        };
        
        // Mock tasks for useReducer examples
        const initialTasks = [
          { id: 1, text: 'Learn React Hooks', completed: true },
          { id: 2, text: 'Build a project with useState', completed: false },
          { id: 3, text: 'Master useEffect', completed: false }
        ];
        
        // Sample data for useMemo examples
        const sampleUserData = [
          { id: 1, name: 'John', age: 25, role: 'Developer' },
          { id: 2, name: 'Sarah', age: 32, role: 'Designer' },
          { id: 3, name: 'Michael', age: 29, role: 'Developer' },
          { id: 4, name: 'Jessica', age: 27, role: 'Manager' }
        ];
      `;
      
      // Create a sandbox environment for evaluation
      // This is simplified and would need more work for production
      // with proper sandboxing and security measures
      const sandboxedEval = new Function('React', `
        // Add mock data that can be used by examples
        ${mockData}
        
        // Main code from example
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


export const mockData = `
// Define global mock data used by various examples

// Sample products data for shopping cart and useMemo examples
const product = { id: 1, name: 'React Hoodie', price: 45.99 };
const cartItem = { id: 1, name: 'React Hoodie', price: 45.99 };
const cartTotal = 45.99;

// Generate a products array for all examples that need it
const generateProducts = () => {
  return [
    { id: 1, name: 'React Hoodie', price: 45.99 },
    { id: 2, name: 'JavaScript Mug', price: 12.99 },
    { id: 3, name: 'TypeScript Hat', price: 22.50 }
  ];
};

// Define or overwrite products in the current scope
const products = generateProducts();

// Helper function to generate product list for useMemo examples
const generateProductList = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    name: \`Product \${i + 1}\`,
    price: Math.round((Math.random() * 100 + 1) * 100) / 100
  }));
};

// Mock tasks for useReducer examples
const initialTasks = [
  { id: 1, text: 'Learn React Hooks', completed: true },
  { id: 2, text: 'Build a project with useState', completed: false },
  { id: 3, text: 'Master useEffect', completed: false }
];

// Sample data for useMemo examples
const sampleUserData = [
  { id: 1, name: 'John', age: 25, role: 'Developer' },
  { id: 2, name: 'Sarah', age: 32, role: 'Designer' },
  { id: 3, name: 'Michael', age: 29, role: 'Developer' },
  { id: 4, name: 'Jessica', age: 27, role: 'Manager' }
];
`;