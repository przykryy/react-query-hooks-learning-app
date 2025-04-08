import React from 'react';
import { Link, useLocation } from 'wouter';
import LearningObjectives from '@/components/tutorial/LearningObjectives';
import CodeExample from '@/components/tutorial/CodeExample';
import Quiz from '@/components/tutorial/Quiz';
import NextSteps from '@/components/tutorial/NextSteps';
import { ChevronRight } from 'lucide-react';
import { useProgress } from '@/hooks/use-progress';

const basicIntroExample = `
const queryClient = new ReactQuery.QueryClient();
function PostsList() {
  // Use the useQuery hook to fetch data

  const { data, isLoading, error } = ReactQuery.useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/posts?_limit=3'
      );
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      return response.json();
    }
  });
  
  // Handle loading state
  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-pulse">Loading posts...</div>
      </div>
    );
  }
  
  // Handle error state
  if (error) {
    return (
      <div className="p-4 text-center">
        <div className="text-destructive">
          Error loading posts: {error.message}
        </div>
      </div>
    );
  }
  
  // Render data
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Posts from API</h2>
      <div className="space-y-4">
        {data.map(post => (
          <div key={post.id} className="p-3 bg-muted rounded-md">
            <h3 className="font-medium">{post.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{post.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Root component with the QueryClientProvider
function App() {
  return (
    <ReactQuery.QueryClientProvider client={queryClient}>
      <div className="max-w-md mx-auto">
        <h1 className="text-xl text-center font-semibold my-4">
          TanStack Query Example
        </h1>
        <PostsList />
      </div>
    </ReactQuery.QueryClientProvider>
  );
}

render(<App/>);`;

const traditionalFetchingExample = `
// Component using traditional React data fetching
function TraditionalFetching() {
  // State management for everything
  const [data, setData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [count, setCount] = React.useState(0);
  
  // Fetch data using useEffect
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(
          'https://jsonplaceholder.typicode.com/posts?_limit=3'
        );
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []); // Empty dependency array = only fetch on mount
  
  // Just to demonstrate component re-renders
  const incrementCounter = () => {
    setCount(prevCount => prevCount + 1);
  };
  
  return (
    <div className="p-4 mb-8">
      <h2 className="text-xl font-semibold mb-4">Traditional React Fetching</h2>
      
      <div className="mb-4">
        <button 
          onClick={incrementCounter}
          className="px-4 py-2 bg-muted rounded mb-2"
        >
          Count: {count} (Click to Increment)
        </button>
        <p className="text-sm text-muted-foreground">
          Notice that clicking this button won't refetch the data
        </p>
      </div>
      
      {isLoading && (
        <div className="animate-pulse">Loading posts...</div>
      )}
      
      {error && (
        <div className="text-destructive">
          Error loading posts: {error}
        </div>
      )}
      
      {data && !isLoading && !error && (
        <div className="space-y-4">
          {data.map(post => (
            <div key={post.id} className="p-3 bg-muted rounded-md">
              <h3 className="font-medium">{post.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{post.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Component using TanStack Query for comparison
function TanStackQueryFetching() {
  // This component would use TanStack Query
  // (Implementation shown in previous example)
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">
        TanStack Query Fetching (see previous example)
      </h2>
      <p className="text-muted-foreground">
        With TanStack Query, the above code would be much simpler,
        with built-in loading/error states, caching, and more.
      </p>
    </div>
  );
}

// Comparison component
function FetchingComparison() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-xl text-center font-semibold my-4">
        Fetching Comparison
      </h1>
      
      <div className="grid grid-cols-1 gap-6">
        <TraditionalFetching />
        <TanStackQueryFetching />
      </div>
    </div>
  );
}

render(<FetchingComparison/>);`;

const quizQuestions = [
  {
    id: 'q1',
    question: 'What is TanStack Query primarily used for?',
    options: [
      { id: 'a', text: 'State management like Redux' },
      { id: 'b', text: 'Server-side rendering' },
      { id: 'c', text: 'Data fetching, caching, synchronization, and server state management' },
      { id: 'd', text: 'CSS-in-JS styling solution' }
    ],
    correctAnswer: 'c'
  },
  {
    id: 'q2',
    question: 'What are the key benefits of using TanStack Query over traditional data fetching?',
    options: [
      { id: 'a', text: 'Automatic caching, background updates, and pagination support' },
      { id: 'b', text: 'Reduced bundle size and better browser compatibility' },
      { id: 'c', text: 'Built-in form validation and state management' },
      { id: 'd', text: 'Server-side rendering and static site generation' }
    ],
    correctAnswer: 'a'
  },
  {
    id: 'q3',
    question: 'What is a "query key" in TanStack Query?',
    options: [
      { id: 'a', text: 'A security token used to authenticate API requests' },
      { id: 'b', text: 'A unique identifier used to cache and track query results' },
      { id: 'c', text: 'A key-value pair used to encrypt sensitive data' },
      { id: 'd', text: 'A configuration parameter for controlling concurrency' }
    ],
    correctAnswer: 'b'
  },
  {
    id: 'q4',
    question: 'What does the "staleTime" configuration option control in TanStack Query?',
    options: [
      { id: 'a', text: 'How long to keep data in the cache before clearing it completely' },
      { id: 'b', text: 'How long to show loading spinners before timing out a request' },
      { id: 'c', text: 'How long data remains "fresh" before it needs revalidation' },
      { id: 'd', text: 'How long to wait between retry attempts for failed queries' }
    ],
    correctAnswer: 'c'
  }
];

const Introduction = () => {
  const [location] = useLocation();
  const { markTutorialViewed } = useProgress();
  
  // Mark tutorial as viewed when component mounts
  React.useEffect(() => {
    markTutorialViewed('introduction');
  }, [markTutorialViewed]);

  return (
    <div className="p-6 md:p-8">
      {/* Breadcrumb navigation */}
      <div className="text-sm mb-6 flex items-center text-muted-foreground">
        <Link href="/">
          <a className="hover:text-primary transition-colors">Home</a>
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link href="/tanstack/introduction">
          <a className="hover:text-primary transition-colors">TanStack Query</a>
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-primary">Introduction</span>
      </div>
      
      {/* Page title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">Introduction to TanStack Query</h1>
        <p className="text-muted-foreground max-w-3xl">
          Learn about TanStack Query (formerly React Query), a powerful data-fetching library for React applications that
          simplifies server state management, caching, and synchronization.
        </p>
      </div>
      
      {/* Learning objectives */}
      <LearningObjectives
        objectives={[
          "Understand the core concepts and benefits of TanStack Query",
          "Learn how TanStack Query improves data fetching in React applications",
          "Differentiate between client state and server state",
          "Get familiar with the basic structure of TanStack Query",
          "Understand the advantages over traditional data fetching approaches"
        ]}
      />
      
      {/* Introduction to TanStack Query */}
      <div className="mb-10 max-w-3xl">
        <h2 className="text-2xl font-semibold mb-4">What is TanStack Query?</h2>
        <p className="mb-4">
          TanStack Query (formerly React Query) is a data-fetching and state management library for React applications that
          simplifies the process of fetching, caching, synchronizing, and updating server state in your React applications.
        </p>
        
        <p className="mb-4">
          While React excels at UI state management, it doesn't provide built-in solutions for server state - data that lives
          on a server and requires asynchronous APIs for CRUD operations. TanStack Query fills this gap by providing:
        </p>
        
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>Declaration and automatic caching of asynchronous data</li>
          <li>Automatic refetching when data becomes stale</li>
          <li>Handling loading and error states with minimal boilerplate</li>
          <li>Pagination and infinite scrolling support</li>
          <li>Prefetching and background updates</li>
          <li>Mutation APIs with automatic cache invalidation</li>
          <li>Request deduplication and retry logic</li>
        </ul>
        
        <p className="mb-4">
          The core concept of TanStack Query is the separation of concerns between <strong>client state</strong> and 
          <strong> server state</strong>:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-sidebar p-3 rounded">
            <h4 className="font-medium mb-2 text-primary">Client State</h4>
            <ul className="space-y-1 pl-3">
              <li>UI state like modal open/closed</li>
              <li>Theme settings</li>
              <li>Form input values before submission</li>
              <li>Managed by useState, useReducer, etc.</li>
              <li>Synchronous and immediately available</li>
            </ul>
          </div>
          
          <div className="bg-sidebar p-3 rounded">
            <h4 className="font-medium mb-2 text-secondary">Server State</h4>
            <ul className="space-y-1 pl-3">
              <li>Remote data from APIs</li>
              <li>Can be shared across components</li>
              <li>Can become stale or outdated</li>
              <li>Requires loading and error states</li>
              <li>Asynchronous by nature</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Example 1: Basic Usage */}
      <div className="mb-10" id="examples">
        <h2 className="text-2xl font-semibold mb-4">Example 1: Basic TanStack Query Usage</h2>
        <p className="mb-4 max-w-3xl">
          This example demonstrates the basic structure of using TanStack Query in a React application.
          It shows how to set up the QueryClient, use the useQuery hook, and handle loading and error states.
        </p>
        
        <CodeExample 
          title="Basic TanStack Query Example"
          initialCode={basicIntroExample}
          explanation={
            <div>
              <h4 className="font-medium mb-2">Key Concepts</h4>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Setting up a QueryClient and wrapping the app with QueryClientProvider</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Using the useQuery hook to fetch data with a unique queryKey</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Handling loading and error states declaratively</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Rendering data once it's available</span>
                </li>
              </ul>
            </div>
          }
          analysis={
            <div>
              <h4 className="font-medium mb-2">Code Analysis</h4>
              <p className="mb-2">Let's analyze how TanStack Query structures data fetching:</p>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>The QueryClient is created once and provided at the app level</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Each query requires a unique queryKey (like 'posts') that's used for caching and refetching</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>The queryFn defines how to fetch the data - it can use any method that returns a Promise</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>The useQuery hook returns an object with data, loading state, and error information</span>
                </li>
              </ul>
            </div>
          }
          challenge={
            <div>
              <h4 className="font-medium mb-2">Challenge</h4>
              <p>Try enhancing this example:</p>
              <ol className="list-decimal pl-5 space-y-1 mt-2">
                <li>Add a refetch button that manually triggers the query to run again</li>
                <li>Display when the data was last updated using query.dataUpdatedAt</li>
                <li>Add a loading spinner component for a better UX during loading</li>
              </ol>
            </div>
          }
        />
      </div>
      
      {/* Example 2: Comparison with Traditional Fetching */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Example 2: Comparison with Traditional Fetching</h2>
        <p className="mb-4 max-w-3xl">
          This example compares traditional React data fetching using useEffect and useState with the
          TanStack Query approach, highlighting the differences in code complexity and features.
        </p>
        
        <CodeExample 
          title="Traditional vs TanStack Query Fetching"
          initialCode={traditionalFetchingExample}
          explanation={
            <div>
              <h4 className="font-medium mb-2">Key Differences</h4>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Traditional approach requires manual management of loading, error, and data states</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Traditional approach has no built-in caching - each component fetches independently</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>With traditional approach, refetching on window focus or reconnect requires extra code</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>TanStack Query handles all these concerns with a cleaner, more declarative API</span>
                </li>
              </ul>
            </div>
          }
          analysis={
            <div>
              <h4 className="font-medium mb-2">Code Analysis</h4>
              <p className="mb-2">Let's analyze the traditional approach's limitations:</p>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>More boilerplate code is needed to handle loading, error states, and data</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>No built-in solution for caching or preventing duplicate requests</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Manual retries, polling, or refetching logic would need to be added</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Each component fetches its own data, even if the same data is needed elsewhere</span>
                </li>
              </ul>
            </div>
          }
          challenge={
            <div>
              <h4 className="font-medium mb-2">Challenge</h4>
              <p>Try to improve the traditional approach:</p>
              <ol className="list-decimal pl-5 space-y-1 mt-2">
                <li>Add a refresh button that refetches the data</li>
                <li>Implement a basic caching mechanism using localStorage</li>
                <li>Add logic to refetch data when the window regains focus</li>
              </ol>
            </div>
          }
        />
      </div>
      
      {/* Key Features */}
      <div className="mb-10 max-w-3xl">
        <div className="bg-muted rounded-lg p-5">
          <h3 className="flex items-center text-lg font-medium mb-3">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-secondary mr-2">
              <path d="M21 10.0836V10.0836C21 6.74281 21 5.07241 20.0311 4.08994C19.0622 3.10748 17.413 3.10748 14.1147 3.10748H9.88526C6.58704 3.10748 4.93793 3.10748 3.96894 4.08994C3 5.07241 3 6.74281 3 10.0836V15.9164C3 19.2572 3 20.9276 3.96894 21.9101C4.93793 22.8925 6.58704 22.8925 9.88526 22.8925H14.1147C17.413 22.8925 19.0622 22.8925 20.0311 21.9101C21 20.9276 21 19.2572 21 15.9164V15.9164" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M8.5 12H15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M12 8.5V15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Key Features of TanStack Query
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Declarative & Automatic</h4>
              <ul className="space-y-1 pl-3">
                <li>Automatic caching by query keys</li>
                <li>Background data refetching</li>
                <li>Garbage collection of inactive queries</li>
                <li>Loading & error states</li>
                <li>Pagination & infinite scrolling</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Advanced Features</h4>
              <ul className="space-y-1 pl-3">
                <li>Request deduplication</li>
                <li>Parallel & dependent queries</li>
                <li>Optimistic updates for mutations</li>
                <li>Prefetching & query invalidation</li>
                <li>Offline support & retry logic</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4">
            <h4 className="font-medium mb-2">Key Terms to Understand</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                <div>
                  <span className="font-medium">Queries</span>: Declarative dependencies on asynchronous data sources
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                <div>
                  <span className="font-medium">Mutations</span>: Functions for creating, updating, or deleting data
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                <div>
                  <span className="font-medium">Query Keys</span>: Unique identifiers for caching, deduping, and refetching
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                <div>
                  <span className="font-medium">Query Client</span>: The core manager that holds the cache and configuration
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Quiz Section */}
      <div id="quiz">
        <Quiz 
          title="Quiz: TanStack Query Introduction"
          questions={quizQuestions}
          tutorialId="introduction"
        />
      </div>
      
      {/* Next steps section */}
      <NextSteps currentPath="/tanstack/introduction" category="tanstack" />
    </div>
  );
};

export default Introduction;
