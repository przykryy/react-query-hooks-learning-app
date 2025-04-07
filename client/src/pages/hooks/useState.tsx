import React from 'react';
import { Link, useLocation } from 'wouter';
import LearningObjectives from '@/components/tutorial/LearningObjectives';
import CodeExample from '@/components/tutorial/CodeExample';
import Quiz from '@/components/tutorial/Quiz';
import NextSteps from '@/components/tutorial/NextSteps';
import { ChevronRight } from 'lucide-react';
import { useProgress } from '@/hooks/use-progress';

const counterExample = `
function Counter() {
  // Initialize state with a value of 0
  const [count, setCount] = React.useState(0);

  // Function to increment the counter
  const increment = () => {
    setCount(count + 1);
  };

  // Function to decrement the counter
  const decrement = () => {
    setCount(count - 1);
  };

  // Function to reset the counter
  const reset = () => {
    setCount(0);
  };

  return (
    <div className="counter-container">
      <h2 className="text-2xl mb-4">Counter: <span className="text-primary">{count}</span></h2>
      <div className="buttons flex space-x-3">
        <button 
          className="px-4 py-2 rounded bg-muted hover:bg-muted/80 transition-colors"
          onClick={decrement}
        >
          -
        </button>
        <button 
          className="px-4 py-2 rounded bg-muted hover:bg-muted/80 transition-colors"
          onClick={reset}
        >
          Reset
        </button>
        <button 
          className="px-4 py-2 rounded bg-muted hover:bg-muted/80 transition-colors"
          onClick={increment}
        >
          +
        </button>
      </div>
    </div>
  );
}`;

const formExample = `
function UserForm() {
  // Initialize state for form data
  const [formData, setFormData] = React.useState({
    username: '',
    email: '',
    role: 'developer'
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(\`Form submitted!\\nUsername: \${formData.username}\\nEmail: \${formData.email}\\nRole: \${formData.role}\`);
  };

  return (
    <div className="form-container">
      <h2 className="text-xl font-semibold mb-4">User Registration</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="block mb-1" htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-muted rounded border border-input focus:outline-none focus:ring-1 focus:ring-primary"
            required
          />
        </div>
        
        <div className="form-group">
          <label className="block mb-1" htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-muted rounded border border-input focus:outline-none focus:ring-1 focus:ring-primary"
            required
          />
        </div>
        
        <div className="form-group">
          <label className="block mb-1" htmlFor="role">Role:</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-muted rounded border border-input focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="developer">Developer</option>
            <option value="designer">Designer</option>
            <option value="manager">Manager</option>
          </select>
        </div>
        
        <button 
          type="submit" 
          className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded hover:bg-primary/80 transition-colors"
        >
          Register
        </button>
      </form>
    </div>
  );
}`;

const quizQuestions = [
  {
    id: 'q1',
    question: 'Which of the following is the correct way to update state based on previous state?',
    options: [
      { id: 'a', text: 'setCount(count + 1)' },
      { id: 'b', text: 'setCount(function(c) { return c + 1 })' },
      { id: 'c', text: 'setCount(prevCount => prevCount + 1)' },
      { id: 'd', text: 'count = count + 1' }
    ],
    correctAnswer: 'c'
  },
  {
    id: 'q2',
    question: "When using useState with an object, what's the correct way to update one property?",
    options: [
      { id: 'a', text: 'setState({ name: "New Name" })' },
      { id: 'b', text: 'setState(prevState => ({ ...prevState, name: "New Name" }))' },
      { id: 'c', text: 'setState.name = "New Name"' },
      { id: 'd', text: 'state.name = "New Name"; setState(state)' }
    ],
    correctAnswer: 'b'
  },
  {
    id: 'q3',
    question: 'What is the primary purpose of the useState hook?',
    options: [
      { id: 'a', text: 'To fetch data from APIs' },
      { id: 'b', text: 'To handle side effects in functional components' },
      { id: 'c', text: 'To add state to functional components' },
      { id: 'd', text: 'To optimize rendering performance' }
    ],
    correctAnswer: 'c'
  }
];

const UseState = () => {
  const [location] = useLocation();
  const { markTutorialViewed } = useProgress();
  
  // Mark tutorial as viewed when component mounts
  React.useEffect(() => {
    markTutorialViewed('useState');
  }, [markTutorialViewed]);

  return (
    <div className="p-6 md:p-8">
      {/* Breadcrumb navigation */}
      <div className="text-sm mb-6 flex items-center text-muted-foreground">
        <Link href="/">
          <a className="hover:text-primary transition-colors">Home</a>
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link href="/hooks/use-state">
          <a className="hover:text-primary transition-colors">React Hooks</a>
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-primary">useState</span>
      </div>
      
      {/* Page title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">useState Hook</h1>
        <p className="text-muted-foreground max-w-3xl">
          Learn how to add and manage state in your functional components with React's useState hook. 
          This tutorial covers the basics to advanced patterns with practical examples.
        </p>
      </div>
      
      {/* Learning objectives */}
      <LearningObjectives
        objectives={[
          "Understand the fundamental concept of component state in React",
          "Learn how to implement useState for single and complex values",
          "Master state updates using both direct values and update functions",
          "Apply useState in practical examples with appropriate patterns"
        ]}
      />
      
      {/* Introduction to useState */}
      <div className="mb-10 max-w-3xl">
        <h2 className="text-2xl font-semibold mb-4">Introduction to useState</h2>
        <p className="mb-4">
          The <code className="bg-sidebar text-primary px-1 py-0.5 rounded">useState</code> hook is one of React's most fundamental hooks, 
          allowing functional components to manage state without needing to convert to a class component.
        </p>
        <p>
          Here's the basic syntax of useState:
        </p>
        <div className="bg-sidebar rounded-md p-4 my-4 font-code text-sm">
          <pre><code>const [state, setState] = useState(initialValue);</code></pre>
        </div>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li><strong>state</strong>: The current state value</li>
          <li><strong>setState</strong>: A function to update the state value</li>
          <li><strong>initialValue</strong>: The value state should start with</li>
        </ul>
        <p>
          When the state updates, React re-renders the component to reflect the new state value.
        </p>
      </div>
      
      {/* Example 1: Basic Counter */}
      <div className="mb-10" id="examples">
        <h2 className="text-2xl font-semibold mb-4">Example 1: Basic Counter</h2>
        <p className="mb-4 max-w-3xl">
          Let's start with a simple counter example. This demonstrates how to use useState to track and update a number value.
        </p>
        
        <CodeExample 
          title="Basic Counter Example"
          initialCode={counterExample}
          explanation={
            <div>
              <h4 className="font-medium mb-2">Key Concepts</h4>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>useState initializes with the value 0 and returns the current state (count) and update function (setCount)</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>When any of the buttons are clicked, the corresponding function is called to update the state</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>React automatically re-renders the component when state changes, showing the updated count value</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>This pattern is the foundation for all state management in React functional components</span>
                </li>
              </ul>
            </div>
          }
          analysis={
            <div>
              <h4 className="font-medium mb-2">Code Analysis</h4>
              <p className="mb-2">Let's break down what's happening in this example:</p>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>The <code>useState(0)</code> call creates a state variable initialized to 0</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Destructuring assignment <code>[count, setCount]</code> gives us the current state and update function</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Each button handler calls setCount with a new value based on the current count</span>
                </li>
              </ul>
            </div>
          }
          challenge={
            <div>
              <h4 className="font-medium mb-2">Challenge</h4>
              <p>Try enhancing this counter with these features:</p>
              <ol className="list-decimal pl-5 space-y-1 mt-2">
                <li>Add a "Double" button that multiplies the counter by 2</li>
                <li>Prevent the counter from going below 0</li>
                <li>Add a visual indicator that changes color based on the count value</li>
              </ol>
            </div>
          }
        />
          
        <div className="bg-muted rounded-lg p-5 max-w-3xl">
          <h3 className="flex items-center text-lg font-medium mb-3">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-primary mr-2">
              <path d="M21 10.0836V10.0836C21 6.74281 21 5.07241 20.0311 4.08994C19.0622 3.10748 17.413 3.10748 14.1147 3.10748H9.88526C6.58704 3.10748 4.93793 3.10748 3.96894 4.08994C3 5.07241 3 6.74281 3 10.0836V15.9164C3 19.2572 3 20.9276 3.96894 21.9101C4.93793 22.8925 6.58704 22.8925 9.88526 22.8925H14.1147C17.413 22.8925 19.0622 22.8925 20.0311 21.9101C21 20.9276 21 19.2572 21 15.9164V15.9164" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M8.5 12H15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M12 8.5V15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Important Note
          </h3>
          <p className="mb-2">
            When updating state that depends on the previous state value, it's best to use the function form of setState:
          </p>
          <div className="bg-sidebar rounded-md p-3 my-2 font-code text-sm">
            <pre><code>// Instead of this:
setCount(count + 1);

// Do this:
setCount(prevCount {`=>`} prevCount + 1);</code></pre>
          </div>
          <p>
            This ensures you're always working with the most current state value, especially in cases where multiple state updates 
            might be batched together.
          </p>
        </div>
      </div>
      
      {/* Example 2: Form Input Management */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Example 2: Form Input State</h2>
        <p className="mb-4 max-w-3xl">
          Now let's look at using useState to manage form input data. This example demonstrates handling form inputs with state.
        </p>
        
        <CodeExample 
          title="Form Input Example"
          initialCode={formExample}
          explanation={
            <div>
              <h4 className="font-medium mb-2">Key Concepts</h4>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Using a single useState object to manage multiple related form fields</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>The spread operator (...prevData) to maintain existing state while updating specific fields</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Computed property names [name]: value to dynamically update the correct field based on input name</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Controlled components pattern where form elements' values are controlled by React state</span>
                </li>
              </ul>
            </div>
          }
          analysis={
            <div>
              <h4 className="font-medium mb-2">Code Analysis</h4>
              <p className="mb-2">Let's examine the form state management:</p>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>We use an object with username, email, and role properties to keep all form data in one state variable</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>The handleChange function uses ES6 destructuring and computed property names to update only the changed field</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Each input's value is tied to the corresponding piece of state, creating a two-way binding</span>
                </li>
              </ul>
            </div>
          }
          challenge={
            <div>
              <h4 className="font-medium mb-2">Challenge</h4>
              <p>Enhance this form with these features:</p>
              <ol className="list-decimal pl-5 space-y-1 mt-2">
                <li>Add validation to ensure the username is at least 4 characters</li>
                <li>Add a confirmation field for email and validate they match</li>
                <li>Show a summary of all form data before submission</li>
              </ol>
            </div>
          }
        />
      </div>
      
      {/* Quiz Section */}
      <div id="quiz">
        <Quiz 
          title="Quick Quiz: useState Fundamentals"
          questions={quizQuestions}
          tutorialId="useState"
        />
      </div>
      
      {/* Next steps section */}
      <NextSteps currentPath="/hooks/use-state" category="hooks" />
    </div>
  );
};

export default UseState;
