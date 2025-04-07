import React from 'react';
import { Link, useLocation } from 'wouter';
import LearningObjectives from '@/components/tutorial/LearningObjectives';
import CodeExample from '@/components/tutorial/CodeExample';
import Quiz from '@/components/tutorial/Quiz';
import NextSteps from '@/components/tutorial/NextSteps';
import { ChevronRight } from 'lucide-react';
import { useProgress } from '@/hooks/use-progress';

const basicContextExample = `import React, { createContext, useContext, useState } from 'react';

// Step 1: Create a context with a default value
const ThemeContext = createContext({
  isDark: false,
  toggleTheme: () => {}
});

// Step 2: Create a provider component
function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  
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
  const { isDark, toggleTheme } = useContext(ThemeContext);
  
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
  const { isDark } = useContext(ThemeContext);
  
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

export default App;`;

const nestedContextExample = `import React, { createContext, useContext, useState, useReducer } from 'react';

// Step 1: Create the contexts
const UserContext = createContext();
const ShoppingCartContext = createContext();

// Shopping cart reducer
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      return [...state, action.payload];
    case 'REMOVE_ITEM':
      return state.filter(item => item.id !== action.payload);
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
}

// Step 2: Create provider components
function AppProviders({ children }) {
  // User state
  const [user, setUser] = useState({
    name: 'John Doe',
    isLoggedIn: true
  });
  
  // Cart state using useReducer
  const [cart, dispatch] = useReducer(cartReducer, []);
  
  // Login/logout function
  const toggleLogin = () => {
    setUser(prevUser => ({
      ...prevUser,
      isLoggedIn: !prevUser.isLoggedIn
    }));
  };
  
  // Add a product to cart
  const addToCart = (product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };
  
  // Remove a product from cart
  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };
  
  // Clear the entire cart
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  return (
    <UserContext.Provider value={{ user, toggleLogin }}>
      <ShoppingCartContext.Provider value={{ 
        cart, 
        addToCart, 
        removeFromCart, 
        clearCart 
      }}>
        {children}
      </ShoppingCartContext.Provider>
    </UserContext.Provider>
  );
}

// Step 3: Create custom hooks to use the contexts
function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserContext.Provider');
  }
  return context;
}

function useCart() {
  const context = useContext(ShoppingCartContext);
  if (!context) {
    throw new Error('useCart must be used within a ShoppingCartContext.Provider');
  }
  return context;
}

// Step 4: Create components that use the contexts
function UserProfile() {
  const { user, toggleLogin } = useUser();
  
  return (
    <div className="p-4 bg-muted rounded-md mb-4">
      <h3 className="font-medium mb-2">User Profile</h3>
      <p className="mb-2">
        <strong>Name:</strong> {user.name}
      </p>
      <p className="mb-3">
        <strong>Status:</strong> {user.isLoggedIn ? 'Logged In' : 'Logged Out'}
      </p>
      <button 
        className="px-3 py-1 bg-primary text-primary-foreground rounded"
        onClick={toggleLogin}
      >
        {user.isLoggedIn ? 'Log Out' : 'Log In'}
      </button>
    </div>
  );
}

function ShoppingCart() {
  const { cart, removeFromCart, clearCart } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);
  
  return (
    <div className="p-4 bg-muted rounded-md">
      <h3 className="font-medium mb-2">Shopping Cart</h3>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <ul className="mb-3">
            {cart.map(item => (
              <li key={item.id} className="flex justify-between items-center mb-2">
                <span>{item.name} (${item.price.toFixed(2)})</span>
                <button 
                  className="text-xs px-2 py-1 bg-destructive text-destructive-foreground rounded"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center mb-3">
            <span className="font-medium">Total:</span>
            <span>${total}</span>
          </div>
          <button 
            className="px-3 py-1 bg-primary text-primary-foreground rounded w-full"
            onClick={clearCart}
          >
            Clear Cart
          </button>
        </>
      )}
    </div>
  );
}

// Step 5: Combine them in an App
function App() {
  return (
    <AppProviders>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Multiple Contexts Example</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UserProfile />
          <ShoppingCart />
        </div>
      </div>
    </AppProviders>
  );
}

export default App;`;

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
