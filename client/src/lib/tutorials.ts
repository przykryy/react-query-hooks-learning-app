export interface Tutorial {
  id: string;
  title: string;
  path: string;
  description: string;
  shortDescription: string;
}

export const tutorials = {
  hooks: [
    {
      id: "useState",
      title: "useState",
      path: "/hooks/use-state",
      description: "Learn how to add and manage state in your functional components with React's useState hook.",
      shortDescription: "Add and manage state in functional components"
    },
    {
      id: "useEffect",
      title: "useEffect",
      path: "/hooks/use-effect",
      description: "Learn how to perform side effects in your functional components with React's useEffect hook.",
      shortDescription: "Handle side effects in functional components"
    },
    {
      id: "useContext",
      title: "useContext",
      path: "/hooks/use-context",
      description: "Share state between components without prop drilling using React's Context API and useContext hook.",
      shortDescription: "Share state between components easily"
    },
    {
      id: "useRef",
      title: "useRef",
      path: "/hooks/use-ref",
      description: "Access DOM elements directly and persist values between renders with React's useRef hook.",
      shortDescription: "Access DOM elements and persist values"
    },
    {
      id: "useMemo",
      title: "useMemo",
      path: "/hooks/use-memo",
      description: "Optimize performance by memoizing expensive calculations with React's useMemo hook.",
      shortDescription: "Memoize expensive calculations for performance"
    },
    {
      id: "useCallback",
      title: "useCallback",
      path: "/hooks/use-callback",
      description: "Optimize performance by memoizing callback functions with React's useCallback hook.",
      shortDescription: "Memoize callback functions for better performance"
    },
    {
      id: "useReducer",
      title: "useReducer",
      path: "/hooks/use-reducer",
      description: "Manage complex state logic with actions and reducers using React's useReducer hook.",
      shortDescription: "Manage complex state with actions and reducers"
    },
    {
      id: "customHooks",
      title: "Custom Hooks",
      path: "/hooks/custom-hooks",
      description: "Learn how to create your own custom hooks to reuse stateful logic across multiple components.",
      shortDescription: "Create reusable stateful logic with custom hooks"
    }
  ],
  tanstack: [
    {
      id: "introduction",
      title: "Introduction",
      path: "/tanstack/introduction",
      description: "Get started with TanStack Query and learn about its core concepts and benefits.",
      shortDescription: "Introduction to TanStack Query basics"
    },
    {
      id: "queryClientProvider",
      title: "QueryClientProvider",
      path: "/tanstack/query-client-provider",
      description: "Learn how to set up and configure the QueryClientProvider in your React application.",
      shortDescription: "Set up and configure QueryClientProvider"
    },
    {
      id: "useQuery",
      title: "useQuery",
      path: "/tanstack/use-query",
      description: "Fetch, cache, and update data in your React components with the useQuery hook.",
      shortDescription: "Fetch and cache data with useQuery"
    },
    {
      id: "useMutation",
      title: "useMutation",
      path: "/tanstack/use-mutation",
      description: "Create, update, and delete data with the useMutation hook.",
      shortDescription: "Create, update, and delete data"
    },
    {
      id: "invalidation",
      title: "Query Invalidation",
      path: "/tanstack/invalidation",
      description: "Learn how to invalidate and refetch queries when data changes.",
      shortDescription: "Invalidate and refetch queries"
    },
    // {
    //   id: "caching",
    //   title: "Caching & Stale Time",
    //   path: "/tanstack/caching",
    //   description: "Understand how TanStack Query's caching system works and how to configure it.",
    //   shortDescription: "Configure caching and stale time"
    // },
    // {
    //   id: "pagination",
    //   title: "Pagination & Infinite Queries",
    //   path: "/tanstack/pagination",
    //   description: "Implement pagination and infinite scroll with TanStack Query.",
    //   shortDescription: "Implement pagination and infinite scroll"
    // }
  ]
};

export default tutorials;
