import React from 'react';
import { Link, useLocation } from 'wouter';
import LearningObjectives from '@/components/tutorial/LearningObjectives';
import CodeExample from '@/components/tutorial/CodeExample';
import Quiz from '@/components/tutorial/Quiz';
import NextSteps from '@/components/tutorial/NextSteps';
import { ChevronRight } from 'lucide-react';
import { useProgress } from '@/hooks/use-progress';

const basicReducerExample = `


function Counter() {
// Step 1: Define an initial state
const initialState = { count: 0 };

// Step 2: Create a reducer function
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    case 'set':
      return { count: action.payload };
    default:
      throw new Error('Unknown action type');
  }
}
  // Step 3: Call useReducer with the reducer function and initial state
  const [state, dispatch] = React.useReducer(reducer, initialState);
  
  return (
    <div className="p-4 text-center">
      <h2 className="text-xl font-semibold mb-4">Counter with useReducer</h2>
      
      <p className="text-3xl mb-4">{state.count}</p>
      
      <div className="flex justify-center space-x-2">
        <button
          onClick={() => dispatch({ type: 'decrement' })}
          className="px-4 py-2 bg-muted rounded"
        >
          -
        </button>
        <button
          onClick={() => dispatch({ type: 'reset' })}
          className="px-4 py-2 bg-muted rounded"
        >
          Reset
        </button>
        <button
          onClick={() => dispatch({ type: 'increment' })}
          className="px-4 py-2 bg-muted rounded"
        >
          +
        </button>
      </div>
      
      <div className="mt-4">
        <button
          onClick={() => dispatch({ type: 'set', payload: 10 })}
          className="px-4 py-2 bg-primary text-primary-foreground rounded"
        >
          Set to 10
        </button>
      </div>
    </div>
  );
}`;

const complexStateExample = `
function complexStateExample() {
// Step 1: Define the initial state for a shopping cart
const initialState = {
  items: [],
  total: 0,
  loading: false,
  error: null
};

// Step 2: Create a reducer function
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      const newItem = action.payload;
      // Check if item already exists in cart
      const existingItemIndex = state.items.findIndex(
        item => item.id === newItem.id
      );
      
      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        
        return {
          ...state,
          items: updatedItems,
          total: state.total + newItem.price
        };
      } else {
        // New item, add to cart
        return {
          ...state,
          items: [...state.items, { ...newItem, quantity: 1 }],
          total: state.total + newItem.price
        };
      }
    
    case 'REMOVE_ITEM':
      const itemId = action.payload;
      const itemToRemove = state.items.find(item => item.id === itemId);
      
      if (!itemToRemove) return state;
      
      // Calculate refund amount based on quantity * price
      const refundAmount = itemToRemove.price * itemToRemove.quantity;
      
      return {
        ...state,
        items: state.items.filter(item => item.id !== itemId),
        total: state.total - refundAmount
      };
    
    case 'UPDATE_QUANTITY':
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        // If quantity is zero or negative, remove the item
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: id });
      }
      
      const itemIndex = state.items.findIndex(item => item.id === id);
      if (itemIndex === -1) return state;
      
      const item = state.items[itemIndex];
      const quantityDiff = quantity - item.quantity;
      const priceDiff = item.price * quantityDiff;
      
      const updatedItems = [...state.items];
      updatedItems[itemIndex] = {
        ...item,
        quantity: quantity
      };
      
      return {
        ...state,
        items: updatedItems,
        total: state.total + priceDiff
      };
    
    case 'CLEAR_CART':
      return {
        ...initialState
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
        error: null
      };
    
    default:
      return state;
  }
}

// Available products to add to cart
const products = [
  { id: 1, name: 'React Book', price: 29.99 },
  { id: 2, name: 'TypeScript Course', price: 49.99 },
  { id: 3, name: 'Redux Toolkit', price: 19.99 }
];

function ShoppingCart() {
  // Step 3: Use the reducer
  const [cart, dispatch] = React.useReducer(cartReducer, initialState);
  
  // Handle adding product to cart
  const addToCart = (product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };
  
  // Handle updating item quantity
  const updateQuantity = (id, quantity) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { id, quantity: parseInt(quantity) }
    });
  };
  
  // Simulate checkout process
  const checkout = () => {
    if (cart.items.length === 0) {
      dispatch({ type: 'SET_ERROR', payload: 'Your cart is empty!' });
      return;
    }
    
    dispatch({ type: 'SET_LOADING', payload: true });
    
    // Simulate API call
    setTimeout(() => {
      dispatch({ type: 'CLEAR_CART' });
      alert('Checkout successful!');
      dispatch({ type: 'SET_LOADING', payload: false });
    }, 1500);
  };
  
  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Shopping Cart with useReducer</h2>
      
      {/* Products list */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Available Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {products.map(product => (
            <div key={product.id} className="p-3 border rounded bg-muted">
              <div className="font-medium">{product.name}</div>
              <div className="text-sm mb-2">\${product.price.toFixed(2)}</div>
              <button
                onClick={() => addToCart(product)}
                className="w-full px-2 py-1 bg-primary text-primary-foreground rounded text-sm"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Cart items */}
      <div className="mb-4">
        <h3 className="font-medium mb-2">Shopping Cart</h3>
        
        {cart.error && (
          <div className="p-2 mb-2 bg-destructive/10 text-destructive rounded">
            {cart.error}
          </div>
        )}
        
        {cart.items.length === 0 ? (
          <div className="p-3 bg-muted rounded text-center">
            Your cart is empty
          </div>
        ) : (
          <div className="space-y-2">
            {cart.items.map(item => (
              <div key={item.id} className="p-3 bg-muted rounded flex justify-between items-center">
                <div>
                  <div>{item.name}</div>
                  <div className="text-sm text-muted-foreground">
                    \${item.price.toFixed(2)} x 
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, e.target.value)}
                      className="w-12 mx-1 px-1 py-0 bg-sidebar rounded"
                    />
                    = \${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
                <button
                  onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}
                  className="px-2 py-1 bg-destructive text-destructive-foreground rounded text-xs"
                >
                  Remove
                </button>
              </div>
            ))}
            
            <div className="p-3 bg-sidebar rounded flex justify-between font-medium">
              <span>Total:</span>
              <span>\${cart.total.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={() => dispatch({ type: 'CLEAR_CART' })}
          className="px-4 py-2 bg-muted rounded"
          disabled={cart.items.length === 0 || cart.loading}
        >
          Clear Cart
        </button>
        <button
          onClick={checkout}
          className="px-4 py-2 bg-primary text-primary-foreground rounded"
          disabled={cart.loading}
        >
          {cart.loading ? 'Processing...' : 'Checkout'}
        </button>
      </div>
    </div>
  );
}
return <ShoppingCart />;
}`;

const quizQuestions = [
  {
    id: 'q1',
    question: 'What is the primary purpose of useReducer?',
    options: [
      { id: 'a', text: 'To manage component re-renders' },
      { id: 'b', text: 'To handle side effects in functional components' },
      { id: 'c', text: 'To manage complex state logic in a more predictable way' },
      { id: 'd', text: 'To optimize performance for heavy calculations' }
    ],
    correctAnswer: 'c'
  },
  {
    id: 'q2',
    question: 'What are the two main arguments passed to useReducer?',
    options: [
      { id: 'a', text: 'Initial state and a state updater function' },
      { id: 'b', text: 'Reducer function and initial state' },
      { id: 'c', text: 'Action type and payload' },
      { id: 'd', text: 'State and props' }
    ],
    correctAnswer: 'b'
  },
  {
    id: 'q3',
    question: 'How do you trigger a state update when using useReducer?',
    options: [
      { id: 'a', text: 'Call the reducer function directly' },
      { id: 'b', text: 'Use the setState function like with useState' },
      { id: 'c', text: 'Call the dispatch function with an action object' },
      { id: 'd', text: 'Modify the state object directly' }
    ],
    correctAnswer: 'c'
  },
  {
    id: 'q4',
    question: 'When would you choose useReducer over useState?',
    options: [
      { id: 'a', text: 'When you need a simple boolean flag' },
      { id: 'b', text: 'When you have complex state logic with multiple sub-values or when the next state depends on the previous one' },
      { id: 'c', text: 'Only when working with APIs' },
      { id: 'd', text: 'useReducer should always be used instead of useState' }
    ],
    correctAnswer: 'b'
  }
];

const UseReducer = () => {
  const [location] = useLocation();
  const { markTutorialViewed } = useProgress();
  
  // Mark tutorial as viewed when component mounts
  React.useEffect(() => {
    markTutorialViewed('useReducer');
  }, [markTutorialViewed]);

  return (
    <div className="p-6 md:p-8">
      {/* Breadcrumb navigation */}
      <div className="text-sm mb-6 flex items-center text-muted-foreground">
        <Link href="/">
          <a className="hover:text-primary transition-colors">Home</a>
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link href="/hooks/use-reducer">
          <a className="hover:text-primary transition-colors">React Hooks</a>
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-primary">useReducer</span>
      </div>
      
      {/* Page title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">useReducer Hook</h1>
        <p className="text-muted-foreground max-w-3xl">
          Learn how to manage complex state logic with the useReducer hook, a powerful alternative to useState
          that helps organize state updates through actions and reducers.
        </p>
      </div>
      
      {/* Learning objectives */}
      <LearningObjectives
        objectives={[
          "Understand the concept of reducers and when to use them",
          "Learn how to implement useReducer for state management",
          "Master the action-based state update pattern",
          "Organize complex state logic in a maintainable way",
          "Compare useReducer with useState for different use cases"
        ]}
      />
      
      {/* Introduction to useReducer */}
      <div className="mb-10 max-w-3xl">
        <h2 className="text-2xl font-semibold mb-4">Introduction to useReducer</h2>
        <p className="mb-4">
          The <code className="bg-sidebar text-primary px-1 py-0.5 rounded">useReducer</code> hook is a more powerful alternative to <code className="bg-sidebar text-primary px-1 py-0.5 rounded">useState</code> when
          you have complex state logic that involves multiple sub-values or when the next state depends on the previous one.
          It's inspired by how Redux works and follows the reducer pattern.
        </p>
        
        <p className="mb-4">
          A reducer is a pure function that takes the current state and an action as arguments, and returns a new state.
          This pattern helps organize code by centralizing state update logic into a single function.
        </p>
        
        <p className="mb-4">Here's the basic syntax of useReducer:</p>
        
        <div className="bg-sidebar rounded-md p-4 my-4 font-code text-sm">
          <pre><code>const [state, dispatch] = useReducer(reducer, initialState);</code></pre>
        </div>
        
        <p className="mb-2">
          The pattern typically follows these steps:
        </p>
        <ol className="list-decimal pl-6 space-y-2 mb-4">
          <li>Define an initial state object</li>
          <li>Create a reducer function that handles different action types</li>
          <li>Use the useReducer hook to get the current state and a dispatch function</li>
          <li>Call dispatch with action objects to update the state</li>
        </ol>
        
        <p className="mb-4">
          An action is usually an object with a <code className="bg-sidebar text-primary px-1 py-0.5 rounded">type</code> property and optional <code className="bg-sidebar text-primary px-1 py-0.5 rounded">payload</code> data:
        </p>
        
        <div className="bg-sidebar rounded-md p-4 my-4 font-code text-sm">
          <pre><code>dispatch({"{"} type: 'INCREMENT' {"}"}); // Simple action
dispatch({"{"} type: 'ADD_TODO', payload: {"{"} text: 'Learn useReducer' {"}"} {"}"}); // With payload</code></pre>
        </div>
      </div>
      
      {/* Example 1: Basic Counter with useReducer */}
      <div className="mb-10" id="examples">
        <h2 className="text-2xl font-semibold mb-4">Example 1: Counter with useReducer</h2>
        <p className="mb-4 max-w-3xl">
          This example demonstrates a simple counter implemented with useReducer instead of useState,
          showing the basic structure of a reducer-based approach.
        </p>
        
        <CodeExample 
          title="Basic Counter with useReducer"
          initialCode={basicReducerExample}
          explanation={
            <div>
              <h4 className="font-medium mb-2">Key Concepts</h4>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>The reducer function takes the current state and an action, returning the new state</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Actions are dispatched with a <code>type</code> property and optional payload</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>The reducer uses a switch statement to handle different action types</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>useReducer returns the current state and a dispatch function</span>
                </li>
              </ul>
            </div>
          }
          analysis={
            <div>
              <h4 className="font-medium mb-2">Code Analysis</h4>
              <p className="mb-2">Let's analyze the useReducer implementation:</p>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Even for this simple counter, the reducer pattern provides a structured way to update state</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Each action type has a clear purpose, making the code more maintainable</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>The 'set' action demonstrates how to use payload data in actions</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>The default case helps catch typos or invalid action types</span>
                </li>
              </ul>
            </div>
          }
          challenge={
            <div>
              <h4 className="font-medium mb-2">Challenge</h4>
              <p>Enhance the counter example:</p>
              <ol className="list-decimal pl-5 space-y-1 mt-2">
                <li>Add actions to increment/decrement by a custom amount (using payload)</li>
                <li>Add a "double" action that multiplies the current count by 2</li>
                <li>Add validation to prevent negative numbers</li>
              </ol>
            </div>
          }
        />
      </div>
      
      {/* Example 2: Complex State Management */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Example 2: Shopping Cart with useReducer</h2>
        <p className="mb-4 max-w-3xl">
          This more complex example demonstrates using useReducer to manage a shopping cart
          with multiple items, quantities, and calculated totals.
        </p>
        
        <CodeExample 
          title="Shopping Cart with useReducer"
          initialCode={complexStateExample}
          explanation={
            <div>
              <h4 className="font-medium mb-2">Key Concepts</h4>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Managing complex state with multiple properties (items, total, loading, error)</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Handling array operations while maintaining immutability</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Actions that depend on the current state (updating quantity, calculating totals)</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Managing loading and error states in the same reducer</span>
                </li>
              </ul>
            </div>
          }
          analysis={
            <div>
              <h4 className="font-medium mb-2">Code Analysis</h4>
              <p className="mb-2">Let's analyze the more complex reducer patterns:</p>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>The reducer handles different aspects of cart management in a centralized way</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Each action properly preserves immutability using the spread operator</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Some actions reuse logic from other actions (UPDATE_QUANTITY calling REMOVE_ITEM)</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Loading and error states are managed alongside the cart data, providing a complete UI state</span>
                </li>
              </ul>
            </div>
          }
          challenge={
            <div>
              <h4 className="font-medium mb-2">Challenge</h4>
              <p>Extend the shopping cart:</p>
              <ol className="list-decimal pl-5 space-y-1 mt-2">
                <li>Add a discount code feature that applies percentage discounts</li>
                <li>Implement a shipping cost calculation based on total weight</li>
                <li>Add an "undo" feature that reverts to the previous state</li>
              </ol>
            </div>
          }
        />
      </div>
      
      {/* useState vs useReducer */}
      <div className="mb-10 max-w-3xl">
        <div className="bg-muted rounded-lg p-5">
          <h3 className="flex items-center text-lg font-medium mb-3">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-primary mr-2">
              <path d="M21 10.0836V10.0836C21 6.74281 21 5.07241 20.0311 4.08994C19.0622 3.10748 17.413 3.10748 14.1147 3.10748H9.88526C6.58704 3.10748 4.93793 3.10748 3.96894 4.08994C3 5.07241 3 6.74281 3 10.0836V15.9164C3 19.2572 3 20.9276 3.96894 21.9101C4.93793 22.8925 6.58704 22.8925 9.88526 22.8925H14.1147C17.413 22.8925 19.0622 22.8925 20.0311 21.9101C21 20.9276 21 19.2572 21 15.9164V15.9164" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M8.5 12H15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M12 8.5V15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            useState vs useReducer
          </h3>
          <p className="mb-3">
            When should you choose useReducer over useState? Here's a comparison:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-sidebar p-3 rounded">
              <h4 className="font-medium mb-2 text-primary">Use useState when:</h4>
              <ul className="space-y-1 pl-3">
                <li>Managing independent simple state values</li>
                <li>State logic is simple and straightforward</li>
                <li>You have a small number of state updates</li>
                <li>State structure is flat and primitive</li>
              </ul>
            </div>
            
            <div className="bg-sidebar p-3 rounded">
              <h4 className="font-medium mb-2 text-primary">Use useReducer when:</h4>
              <ul className="space-y-1 pl-3">
                <li>Managing complex objects or arrays</li>
                <li>State has many sub-values or nested structure</li>
                <li>State transitions are numerous or complex</li>
                <li>Next state depends on previous state</li>
                <li>You want centralized update logic</li>
                <li>Actions need to be handled in multiple places</li>
              </ul>
            </div>
          </div>
          
          <p>
            useReducer helps make state updates more predictable and easier to test, especially
            as your component's state logic grows in complexity. It also makes it easier to debug
            state changes since actions clearly describe what happened.
          </p>
        </div>
      </div>
      
      {/* Quiz Section */}
      <div id="quiz">
        <Quiz 
          title="Quiz: useReducer Concepts"
          questions={quizQuestions}
          tutorialId="useReducer"
        />
      </div>
      
      {/* Next steps section */}
      <NextSteps currentPath="/hooks/use-reducer" category="hooks" />
    </div>
  );
};

export default UseReducer;
