import React from 'react';
import { Link, useLocation } from 'wouter';
import LearningObjectives from '@/components/tutorial/LearningObjectives';
import CodeExample from '@/components/tutorial/CodeExample';
import Quiz from '@/components/tutorial/Quiz';
import NextSteps from '@/components/tutorial/NextSteps';
import { ChevronRight } from 'lucide-react';
import { useProgress } from '@/hooks/use-progress';

const basicCallbackExample = `import React, { useState, useCallback } from 'react';

function ButtonWithCallback() {
  const [count, setCount] = useState(0);
  const [otherState, setOtherState] = useState(0);
  
  // Without useCallback, this function would be recreated on every render
  const handleClick = useCallback(() => {
    setCount(prevCount => prevCount + 1);
    console.log('Button clicked!');
  }, []); // Empty dependency array means this function is created once
  
  // This function WILL be recreated on every render
  const handleOtherClick = () => {
    setOtherState(prevState => prevState + 1);
    console.log('Other button clicked!');
  };
  
  console.log('ButtonWithCallback rendered');
  
  return (
    <div className="p-4 text-center">
      <h2 className="text-xl font-semibold mb-4">useCallback Example</h2>
      
      <div className="mb-6">
        <p className="mb-2">Primary Counter: {count}</p>
        <ChildComponent onClick={handleClick} label="Increment (useCallback)" />
        
        <p className="text-sm text-muted-foreground mt-2">
          This button uses a memoized callback function
        </p>
      </div>
      
      <div className="mb-6">
        <p className="mb-2">Other Counter: {otherState}</p>
        <ChildComponent onClick={handleOtherClick} label="Increment (No useCallback)" />
        
        <p className="text-sm text-muted-foreground mt-2">
          This button uses a function recreated on every render
        </p>
      </div>
      
      <div className="text-sm p-3 bg-sidebar rounded-md text-left">
        <p>Open the console to see render logs. Notice:</p>
        <ul className="list-disc pl-5 mt-2">
          <li>The first child re-renders only when its callback changes</li>
          <li>The second child re-renders on every parent render</li>
        </ul>
      </div>
    </div>
  );
}

// A child component that accepts an onClick function
// Using React.memo to prevent re-renders if props don't change
const ChildComponent = React.memo(({ onClick, label }) => {
  console.log(\`ChildComponent "\${label}" rendered\`);
  
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-primary text-primary-foreground rounded"
    >
      {label}
    </button>
  );
});

// For our example display
export default function App() {
  return <ButtonWithCallback />;
}`;

const dependencyArrayExample = `import React, { useState, useCallback } from 'react';

function TodoApp() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Learn useCallback', completed: false },
    { id: 3, text: 'Build something cool', completed: false }
  ]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('all');
  
  // Function with dependencies - recreated when todos or filter changes
  const getFilteredTodos = useCallback(() => {
    console.log('Filtering todos with:', filter);
    switch (filter) {
      case 'completed':
        return todos.filter(todo => todo.completed);
      case 'active':
        return todos.filter(todo => !todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);
  
  // Add todo function - only recreated when todos change
  const addTodo = useCallback(() => {
    if (!newTodo.trim()) return;
    
    setTodos(prevTodos => [
      ...prevTodos,
      {
        id: Date.now(),
        text: newTodo,
        completed: false
      }
    ]);
    setNewTodo('');
  }, [newTodo]);
  
  // Toggle todo - recreated when todos changes
  const toggleTodo = useCallback((id) => {
    console.log('Toggling todo:', id);
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);
  
  // Get filtered todos for rendering
  const filteredTodos = getFilteredTodos();
  
  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Todo App with useCallback</h2>
      
      <div className="mb-4 flex">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="px-3 py-2 bg-muted rounded-l border border-input flex-grow"
          placeholder="Add a new todo..."
        />
        <button
          onClick={addTodo}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-r"
        >
          Add
        </button>
      </div>
      
      <div className="mb-4 flex space-x-2">
        <button
          onClick={() => setFilter('all')}
          className={\`px-3 py-1 rounded \${
            filter === 'all' 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted text-foreground'
          }\`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('active')}
          className={\`px-3 py-1 rounded \${
            filter === 'active' 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted text-foreground'
          }\`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={\`px-3 py-1 rounded \${
            filter === 'completed' 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted text-foreground'
          }\`}
        >
          Completed
        </button>
      </div>
      
      <div className="space-y-2">
        {filteredTodos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            toggleTodo={toggleTodo}
          />
        ))}
      </div>
      
      <div className="text-sm p-3 bg-sidebar rounded-md text-left mt-4">
        <p>Open the console to see logs:</p>
        <ul className="list-disc pl-5 mt-2">
          <li>toggleTodo only recreates when its dependencies change</li>
          <li>getFilteredTodos recreates when todos or filter changes</li>
          <li>addTodo recreates when newTodo changes</li>
        </ul>
      </div>
    </div>
  );
}

// A memoized TodoItem component
const TodoItem = React.memo(({ todo, toggleTodo }) => {
  console.log(\`TodoItem "\${todo.text}" rendered\`);
  
  return (
    <div className="flex items-center p-2 bg-muted rounded">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleTodo(todo.id)}
        className="mr-3"
      />
      <span className={todo.completed ? 'line-through text-muted-foreground' : ''}>
        {todo.text}
      </span>
    </div>
  );
});

// For our example display
export default function App() {
  return <TodoApp />;
}`;

const quizQuestions = [
  {
    id: 'q1',
    question: 'What is the primary purpose of useCallback?',
    options: [
      { id: 'a', text: 'To memoize expensive calculations' },
      { id: 'b', text: 'To memoize callback functions between renders' },
      { id: 'c', text: 'To manage side effects in functional components' },
      { id: 'd', text: 'To create stateful variables in components' }
    ],
    correctAnswer: 'b'
  },
  {
    id: 'q2',
    question: 'When is useCallback most beneficial?',
    options: [
      { id: 'a', text: 'When passing callback functions to regular React components' },
      { id: 'b', text: 'When passing callback functions to memoized child components or custom hooks' },
      { id: 'c', text: 'When defining functions that don\'t use any props or state' },
      { id: 'd', text: 'When calling a function immediately in the render function' }
    ],
    correctAnswer: 'b'
  },
  {
    id: 'q3',
    question: 'What happens if you omit the dependency array in useCallback?',
    options: [
      { id: 'a', text: 'The function is created once and never recreated' },
      { id: 'b', text: 'The function is recreated on every render' },
      { id: 'c', text: 'React throws an error' },
      { id: 'd', text: 'The function is only created when explicitly called' }
    ],
    correctAnswer: 'b'
  },
  {
    id: 'q4',
    question: 'What\'s the difference between useCallback and useMemo?',
    options: [
      { id: 'a', text: 'useCallback memoizes functions, while useMemo memoizes values' },
      { id: 'b', text: 'useCallback is for class components, useMemo is for functional components' },
      { id: 'c', text: 'useCallback performs better than useMemo in all cases' },
      { id: 'd', text: 'useCallback can only be used with event handlers, useMemo for all other calculations' }
    ],
    correctAnswer: 'a'
  }
];

const UseCallback = () => {
  const [location] = useLocation();
  const { markTutorialViewed } = useProgress();
  
  // Mark tutorial as viewed when component mounts
  React.useEffect(() => {
    markTutorialViewed('useCallback');
  }, [markTutorialViewed]);

  return (
    <div className="p-6 md:p-8">
      {/* Breadcrumb navigation */}
      <div className="text-sm mb-6 flex items-center text-muted-foreground">
        <Link href="/">
          <a className="hover:text-primary transition-colors">Home</a>
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link href="/hooks/use-callback">
          <a className="hover:text-primary transition-colors">React Hooks</a>
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-primary">useCallback</span>
      </div>
      
      {/* Page title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">useCallback Hook</h1>
        <p className="text-muted-foreground max-w-3xl">
          Learn how to optimize performance by memoizing callback functions with React's useCallback hook.
          This tutorial covers preventing unnecessary function recreations and optimizing child component renders.
        </p>
      </div>
      
      {/* Learning objectives */}
      <LearningObjectives
        objectives={[
          "Understand when and why function identity matters in React",
          "Learn how to implement useCallback to memoize functions",
          "Optimize child component rendering by preventing unnecessary rerenders",
          "Master dependency arrays to control when callbacks are refreshed",
          "Apply useCallback with React.memo for maximum optimization"
        ]}
      />
      
      {/* Introduction to useCallback */}
      <div className="mb-10 max-w-3xl">
        <h2 className="text-2xl font-semibold mb-4">Introduction to useCallback</h2>
        <p className="mb-4">
          The <code className="bg-sidebar text-primary px-1 py-0.5 rounded">useCallback</code> hook lets you memoize (cache) a callback function so it doesn't
          get recreated on every render. This is particularly useful when passing callbacks to optimized child components that rely on reference equality to prevent unnecessary renders.
        </p>
        
        <p className="mb-4">
          In React, when a component renders, all functions defined inside it are recreated. Most of the time this isn't a problem,
          but it can cause performance issues in these scenarios:
        </p>
        
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>When passing callbacks to child components that use React.memo</li>
          <li>When a function is used as a dependency in hooks like useEffect</li>
          <li>When the function creation itself is expensive</li>
          <li>When the function is used with other hooks that depend on stable references</li>
        </ul>
        
        <p className="mb-4">Here's the basic syntax of useCallback:</p>
        
        <div className="bg-sidebar rounded-md p-4 my-4 font-code text-sm">
          <pre>const memoizedCallback = useCallback(
  function() {'{'} /* function body */ {'}'},
  [dependency1, dependency2]
);</pre>
        </div>
        
        <p className="mb-2">
          useCallback takes two arguments:
        </p>
        <ol className="list-decimal pl-6 space-y-2 mb-4">
          <li>A callback function that you want to memoize</li>
          <li>A dependency array of values that, when changed, will cause the callback to be recreated</li>
        </ol>
      </div>
      
      {/* Example 1: Basic useCallback Usage */}
      <div className="mb-10" id="examples">
        <h2 className="text-2xl font-semibold mb-4">Example 1: Basic useCallback with React.memo</h2>
        <p className="mb-4 max-w-3xl">
          This example demonstrates how useCallback prevents unnecessary rerenders when passing callback
          functions to memoized child components.
        </p>
        
        <CodeExample 
          title="useCallback with React.memo"
          initialCode={basicCallbackExample}
          explanation={
            <div>
              <h4 className="font-medium mb-2">Key Concepts</h4>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>useCallback preserves the function reference between renders</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>React.memo prevents re-rendering if props (including function references) haven't changed</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>The first ChildComponent doesn't re-render when the parent renders because its onClick prop stays the same</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>The second ChildComponent re-renders every time because its onClick prop is recreated each render</span>
                </li>
              </ul>
            </div>
          }
          analysis={
            <div>
              <h4 className="font-medium mb-2">Code Analysis</h4>
              <p className="mb-2">Let's examine what's happening with function identity:</p>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>handleClick is memoized with an empty dependency array, so it's only created once</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>handleOtherClick is defined inside the component without useCallback, so it's recreated on every render</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>React.memo on ChildComponent makes it sensitive to prop changes - it will only re-render if its props change</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Console logs help visualize when components and functions are recreated</span>
                </li>
              </ul>
            </div>
          }
          challenge={
            <div>
              <h4 className="font-medium mb-2">Challenge</h4>
              <p>Expand this example with:</p>
              <ol className="list-decimal pl-5 space-y-1 mt-2">
                <li>Add a reset button that uses useCallback with the count in its dependency array</li>
                <li>Create a third counter that uses both count and otherState in its callback</li>
                <li>Add console.time() measurements to compare render performance</li>
              </ol>
            </div>
          }
        />
      </div>
      
      {/* Example 2: Dependencies */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Example 2: useCallback with Dependencies</h2>
        <p className="mb-4 max-w-3xl">
          This example demonstrates how to effectively use the dependency array in useCallback
          to control when functions are recreated, in a more complex scenario.
        </p>
        
        <CodeExample 
          title="Todo App with useCallback Dependencies"
          initialCode={dependencyArrayExample}
          explanation={
            <div>
              <h4 className="font-medium mb-2">Key Concepts</h4>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Different callbacks have different dependency requirements</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>getFilteredTodos depends on todos and filter, so both are in the dependency array</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>addTodo depends on newTodo, so it's in the dependency array</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>toggleTodo uses the function form of setState, so it doesn't need todos as a dependency</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>TodoItem uses React.memo to avoid re-rendering when its props don't change</span>
                </li>
              </ul>
            </div>
          }
          analysis={
            <div>
              <h4 className="font-medium mb-2">Code Analysis</h4>
              <p className="mb-2">Let's analyze the dependency choices:</p>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>For toggleTodo, we use the function form of setState, which doesn't need the current todos as a dependency</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>For getFilteredTodos, we need both todos and filter since the output depends on both</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>React.memo on TodoItem prevents needless re-renders when the parent component changes state</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>When filter changes, only getFilteredTodos is recreated; the other callbacks remain stable</span>
                </li>
              </ul>
            </div>
          }
          challenge={
            <div>
              <h4 className="font-medium mb-2">Challenge</h4>
              <p>Enhance the todo application:</p>
              <ol className="list-decimal pl-5 space-y-1 mt-2">
                <li>Add the ability to edit existing todos</li>
                <li>Implement a bulk action feature (complete all, delete all)</li>
                <li>Add local storage persistence using useEffect and your memoized functions</li>
              </ol>
            </div>
          }
        />
      </div>
      
      {/* useCallback vs useMemo */}
      <div className="mb-10 max-w-3xl">
        <div className="bg-muted rounded-lg p-5">
          <h3 className="flex items-center text-lg font-medium mb-3">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-primary mr-2">
              <path d="M21 10.0836V10.0836C21 6.74281 21 5.07241 20.0311 4.08994C19.0622 3.10748 17.413 3.10748 14.1147 3.10748H9.88526C6.58704 3.10748 4.93793 3.10748 3.96894 4.08994C3 5.07241 3 6.74281 3 10.0836V15.9164C3 19.2572 3 20.9276 3.96894 21.9101C4.93793 22.8925 6.58704 22.8925 9.88526 22.8925H14.1147C17.413 22.8925 19.0622 22.8925 20.0311 21.9101C21 20.9276 21 19.2572 21 15.9164V15.9164" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M8.5 12H15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M12 8.5V15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            useCallback vs useMemo
          </h3>
          <p className="mb-3">
            useCallback and useMemo are closely related but have different purposes:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div className="bg-sidebar p-3 rounded">
              <h4 className="font-medium mb-2 text-primary">useCallback</h4>
              <ul className="space-y-1 pl-3">
                <li>Memoizes a function reference</li>
                <li>Returns the function itself</li>
                <li>Use for callbacks passed to child components</li>
                <li>Use when a function is a dependency in other hooks</li>
              </ul>
              <div className="mt-2 font-code text-xs bg-muted p-2 rounded">
                <pre>useCallback(function() {'{'} fn(a, b) {'}'}, [a, b]);</pre>
              </div>
            </div>
            
            <div className="bg-sidebar p-3 rounded">
              <h4 className="font-medium mb-2 text-primary">useMemo</h4>
              <ul className="space-y-1 pl-3">
                <li>Memoizes a computed value</li>
                <li>Returns the result of calling the function</li>
                <li>Use for expensive calculations</li>
                <li>Use when creating objects to avoid new references</li>
              </ul>
              <div className="mt-2 font-code text-xs bg-muted p-2 rounded">
                <pre>useMemo(function() {'{'} return fn(a, b); {'}'}, [a, b]);</pre>
              </div>
            </div>
          </div>
          
          <p>
            Both hooks can technically be used to achieve similar goals, but using them for their intended purposes
            makes your code more readable and potentially more optimized.
          </p>
        </div>
      </div>
      
      {/* Quiz Section */}
      <div id="quiz">
        <Quiz 
          title="Quiz: useCallback Concepts"
          questions={quizQuestions}
          tutorialId="useCallback"
        />
      </div>
      
      {/* Next steps section */}
      <NextSteps currentPath="/hooks/use-callback" category="hooks" />
    </div>
  );
};

export default UseCallback;
