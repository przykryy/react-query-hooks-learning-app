import React from 'react';
import { Link, useLocation } from 'wouter';
import LearningObjectives from '@/components/tutorial/LearningObjectives';
import CodeExample from '@/components/tutorial/CodeExample';
import Quiz from '@/components/tutorial/Quiz';
import NextSteps from '@/components/tutorial/NextSteps';
import { ChevronRight } from 'lucide-react';
import { useProgress } from '@/hooks/use-progress';

const basicQueryExample = `import React from 'react';
import { 
  QueryClient, 
  QueryClientProvider,
  useQuery 
} from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

// Component that uses useQuery
function UserProfile() {
  const {
    data,            // The query data
    isLoading,       // True while the query is fetching for the first time
    isError,         // True if the query encountered an error
    error,           // The error if isError is true
    isSuccess,       // True if the query has data and no errors
    isFetching,      // True whenever the query is fetching data
    refetch          // Function to manually trigger the query
  } = useQuery({
    queryKey: ['user', 1], // Unique identifier for this query
    queryFn: async () => {
      // Function that fetches the data
      const response = await fetch('https://jsonplaceholder.typicode.com/users/1');
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      return response.json();
    }
  });
  
  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4">User Profile</h2>
      
      <div className="mb-4">
        <button 
          onClick={() => refetch()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded mb-4"
        >
          Refetch Data
        </button>
      </div>
      
      {/* Status indicators */}
      <div className="space-y-1 mb-4 text-sm">
        <div className="flex items-center space-x-2">
          <span>Loading:</span>
          <span className={isLoading ? "text-primary font-medium" : "text-muted-foreground"}>
            {isLoading ? "Yes" : "No"}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span>Success:</span>
          <span className={isSuccess ? "text-accent font-medium" : "text-muted-foreground"}>
            {isSuccess ? "Yes" : "No"}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span>Error:</span>
          <span className={isError ? "text-destructive font-medium" : "text-muted-foreground"}>
            {isError ? "Yes" : "No"}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span>Fetching:</span>
          <span className={isFetching ? "text-primary font-medium" : "text-muted-foreground"}>
            {isFetching ? "Yes" : "No"}
          </span>
        </div>
      </div>
      
      {/* User data display */}
      {isLoading && (
        <div className="animate-pulse p-4 bg-muted rounded">
          Loading user data...
        </div>
      )}
      
      {isError && (
        <div className="p-4 bg-destructive/10 text-destructive rounded">
          Error: {error.message}
        </div>
      )}
      
      {data && !isLoading && !isError && (
        <div className="p-4 bg-muted rounded">
          <div className="space-y-2">
            <p><strong>Name:</strong> {data.name}</p>
            <p><strong>Email:</strong> {data.email}</p>
            <p><strong>Phone:</strong> {data.phone}</p>
            <p><strong>Website:</strong> {data.website}</p>
            <p><strong>Company:</strong> {data.company.name}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Main app with provider
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="p-4">
        <h1 className="text-2xl font-bold text-center mb-6">
          useQuery Hook Example
        </h1>
        <UserProfile />
      </div>
    </QueryClientProvider>
  );
}

export default App;`;

const advancedQueryExample = `import React, { useState } from 'react';
import { 
  QueryClient, 
  QueryClientProvider,
  useQuery,
  useQueryClient
} from '@tanstack/react-query';

const queryClient = new QueryClient();

// Component using advanced query features
function PostsWithFilters() {
  // State for our filters
  const [limit, setLimit] = useState(5);
  const [userId, setUserId] = useState("");
  
  // Access the query client instance
  const queryClient = useQueryClient();
  
  // Define the query with dependencies
  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    isPlaceholderData, // True when showing cached data while refetching
    isPreviousData     // True when showing previous results while new results are fetched
  } = useQuery({
    // Query key includes filter values, causing refetch when they change
    queryKey: ['posts', { limit, userId }],
    
    // Query function now uses the filters
    queryFn: async () => {
      let url = 'https://jsonplaceholder.typicode.com/posts?';
      
      // Add filters to URL
      const params = new URLSearchParams();
      
      if (limit) {
        params.append('_limit', String(limit));
      }
      
      if (userId) {
        params.append('userId', userId);
      }
      
      url += params.toString();
      
      console.log("Fetching URL:", url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      return response.json();
    },
    
    // Keep previous data while fetching new data
    keepPreviousData: true,
    
    // Stale time of 30 seconds - data won't refetch until this time has passed
    staleTime: 1000 * 30,
    
    // When this query succeeds, invalidate the 'user' queries
    onSuccess: (data) => {
      // Prefetch related data
      if (data && data.length > 0) {
        // Prefetch the first user data when posts load
        queryClient.prefetchQuery({
          queryKey: ['user', String(data[0].userId)],
          queryFn: async () => {
            const response = await fetch(\`https://jsonplaceholder.typicode.com/users/\${data[0].userId}\`);
            if (!response.ok) {
              throw new Error('Failed to fetch user');
            }
            return response.json();
          }
        });
      }
    }
  });
  
  // Function to handle prefetching on hover
  const prefetchUser = async (userId) => {
    await queryClient.prefetchQuery({
      queryKey: ['user', String(userId)],
      queryFn: async () => {
        console.log(\`Prefetching user \${userId}\`);
        const response = await fetch(\`https://jsonplaceholder.typicode.com/users/\${userId}\`);
        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }
        return response.json();
      },
      staleTime: 1000 * 60 * 5 // 5 minutes
    });
  };
  
  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Posts with Filters</h2>
      
      {/* Filter controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div>
          <label className="block text-sm mb-1">Limit</label>
          <select 
            value={limit} 
            onChange={e => setLimit(Number(e.target.value))}
            className="px-3 py-2 bg-muted rounded border border-input w-full"
          >
            <option value="3">3 posts</option>
            <option value="5">5 posts</option>
            <option value="10">10 posts</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm mb-1">User ID</label>
          <select 
            value={userId} 
            onChange={e => setUserId(e.target.value)}
            className="px-3 py-2 bg-muted rounded border border-input w-full"
          >
            <option value="">All users</option>
            <option value="1">User 1</option>
            <option value="2">User 2</option>
            <option value="3">User 3</option>
          </select>
        </div>
      </div>
      
      {/* Status indicators */}
      <div className="space-y-1 mb-4 text-sm">
        <div className="flex items-center space-x-2">
          <span>Loading:</span>
          <span className={isLoading ? "text-primary font-medium" : "text-muted-foreground"}>
            {isLoading ? "Yes" : "No"}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span>Fetching:</span>
          <span className={isFetching ? "text-primary font-medium" : "text-muted-foreground"}>
            {isFetching ? "Yes" : "No"}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span>Using placeholder data:</span>
          <span className={isPlaceholderData ? "text-accent font-medium" : "text-muted-foreground"}>
            {isPlaceholderData ? "Yes" : "No"}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span>Showing previous data:</span>
          <span className={isPreviousData ? "text-accent font-medium" : "text-muted-foreground"}>
            {isPreviousData ? "Yes" : "No"}
          </span>
        </div>
      </div>
      
      {/* Loading state */}
      {isLoading && (
        <div className="animate-pulse p-4 bg-muted rounded">
          Loading posts...
        </div>
      )}
      
      {/* Error state */}
      {isError && (
        <div className="p-4 bg-destructive/10 text-destructive rounded">
          Error: {error.message}
        </div>
      )}
      
      {/* Posts list */}
      {data && !isLoading && !isError && (
        <div className="space-y-4">
          {data.map(post => (
            <div 
              key={post.id}
              className="p-4 bg-muted rounded"
              onMouseEnter={() => prefetchUser(post.userId)}
            >
              <h3 className="font-medium">{post.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{post.body}</p>
              <div className="text-xs text-primary">
                User ID: {post.userId} (hover to prefetch user data)
              </div>
            </div>
          ))}
          
          {data.length === 0 && (
            <div className="p-4 bg-muted rounded text-center">
              No posts found for the selected filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Main app with provider
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="p-4">
        <h1 className="text-2xl font-bold text-center mb-6">
          Advanced useQuery Features
        </h1>
        <PostsWithFilters />
      </div>
    </QueryClientProvider>
  );
}

export default App;`;

const quizQuestions = [
  {
    id: 'q1',
    question: 'What is the primary purpose of the useQuery hook?',
    options: [
      { id: 'a', text: 'To manage local component state' },
      { id: 'b', text: 'To fetch, cache, and manage asynchronous data' },
      { id: 'c', text: 'To create side effects in React components' },
      { id: 'd', text: 'To handle form submissions' }
    ],
    correctAnswer: 'b'
  },
  {
    id: 'q2',
    question: 'What does the queryKey parameter do in useQuery?',
    options: [
      { id: 'a', text: 'It sets the URL for the API request' },
      { id: 'b', text: 'It authenticates the request with an API key' },
      { id: 'c', text: 'It uniquely identifies the query for caching and refetching' },
      { id: 'd', text: 'It defines how long the data should be cached' }
    ],
    correctAnswer: 'c'
  },
  {
    id: 'q3',
    question: 'What is the difference between isLoading and isFetching?',
    options: [
      { id: 'a', text: 'isLoading is true only during the first load, while isFetching is true during any data fetching' },
      { id: 'b', text: 'isLoading is for mutations, while isFetching is for queries' },
      { id: 'c', text: 'isLoading is for background fetches, while isFetching is for user-initiated fetches' },
      { id: 'd', text: 'There is no difference; they are aliases of the same state' }
    ],
    correctAnswer: 'a'
  },
  {
    id: 'q4',
    question: 'What happens when a dependency in the queryKey array changes?',
    options: [
      { id: 'a', text: 'Nothing happens automatically; you need to call refetch() manually' },
      { id: 'b', text: 'The query is automatically refetched with the new parameters' },
      { id: 'c', text: 'The cache is cleared but no refetch happens' },
      { id: 'd', text: 'An error is thrown that must be handled' }
    ],
    correctAnswer: 'b'
  }
];

const UseQueryPage = () => {
  const [location] = useLocation();
  const { markTutorialViewed } = useProgress();
  
  // Mark tutorial as viewed when component mounts
  React.useEffect(() => {
    markTutorialViewed('useQuery');
  }, [markTutorialViewed]);

  return (
    <div className="p-6 md:p-8">
      {/* Breadcrumb navigation */}
      <div className="text-sm mb-6 flex items-center text-muted-foreground">
        <Link href="/">
          <a className="hover:text-primary transition-colors">Home</a>
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link href="/tanstack/use-query">
          <a className="hover:text-primary transition-colors">TanStack Query</a>
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-primary">useQuery</span>
      </div>
      
      {/* Page title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">useQuery Hook</h1>
        <p className="text-muted-foreground max-w-3xl">
          Learn how to fetch, cache, and manage asynchronous data in your React components using 
          TanStack Query's useQuery hook, one of the core building blocks of the library.
        </p>
      </div>
      
      {/* Learning objectives */}
      <LearningObjectives
        objectives={[
          "Understand the useQuery hook and its core functionality",
          "Learn to structure query keys for effective caching and invalidation",
          "Master query status indicators like isLoading, isError, and isFetching",
          "Implement dependent queries and handle dynamic parameters",
          "Apply advanced techniques like prefetching and keeping previous data"
        ]}
      />
      
      {/* Introduction to useQuery */}
      <div className="mb-10 max-w-3xl">
        <h2 className="text-2xl font-semibold mb-4">Introduction to useQuery</h2>
        <p className="mb-4">
          The <code className="bg-sidebar text-secondary px-1 py-0.5 rounded">useQuery</code> hook is at the heart of TanStack Query's 
          data fetching capabilities. It provides a declarative way to fetch, cache, and manage asynchronous data in your React components.
        </p>
        
        <p className="mb-4">
          The hook handles the entire data fetching lifecycle, including:
        </p>
        
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>Loading and error states</li>
          <li>Caching results by query keys</li>
          <li>Background refetching when data becomes stale</li>
          <li>Retry logic for failed requests</li>
          <li>Pagination and dependent queries</li>
          <li>Synchronizing with browser events like window focus or reconnections</li>
        </ul>
        
        <p className="mb-4">
          Here's the basic syntax of useQuery:
        </p>
        
        <div className="bg-sidebar rounded-md p-4 my-4 font-code text-sm">
          <pre>const {
  data,
  isLoading,
  isError,
  error,
  // other properties
} = useQuery({
  queryKey: ['uniqueKey', param1, param2], 
  queryFn: async () => {
    // Fetch and return data
  },
  // options
});</pre>
        </div>
        
        <p className="mb-2">
          The useQuery hook requires at least two parameters:
        </p>
        <ol className="list-decimal pl-6 space-y-2 mb-4">
          <li><strong>queryKey</strong>: A unique identifier (string or array) used for caching and automatic refetching</li>
          <li><strong>queryFn</strong>: An async function that returns a promise with the data</li>
        </ol>
        
        <p className="mb-4">
          useQuery returns an object with many properties that help you handle the current state of the query, 
          including but not limited to <code className="bg-sidebar text-secondary px-1 py-0.5 rounded">data</code>, <code className="bg-sidebar text-secondary px-1 py-0.5 rounded">isLoading</code>, <code className="bg-sidebar text-secondary px-1 py-0.5 rounded">isError</code>, and <code className="bg-sidebar text-secondary px-1 py-0.5 rounded">error</code>.
        </p>
      </div>
      
      {/* Example 1: Basic useQuery */}
      <div className="mb-10" id="examples">
        <h2 className="text-2xl font-semibold mb-4">Example 1: Basic useQuery Usage</h2>
        <p className="mb-4 max-w-3xl">
          This example demonstrates the basic usage of useQuery to fetch data from an API,
          and how to handle loading, success, and error states.
        </p>
        
        <CodeExample 
          title="Basic useQuery Example"
          initialCode={basicQueryExample}
          explanation={
            <div>
              <h4 className="font-medium mb-2">Key Concepts</h4>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span>Basic useQuery implementation with queryKey and queryFn</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span>Handling different query states: loading, success, error</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span>Using the refetch function to manually trigger the query</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span>Displaying data when the query is successful</span>
                </li>
              </ul>
            </div>
          }
          analysis={
            <div>
              <h4 className="font-medium mb-2">Code Analysis</h4>
              <p className="mb-2">Let's analyze the key parts of this useQuery implementation:</p>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span>The queryKey ['user', 1] uniquely identifies this query in the cache</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span>The queryFn makes an async fetch request and returns the parsed JSON</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span>destructured values like isLoading and isError let us conditionally render UI</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span>The refetch function lets users manually trigger the query again</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span>Notice how we can use the data directly when it's available</span>
                </li>
              </ul>
            </div>
          }
          challenge={
            <div>
              <h4 className="font-medium mb-2">Challenge</h4>
              <p>Try enhancing this example by:</p>
              <ol className="list-decimal pl-5 space-y-1 mt-2">
                <li>Adding a timeout to simulate slower networks</li>
                <li>Adding a button to deliberately cause an error (by fetching a non-existent user)</li>
                <li>Displaying the time of the last successful data fetch</li>
              </ol>
            </div>
          }
        />
      </div>
      
      {/* Example 2: Advanced useQuery Features */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Example 2: Advanced useQuery Techniques</h2>
        <p className="mb-4 max-w-3xl">
          This more advanced example demonstrates dynamic query parameters, keepPreviousData, prefetching, 
          and query dependencies.
        </p>
        
        <CodeExample 
          title="Advanced useQuery Features"
          initialCode={advancedQueryExample}
          explanation={
            <div>
              <h4 className="font-medium mb-2">Key Concepts</h4>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span>Using dynamic parameters in the queryKey to refetch when filters change</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span>Keeping previous data while new data is fetching with keepPreviousData</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span>Prefetching related data on success and on hover with prefetchQuery</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span>Setting a staleTime to control when data is considered outdated</span>
                </li>
              </ul>
            </div>
          }
          analysis={
            <div>
              <h4 className="font-medium mb-2">Advanced Features Explained</h4>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span><strong>Dynamic Query Keys</strong>: The queryKey includes filter values (limit, userId), causing automatic refetching when these change</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span><strong>keepPreviousData</strong>: Prevents flickering by showing old data while fetching new data</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span><strong>Prefetching</strong>: Using queryClient.prefetchQuery to load related data before it's needed</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span><strong>onSuccess</strong>: Executing code after a successful query completion</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span><strong>staleTime</strong>: Setting how long data remains fresh before refetching</span>
                </li>
              </ul>
            </div>
          }
          challenge={
            <div>
              <h4 className="font-medium mb-2">Challenge</h4>
              <p>Enhance this advanced example by:</p>
              <ol className="list-decimal pl-5 space-y-1 mt-2">
                <li>Adding pagination controls (next/previous page)</li>
                <li>Implementing the ability to search posts by title</li>
                <li>Displaying a "stale data" indicator when showing cached data older than 10 seconds</li>
              </ol>
            </div>
          }
        />
      </div>
      
      {/* Query Keys and Status States */}
      <div className="mb-10 max-w-3xl">
        <div className="bg-muted rounded-lg p-5">
          <h3 className="flex items-center text-lg font-medium mb-3">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-secondary mr-2">
              <path d="M21 10.0836V10.0836C21 6.74281 21 5.07241 20.0311 4.08994C19.0622 3.10748 17.413 3.10748 14.1147 3.10748H9.88526C6.58704 3.10748 4.93793 3.10748 3.96894 4.08994C3 5.07241 3 6.74281 3 10.0836V15.9164C3 19.2572 3 20.9276 3.96894 21.9101C4.93793 22.8925 6.58704 22.8925 9.88526 22.8925H14.1147C17.413 22.8925 19.0622 22.8925 20.0311 21.9101C21 20.9276 21 19.2572 21 15.9164V15.9164" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M8.5 12H15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M12 8.5V15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Important useQuery Concepts
          </h3>
          
          <div className="mb-5">
            <h4 className="font-medium mb-2">Query Keys</h4>
            <p className="mb-2">
              Query keys uniquely identify your queries and determine caching behavior. Keys can be:
            </p>
            <ul className="space-y-1 pl-3 mb-3">
              <li>Simple strings: <code className="bg-sidebar text-xs px-1 rounded">queryKey: ['todos']</code></li>
              <li>Hierarchical arrays: <code className="bg-sidebar text-xs px-1 rounded">queryKey: ['todos', { status: 'active' }]</code></li>
              <li>Dynamic values: <code className="bg-sidebar text-xs px-1 rounded">queryKey: ['todo', todoId]</code></li>
            </ul>
            <p className="text-sm">
              When any value in the key changes, TanStack Query automatically refetches the data.
              Well-structured query keys enable effective cache management and invalidation.
            </p>
          </div>
          
          <div className="mb-5">
            <h4 className="font-medium mb-2">Query Status Lifecycle</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mb-3">
              <div>
                <span className="font-mono text-xs bg-sidebar px-1 rounded">isLoading</span>
                <p className="text-sm">True during the first load with no cached data</p>
              </div>
              <div>
                <span className="font-mono text-xs bg-sidebar px-1 rounded">isFetching</span>
                <p className="text-sm">True whenever a request is in-flight (including background refetching)</p>
              </div>
              <div>
                <span className="font-mono text-xs bg-sidebar px-1 rounded">isError</span>
                <p className="text-sm">True when the query encountered an error</p>
              </div>
              <div>
                <span className="font-mono text-xs bg-sidebar px-1 rounded">isSuccess</span>
                <p className="text-sm">True when the query successfully returned data</p>
              </div>
              <div>
                <span className="font-mono text-xs bg-sidebar px-1 rounded">isStale</span>
                <p className="text-sm">True when the query's data is considered stale</p>
              </div>
              <div>
                <span className="font-mono text-xs bg-sidebar px-1 rounded">isPaused</span>
                <p className="text-sm">True when the query is temporarily paused (offline)</p>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Best Practices</h4>
            <ul className="space-y-1 pl-3">
              <li>Structure query keys logically based on your API endpoints</li>
              <li>Set appropriate staleTime based on how frequently your data changes</li>
              <li>Use dependent queries when data depends on other queries</li>
              <li>Utilize keepPreviousData to avoid UI flickering during refetches</li>
              <li>Prefetch related data for improved user experience</li>
              <li>Use select option to transform or filter the returned data</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Quiz Section */}
      <div id="quiz">
        <Quiz 
          title="Quiz: useQuery Hook"
          questions={quizQuestions}
          tutorialId="useQuery"
        />
      </div>
      
      {/* Next steps section */}
      <NextSteps currentPath="/tanstack/use-query" category="tanstack" />
    </div>
  );
};

export default UseQueryPage;
