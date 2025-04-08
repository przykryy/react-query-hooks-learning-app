import React from 'react';
import { Link, useLocation } from 'wouter';
import LearningObjectives from '@/components/tutorial/LearningObjectives';
import CodeExample from '@/components/tutorial/CodeExample';
import Quiz from '@/components/tutorial/Quiz';
import NextSteps from '@/components/tutorial/NextSteps';
import { ChevronRight } from 'lucide-react';
import { useProgress } from '@/hooks/use-progress';

const basicSetupExample = `
// Create a client with default options
const queryClient = new ReactQuery.QueryClient();

// A simple component that will use the QueryClient
function TodoApp() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Todo App</h2>
      <p>This component would use queries and mutations to interact with a Todo API.</p>
    </div>
  );
}

// Root component with the QueryClientProvider
function App() {
  return (
    // Provide the client to your App
    <ReactQuery.QueryClientProvider client={queryClient}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-center my-4">
          TanStack Query App
        </h1>
        <TodoApp />
      </div>
      
      {/* Add the ReactQueryDevtools for development - only appears in development */}
    </ReactQuery.QueryClientProvider>
  );
}

render(<App />);`;

const customClientExample = `
// Create a custom configured client
const queryClient = new ReactQuery.QueryClient({
  defaultOptions: {
    queries: {
      // All queries will use these settings by default
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      // All mutations will use these settings by default
      retry: 2,
      retryDelay: 1000,
    },
  },
});

// Component using a query
function PostList() {
  const { data, isLoading, error } = ReactQuery.useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      // This query will use the default options
      const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=3');
      if (!res.ok) {
        throw new Error('Failed to fetch posts');
      }
      return res.json();
    },
    // Override specific options for this query
    staleTime: 1000 * 60 * 1, // 1 minute for this specific query
  });
  
  if (isLoading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Posts</h2>
      <div className="space-y-2">
        {data.map(post => (
          <div key={post.id} className="p-3 bg-muted rounded">
            <h3 className="font-medium">{post.title}</h3>
            <p className="text-sm text-muted-foreground">{post.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Component with custom query options
function UserProfile() {
  const { data, isLoading } = ReactQuery.useQuery({
    queryKey: ['user', 1],
    queryFn: async () => {
      const res = await fetch('https://jsonplaceholder.typicode.com/users/1');
      if (!res.ok) {
        throw new Error('Failed to fetch user');
      }
      return res.json();
    },
    // Override with component-specific options
    staleTime: Infinity, // This data never goes stale
  });
  
  if (isLoading) return <div>Loading user...</div>;
  
  return (
    <div className="p-3 bg-muted rounded mb-4">
      <h2 className="text-xl font-semibold mb-2">User Profile</h2>
      <p><strong>Name:</strong> {data.name}</p>
      <p><strong>Email:</strong> {data.email}</p>
      <p><strong>Company:</strong> {data.company.name}</p>
    </div>
  );
}

// App with configured client
function App() {
  return (
    <ReactQuery.QueryClientProvider client={queryClient}>
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold text-center mb-6">
          Configured QueryClient Example
        </h1>
        
        <div className="mb-4">
          <h2 className="text-lg font-medium mb-2">Client Configuration Features:</h2>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li>Custom stale time (5 minutes global)</li>
            <li>Custom cache time (30 minutes)</li>
            <li>Custom retry logic (3 retries with exponential backoff)</li>
            <li>Component-specific overrides</li>
          </ul>
        </div>
        
        <UserProfile />
        <PostList />
      </div>
      
    </ReactQuery.QueryClientProvider>
  );
}

render(<App />);`;

const quizQuestions = [
  {
    id: 'q1',
    question: 'What is the purpose of QueryClientProvider?',
    options: [
      { id: 'a', text: 'To define query functions for data fetching' },
      { id: 'b', text: 'To configure the QueryClient with application-wide settings' },
      { id: 'c', text: 'To provide the QueryClient instance to the component tree' },
      { id: 'd', text: 'To connect to a specific database or backend service' }
    ],
    correctAnswer: 'c'
  },
  {
    id: 'q2',
    question: 'Where should you typically place the QueryClientProvider?',
    options: [
      { id: 'a', text: 'Inside each component that uses queries' },
      { id: 'b', text: 'Near the root of your application' },
      { id: 'c', text: 'Only around components that fetch data' },
      { id: 'd', text: 'Inside React Router routes' }
    ],
    correctAnswer: 'b'
  },
  {
    id: 'q3',
    question: 'What does "staleTime" control in the QueryClient configuration?',
    options: [
      { id: 'a', text: 'How long until the data is removed from the cache' },
      { id: 'b', text: 'How long until a query is automatically refetched in the background' },
      { id: 'c', text: 'How long data is considered fresh before it becomes stale' },
      { id: 'd', text: 'How long to wait before retrying a failed query' }
    ],
    correctAnswer: 'c'
  },
  {
    id: 'q4',
    question: 'How can you override the global QueryClient configuration for a specific query?',
    options: [
      { id: 'a', text: 'Create a new QueryClient instance for each query' },
      { id: 'b', text: 'Use a different QueryClientProvider for each query component' },
      { id: 'c', text: 'Pass specific configuration options directly to the useQuery hook' },
      { id: 'd', text: 'You cannot override global configuration for individual queries' }
    ],
    correctAnswer: 'c'
  }
];

const QueryClientProviderPage = () => {
  const [location] = useLocation();
  const { markTutorialViewed } = useProgress();
  
  // Mark tutorial as viewed when component mounts
  React.useEffect(() => {
    markTutorialViewed('queryClientProvider');
  }, [markTutorialViewed]);

  return (
    <div className="p-6 md:p-8">
      {/* Breadcrumb navigation */}
      <div className="text-sm mb-6 flex items-center text-muted-foreground">
        <Link href="/">
          <a className="hover:text-primary transition-colors">Home</a>
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link href="/tanstack/query-client-provider">
          <a className="hover:text-primary transition-colors">TanStack Query</a>
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-primary">QueryClientProvider</span>
      </div>
      
      {/* Page title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">QueryClientProvider</h1>
        <p className="text-muted-foreground max-w-3xl">
          Learn how to configure and set up TanStack Query in your application using the 
          QueryClient and QueryClientProvider. This is the foundation for using TanStack 
          Query in your React applications.
        </p>
      </div>
      
      {/* Learning objectives */}
      <LearningObjectives
        objectives={[
          "Understand the role of QueryClient and QueryClientProvider",
          "Learn how to set up and configure TanStack Query in your application",
          "Configure global default options for queries and mutations",
          "Set up the QueryClient with custom configurations",
          "Implement ReactQueryDevtools for debugging and monitoring"
        ]}
      />
      
      {/* Introduction to QueryClientProvider */}
      <div className="mb-10 max-w-3xl">
        <h2 className="text-2xl font-semibold mb-4">Understanding QueryClient and QueryClientProvider</h2>
        <p className="mb-4">
          The <code className="bg-sidebar text-secondary px-1 py-0.5 rounded">QueryClient</code> and <code className="bg-sidebar text-secondary px-1 py-0.5 rounded">QueryClientProvider</code> are the core building blocks 
          of TanStack Query. They work together to manage the client state and provide that state to your React components.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-sidebar p-4 rounded">
            <h4 className="font-medium mb-2 text-secondary">QueryClient</h4>
            <p className="mb-2">
              The central instance that manages all queries and mutations:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Maintains the query cache</li>
              <li>Stores all query and mutation data</li>
              <li>Provides global configuration defaults</li>
              <li>Controls query refetching, garbage collection, and more</li>
            </ul>
          </div>
          
          <div className="bg-sidebar p-4 rounded">
            <h4 className="font-medium mb-2 text-secondary">QueryClientProvider</h4>
            <p className="mb-2">
              A React context provider component that:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Accepts a QueryClient instance</li>
              <li>Makes that client available to any nested components</li>
              <li>Should be placed near the root of your component tree</li>
              <li>Enables React components to use TanStack Query hooks</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Setting up TanStack Query in your application involves three main steps:
        </p>
        
        <ol className="list-decimal pl-6 space-y-2 mb-4">
          <li>Creating a QueryClient instance</li>
          <li>Wrapping your application with QueryClientProvider</li>
          <li>Using hooks like useQuery and useMutation in your components</li>
        </ol>
        
        <p className="mb-4">
          The QueryClient can be configured with default options that apply to all queries and mutations,
          which can then be overridden at the individual query level as needed.
        </p>
      </div>
      
      {/* Example 1: Basic Setup */}
      <div className="mb-10" id="examples">
        <h2 className="text-2xl font-semibold mb-4">Example 1: Basic Setup</h2>
        <p className="mb-4 max-w-3xl">
          This example demonstrates the most basic setup of TanStack Query in a React application.
          It shows how to create a QueryClient and provide it to your application.
        </p>
        
        <CodeExample 
          title="Basic QueryClientProvider Setup"
          initialCode={basicSetupExample}
          explanation={
            <div>
              <h4 className="font-medium mb-2">Key Concepts</h4>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span>Creating a simple QueryClient with default options</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span>Wrapping the application with QueryClientProvider</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span>Including ReactQueryDevtools for development debugging</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span>Proper placement near the root component</span>
                </li>
              </ul>
            </div>
          }
          analysis={
            <div>
              <h4 className="font-medium mb-2">Code Analysis</h4>
              <p className="mb-2">Let's analyze the basic setup:</p>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span>The QueryClient is created once, outside of the component render cycle</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span>QueryClientProvider wraps the entire app, making the client available everywhere</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span>ReactQueryDevtools provides a UI for inspecting queries and cache (development only)</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span>Without configuration options, the QueryClient uses sensible defaults</span>
                </li>
              </ul>
            </div>
          }
          challenge={
            <div>
              <h4 className="font-medium mb-2">Challenge</h4>
              <p>Extend this basic setup:</p>
              <ol className="list-decimal pl-5 space-y-1 mt-2">
                <li>Configure the QueryClient to use a localStorage cache persister</li>
                <li>Add a custom default query function that handles API URLs and authentication</li>
                <li>Implement a loading and error UI wrapper component</li>
              </ol>
            </div>
          }
        />
      </div>
      
      {/* Example 2: Custom Configuration */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Example 2: Custom Configuration</h2>
        <p className="mb-4 max-w-3xl">
          This example demonstrates how to configure the QueryClient with custom options and 
          override those options at the individual query level when needed.
        </p>
        
        <CodeExample 
          title="Configured QueryClient"
          initialCode={customClientExample}
          explanation={
            <div>
              <h4 className="font-medium mb-2">Key Concepts</h4>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span>Configuring global defaults for all queries and mutations</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span>Setting custom staleTime, cacheTime, and retry logic</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span>Overriding global options at the individual query level</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span>Components receive and use the custom configuration automatically</span>
                </li>
              </ul>
            </div>
          }
          analysis={
            <div>
              <h4 className="font-medium mb-2">Configuration Options Explained</h4>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span><strong>staleTime</strong>: How long data remains "fresh" (5 minutes globally, but UserProfile uses Infinity)</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span><strong>cacheTime</strong>: How long inactive data remains in cache before garbage collection (30 minutes)</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span><strong>refetchOnWindowFocus/Mount/Reconnect</strong>: When to automatically refetch data</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span><strong>retry & retryDelay</strong>: How to handle failed queries with exponential backoff</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span>Notice how PostList overrides the global staleTime with its own 1-minute setting</span>
                </li>
              </ul>
            </div>
          }
          challenge={
            <div>
              <h4 className="font-medium mb-2">Challenge</h4>
              <p>Enhance the configuration:</p>
              <ol className="list-decimal pl-5 space-y-1 mt-2">
                <li>Add a global onError handler to log all query and mutation errors</li>
                <li>Configure refetchInterval for polls that update every 30 seconds</li>
                <li>Add a suspense mode configuration for use with React Suspense</li>
              </ol>
            </div>
          }
        />
      </div>
      
      {/* Configuration Options */}
      <div className="mb-10 max-w-3xl">
        <div className="bg-muted rounded-lg p-5">
          <h3 className="flex items-center text-lg font-medium mb-3">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-secondary mr-2">
              <path d="M21 10.0836V10.0836C21 6.74281 21 5.07241 20.0311 4.08994C19.0622 3.10748 17.413 3.10748 14.1147 3.10748H9.88526C6.58704 3.10748 4.93793 3.10748 3.96894 4.08994C3 5.07241 3 6.74281 3 10.0836V15.9164C3 19.2572 3 20.9276 3.96894 21.9101C4.93793 22.8925 6.58704 22.8925 9.88526 22.8925H14.1147C17.413 22.8925 19.0622 22.8925 20.0311 21.9101C21 20.9276 21 19.2572 21 15.9164V15.9164" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M8.5 12H15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M12 8.5V15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Important QueryClient Configuration Options
          </h3>
          
          <div className="mb-4">
            <h4 className="font-medium mb-2">Query Options</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <span className="font-mono text-sm bg-sidebar px-1 rounded">staleTime</span>
                <p className="text-sm">How long data remains fresh (default: 0)</p>
              </div>
              <div>
                <span className="font-mono text-sm bg-sidebar px-1 rounded">cacheTime</span>
                <p className="text-sm">How long inactive data is kept (default: 5 minutes)</p>
              </div>
              <div>
                <span className="font-mono text-sm bg-sidebar px-1 rounded">refetchOnMount</span>
                <p className="text-sm">Refetch when a component mounts (default: true)</p>
              </div>
              <div>
                <span className="font-mono text-sm bg-sidebar px-1 rounded">refetchOnWindowFocus</span>
                <p className="text-sm">Refetch when window regains focus (default: true)</p>
              </div>
              <div>
                <span className="font-mono text-sm bg-sidebar px-1 rounded">refetchOnReconnect</span>
                <p className="text-sm">Refetch when reconnecting (default: true)</p>
              </div>
              <div>
                <span className="font-mono text-sm bg-sidebar px-1 rounded">retry</span>
                <p className="text-sm">Number of retry attempts (default: 3)</p>
              </div>
              <div>
                <span className="font-mono text-sm bg-sidebar px-1 rounded">retryDelay</span>
                <p className="text-sm">Delay between retry attempts (default: exponential)</p>
              </div>
              <div>
                <span className="font-mono text-sm bg-sidebar px-1 rounded">queryFn</span>
                <p className="text-sm">Default function for all queries</p>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Best Practices</h4>
            <ul className="space-y-1 pl-3">
              <li>Create QueryClient outside component renders to prevent recreation</li>
              <li>In server-side rendering, create a new client for each request</li>
              <li>Configure appropriate staleTime based on how often your data changes</li>
              <li>Use ReactQueryDevtools in development for debugging</li>
              <li>Consider using persistence plugins for offline support</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Quiz Section */}
      <div id="quiz">
        <Quiz 
          title="Quiz: QueryClientProvider"
          questions={quizQuestions}
          tutorialId="queryClientProvider"
        />
      </div>
      
      {/* Next steps section */}
      <NextSteps currentPath="/tanstack/query-client-provider" category="tanstack" />
    </div>
  );
};

export default QueryClientProviderPage;
