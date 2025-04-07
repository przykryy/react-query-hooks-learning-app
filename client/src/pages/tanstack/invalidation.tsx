import React from 'react';
import NextSteps from '@/components/tutorial/NextSteps';
import LearningObjectives from '@/components/tutorial/LearningObjectives';
import CodeExample from '@/components/tutorial/CodeExample';
import Quiz from '@/components/tutorial/Quiz';

const basicInvalidationExample = `import React, { useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Mock API
const api = {
  getTodos: async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      { id: 1, title: 'Learn React', completed: false },
      { id: 2, title: 'Learn TanStack Query', completed: false },
      { id: 3, title: 'Build an app', completed: false },
    ];
  },
  
  updateTodo: async (todo) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...todo, completed: !todo.completed };
  }
};

// Todo component with toggle functionality
function Todo({ todo }) {
  const queryClient = useQueryClient();
  
  // Mutation to toggle todo completion status
  const toggleMutation = useMutation({
    mutationFn: api.updateTodo,
    onSuccess: (updatedTodo) => {
      // Method 1: Invalidate the todos query
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      
      console.log('Todo updated and cache invalidated!');
    }
  });
  
  return (
    <div className="flex items-center p-2 border-b">
      <input 
        type="checkbox" 
        checked={todo.completed} 
        onChange={() => toggleMutation.mutate(todo)}
        className="mr-2"
      />
      <span className={todo.completed ? 'line-through text-gray-500' : ''}>
        {todo.title}
      </span>
      
      {toggleMutation.isPending && <span className="ml-2 text-sm text-blue-500">Updating...</span>}
    </div>
  );
}

// TodoList component that fetches and displays todos
function TodoList() {
  const queryClient = useQueryClient();
  
  // Query to fetch todos
  const { data: todos, isLoading, isError, error, refetch, dataUpdatedAt } = useQuery({
    queryKey: ['todos'],
    queryFn: api.getTodos,
    staleTime: 5000, // Consider data stale after 5 seconds
  });
  
  // Format the last updated time
  const lastUpdated = new Date(dataUpdatedAt).toLocaleTimeString();
  
  if (isLoading) return <div className="text-center p-4">Loading todos...</div>;
  if (isError) return <div className="text-red-500 p-4">Error: {error.message}</div>;
  
  return (
    <div className="border rounded shadow-sm">
      <div className="flex justify-between items-center p-2 bg-gray-100">
        <h3 className="font-medium">Todo List</h3>
        <div className="text-sm text-gray-500">Last updated: {lastUpdated}</div>
      </div>
      
      <div className="divide-y">
        {todos.map(todo => (
          <Todo key={todo.id} todo={todo} />
        ))}
      </div>
      
      <div className="p-2 flex space-x-2">
        <button 
          onClick={() => refetch()}
          className="px-2 py-1 bg-blue-500 text-white text-sm rounded"
        >
          Refetch Manually
        </button>
        
        <button 
          onClick={() => queryClient.invalidateQueries({ queryKey: ['todos'] })}
          className="px-2 py-1 bg-green-500 text-white text-sm rounded"
        >
          Invalidate Cache
        </button>
      </div>
    </div>
  );
}

// Main App component with query client
function App() {
  return (
    <div className="max-w-md mx-auto my-8 p-4">
      <h1 className="text-xl font-bold mb-4">Query Invalidation Demo</h1>
      <TodoList />
      
      <div className="mt-4 text-sm bg-gray-100 p-3 rounded">
        <p className="font-medium">Notes:</p>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>Toggling a todo will invalidate the todos query</li>
          <li>Data becomes stale after 5 seconds</li>
          <li>Try using both buttons to see different refetching behaviors</li>
        </ul>
      </div>
    </div>
  );
}

export default App;`;

const advancedInvalidationExample = `import React, { useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Mock API for different resources
const api = {
  // Posts API
  getPosts: async (userId = null) => {
    console.log(\`Fetching posts \${userId ? 'for user ' + userId : 'for all users'}\`);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const allPosts = [
      { id: 1, userId: 1, title: 'First post', body: 'Content for first post' },
      { id: 2, userId: 1, title: 'Second post', body: 'Content for second post' },
      { id: 3, userId: 2, title: 'Third post', body: 'Content for third post' },
      { id: 4, userId: 2, title: 'Fourth post', body: 'Content for fourth post' },
      { id: 5, userId: 3, title: 'Fifth post', body: 'Content for fifth post' },
    ];
    
    if (userId) {
      return allPosts.filter(post => post.userId === userId);
    }
    
    return allPosts;
  },
  
  addPost: async (post) => {
    console.log('Adding new post:', post);
    await new Promise(resolve => setTimeout(resolve, 500));
    return { id: Date.now(), ...post };
  },
  
  // Users API
  getUsers: async () => {
    console.log('Fetching users');
    await new Promise(resolve => setTimeout(resolve, 600));
    return [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Smith' },
      { id: 3, name: 'Bob Johnson' },
    ];
  },
  
  // Comments API
  getComments: async (postId) => {
    console.log(\`Fetching comments for post \${postId}\`);
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const commentsMap = {
      1: [
        { id: 101, postId: 1, text: 'Great post!' },
        { id: 102, postId: 1, text: 'I learned a lot' },
      ],
      2: [
        { id: 201, postId: 2, text: 'Thanks for sharing' },
      ],
      3: [
        { id: 301, postId: 3, text: 'Interesting points' },
        { id: 302, postId: 3, text: 'I disagree with some parts' },
      ],
    };
    
    return commentsMap[postId] || [];
  },
  
  addComment: async (comment) => {
    console.log('Adding new comment:', comment);
    await new Promise(resolve => setTimeout(resolve, 500));
    return { id: Date.now(), ...comment };
  },
};

// Component for adding a new post
function AddPostForm() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [userId, setUserId] = useState(1);
  const queryClient = useQueryClient();
  
  // Get users for the dropdown
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: api.getUsers,
  });
  
  // Mutation to add a post
  const addPostMutation = useMutation({
    mutationFn: api.addPost,
    onSuccess: (newPost) => {
      // APPROACH 1: Invalidate all posts queries
      queryClient.invalidateQueries({ 
        queryKey: ['posts'], 
        // This will invalidate both ['posts'] and ['posts', userId] queries
        refetchType: 'all'
      });
      
      // APPROACH 2: Update specific queries directly
      // First, update the general posts query
      queryClient.setQueryData(['posts'], (oldPosts = []) => {
        return [...oldPosts, newPost];
      });
      
      // Then, update the user-specific posts query
      queryClient.setQueryData(['posts', newPost.userId], (oldPosts = []) => {
        return [...oldPosts, newPost];
      });
      
      // Reset form
      setTitle('');
      setBody('');
    },
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    
    addPostMutation.mutate({ title, body, userId });
  };
  
  return (
    <div className="mb-6 p-4 border rounded shadow-sm">
      <h3 className="font-medium mb-3">Add New Post</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="block text-sm mb-1">Author</label>
          <select 
            value={userId} 
            onChange={(e) => setUserId(Number(e.target.value))}
            className="w-full p-2 border rounded"
          >
            {users?.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
        </div>
        
        <div className="mb-3">
          <label className="block text-sm mb-1">Title</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Post title"
          />
        </div>
        
        <div className="mb-3">
          <label className="block text-sm mb-1">Content</label>
          <textarea 
            value={body} 
            onChange={(e) => setBody(e.target.value)}
            className="w-full p-2 border rounded"
            rows={3}
            placeholder="Post content"
          />
        </div>
        
        <button 
          type="submit"
          disabled={addPostMutation.isPending}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
        >
          {addPostMutation.isPending ? 'Adding...' : 'Add Post'}
        </button>
      </form>
    </div>
  );
}

// Component for displaying comments
function CommentList({ postId }) {
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState('');
  
  // Query for comments
  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => api.getComments(postId),
  });
  
  // Mutation to add a comment
  const addCommentMutation = useMutation({
    mutationFn: api.addComment,
    onSuccess: (newComment) => {
      // More precise invalidation - only invalidate comments for this post
      queryClient.invalidateQueries({ 
        queryKey: ['comments', postId],
        exact: true
      });
      
      setNewComment('');
    },
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    addCommentMutation.mutate({ postId, text: newComment });
  };
  
  if (isLoading) return <div className="text-sm text-gray-500">Loading comments...</div>;
  
  return (
    <div className="mt-2 pl-4 border-l-2 border-gray-200">
      <h4 className="text-sm font-medium mb-2">Comments ({comments.length})</h4>
      
      {comments.length === 0 ? (
        <div className="text-sm text-gray-500 mb-2">No comments yet</div>
      ) : (
        <ul className="space-y-1 mb-3">
          {comments.map(comment => (
            <li key={comment.id} className="text-sm p-1">
              {comment.text}
            </li>
          ))}
        </ul>
      )}
      
      <form onSubmit={handleSubmit} className="flex">
        <input 
          type="text" 
          value={newComment} 
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 p-1 text-sm border rounded-l"
          placeholder="Add a comment..."
        />
        <button 
          type="submit"
          disabled={addCommentMutation.isPending}
          className="px-2 py-1 bg-gray-200 text-gray-800 text-sm rounded-r border-t border-r border-b"
        >
          Add
        </button>
      </form>
    </div>
  );
}

// Component for a single post
function Post({ post, expanded, onToggleExpand }) {
  return (
    <div className="mb-3 p-3 border rounded shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">{post.title}</h3>
        <button 
          onClick={() => onToggleExpand(post.id)}
          className="text-xs text-blue-500"
        >
          {expanded ? 'Hide Comments' : 'Show Comments'}
        </button>
      </div>
      
      <p className="text-sm mb-2">{post.body}</p>
      
      {expanded && <CommentList postId={post.id} />}
    </div>
  );
}

// User filter component
function UserFilter({ activeUserId, onUserChange }) {
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: api.getUsers,
  });
  
  if (isLoading) return <div>Loading users...</div>;
  
  return (
    <div className="mb-4">
      <label className="block text-sm mb-1">Filter by User:</label>
      <select 
        value={activeUserId || ''}
        onChange={(e) => onUserChange(e.target.value ? Number(e.target.value) : null)}
        className="p-2 border rounded"
      >
        <option value="">All Users</option>
        {users.map(user => (
          <option key={user.id} value={user.id}>{user.name}</option>
        ))}
      </select>
    </div>
  );
}

// Posts list component
function PostsList() {
  const queryClient = useQueryClient();
  const [activeUserId, setActiveUserId] = useState(null);
  const [expandedPostId, setExpandedPostId] = useState(null);
  
  // Query for posts based on active user
  const { data: posts = [], isLoading, dataUpdatedAt } = useQuery({
    queryKey: ['posts', activeUserId].filter(Boolean),
    queryFn: () => api.getPosts(activeUserId),
  });
  
  // Format the last updated time
  const lastUpdated = new Date(dataUpdatedAt).toLocaleTimeString();
  
  // Toggle post expansion (to show comments)
  const handleToggleExpand = (postId) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Posts</h2>
        <div className="text-xs text-gray-500">Last updated: {lastUpdated}</div>
      </div>
      
      <UserFilter activeUserId={activeUserId} onUserChange={setActiveUserId} />
      
      <div className="mb-4 flex space-x-2">
        <button 
          onClick={() => queryClient.invalidateQueries({ queryKey: ['posts'] })}
          className="px-3 py-1 bg-green-500 text-white text-sm rounded"
        >
          Invalidate All Posts
        </button>
        
        <button 
          onClick={() => queryClient.invalidateQueries({ queryKey: ['users'] })}
          className="px-3 py-1 bg-purple-500 text-white text-sm rounded"
        >
          Invalidate Users
        </button>
        
        <button 
          onClick={() => queryClient.invalidateQueries({
            predicate: (query) => query.queryKey[0] === 'comments'
          })}
          className="px-3 py-1 bg-yellow-500 text-white text-sm rounded"
        >
          Invalidate All Comments
        </button>
      </div>
      
      {isLoading ? (
        <div className="text-center p-4">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="text-center p-4 border rounded">No posts found</div>
      ) : (
        <div>
          {posts.map(post => (
            <Post 
              key={post.id} 
              post={post} 
              expanded={expandedPostId === post.id}
              onToggleExpand={handleToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Main app component
function App() {
  return (
    <div className="max-w-2xl mx-auto my-8 p-4">
      <h1 className="text-2xl font-bold mb-6">Advanced Query Invalidation Demo</h1>
      <AddPostForm />
      <hr className="my-6" />
      <PostsList />
      
      <div className="mt-6 text-sm bg-gray-100 p-3 rounded">
        <p className="font-medium">Invalidation Techniques Demonstrated:</p>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>Exact key invalidation (specific post comments)</li>
          <li>Hierarchical key invalidation (all posts or user-specific posts)</li>
          <li>Predicate-based invalidation (all comments queries)</li>
          <li>Direct cache manipulation with setQueryData</li>
          <li>Mixed approach with both invalidation and direct updates</li>
        </ul>
      </div>
    </div>
  );
}

export default App;`;

const quizQuestions = [
  {
    id: '1',
    question: 'What is the primary purpose of query invalidation in TanStack Query?',
    options: [
      { id: 'a', text: 'To delete data from the cache permanently' },
      { id: 'b', text: 'To mark queries as stale and potentially trigger refetching' },
      { id: 'c', text: 'To prevent queries from executing' },
      { id: 'd', text: 'To save memory by removing unused queries' }
    ],
    correctAnswer: 'b',
    explanation: 'Query invalidation marks queries as stale, which can trigger refetching based on your refetch configuration. It doesn\'t delete data but rather signals that the cached data may no longer be accurate.'
  },
  {
    id: '2',
    question: 'Which method is used to invalidate queries in TanStack Query?',
    options: [
      { id: 'a', text: 'queryClient.removeQueries()' },
      { id: 'b', text: 'queryClient.resetQueries()' },
      { id: 'c', text: 'queryClient.invalidateQueries()' },
      { id: 'd', text: 'queryClient.clearQueries()' }
    ],
    correctAnswer: 'c',
    explanation: 'queryClient.invalidateQueries() is the method used to mark queries as stale and potentially trigger refetching. The other methods have different purposes: removeQueries removes queries from the cache, and resetQueries resets query data to its initial state.'
  },
  {
    id: '3',
    question: 'How can you invalidate all queries related to "todos" regardless of any additional query key parameters?',
    options: [
      { id: 'a', text: 'queryClient.invalidateQueries({ queryKey: ["todos"] })' },
      { id: 'b', text: 'queryClient.invalidateQueries({ queryKey: "todos" })' },
      { id: 'c', text: 'queryClient.invalidateQueries({ exact: true, queryKey: ["todos"] })' },
      { id: 'd', text: 'queryClient.invalidateQueries({ type: "todos" })' }
    ],
    correctAnswer: 'a',
    explanation: 'queryClient.invalidateQueries({ queryKey: ["todos"] }) will invalidate all queries whose key starts with "todos", including nested queries like ["todos", 1], ["todos", "active"], etc. To match only the exact key, you would add the exact: true option.'
  },
  {
    id: '4',
    question: 'When would you use exact: true with invalidateQueries?',
    options: [
      { id: 'a', text: 'When you want to invalidate all queries in the cache' },
      { id: 'b', text: 'When you want to invalidate only a specific query with an exact match on the query key' },
      { id: 'c', text: 'When you want to ensure queries are refetched immediately' },
      { id: 'd', text: 'When you want to prevent specific queries from being invalidated' }
    ],
    correctAnswer: 'b',
    explanation: 'The exact: true option ensures that only queries with the exact query key match are invalidated. Without this option, invalidation applies to the specified query key and any query keys that include it as a prefix.'
  },
  {
    id: '5',
    question: 'Which approach is most appropriate when you need to invalidate multiple unrelated queries after a complex operation?',
    options: [
      { id: 'a', text: 'Use multiple separate invalidateQueries calls' },
      { id: 'b', text: 'Use a single invalidateQueries call with a common prefix' },
      { id: 'c', text: 'Use queryClient.clear() to invalidate all queries' },
      { id: 'd', text: 'Use queryClient.invalidateQueries() with a predicate function' }
    ],
    correctAnswer: 'd',
    explanation: 'Using a predicate function with invalidateQueries gives you the most flexibility for invalidating multiple unrelated queries based on custom logic. You can examine each query\'s key and determine whether it should be invalidated.'
  }
];

const QueryInvalidationPage: React.FC = () => {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">TanStack Query: Cache Invalidation</h1>
      
      <LearningObjectives 
        objectives={[
          "Understand query invalidation and its importance",
          "Learn different methods to invalidate queries",
          "Master hierarchical query invalidation strategies",
          "Implement precise cache updates for optimal performance",
          "Apply advanced invalidation techniques for complex applications"
        ]}
      />
      
      <div className="mt-12 mb-10 max-w-3xl">
        <h2 className="text-2xl font-semibold mb-4">Introduction to Query Invalidation</h2>
        <p className="mb-4">
          Query invalidation is a critical aspect of state management in TanStack Query. It allows you
          to mark queries as stale and potentially trigger refetching to ensure your UI displays the most
          up-to-date data, especially after mutations.
        </p>
        
        <p className="mb-4">
          Here's the basic syntax for invalidating queries:
        </p>
        
        <div className="bg-sidebar rounded-md p-4 my-4 font-code text-sm">
          <pre>// Invalidate a specific query
queryClient.invalidateQueries({'{'}
  queryKey: ['todos']
{'}'});

// Invalidate with more options
queryClient.invalidateQueries({'{'}
  queryKey: ['todos'],
  exact: true,       // Match only this exact key
  refetchType: 'all' // 'active' (default) or 'all' or 'none'
{'}'});</pre>
        </div>
        
        <p className="mb-4">
          When you invalidate a query:
        </p>
        
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>It's marked as stale immediately</li>
          <li>If the query is currently rendered on screen (active), it will be refetched in the background</li>
          <li>If the query isn't being rendered (inactive), it will be refetched the next time it's used</li>
        </ul>
        
        <p className="mb-4">
          Proper invalidation strategies are essential for maintaining data consistency while maximizing performance.
        </p>
      </div>
      
      {/* Example 1: Basic Invalidation */}
      <div className="mb-10" id="examples">
        <h2 className="text-2xl font-semibold mb-4">Example 1: Basic Query Invalidation</h2>
        <p className="mb-4 max-w-3xl">
          This example demonstrates the basics of query invalidation with a simple todo application.
          You'll see how to invalidate queries after mutations and manually trigger invalidation.
        </p>
        
        <CodeExample 
          title="Basic Query Invalidation"
          initialCode={basicInvalidationExample}
          explanation={
            <div>
              <h4 className="font-medium mb-2">Key Concepts</h4>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span>Invalidating queries after a mutation completes</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span>Using manual refetch vs. cache invalidation</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span>Configuring staleTime for controlling when data is considered outdated</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span>Tracking when data was last updated</span>
                </li>
              </ul>
            </div>
          }
          analysis={
            <div>
              <h4 className="font-medium mb-2">Code Analysis</h4>
              <p className="mb-2">Let's analyze the key invalidation aspects:</p>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span>In the Todo component, we invalidate the todos query after toggling a todo</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span>The refetch button directly triggers refetching without invalidating</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span>The invalidate cache button explicitly marks the query as stale</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span>We see the last updated time to visualize when refetching occurs</span>
                </li>
              </ul>
            </div>
          }
          challenge={
            <div>
              <h4 className="font-medium mb-2">Challenge</h4>
              <p>Try enhancing this example by:</p>
              <ol className="list-decimal pl-5 space-y-1 mt-2">
                <li>Adding a new todo form that invalidates the cache on successful creation</li>
                <li>Implementing a delete todo feature with appropriate cache invalidation</li>
                <li>Creating a button that only refetches if data is older than 10 seconds</li>
              </ol>
            </div>
          }
        />
      </div>
      
      {/* Example 2: Advanced Invalidation */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Example 2: Advanced Invalidation Techniques</h2>
        <p className="mb-4 max-w-3xl">
          This more advanced example shows sophisticated invalidation strategies for a blog
          application with posts, comments, and users. It demonstrates how to handle complex
          relationships between different data types.
        </p>
        
        <CodeExample 
          title="Advanced Invalidation Strategies"
          initialCode={advancedInvalidationExample}
          explanation={
            <div>
              <h4 className="font-medium mb-2">Key Concepts</h4>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span>Hierarchical and nested query invalidation</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span>Using the exact parameter for precise invalidation</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span>Predicate-based query invalidation for complex filtering</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span>Combining direct cache updates with invalidation</span>
                </li>
              </ul>
            </div>
          }
          analysis={
            <div>
              <h4 className="font-medium mb-2">Advanced Techniques Explained</h4>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span><strong>Hierarchical invalidation</strong>: When adding a post, we invalidate all ['posts'] queries, affecting both general and user-specific queries</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span><strong>Exact matching</strong>: When adding a comment, we use exact: true to only invalidate comments for that specific post</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span><strong>Predicate-based invalidation</strong>: We invalidate all comments by matching any query whose first key part is 'comments'</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                  <span><strong>Mixed strategy</strong>: When adding a post, we both invalidate and directly update the cache for optimal UX</span>
                </li>
              </ul>
            </div>
          }
          challenge={
            <div>
              <h4 className="font-medium mb-2">Challenge</h4>
              <p>Enhance this advanced example by:</p>
              <ol className="list-decimal pl-5 space-y-1 mt-2">
                <li>Adding the ability to edit posts with optimistic updates and fallback invalidation</li>
                <li>Implementing a "clear all cache" button with confirmation</li>
                <li>Creating a feature to filter posts by keyword with appropriate cache handling</li>
              </ol>
            </div>
          }
        />
      </div>
      
      {/* Invalidation Best Practices */}
      <div className="mb-10 max-w-3xl">
        <div className="bg-muted rounded-lg p-5">
          <h3 className="flex items-center text-lg font-medium mb-3">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-secondary mr-2">
              <path d="M21 10.0836V10.0836C21 6.74281 21 5.07241 20.0311 4.08994C19.0622 3.10748 17.413 3.10748 14.1147 3.10748H9.88526C6.58704 3.10748 4.93793 3.10748 3.96894 4.08994C3 5.07241 3 6.74281 3 10.0836V15.9164C3 19.2572 3 20.9276 3.96894 21.9101C4.93793 22.8925 6.58704 22.8925 9.88526 22.8925H14.1147C17.413 22.8925 19.0622 22.8925 20.0311 21.9101C21 20.9276 21 19.2572 21 15.9164V15.9164" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M8.5 12H15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M12 8.5V15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Cache Invalidation Best Practices
          </h3>
          
          <div className="mb-5">
            <h4 className="font-medium mb-2">Design Your Query Keys Strategically</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                <span>Structure keys to allow for both broad and targeted invalidation</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                <span>Use array-based keys for hierarchical relationships</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                <span>Include all filter parameters in the key for precise cache control</span>
              </li>
            </ul>
          </div>
          
          <div className="mb-5">
            <h4 className="font-medium mb-2">Optimize Invalidation Scope</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                <span>Be as specific as possible to avoid unnecessary refetches</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                <span>Use exact: true when you only want to invalidate a specific query</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                <span>Consider using setQueryData for immediate updates plus invalidation for consistency</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Advanced Techniques</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                <span>Use refetchType: 'none' when you want to mark as stale without immediate refetch</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                <span>Use predicates for complex invalidation logic beyond simple key matching</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 mr-2"></div>
                <span>Consider cache lifetime settings (gcTime, staleTime) when designing invalidation strategies</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Quiz Section */}
      <div id="quiz">
        <Quiz 
          title="Quiz: Query Invalidation"
          questions={quizQuestions}
          tutorialId="invalidation"
        />
      </div>
      
      {/* Next steps section */}
      <NextSteps currentPath="/tanstack/invalidation" category="tanstack" />
    </div>
  );
};

export default QueryInvalidationPage;