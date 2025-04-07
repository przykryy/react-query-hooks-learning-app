import React from 'react';
import { Link, useLocation } from 'wouter';
import LearningObjectives from '@/components/tutorial/LearningObjectives';
import CodeExample from '@/components/tutorial/CodeExample';
import Quiz from '@/components/tutorial/Quiz';
import NextSteps from '@/components/tutorial/NextSteps';
import { ChevronRight } from 'lucide-react';
import { useProgress } from '@/hooks/use-progress';

const basicEffectExample = `import React, { useState, useEffect } from 'react';

function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    let interval = null;
    
    if (isActive) {
      // Set up the interval when isActive becomes true
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      // Clean up the interval when isActive becomes false
      clearInterval(interval);
    }
    
    // This cleanup function runs when the component unmounts
    // or before the effect runs again
    return () => clearInterval(interval);
  }, [isActive, seconds]);
  
  const toggleTimer = () => {
    setIsActive(!isActive);
  };
  
  const resetTimer = () => {
    setSeconds(0);
    setIsActive(false);
  };
  
  return (
    <div className="timer-container text-center">
      <h2 className="text-2xl mb-4">
        Timer: <span className="text-primary">{seconds}</span> seconds
      </h2>
      <div className="flex justify-center space-x-3">
        <button 
          className="px-4 py-2 rounded bg-muted hover:bg-muted/80 transition-colors"
          onClick={toggleTimer}
        >
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button 
          className="px-4 py-2 rounded bg-muted hover:bg-muted/80 transition-colors"
          onClick={resetTimer}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

// For our example display
export default function App() {
  return <Timer />;
}`;

const fetchDataExample = `import React, { useState, useEffect } from 'react';

function UserProfile() {
  const [userId, setUserId] = useState(1);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Reset states when userId changes
    setLoading(true);
    setError(null);
    
    // Function to fetch user data
    const fetchUser = async () => {
      try {
        // Using JSONPlaceholder for demo API
        const response = await fetch(
          \`https://jsonplaceholder.typicode.com/users/\${userId}\`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const userData = await response.json();
        setUser(userData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchUser();
    
    // No cleanup needed for this effect
    // but we could add one if necessary
  }, [userId]); // Only re-run when userId changes
  
  const handleNextUser = () => {
    setUserId(prevId => (prevId === 10 ? 1 : prevId + 1));
  };
  
  return (
    <div className="user-profile">
      <h2 className="text-xl font-semibold mb-4">User Profile</h2>
      
      <div className="mb-4">
        <button 
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/80 transition-colors"
          onClick={handleNextUser}
        >
          Load Next User
        </button>
      </div>
      
      <div className="p-4 bg-muted rounded-md">
        {loading && <div>Loading user data...</div>}
        
        {error && (
          <div className="text-destructive">Error: {error}</div>
        )}
        
        {user && !loading && !error && (
          <div className="space-y-2">
            <p><strong className="text-primary">Name:</strong> {user.name}</p>
            <p><strong className="text-primary">Email:</strong> {user.email}</p>
            <p><strong className="text-primary">Company:</strong> {user.company.name}</p>
            <p><strong className="text-primary">Website:</strong> {user.website}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// For our example display
export default function App() {
  return <UserProfile />;
}`;

const quizQuestions = [
  {
    id: 'q1',
    question: 'What is the primary purpose of the useEffect hook?',
    options: [
      { id: 'a', text: 'To create state variables in functional components' },
      { id: 'b', text: 'To perform side effects in functional components' },
      { id: 'c', text: 'To memoize expensive calculations' },
      { id: 'd', text: 'To replace the render method in class components' }
    ],
    correctAnswer: 'b'
  },
  {
    id: 'q2',
    question: 'What does the dependency array in useEffect control?',
    options: [
      { id: 'a', text: 'The values that can be modified by the effect' },
      { id: 'b', text: 'The minimum number of times the effect will run' },
      { id: 'c', text: 'When the effect will be re-executed' },
      { id: 'd', text: 'The performance optimization level of the effect' }
    ],
    correctAnswer: 'c'
  },
  {
    id: 'q3',
    question: 'What happens if you omit the dependency array in useEffect?',
    options: [
      { id: 'a', text: 'The effect runs only once when the component mounts' },
      { id: 'b', text: 'The effect runs after every render' },
      { id: 'c', text: 'The effect never runs' },
      { id: 'd', text: 'React shows a warning but the effect runs only on mount' }
    ],
    correctAnswer: 'b'
  },
  {
    id: 'q4',
    question: 'What is the purpose of the cleanup function returned by useEffect?',
    options: [
      { id: 'a', text: 'To stop the component from re-rendering' },
      { id: 'b', text: 'To reset state variables to their initial values' },
      { id: 'c', text: 'To clean up side effects before the component unmounts or before the effect runs again' },
      { id: 'd', text: 'To verify that the effect completed successfully' }
    ],
    correctAnswer: 'c'
  }
];

const UseEffect = () => {
  const [location] = useLocation();
  const { markTutorialViewed } = useProgress();
  
  // Mark tutorial as viewed when component mounts
  React.useEffect(() => {
    markTutorialViewed('useEffect');
  }, [markTutorialViewed]);

  return (
    <div className="p-6 md:p-8">
      {/* Breadcrumb navigation */}
      <div className="text-sm mb-6 flex items-center text-muted-foreground">
        <Link href="/">
          <a className="hover:text-primary transition-colors">Home</a>
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link href="/hooks/use-effect">
          <a className="hover:text-primary transition-colors">React Hooks</a>
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-primary">useEffect</span>
      </div>
      
      {/* Page title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">useEffect Hook</h1>
        <p className="text-muted-foreground max-w-3xl">
          Learn how to perform side effects in your functional components with React's useEffect hook.
          This tutorial covers synchronizing with external systems, data fetching, and cleanup.
        </p>
      </div>
      
      {/* Learning objectives */}
      <LearningObjectives
        objectives={[
          "Understand the concept of side effects in React components",
          "Learn to use useEffect for various common use cases",
          "Implement cleanup functions to prevent memory leaks",
          "Master the dependency array to control when effects run",
          "Apply useEffect for data fetching and subscription patterns"
        ]}
      />
      
      {/* Introduction to useEffect */}
      <div className="mb-10 max-w-3xl">
        <h2 className="text-2xl font-semibold mb-4">Introduction to useEffect</h2>
        <p className="mb-4">
          The <code className="bg-sidebar text-primary px-1 py-0.5 rounded">useEffect</code> hook lets you perform side effects in function components.
          Side effects are operations that affect something outside the scope of the current function, such as:
        </p>
        
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>Data fetching from an API</li>
          <li>Setting up subscriptions or timers</li>
          <li>Manually changing the DOM</li>
          <li>Logging, analytics tracking</li>
          <li>Integrating with third-party libraries</li>
        </ul>
        
        <p className="mb-4">Here's the basic syntax of useEffect:</p>
        
        <div className="bg-sidebar rounded-md p-4 my-4 font-code text-sm">
          <pre>useEffect(function() {'{'}
  // Side effect code goes here
  
  // Optional cleanup function
  return function() {'{'}
    // Cleanup code goes here
  {'}'};
{'}'}, [dependencies]);</pre>
        </div>
        
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li><strong>Effect function</strong>: The first argument is a function that contains the side effect code</li>
          <li><strong>Cleanup function</strong>: Optionally returned from the effect function to clean up resources</li>
          <li><strong>Dependencies array</strong>: The second argument controls when the effect runs:
            <ul className="list-disc pl-5 mt-2">
              <li>Omitted: Effect runs after every render</li>
              <li>Empty []: Effect runs only once after the initial render</li>
              <li>With values [a, b]: Effect runs when any dependency changes</li>
            </ul>
          </li>
        </ul>
      </div>
      
      {/* Example 1: Basic Timer */}
      <div className="mb-10" id="examples">
        <h2 className="text-2xl font-semibold mb-4">Example 1: Timer with Cleanup</h2>
        <p className="mb-4 max-w-3xl">
          This example demonstrates useEffect with a timer that needs proper cleanup to prevent memory leaks.
        </p>
        
        <CodeExample 
          title="Timer with useEffect"
          initialCode={basicEffectExample}
          explanation={
            <div>
              <h4 className="font-medium mb-2">Key Concepts</h4>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>useEffect sets up an interval when the timer is active</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>The cleanup function (return statement) clears the interval to prevent memory leaks</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>The effect re-runs when isActive or seconds changes</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Note the use of functional updates with setSeconds to ensure we're using the latest state</span>
                </li>
              </ul>
            </div>
          }
          analysis={
            <div>
              <h4 className="font-medium mb-2">Code Analysis</h4>
              <p className="mb-2">Let's analyze the effect in detail:</p>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>The effect creates or clears an interval based on the isActive state</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>We use setSeconds(function(seconds) {'{'} return seconds + 1; {'}'}) instead of setSeconds(seconds + 1) to avoid stale closures</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>The cleanup function prevents multiple intervals from being created and ensures resources are freed</span>
                </li>
              </ul>
            </div>
          }
          challenge={
            <div>
              <h4 className="font-medium mb-2">Challenge</h4>
              <p>Enhance this timer with these features:</p>
              <ol className="list-decimal pl-5 space-y-1 mt-2">
                <li>Add a lap feature that records the time when a "Lap" button is clicked</li>
                <li>Format the time to show minutes and seconds (MM:SS)</li>
                <li>Add a countdown mode that starts from a user-defined number</li>
              </ol>
            </div>
          }
        />
      </div>
      
      {/* Example 2: API Data Fetching */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Example 2: Data Fetching</h2>
        <p className="mb-4 max-w-3xl">
          This example shows how to use useEffect for API data fetching, a common use case in React applications.
        </p>
        
        <CodeExample 
          title="API Data Fetching with useEffect"
          initialCode={fetchDataExample}
          explanation={
            <div>
              <h4 className="font-medium mb-2">Key Concepts</h4>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>useEffect fetches data from an API when the component mounts or when userId changes</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>The loading and error states help manage the UI during different fetch states</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>The dependency array [userId] means the effect only runs when userId changes</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>We use try/catch to handle potential errors during fetching</span>
                </li>
              </ul>
            </div>
          }
          analysis={
            <div>
              <h4 className="font-medium mb-2">Code Analysis</h4>
              <p className="mb-2">Let's analyze the data fetching pattern:</p>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>We define an async function inside useEffect and immediately invoke it</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>The component handles three states: loading, error, and success</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>We reset loading and error states when userId changes to provide a better UX</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>This is a common pattern, though in real apps you might use a library like TanStack Query instead</span>
                </li>
              </ul>
            </div>
          }
          challenge={
            <div>
              <h4 className="font-medium mb-2">Challenge</h4>
              <p>Improve this data fetching example:</p>
              <ol className="list-decimal pl-5 space-y-1 mt-2">
                <li>Add a loading spinner component while data is loading</li>
                <li>Implement a retry button when fetch fails</li>
                <li>Add a cache mechanism to avoid refetching data for users you've already loaded</li>
              </ol>
            </div>
          }
        />
      </div>
      
      {/* Important Note */}
      <div className="mb-10 max-w-3xl">
        <div className="bg-muted rounded-lg p-5">
          <h3 className="flex items-center text-lg font-medium mb-3">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-primary mr-2">
              <path d="M21 10.0836V10.0836C21 6.74281 21 5.07241 20.0311 4.08994C19.0622 3.10748 17.413 3.10748 14.1147 3.10748H9.88526C6.58704 3.10748 4.93793 3.10748 3.96894 4.08994C3 5.07241 3 6.74281 3 10.0836V15.9164C3 19.2572 3 20.9276 3.96894 21.9101C4.93793 22.8925 6.58704 22.8925 9.88526 22.8925H14.1147C17.413 22.8925 19.0622 22.8925 20.0311 21.9101C21 20.9276 21 19.2572 21 15.9164V15.9164" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M8.5 12H15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M12 8.5V15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Common useEffect Pitfalls
          </h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
              <span><strong>Infinite loops</strong>: Be careful when setting state in useEffect without proper dependencies</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
              <span><strong>Missing dependencies</strong>: React's ESLint rules can help identify missing dependencies</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
              <span><strong>Stale closures</strong>: Effects capture values from when they were defined; use functional updates when needed</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
              <span><strong>Object/array dependencies</strong>: Objects and arrays create new references on each render; consider useMemo or useCallback</span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Quiz Section */}
      <div id="quiz">
        <Quiz 
          title="Quiz: useEffect Concepts"
          questions={quizQuestions}
          tutorialId="useEffect"
        />
      </div>
      
      {/* Next steps section */}
      <NextSteps currentPath="/hooks/use-effect" category="hooks" />
    </div>
  );
};

export default UseEffect;
