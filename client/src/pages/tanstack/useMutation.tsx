import React from 'react';
import { NextSteps } from '@/components/tutorial/NextSteps';
import { LearningObjectives } from '@/components/tutorial/LearningObjectives';
import CodeExample from '@/components/tutorial/CodeExample';
import Quiz from '@/components/tutorial/Quiz';

const basicMutationExample = `import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Example form component that creates a new todo
function AddTodoForm() {
  const [title, setTitle] = useState('');
  const queryClient = useQueryClient();
  
  // Define the mutation
  const addTodoMutation = useMutation({
    mutationFn: async (newTodo) => {
      // In a real app, you would call your API here
      const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        body: JSON.stringify(newTodo),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      return response.json();
    },
    // When mutation succeeds, invalidate the todos query to refetch
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setTitle(''); // Reset the form
    },
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    // Execute the mutation
    addTodoMutation.mutate({ title, completed: false, userId: 1 });
  };
  
  return (
    <div className="p-4 border rounded shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Add New Todo</h2>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter todo title"
          className="w-full p-2 border rounded mb-2"
        />
        
        <button 
          type="submit"
          disabled={addTodoMutation.isPending}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
        >
          {addTodoMutation.isPending ? 'Adding...' : 'Add Todo'}
        </button>
      </form>
      
      {addTodoMutation.isError && (
        <div className="mt-2 text-red-500">
          Error: {addTodoMutation.error.message}
        </div>
      )}
      
      {addTodoMutation.isSuccess && (
        <div className="mt-2 text-green-500">
          Todo added successfully!
        </div>
      )}
    </div>
  );
}

// Main app component
function App() {
  return (
    <div className="max-w-md mx-auto my-8">
      <h1 className="text-xl font-bold mb-4">Todo Management</h1>
      <AddTodoForm />
    </div>
  );
}

export default App;`;

const advancedMutationExample = `import React, { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';

// Simulate API calls
const api = {
  getTodos: async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock data
    return [
      { id: 1, title: 'Learn React', completed: true },
      { id: 2, title: 'Learn React Query', completed: false },
      { id: 3, title: 'Build amazing apps', completed: false },
    ];
  },
  
  addTodo: async (newTodo) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Simulate server response with generated ID
    return { ...newTodo, id: Date.now() };
  },
  
  updateTodo: async (updatedTodo) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Simulate server response
    return updatedTodo;
  },
  
  deleteTodo: async (id) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Just return success flag
    return { success: true };
  }
};

// Todo item component with update and delete mutations
function TodoItem({ todo }) {
  const queryClient = useQueryClient();
  
  // Toggle completion status mutation
  const toggleMutation = useMutation({
    mutationFn: (todo) => api.updateTodo({
      ...todo,
      completed: !todo.completed
    }),
    
    // Optimistic update
    onMutate: async (updatedTodo) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      
      // Snapshot the previous value
      const previousTodos = queryClient.getQueryData(['todos']);
      
      // Optimistically update to the new value
      queryClient.setQueryData(['todos'], old => 
        old.map(t => t.id === updatedTodo.id ? {
          ...t,
          completed: !t.completed
        } : t)
      );
      
      // Return the snapshotted value
      return { previousTodos };
    },
    
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, variables, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
      }
    },
    
    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
  
  // Delete todo mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => api.deleteTodo(id),
    
    // Optimistic update
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      
      // Snapshot the previous value
      const previousTodos = queryClient.getQueryData(['todos']);
      
      // Optimistically update to the new value
      queryClient.setQueryData(['todos'], old => 
        old.filter(t => t.id !== id)
      );
      
      // Return the snapshotted value
      return { previousTodos };
    },
    
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, id, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
      }
    },
    
    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
  
  return (
    <div className="flex items-center justify-between p-3 border-b">
      <div className="flex items-center">
        <input 
          type="checkbox" 
          checked={todo.completed} 
          onChange={() => toggleMutation.mutate(todo)}
          className="mr-2"
        />
        <span className={todo.completed ? 'line-through text-gray-500' : ''}>
          {todo.title}
        </span>
      </div>
      
      <button 
        onClick={() => deleteMutation.mutate(todo.id)}
        className="text-red-500 hover:text-red-700"
        disabled={deleteMutation.isPending}
      >
        {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  );
}

// Add todo form with mutation
function AddTodoForm() {
  const [title, setTitle] = useState('');
  const queryClient = useQueryClient();
  
  const addMutation = useMutation({
    mutationFn: (newTodo) => api.addTodo(newTodo),
    
    // When mutation succeeds, add the new todo to the cache
    onSuccess: (newTodo) => {
      queryClient.setQueryData(['todos'], old => [...old, newTodo]);
      setTitle(''); // Reset form
    },
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    addMutation.mutate({ title, completed: false });
  };
  
  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new todo"
          className="flex-1 p-2 border rounded-l"
        />
        <button 
          type="submit"
          disabled={addMutation.isPending}
          className="px-4 py-2 bg-blue-500 text-white rounded-r disabled:bg-blue-300"
        >
          {addMutation.isPending ? 'Adding...' : 'Add'}
        </button>
      </div>
      
      {addMutation.isError && (
        <div className="mt-2 text-red-500">
          Error: {addMutation.error.message}
        </div>
      )}
    </form>
  );
}

// TodoList component that displays todos
function TodoList() {
  const { data: todos, isLoading, isError, error } = useQuery({
    queryKey: ['todos'],
    queryFn: api.getTodos
  });
  
  if (isLoading) {
    return <div className="text-center p-4">Loading todos...</div>;
  }
  
  if (isError) {
    return <div className="text-red-500 p-4">Error: {error.message}</div>;
  }
  
  return (
    <div className="border rounded">
      {todos.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No todos yet. Add one above!</div>
      ) : (
        todos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))
      )}
    </div>
  );
}

// Main app component
function App() {
  return (
    <div className="max-w-md mx-auto my-8">
      <h1 className="text-xl font-bold mb-4">Advanced Todo Management</h1>
      <AddTodoForm />
      <TodoList />
    </div>
  );
}

export default App;`;

const quizQuestions = [
  {
    id: '1',
    question: 'What is the primary purpose of useMutation in TanStack Query?',
    options: [
      'To fetch data from an API',
      'To handle create, update, and delete operations',
      'To manage query caching',
      'To handle offline data synchronization'
    ],
    correctAnswerIndex: 1,
    explanation: 'useMutation is designed for handling data mutations (create, update, delete operations) rather than data fetching. It provides useful state variables and functions for managing the lifecycle of a mutation.'
  },
  {
    id: '2',
    question: 'What does the onMutate callback in useMutation allow you to do?',
    options: [
      'Handle mutation errors',
      'Transform the variables before the mutation',
      'Perform optimistic updates and return context for potential rollbacks',
      'Log mutation metrics'
    ],
    correctAnswerIndex: 2,
    explanation: 'The onMutate callback is called before a mutation executes. It allows you to perform optimistic updates by modifying the cache and return a context object that can be used to roll back changes if the mutation fails.'
  },
  {
    id: '3',
    question: 'After a successful mutation, what's the best way to update the query cache?',
    options: [
      'Manually update the cache using queryClient.setQueryData',
      'Always invalidate related queries with queryClient.invalidateQueries',
      'Use a combination of optimistic updates and cache invalidation depending on the use case',
      'Directly modify the DOM to reflect the changes'
    ],
    correctAnswerIndex: 2,
    explanation: 'The best approach depends on the use case. For real-time feedback, optimistic updates with queryClient.setQueryData work well. For ensuring data consistency, invalidating queries forces a refetch. A combination of both is often the most effective strategy.'
  },
  {
    id: '4',
    question: 'What does the isPending property indicate in a mutation result?',
    options: [
      'Whether the mutation has successfully completed',
      'Whether the mutation has encountered an error',
      'Whether the mutation is currently in progress',
      'Whether the mutation has been paused'
    ],
    correctAnswerIndex: 2,
    explanation: 'The isPending property (formerly isLoading in v4) indicates that the mutation is currently in progress. It's useful for displaying loading states in the UI while the mutation is being executed.'
  },
  {
    id: '5',
    question: 'What is an optimistic update in the context of mutations?',
    options: [
      'A performance optimization technique',
      'Immediately updating the UI before the server confirms the change',
      'Batching multiple mutations together',
      'Automatically retrying failed mutations'
    ],
    correctAnswerIndex: 1,
    explanation: 'An optimistic update is when you immediately update the UI to reflect the expected result of a mutation before receiving confirmation from the server. If the mutation fails, you can roll back to the previous state.'
  }
];

const UseMutationPage: React.FC = () => {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">TanStack Query: useMutation Hook</h1>
      
      <LearningObjectives 
        objectives={[
          "Understand the useMutation hook and its purpose",
          "Learn how to create, update, and delete data with useMutation",
          "Implement optimistic updates for a better user experience",
          "Handle mutation states (loading, success, error)",
          "Update the query cache after mutations"
        ]}
      />
      
      <div className="mt-12 mb-10 max-w-3xl">
        <h2 className="text-2xl font-semibold mb-4">Introduction to useMutation</h2>
        <p className="mb-4">
          While useQuery is perfect for fetching data, useMutation is designed for creating, 
          updating, and deleting data. It helps you manage the entire lifecycle of a mutation 
          operation, including loading states, error handling, and success callbacks.
        </p>
        
        <p className="mb-4">
          Here's the basic syntax of useMutation:
        </p>
        
        <div className="bg-sidebar rounded-md p-4 my-4 font-code text-sm">
          <pre>const mutation = useMutation({
  mutationFn: (variables) => {
    // Function that performs the mutation
    return api.createItem(variables);
  },
  onSuccess: (data, variables, context) => {
    // Called when the mutation succeeds
  },
  onError: (error, variables, context) => {
    // Called when the mutation fails
  },
  onSettled: (data, error, variables, context) => {
    // Called when the mutation completes (success or error)
  }
});</pre>
        </div>
        
        <p className="mb-4">
          The useMutation hook returns an object with several properties and methods:
        </p>
        
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li><code className="bg-sidebar text-secondary px-1 py-0.5 rounded">mutate</code> / <code className="bg-sidebar text-secondary px-1 py-0.5 rounded">mutateAsync</code>: Functions to trigger the mutation</li>
          <li><code className="bg-sidebar text-secondary px-1 py-0.5 rounded">isPending</code>: Boolean indicating if the mutation is in progress</li>
          <li><code className="bg-sidebar text-secondary px-1 py-0.5 rounded">isError</code>: Boolean indicating if the mutation encountered an error</li>
          <li><code className="bg-sidebar text-secondary px-1 py-0.5 rounded">isSuccess</code>: Boolean indicating if the mutation was successful</li>
          <li><code className="bg-sidebar text-secondary px-1 py-0.5 rounded">error</code>: The error object if the mutation failed</li>
          <li><code className="bg-sidebar text-secondary px-1 py-0.5 rounded">data</code>: The data returned from the mutation function</li>
        </ul>
      </div>
      
      {/* Example 1: Basic useMutation */}
      <div className="mb-10" id="examples">
        <h2 className="text-2xl font-semibold mb-4">Example 1: Basic useMutation</h2>
        <p className="mb-4 max-w-3xl">
          This example demonstrates a simple form that creates a new todo item using useMutation.
          It shows how to handle loading, success, and error states during the mutation.
        </p>
        
        <CodeExample 
          title="Create Todo with useMutation"
          initialCode={basicMutationExample}
          explanation={
            <div>
              <h4 className="font-medium mb-2">Key Concepts</h4>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span>Using useMutation to create a new resource</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span>Handling form submission with mutation state</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span>Invalidating the query cache after a successful mutation</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span>Displaying loading, success, and error states in the UI</span>
                </li>
              </ul>
            </div>
          }
          analysis={
            <div>
              <h4 className="font-medium mb-2">Code Analysis</h4>
              <p className="mb-2">Let's analyze the key parts of this useMutation implementation:</p>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span>The mutationFn performs an API call to create a new todo</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span>onSuccess invalidates the todos query to refetch the latest data</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span>We use isPending to disable the submit button during the mutation</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span>Error handling includes showing the error message to the user</span>
                </li>
              </ul>
            </div>
          }
          challenge={
            <div>
              <h4 className="font-medium mb-2">Challenge</h4>
              <p>Try enhancing this example by:</p>
              <ol className="list-decimal pl-5 space-y-1 mt-2">
                <li>Adding form validation before submission</li>
                <li>Creating a toast notification system for success and error states</li>
                <li>Implementing a loading spinner inside the submit button</li>
              </ol>
            </div>
          }
        />
      </div>
      
      {/* Example 2: Advanced useMutation with Optimistic Updates */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Example 2: Advanced useMutation with Optimistic Updates</h2>
        <p className="mb-4 max-w-3xl">
          This more advanced example demonstrates using useMutation with optimistic updates
          for creating, updating, and deleting todos. It creates a responsive UI that updates
          immediately while mutations are processing.
        </p>
        
        <CodeExample 
          title="Todo App with Optimistic Updates"
          initialCode={advancedMutationExample}
          explanation={
            <div>
              <h4 className="font-medium mb-2">Key Concepts</h4>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span>Implementing optimistic updates with onMutate</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span>Rolling back changes on mutation failure</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span>Handling multiple mutation types (create, update, delete)</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span>Managing the query cache for a smooth user experience</span>
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
                  <span><strong>Optimistic Updates</strong>: We update the UI immediately before the server responds</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span><strong>Context for Rollbacks</strong>: We save the previous state to restore it if the mutation fails</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span><strong>Cache Manipulation</strong>: We directly modify the cache with setQueryData for immediate feedback</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span><strong>Query Invalidation</strong>: We invalidate queries after mutations to ensure data consistency</span>
                </li>
              </ul>
            </div>
          }
          challenge={
            <div>
              <h4 className="font-medium mb-2">Challenge</h4>
              <p>Enhance this advanced example by:</p>
              <ol className="list-decimal pl-5 space-y-1 mt-2">
                <li>Adding an edit feature for todo titles</li>
                <li>Implementing batch operations (e.g., delete all completed todos)</li>
                <li>Adding undo functionality after a todo is deleted</li>
              </ol>
            </div>
          }
        />
      </div>
      
      {/* useMutation Best Practices */}
      <div className="mb-10 max-w-3xl">
        <div className="bg-muted rounded-lg p-5">
          <h3 className="flex items-center text-lg font-medium mb-3">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-secondary mr-2">
              <path d="M21 10.0836V10.0836C21 6.74281 21 5.07241 20.0311 4.08994C19.0622 3.10748 17.413 3.10748 14.1147 3.10748H9.88526C6.58704 3.10748 4.93793 3.10748 3.96894 4.08994C3 5.07241 3 6.74281 3 10.0836V15.9164C3 19.2572 3 20.9276 3.96894 21.9101C4.93793 22.8925 6.58704 22.8925 9.88526 22.8925H14.1147C17.413 22.8925 19.0622 22.8925 20.0311 21.9101C21 20.9276 21 19.2572 21 15.9164V15.9164" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M8.5 12H15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M12 8.5V15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            useMutation Best Practices
          </h3>
          
          <div className="mb-5">
            <h4 className="font-medium mb-2">Cache Management</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                <span><strong>Direct Updates</strong>: Use queryClient.setQueryData for immediate UI updates</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                <span><strong>Invalidation</strong>: Use queryClient.invalidateQueries to refetch and ensure data consistency</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                <span><strong>Selective Updates</strong>: Update specific items in collections rather than invalidating entire queries</span>
              </li>
            </ul>
          </div>
          
          <div className="mb-5">
            <h4 className="font-medium mb-2">Optimistic Updates</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                <span><strong>Save Previous State</strong>: Always save the previous state in onMutate for potential rollbacks</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                <span><strong>Cancel In-flight Queries</strong>: Cancel related queries before optimistic updates</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                <span><strong>Handle Errors</strong>: Implement proper error handling with rollbacks in onError</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Performance Tips</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                <span><strong>Batch Operations</strong>: Use batch mutations for multiple related changes</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                <span><strong>Retry Logic</strong>: Configure retry behavior for transient failures</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                <span><strong>Debounce Inputs</strong>: For real-time saving features, debounce user inputs before triggering mutations</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Quiz Section */}
      <div id="quiz">
        <Quiz 
          title="Quiz: useMutation Hook"
          questions={quizQuestions}
          tutorialId="useMutation"
        />
      </div>
      
      {/* Next steps section */}
      <NextSteps currentPath="/tanstack/use-mutation" category="tanstack" />
    </div>
  );
};

export default UseMutationPage;