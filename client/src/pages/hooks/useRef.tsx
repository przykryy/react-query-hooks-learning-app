import React from 'react';
import { Link, useLocation } from 'wouter';
import LearningObjectives from '@/components/tutorial/LearningObjectives';
import CodeExample from '@/components/tutorial/CodeExample';
import Quiz from '@/components/tutorial/Quiz';
import NextSteps from '@/components/tutorial/NextSteps';
import { ChevronRight } from 'lucide-react';
import { useProgress } from '@/hooks/use-progress';

const domRefExample = `
function TextInputWithFocus() {
  // Create a ref to store the DOM input element
  const inputRef = React.useRef(null);
  const [inputValue, setInputValue] = React.useState('');
  
  // Function to focus the input element
  const focusInput = () => {
    // Current points to the DOM node
    inputRef.current.focus();
  };
  
  const handleChange = (e) => {
    setInputValue(e.target.value);
  };
  
  return (
    <div className="p-4 text-center">
      <h2 className="text-xl font-semibold mb-4">useRef DOM Example</h2>
      <div className="mb-4 flex justify-center">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleChange}
          className="px-3 py-2 bg-muted rounded border border-input mr-2 focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Type something..."
        />
        <button
          onClick={focusInput}
          className="px-4 py-2 bg-primary text-primary-foreground rounded"
        >
          Focus Input
        </button>
      </div>
      <p>
        {inputValue ? (
          <span>Current value: <span className="text-primary">{inputValue}</span></span>
        ) : (
          <span>Input is empty. Click the button to focus it.</span>
        )}
      </p>
    </div>
  );
}`;

const valueRefExample = `
function StopwatchWithPrevious() {
  // Use a ref to keep track of the previous time
  const [time, setTime] = React.useState(0);
  const [isRunning, setIsRunning] = React.useState(false);
  
  // This ref will persist between renders and won't cause re-renders
  const previousTimeRef = React.useRef(0);
  const intervalRef = React.useRef(null);
  
  // Update the previousTimeRef when time changes
  React.useEffect(() => {
    previousTimeRef.current = time;
  }, [time]);
  
  // Handle timer start/stop
  React.useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(t => t + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Clean up on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);
  
  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };
  
  const handleReset = () => {
    setTime(0);
    setIsRunning(false);
  };
  
  return (
    <div className="p-4 text-center">
      <h2 className="text-xl font-semibold mb-4">Stopwatch with Previous Time</h2>
      <div className="mb-4">
        <div className="text-4xl font-mono mb-2">
          {time}s
        </div>
        <div className="text-sm text-muted-foreground">
          Previous: {previousTimeRef.current}s
        </div>
      </div>
      <div className="flex justify-center space-x-3">
        <button
          onClick={handleStartStop}
          className="px-4 py-2 bg-primary text-primary-foreground rounded"
        >
          {isRunning ? 'Stop' : 'Start'}
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-muted text-foreground rounded"
        >
          Reset
        </button>
      </div>
    </div>
  );
}`;

const quizQuestions = [
  {
    id: 'q1',
    question: 'What is the primary purpose of useRef?',
    options: [
      { id: 'a', text: 'To manage component state and trigger re-renders' },
      { id: 'b', text: 'To create direct references to DOM elements and persist mutable values' },
      { id: 'c', text: 'To prevent components from re-rendering' },
      { id: 'd', text: 'To handle side effects in functional components' }
    ],
    correctAnswer: 'b'
  },
  {
    id: 'q2',
    question: 'What happens when a value inside useRef changes?',
    options: [
      { id: 'a', text: 'The component re-renders immediately' },
      { id: 'b', text: 'React throws an error' },
      { id: 'c', text: 'The component does not re-render' },
      { id: 'd', text: 'The ref is reset to its initial value' }
    ],
    correctAnswer: 'c'
  },
  {
    id: 'q3',
    question: 'How do you access the current value of a ref?',
    options: [
      { id: 'a', text: 'ref.getValue()' },
      { id: 'b', text: 'ref.current' },
      { id: 'c', text: 'ref.value' },
      { id: 'd', text: 'ref()' }
    ],
    correctAnswer: 'b'
  }
];

const UseRef = () => {
  const [location] = useLocation();
  const { markTutorialViewed } = useProgress();
  
  // Mark tutorial as viewed when component mounts
  React.useEffect(() => {
    markTutorialViewed('useRef');
  }, [markTutorialViewed]);

  return (
    <div className="p-6 md:p-8">
      {/* Breadcrumb navigation */}
      <div className="text-sm mb-6 flex items-center text-muted-foreground">
        <Link href="/">
          <a className="hover:text-primary transition-colors">Home</a>
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link href="/hooks/use-ref">
          <a className="hover:text-primary transition-colors">React Hooks</a>
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-primary">useRef</span>
      </div>
      
      {/* Page title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">useRef Hook</h1>
        <p className="text-muted-foreground max-w-3xl">
          Learn how to use the useRef hook to create mutable references that persist across renders,
          access DOM elements directly, and store values without triggering re-renders.
        </p>
      </div>
      
      {/* Learning objectives */}
      <LearningObjectives
        objectives={[
          "Understand the purpose and use cases of the useRef hook",
          "Learn how to access and manipulate DOM elements directly",
          "Store mutable values that persist across renders without causing re-renders",
          "Implement common patterns using useRef for timers, previous values, and input focus"
        ]}
      />
      
      {/* Introduction to useRef */}
      <div className="mb-10 max-w-3xl">
        <h2 className="text-2xl font-semibold mb-4">Introduction to useRef</h2>
        <p className="mb-4">
          The <code className="bg-sidebar text-primary px-1 py-0.5 rounded">useRef</code> hook is a function that returns a mutable ref object 
          with a <code className="bg-sidebar text-primary px-1 py-0.5 rounded">current</code> property. 
          This object persists for the full lifetime of the component and has two primary use cases:
        </p>
        
        <ol className="list-decimal pl-6 space-y-2 mb-4">
          <li>
            <strong>Accessing DOM elements directly</strong> - Similar to using <code className="bg-sidebar text-primary px-1 py-0.5 rounded">ref</code> attributes in class components
          </li>
          <li>
            <strong>Storing mutable values</strong> - Values that need to persist between renders but don't need to trigger a re-render when changed
          </li>
        </ol>
        
        <p className="mb-4">Here's the basic syntax of useRef:</p>
        
        <div className="bg-sidebar rounded-md p-4 my-4 font-code text-sm">
          <pre><code>const refContainer = useRef(initialValue);</code></pre>
        </div>
        
        <p className="mb-2">
          The key differences between <code className="bg-sidebar text-primary px-1 py-0.5 rounded">useRef</code> and <code className="bg-sidebar text-primary px-1 py-0.5 rounded">useState</code> are:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Changing a ref value doesn't trigger a re-render</li>
          <li>The ref value is mutable and can be updated without using a setter function</li>
          <li>The ref value persists between renders, similar to state</li>
        </ul>
      </div>
      
      {/* Example 1: DOM Reference */}
      <div className="mb-10" id="examples">
        <h2 className="text-2xl font-semibold mb-4">Example 1: Accessing DOM Elements</h2>
        <p className="mb-4 max-w-3xl">
          This example demonstrates how to use useRef to get a direct reference to a DOM element,
          allowing you to call DOM methods like focus(), blur(), etc.
        </p>
        
        <CodeExample 
          title="DOM Reference with useRef"
          initialCode={domRefExample}
          explanation={
            <div>
              <h4 className="font-medium mb-2">Key Concepts</h4>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Create a ref with <code>useRef(null)</code> and attach it to an element with the ref attribute</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Access the actual DOM node through <code>inputRef.current</code></span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Call DOM methods directly on the node, like <code>focus()</code></span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>The input's value is still controlled by React state, but focusing is handled imperatively</span>
                </li>
              </ul>
            </div>
          }
          analysis={
            <div>
              <h4 className="font-medium mb-2">Code Analysis</h4>
              <p className="mb-2">This example demonstrates the common pattern of managing the DOM imperatively:</p>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>We use both React state (for the input value) and a ref (for DOM access)</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>The focus behavior can't be easily done with just props and state</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Any DOM API like blur(), select(), or scrollIntoView() can be called this way</span>
                </li>
              </ul>
            </div>
          }
          challenge={
            <div>
              <h4 className="font-medium mb-2">Challenge</h4>
              <p>Enhance this example with these features:</p>
              <ol className="list-decimal pl-5 space-y-1 mt-2">
                <li>Add a button that selects all text in the input</li>
                <li>Add a character count display below the input</li>
                <li>Auto-focus the input when the component first renders</li>
              </ol>
            </div>
          }
        />
      </div>
      
      {/* Example 2: Persisting Values */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Example 2: Storing Mutable Values</h2>
        <p className="mb-4 max-w-3xl">
          This example demonstrates using useRef to store values that persist across renders without
          causing re-renders, including keeping track of previous state and storing interval IDs.
        </p>
        
        <CodeExample 
          title="Persisting Values with useRef"
          initialCode={valueRefExample}
          explanation={
            <div>
              <h4 className="font-medium mb-2">Key Concepts</h4>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Using <code>useRef</code> to remember a previous state value across renders</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Storing an interval ID in a ref so it can be accessed by cleanup functions</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Updating ref values doesn't trigger re-renders, unlike state updates</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Using <code>useEffect</code> to update the ref whenever the state changes</span>
                </li>
              </ul>
            </div>
          }
          analysis={
            <div>
              <h4 className="font-medium mb-2">Code Analysis</h4>
              <p className="mb-2">Let's examine the patterns used in this example:</p>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Using an effect to update <code>previousTimeRef.current</code> when time changes</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Storing <code>intervalRef.current</code> to clean up timers properly in useEffect</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>This pattern is common for tracking "previous" values or any value that needs to persist without causing re-renders</span>
                </li>
              </ul>
            </div>
          }
          challenge={
            <div>
              <h4 className="font-medium mb-2">Challenge</h4>
              <p>Improve this stopwatch example:</p>
              <ol className="list-decimal pl-5 space-y-1 mt-2">
                <li>Add a lap function that stores each time when a button is clicked</li>
                <li>Change the timer to display in MM:SS format</li>
                <li>Track and display the fastest and slowest lap times</li>
              </ol>
            </div>
          }
        />
      </div>
      
      {/* Common useRef Patterns */}
      <div className="mb-10 max-w-3xl">
        <div className="bg-muted rounded-lg p-5">
          <h3 className="flex items-center text-lg font-medium mb-3">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-primary mr-2">
              <path d="M21 10.0836V10.0836C21 6.74281 21 5.07241 20.0311 4.08994C19.0622 3.10748 17.413 3.10748 14.1147 3.10748H9.88526C6.58704 3.10748 4.93793 3.10748 3.96894 4.08994C3 5.07241 3 6.74281 3 10.0836V15.9164C3 19.2572 3 20.9276 3.96894 21.9101C4.93793 22.8925 6.58704 22.8925 9.88526 22.8925H14.1147C17.413 22.8925 19.0622 22.8925 20.0311 21.9101C21 20.9276 21 19.2572 21 15.9164V15.9164" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M8.5 12H15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M12 8.5V15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Common useRef Patterns
          </h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
              <span><strong>DOM Access</strong>: Focusing inputs, measuring elements, triggering animations</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
              <span><strong>Previous Values</strong>: Keeping track of previous props or state to compare changes</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
              <span><strong>Instance Variables</strong>: Storing values like intervals, timeouts, or third-party library instances</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
              <span><strong>Avoiding Re-renders</strong>: When you need to update a value but don't want to trigger a re-render</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
              <span><strong>Initial render flag</strong>: Track whether the component has already rendered once</span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Quiz Section */}
      <div id="quiz">
        <Quiz 
          title="Quiz: useRef Fundamentals"
          questions={quizQuestions}
          tutorialId="useRef"
        />
      </div>
      
      {/* Next steps section */}
      <NextSteps currentPath="/hooks/use-ref" category="hooks" />
    </div>
  );
};

export default UseRef;
