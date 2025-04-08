import React from 'react';
import { Link, useLocation } from 'wouter';
import LearningObjectives from '@/components/tutorial/LearningObjectives';
import CodeExample from '@/components/tutorial/CodeExample';
import Quiz from '@/components/tutorial/Quiz';
import NextSteps from '@/components/tutorial/NextSteps';
import { ChevronRight } from 'lucide-react';
import { useProgress } from '@/hooks/use-progress';

const basicCustomHookExample = `
// Step 1: Create a custom hook
function useWindowSize() {
  // State to store window dimensions
  const [windowSize, setWindowSize] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  // Effect to update state on window resize
  React.useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Call handler right away so state gets updated with initial window size
    handleResize();
    
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount and unmount
  
  // Return the window size object
  return windowSize;
}

// Component that uses the custom hook
function WindowSizeDisplay() {
  // Use our custom hook
  const windowSize = useWindowSize();
  
  return (
    <div className="p-4 text-center">
      <h2 className="text-xl font-semibold mb-4">Window Size Monitor</h2>
      
      <div className="p-4 bg-muted rounded-md mb-4">
        <p className="mb-2">Current Window Dimensions:</p>
        <div className="text-2xl text-primary font-mono">
          {windowSize.width} × {windowSize.height}
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Resize your browser window to see the values update.
      </p>
    </div>
  );
}
  render(<WindowSizeDisplay />);
`;

const complexCustomHookExample = `
// Custom hook for form validation and handling
function useForm(initialValues, validate) {
  // State for values, errors, and form status
  const [values, setValues] = React.useState(initialValues);
  const [errors, setErrors] = React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isValid, setIsValid] = React.useState(false);
  
  // Validate form values whenever they change
  React.useEffect(() => {
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setIsValid(Object.keys(validationErrors).length === 0);
  }, [values, validate]);
  
  // Handle input changes
  const handleChange = React.useCallback((e) => {
    const { name, value } = e.target;
    setValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
  }, []);
  
  // Handle form submission
  const handleSubmit = React.useCallback((e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    
    // If there are no errors, onSubmit will be called by the component
    if (Object.keys(errors).length === 0) {
      setIsSubmitting(false);
    }
  }, [errors]);
  
  // Reset form to initial values
  const resetForm = React.useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  }, [initialValues]);
  
  // Return everything needed for form management
  return {
    values,
    errors,
    isSubmitting,
    isValid,
    handleChange,
    handleSubmit,
    resetForm
  };
}

// Component that uses the custom form hook
function SignupForm() {
  // Validation function
  const validateForm = (values) => {
    let errors = {};
    
    // Email validation
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/\\S+@\\S+\\.\\S+/.test(values.email)) {
      errors.email = 'Email is invalid';
    }
    
    // Password validation
    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    // Name validation
    if (!values.name) {
      errors.name = 'Name is required';
    }
    
    return errors;
  };
  
  // Use our custom hook
  const {
    values,
    errors,
    isSubmitting,
    isValid,
    handleChange,
    handleSubmit,
    resetForm
  } = useForm(
    { name: '', email: '', password: '' },
    validateForm
  );
  
  // Submission handler
  const submitForm = () => {
    alert(\`Form submitted successfully!
Name: \${values.name}
Email: \${values.email}
Password: \${values.password.replace(/./g, '*')}\`);
    resetForm();
  };
  
  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Signup Form with Custom Hook</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={values.name}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-muted rounded border border-input focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {errors.name && (
            <p className="text-sm text-destructive mt-1">{errors.name}</p>
          )}
        </div>
        
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-muted rounded border border-input focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {errors.email && (
            <p className="text-sm text-destructive mt-1">{errors.email}</p>
          )}
        </div>
        
        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-muted rounded border border-input focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {errors.password && (
            <p className="text-sm text-destructive mt-1">{errors.password}</p>
          )}
        </div>
        
        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            onClick={submitForm}
            className="px-4 py-2 bg-primary text-primary-foreground rounded disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
          
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 bg-muted text-foreground rounded"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
  render(<SignupForm />);
`;

const quizQuestions = [
  {
    id: 'q1',
    question: 'What is the main purpose of custom hooks in React?',
    options: [
      { id: 'a', text: 'To create reusable stateful logic that can be shared between components' },
      { id: 'b', text: 'To create UI components that can be reused across the application' },
      { id: 'c', text: 'To optimize React performance automatically' },
      { id: 'd', text: 'To hide complex code from component files' }
    ],
    correctAnswer: 'a'
  },
  {
    id: 'q2',
    question: 'What naming convention must custom hooks follow?',
    options: [
      { id: 'a', text: 'They must start with "custom"' },
      { id: 'b', text: 'They must start with "use"' },
      { id: 'c', text: 'They must end with "Hook"' },
      { id: 'd', text: 'They can have any name as long as they use other hooks internally' }
    ],
    correctAnswer: 'b'
  },
  {
    id: 'q3',
    question: 'What is NOT true about custom hooks?',
    options: [
      { id: 'a', text: 'They can call other hooks' },
      { id: 'b', text: 'They can share stateful logic between components' },
      { id: 'c', text: 'They create shared state between components that use them' },
      { id: 'd', text: 'They can be composed together' }
    ],
    correctAnswer: 'c'
  },
  {
    id: 'q4',
    question: 'Which React hook rules also apply to custom hooks?',
    options: [
      { id: 'a', text: 'Custom hooks follow a completely different set of rules' },
      { id: 'b', text: 'Only call custom hooks at the top level, never inside loops, conditions, or nested functions' },
      { id: 'c', text: 'Custom hooks can only be called from inside class components' },
      { id: 'd', text: 'Custom hooks must always return an array with exactly two elements' }
    ],
    correctAnswer: 'b'
  }
];

const CustomHooks = () => {
  const [location] = useLocation();
  const { markTutorialViewed } = useProgress();
  
  // Mark tutorial as viewed when component mounts
  React.useEffect(() => {
    markTutorialViewed('customHooks');
  }, [markTutorialViewed]);

  return (
    <div className="p-6 md:p-8">
      {/* Breadcrumb navigation */}
      <div className="text-sm mb-6 flex items-center text-muted-foreground">
        <Link href="/">
          <a className="hover:text-primary transition-colors">Home</a>
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link href="/hooks/custom-hooks">
          <a className="hover:text-primary transition-colors">React Hooks</a>
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-primary">Custom Hooks</span>
      </div>
      
      {/* Page title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">Custom Hooks</h1>
        <p className="text-muted-foreground max-w-3xl">
          Learn how to create your own custom hooks to extract and reuse stateful logic between 
          components, making your code more modular and maintainable.
        </p>
      </div>
      
      {/* Learning objectives */}
      <LearningObjectives
        objectives={[
          "Understand what custom hooks are and why they're useful",
          "Learn how to extract repeated logic into reusable custom hooks",
          "Build custom hooks that combine multiple React hooks",
          "Implement practical custom hooks for common use cases",
          "Master the naming conventions and best practices for custom hooks"
        ]}
      />
      
      {/* Introduction to Custom Hooks */}
      <div className="mb-10 max-w-3xl">
        <h2 className="text-2xl font-semibold mb-4">Introduction to Custom Hooks</h2>
        <p className="mb-4">
          Custom hooks are a powerful feature in React that allows you to extract stateful logic from components into reusable functions.
          Unlike components, custom hooks don't render UI – they encapsulate behavior and stateful logic that can be shared across multiple components.
        </p>
        
        <p className="mb-4">
          Custom hooks follow these key principles:
        </p>
        
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>They must start with the word <code className="bg-sidebar text-primary px-1 py-0.5 rounded">use</code> (like useEffect or useState)</li>
          <li>They can call other hooks (built-in or custom)</li>
          <li>Each component that uses a custom hook gets its own isolated state</li>
          <li>They simplify components by moving complex logic out of the component body</li>
        </ul>
        
        <p className="mb-4">
          Some common use cases for custom hooks include:
        </p>
        
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>Form handling and validation</li>
          <li>Data fetching and API interactions</li>
          <li>Browser APIs (localStorage, geolocation, media, etc.)</li>
          <li>Animation and timing effects</li>
          <li>Event listeners and subscriptions</li>
        </ul>
        
        <p className="mb-4">
          Custom hooks help keep your code DRY (Don't Repeat Yourself) and make it more maintainable by isolating 
          specific concerns in their own functions.
        </p>
      </div>
      
      {/* Example 1: Simple Custom Hook */}
      <div className="mb-10" id="examples">
        <h2 className="text-2xl font-semibold mb-4">Example 1: Window Size Custom Hook</h2>
        <p className="mb-4 max-w-3xl">
          This example demonstrates a simple custom hook that tracks the browser window size.
          It shows how to extract this logic into a reusable hook that any component can use.
        </p>
        
        <CodeExample 
          title="useWindowSize Custom Hook"
          initialCode={basicCustomHookExample}
          explanation={
            <div>
              <h4 className="font-medium mb-2">Key Concepts</h4>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Creating a custom hook called <code>useWindowSize</code> that starts with "use"</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Using useState and useEffect inside our custom hook</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Setting up and cleaning up event listeners properly</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Returning values that components can use in their rendering logic</span>
                </li>
              </ul>
            </div>
          }
          analysis={
            <div>
              <h4 className="font-medium mb-2">Code Analysis</h4>
              <p className="mb-2">Let's examine how this hook is structured:</p>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>The hook manages state internally with useState, keeping this logic out of the component</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>It sets up effects that handle browser events and performs cleanup</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>The component using the hook (WindowSizeDisplay) is simplified and focused on rendering</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>The same hook could be reused in any component that needs window size information</span>
                </li>
              </ul>
            </div>
          }
          challenge={
            <div>
              <h4 className="font-medium mb-2">Challenge</h4>
              <p>Enhance the useWindowSize hook:</p>
              <ol className="list-decimal pl-5 space-y-1 mt-2">
                <li>Add a debounce function to prevent too many updates during resize</li>
                <li>Track additional window properties like scrollX and scrollY positions</li>
                <li>Add a method to check if the viewport is considered mobile-sized</li>
              </ol>
            </div>
          }
        />
      </div>
      
      {/* Example 2: Complex Custom Hook */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Example 2: Form Handling Custom Hook</h2>
        <p className="mb-4 max-w-3xl">
          This more complex example demonstrates a custom hook for form handling and validation.
          It shows how custom hooks can combine multiple React hooks to provide comprehensive functionality.
        </p>
        
        <CodeExample 
          title="useForm Custom Hook"
          initialCode={complexCustomHookExample}
          explanation={
            <div>
              <h4 className="font-medium mb-2">Key Concepts</h4>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Creating a more complex custom hook that manages form state, validation, and submission</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Using multiple React hooks together (useState, useEffect, useCallback)</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Accepting parameters that customize the hook behavior</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Returning multiple values and functions as an object</span>
                </li>
              </ul>
            </div>
          }
          analysis={
            <div>
              <h4 className="font-medium mb-2">Code Analysis</h4>
              <p className="mb-2">Let's analyze the structure of this more complex hook:</p>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>The hook accepts initialValues and a validate function as parameters</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>It manages multiple aspects of form state: values, errors, submission status, and validity</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>useCallback is used to memoize functions to prevent unnecessary rerenders</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>The component using the hook is cleaner, focusing on UI rather than form logic</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>This pattern can be reused for any form in the application, saving time and reducing duplication</span>
                </li>
              </ul>
            </div>
          }
          challenge={
            <div>
              <h4 className="font-medium mb-2">Challenge</h4>
              <p>Enhance the useForm hook with these features:</p>
              <ol className="list-decimal pl-5 space-y-1 mt-2">
                <li>Add touched fields tracking to only show errors after a field has been interacted with</li>
                <li>Add support for custom validation messages</li>
                <li>Implement a way to handle file inputs and their validation</li>
              </ol>
            </div>
          }
        />
      </div>
      
      {/* Custom Hook Best Practices */}
      <div className="mb-10 max-w-3xl">
        <div className="bg-muted rounded-lg p-5">
          <h3 className="flex items-center text-lg font-medium mb-3">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-primary mr-2">
              <path d="M21 10.0836V10.0836C21 6.74281 21 5.07241 20.0311 4.08994C19.0622 3.10748 17.413 3.10748 14.1147 3.10748H9.88526C6.58704 3.10748 4.93793 3.10748 3.96894 4.08994C3 5.07241 3 6.74281 3 10.0836V15.9164C3 19.2572 3 20.9276 3.96894 21.9101C4.93793 22.8925 6.58704 22.8925 9.88526 22.8925H14.1147C17.413 22.8925 19.0622 22.8925 20.0311 21.9101C21 20.9276 21 19.2572 21 15.9164V15.9164" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M8.5 12H15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M12 8.5V15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Custom Hook Best Practices
          </h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
              <span><strong>Naming</strong>: Always start custom hook names with 'use' (e.g., useFormValidation, useLocalStorage)</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
              <span><strong>Single Responsibility</strong>: Each hook should do one thing well - prefer multiple focused hooks over one complex hook</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
              <span><strong>Composition</strong>: Build complex hooks by composing simpler hooks together</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
              <span><strong>Documentation</strong>: Document parameters, return values, and usage examples</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
              <span><strong>Testing</strong>: Custom hooks should be tested independently, consider using @testing-library/react-hooks</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
              <span><strong>Cleanup</strong>: Always clean up resources (event listeners, subscriptions) in useEffect return functions</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
              <span><strong>Parameters</strong>: Accept configuration options to make hooks flexible and reusable</span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Quiz Section */}
      <div id="quiz">
        <Quiz 
          title="Quiz: Custom Hooks"
          questions={quizQuestions}
          tutorialId="customHooks"
        />
      </div>
      
      {/* Next steps section */}
      <NextSteps currentPath="/hooks/custom-hooks" category="hooks" />
    </div>
  );
};

export default CustomHooks;
