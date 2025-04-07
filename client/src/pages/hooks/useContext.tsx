import React from 'react';
import { Link, useLocation } from 'wouter';
import LearningObjectives from '@/components/tutorial/LearningObjectives';
import CodeExample from '@/components/tutorial/CodeExample';
import Quiz from '@/components/tutorial/Quiz';
import NextSteps from '@/components/tutorial/NextSteps';
import { ChevronRight } from 'lucide-react';
import { useProgress } from '@/hooks/use-progress';

const basicContextExample = `
function ThemeApp() {
var ThemeContext = React.createContext({
  isDark: false,
  toggleTheme: () => {}
});

// Step 2: Create a provider component
function ThemeProvider({ children }) {
  const [isDark, setIsDark] = React.useState(false);
  
  // Function to toggle theme
  const toggleTheme = () => {
    setIsDark(prevIsDark => !prevIsDark);
  };
  
  // Create the value object that will be provided
  const themeContextValue = {
    isDark,
    toggleTheme
  };
  
  return (
    <ThemeContext.Provider value={themeContextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// Step 3: Create components that consume the context
function ThemedButton() {
  // Use the useContext hook to access the context value
  const { isDark, toggleTheme } = React.useContext(ThemeContext);
  
  return (
    <button
      onClick={toggleTheme}
      className={\`px-4 py-2 rounded transition-colors \${
        isDark 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-muted text-foreground'
      }\`}
    >
      Toggle Theme
    </button>
  );
}

function ThemedText() {
  // Another component consuming the same context
  const { isDark } = React.useContext(ThemeContext);
  
  return (
    <p className="mt-4">
      Current theme is: <strong>{isDark ? 'Dark' : 'Light'}</strong>
    </p>
  );
}

// Step 4: Use the components together
function App() {
  return (
    <ThemeProvider>
      <div className="text-center p-4">
        <h2 className="text-xl font-semibold mb-4">Theme Context Example</h2>
        <ThemedButton />
        <ThemedText />
      </div>
    </ThemeProvider>
  );
}
return <App/>
}`;

const nestedContextExample = `
function nestedContext() {
// Step 1: Create the contexts
const ThemeContext = React.createContext('light');
const UserContext = React.createContext(null);

// Step 2: Create Provider components
function AppProvider({ children }) {
  const [theme, setTheme] = React.useState('light');
  const [user, setUser] = React.useState({
    name: 'Guest User',
    isLoggedIn: false,
    role: 'visitor'
  });
  
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };
  
  const login = () => {
    setUser({
      name: 'John Doe',
      isLoggedIn: true,
      role: 'admin'
    });
  };
  
  const logout = () => {
    setUser({
      name: 'Guest User',
      isLoggedIn: false,
      role: 'visitor'
    });
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <UserContext.Provider value={{ user, login, logout }}>
        {children}
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}

// Step 3: Create custom hooks
function useTheme() {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

function useUser() {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

// Step 4: Create components that use the contexts
function ThemedHeader() {
  const { theme, toggleTheme } = useTheme();
  
  const headerStyle = {
    backgroundColor: theme === 'light' ? '#f0f4f8' : '#1a202c',
    color: theme === 'light' ? '#1a202c' : '#f0f4f8',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    borderRadius: '0.375rem'
  };
  
  return (
    <header style={headerStyle}>
      <h2>Context Demo App</h2>
      <button 
        onClick={toggleTheme}
        style={{
          backgroundColor: theme === 'light' ? '#4299e1' : '#63b3ed',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '0.25rem',
          cursor: 'pointer'
        }}
      >
        Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
      </button>
    </header>
  );
}

function UserProfile() {
  const { user, login, logout } = useUser();
  
  return (
    <div 
      style={{ 
        padding: '1rem', 
        backgroundColor: '#f3f4f6', 
        borderRadius: '0.375rem',
        marginBottom: '1rem'
      }}
    >
      <h3 style={{ marginBottom: '0.5rem' }}>User Profile</h3>
      <p>Name: {user.name}</p>
      <p>Status: {user.isLoggedIn ? 'Logged In' : 'Logged Out'}</p>
      <p>Role: {user.role}</p>
      <button
        onClick={user.isLoggedIn ? logout : login}
        style={{
          backgroundColor: user.isLoggedIn ? '#e53e3e' : '#38a169',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '0.25rem',
          marginTop: '0.5rem',
          cursor: 'pointer'
        }}
      >
        {user.isLoggedIn ? 'Log Out' : 'Log In'}
      </button>
    </div>
  );
}

function Content() {
  const { theme } = useTheme();
  const { user } = useUser();
  
  const contentStyle = {
    padding: '1rem',
    backgroundColor: theme === 'light' ? 'white' : '#2d3748',
    color: theme === 'light' ? '#1a202c' : 'white',
    borderRadius: '0.375rem',
    border: '1px solid',
    borderColor: theme === 'light' ? '#e2e8f0' : '#4a5568'
  };
  
  return (
    <div style={contentStyle}>
      <h3 style={{ marginBottom: '0.5rem' }}>Content Area</h3>
      <p>This content is being displayed in {theme} theme mode.</p>
      
      {user.isLoggedIn ? (
        <div style={{ marginTop: '1rem' }}>
          <p>Welcome back, {user.name}!</p>
          <p>You have access to this content because you're logged in as {user.role}.</p>
        </div>
      ) : (
        <div style={{ marginTop: '1rem' }}>
          <p>Please log in to see restricted content.</p>
        </div>
      )}
    </div>
  );
}

// Step 5: Create the main App component
function App() {
  return (
    <AppProvider>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
        <ThemedHeader />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <UserProfile />
          <Content />
        </div>
      </div>
    </AppProvider>
  );
}
  return <App />
}`;

const quizQuestions = [
  {
    id: 'q1',
    question: 'What problem does the useContext hook solve in React?',
    options: [
      { id: 'a', text: 'It prevents components from re-rendering' },
      { id: 'b', text: 'It allows components to share state without prop drilling' },
      { id: 'c', text: 'It optimizes the performance of React applications' },
      { id: 'd', text: 'It manages side effects in functional components' }
    ],
    correctAnswer: 'b'
  },
  {
    id: 'q2',
    question: 'What are the two key parts needed to use React Context?',
    options: [
      { id: 'a', text: 'Provider and Consumer' },
      { id: 'b', text: 'Reducer and Action' },
      { id: 'c', text: 'State and Props' },
      { id: 'd', text: 'Dispatcher and Selector' }
    ],
    correctAnswer: 'a'
  },
  {
    id: 'q3',
    question: 'When a context value changes, which components will re-render?',
    options: [
      { id: 'a', text: 'Only the component that called useContext' },
      { id: 'b', text: 'All components in the application' },
      { id: 'c', text: 'The Provider component and all components that consume that context' },
      { id: 'd', text: 'Only the direct children of the Provider component' }
    ],
    correctAnswer: 'c'
  }
];

const UseContext = () => {
  const [location] = useLocation();
  const { markTutorialViewed } = useProgress();
  
  // Mark tutorial as viewed when component mounts
  React.useEffect(() => {
    markTutorialViewed('useContext');
  }, [markTutorialViewed]);

  return (
    <div className="p-6 md:p-8">
      {/* Breadcrumb navigation */}
      <div className="text-sm mb-6 flex items-center text-muted-foreground">
        <Link href="/">
          <a className="hover:text-primary transition-colors">Home</a>
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link href="/hooks/use-context">
          <a className="hover:text-primary transition-colors">React Hooks</a>
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-primary">useContext</span>
      </div>
      
      {/* Page title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">useContext Hook</h1>
        <p className="text-muted-foreground max-w-3xl">
          Learn how to share state between components without prop drilling using React's Context API
          and the useContext hook.
        </p>
      </div>
      
      {/* Learning objectives */}
      <LearningObjectives
        objectives={[
          "Understand the concept of React Context and its use cases",
          "Learn how to create and provide context with createContext",
          "Master consuming context values with the useContext hook",
          "Implement nested contexts for complex state management",
          "Apply best practices for context performance optimization"
        ]}
      />
      
      {/* Introduction to useContext */}
      <div className="mb-10 max-w-3xl">
        <h2 className="text-2xl font-semibold mb-4">Introduction to useContext</h2>
        <p className="mb-4">
          The <code className="bg-sidebar text-primary px-1 py-0.5 rounded">useContext</code> hook lets you consume values from React's Context API.
          Context provides a way to pass data through the component tree without having to pass props down manually at every level.
        </p>
        
        <p className="mb-4">
          Context is designed to share data that can be considered "global" for a tree of React components, such as:
        </p>
        
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>Current authenticated user</li>
          <li>Theme (dark/light mode)</li>
          <li>Language or locale preferences</li>
          <li>UI state that affects many components</li>
        </ul>
        
        <p className="mb-4">Here's the basic pattern for using Context in React:</p>
        
        <div className="bg-sidebar rounded-md p-4 my-4 font-code text-sm">
          <pre><code>// 1. Create a context
const MyContext = createContext(defaultValue);

// 2. Provide a value from a component
function ParentComponent() {"{"} 
  return (
    &lt;MyContext.Provider value={"{"}/* some value */{"}"}&gt;
      &lt;ChildComponents /&gt;
    &lt;/MyContext.Provider&gt;
  );
{"}"}

// 3. Consume the context in any nested component
function ChildComponent() {"{"} 
  const contextValue = useContext(MyContext);
  // Use the context value
{"}"}</code></pre>
        </div>
      </div>
      
      {/* Example 1: Basic Theme Context */}
      <div className="mb-10" id="examples">
        <h2 className="text-2xl font-semibold mb-4">Example 1: Theme Context</h2>
        <p className="mb-4 max-w-3xl">
          This example demonstrates a simple theme context that allows components to access and toggle
          between light and dark themes.
        </p>
        
        <CodeExample 
          title="Basic Theme Context Example"
          initialCode={basicContextExample}
          explanation={
            <div>
              <h4 className="font-medium mb-2">Key Concepts</h4>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Creating a context with createContext and providing a default value</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Building a provider component that manages state and passes it through context</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Consuming context in child components with useContext</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Multiple components can consume the same context value</span>
                </li>
              </ul>
            </div>
          }
          analysis={
            <div>
              <h4 className="font-medium mb-2">Code Analysis</h4>
              <p className="mb-2">Let's break down the implementation:</p>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>We create ThemeContext with a default object that matches the shape of our actual value</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>The ThemeProvider component maintains state and provides both the state and updater function</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Both ThemedButton and ThemedText components can access and react to theme changes</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>When the button is clicked, all components consuming the context re-render with the new value</span>
                </li>
              </ul>
            </div>
          }
          challenge={
            <div>
              <h4 className="font-medium mb-2">Challenge</h4>
              <p>Enhance the theme context example:</p>
              <ol className="list-decimal pl-5 space-y-1 mt-2">
                <li>Add a third theme option (e.g., "System" that follows the OS setting)</li>
                <li>Store the theme preference in localStorage so it persists between page refreshes</li>
                <li>Add a themed header component that changes background color based on the theme</li>
              </ol>
            </div>
          }
        />
      </div>
      
      {/* Example 2: Multiple Contexts */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Example 2: Multiple Nested Contexts</h2>
        <p className="mb-4 max-w-3xl">
          This more advanced example demonstrates using multiple nested contexts together,
          along with custom hooks for better organization.
        </p>
        
        <CodeExample 
          title="Multiple Contexts Example"
          initialCode={nestedContextExample}
          explanation={
            <div>
              <h4 className="font-medium mb-2">Key Concepts</h4>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Creating and nesting multiple context providers</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Combining context with other hooks like useState and useReducer</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Creating custom hooks to simplify context consumption</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Adding error handling to ensure contexts are used correctly</span>
                </li>
              </ul>
            </div>
          }
          analysis={
            <div>
              <h4 className="font-medium mb-2">Code Analysis</h4>
              <p className="mb-2">Let's analyze the advanced patterns used:</p>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>We create multiple contexts and nest their providers, allowing components to access both contexts</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>The cart uses useReducer for more complex state management, while user info uses useState</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Custom hooks (useUser and useCart) provide error checking and simplify component code</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Components only consume the context they need, making them more focused and maintainable</span>
                </li>
              </ul>
            </div>
          }
          challenge={
            <div>
              <h4 className="font-medium mb-2">Challenge</h4>
              <p>Extend the multiple contexts example:</p>
              <ol className="list-decimal pl-5 space-y-1 mt-2">
                <li>Add a third context for notifications (success/error messages)</li>
                <li>Create a component that shows notifications when cart items are added/removed</li>
                <li>Add a feature that restricts certain cart actions to logged-in users only</li>
              </ol>
            </div>
          }
        />
      </div>
      
      {/* Best Practices */}
      <div className="mb-10 max-w-3xl">
        <div className="bg-muted rounded-lg p-5">
          <h3 className="flex items-center text-lg font-medium mb-3">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-primary mr-2">
              <path d="M21 10.0836V10.0836C21 6.74281 21 5.07241 20.0311 4.08994C19.0622 3.10748 17.413 3.10748 14.1147 3.10748H9.88526C6.58704 3.10748 4.93793 3.10748 3.96894 4.08994C3 5.07241 3 6.74281 3 10.0836V15.9164C3 19.2572 3 20.9276 3.96894 21.9101C4.93793 22.8925 6.58704 22.8925 9.88526 22.8925H14.1147C17.413 22.8925 19.0622 22.8925 20.0311 21.9101C21 20.9276 21 19.2572 21 15.9164V15.9164" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M8.5 12H15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M12 8.5V15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Context Best Practices
          </h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
              <span><strong>Context splitting</strong>: Split contexts by domain/purpose to prevent unnecessary re-renders</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
              <span><strong>Memoization</strong>: Use React.memo, useMemo, or useCallback to optimize context value stability</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
              <span><strong>Custom hooks</strong>: Create custom hooks for each context to simplify consumption and add validation</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
              <span><strong>Default values</strong>: Always provide meaningful default values that match your context shape</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
              <span><strong>When not to use</strong>: Avoid context for props that only need to go down one or two levels</span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Quiz Section */}
      <div id="quiz">
        <Quiz 
          title="Quiz: useContext Concepts"
          questions={quizQuestions}
          tutorialId="useContext"
        />
      </div>
      
      {/* Next steps section */}
      <NextSteps currentPath="/hooks/use-context" category="hooks" />
    </div>
  );
};

export default UseContext;
