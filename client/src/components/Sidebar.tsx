import React from 'react';
import { Link, useLocation } from 'wouter';
import { ChevronRight } from 'lucide-react';
import ProgressBar from './ProgressBar';
import { useQuery } from '@tanstack/react-query';
import { ModuleProgress } from '@/types';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const [location] = useLocation();
  
  // Mock progress data until we implement user authentication
  const progress: ModuleProgress = {
    total: 20,
    completed: 3,
    percentage: 15
  };
  
  // We'll query for actual progress data when user auth is implemented
  /*
  const { data: progress } = useQuery({
    queryKey: ['/api/progress'],
    enabled: false, // Disable until we have a userId
  });
  */

  const sidebarClass = isOpen 
    ? "w-full md:w-64 bg-card flex-shrink-0 flex flex-col overflow-y-auto shadow-lg"
    : "w-full md:w-64 bg-card flex-shrink-0 md:flex flex-col overflow-y-auto shadow-lg hidden";

  const isActiveHook = (hook: string) => {
    return location === `/hooks/${hook}`;
  };

  const isActiveQuery = (query: string) => {
    return location === `/query/${query}`;
  };

  return (
    <div className={sidebarClass} id="sidebar">
      <div className="p-4 flex justify-between items-center border-b border-border">
        <div className="flex items-center space-x-2">
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" alt="React Logo" className="w-6 h-6" />
          <h1 className="text-lg font-semibold font-inter text-white">React <span className="text-primary">Mastery</span></h1>
        </div>
        <button 
          onClick={toggleSidebar} 
          className="md:hidden text-muted-foreground hover:text-foreground"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
      
      <div className="py-4">
        <div className="px-4 mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          React Hooks
        </div>
        <Link href="/hooks/useState" 
          className={`flex items-center px-4 py-2 text-sm font-medium ${isActiveHook('useState') ? 'bg-background text-primary border-l-2 border-primary' : 'text-muted-foreground hover:bg-background hover:text-foreground'}`}>
          <span className="w-6">
            <ChevronRight className={`h-4 w-4 ${isActiveHook('useState') ? '' : 'opacity-0'}`} />
          </span>
          useState
        </Link>
        <Link href="/hooks/useEffect" 
          className={`flex items-center px-4 py-2 text-sm font-medium ${isActiveHook('useEffect') ? 'bg-background text-primary border-l-2 border-primary' : 'text-muted-foreground hover:bg-background hover:text-foreground'}`}>
          <span className="w-6">
            <ChevronRight className={`h-4 w-4 ${isActiveHook('useEffect') ? '' : 'opacity-0'}`} />
          </span>
          useEffect
        </Link>
        <Link href="/hooks/useContext" 
          className={`flex items-center px-4 py-2 text-sm font-medium ${isActiveHook('useContext') ? 'bg-background text-primary border-l-2 border-primary' : 'text-muted-foreground hover:bg-background hover:text-foreground'}`}>
          <span className="w-6">
            <ChevronRight className={`h-4 w-4 ${isActiveHook('useContext') ? '' : 'opacity-0'}`} />
          </span>
          useContext
        </Link>
        <Link href="/hooks/useReducer" 
          className={`flex items-center px-4 py-2 text-sm font-medium ${isActiveHook('useReducer') ? 'bg-background text-primary border-l-2 border-primary' : 'text-muted-foreground hover:bg-background hover:text-foreground'}`}>
          <span className="w-6">
            <ChevronRight className={`h-4 w-4 ${isActiveHook('useReducer') ? '' : 'opacity-0'}`} />
          </span>
          useReducer
        </Link>
        <Link href="/hooks/useCallback" 
          className={`flex items-center px-4 py-2 text-sm font-medium ${isActiveHook('useCallback') ? 'bg-background text-primary border-l-2 border-primary' : 'text-muted-foreground hover:bg-background hover:text-foreground'}`}>
          <span className="w-6">
            <ChevronRight className={`h-4 w-4 ${isActiveHook('useCallback') ? '' : 'opacity-0'}`} />
          </span>
          useCallback
        </Link>
        <Link href="/hooks/useMemo" 
          className={`flex items-center px-4 py-2 text-sm font-medium ${isActiveHook('useMemo') ? 'bg-background text-primary border-l-2 border-primary' : 'text-muted-foreground hover:bg-background hover:text-foreground'}`}>
          <span className="w-6">
            <ChevronRight className={`h-4 w-4 ${isActiveHook('useMemo') ? '' : 'opacity-0'}`} />
          </span>
          useMemo
        </Link>
        <Link href="/hooks/useRef" 
          className={`flex items-center px-4 py-2 text-sm font-medium ${isActiveHook('useRef') ? 'bg-background text-primary border-l-2 border-primary' : 'text-muted-foreground hover:bg-background hover:text-foreground'}`}>
          <span className="w-6">
            <ChevronRight className={`h-4 w-4 ${isActiveHook('useRef') ? '' : 'opacity-0'}`} />
          </span>
          useRef
        </Link>
        
        <div className="px-4 mt-6 mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          TanStack React Query
        </div>
        <Link href="/query/basics" 
          className={`flex items-center px-4 py-2 text-sm font-medium ${isActiveQuery('basics') ? 'bg-background text-primary border-l-2 border-primary' : 'text-muted-foreground hover:bg-background hover:text-foreground'}`}>
          <span className="w-6">
            <ChevronRight className={`h-4 w-4 ${isActiveQuery('basics') ? '' : 'opacity-0'}`} />
          </span>
          Query Basics
        </Link>
        <Link href="/query/useQuery" 
          className={`flex items-center px-4 py-2 text-sm font-medium ${isActiveQuery('useQuery') ? 'bg-background text-primary border-l-2 border-primary' : 'text-muted-foreground hover:bg-background hover:text-foreground'}`}>
          <span className="w-6">
            <ChevronRight className={`h-4 w-4 ${isActiveQuery('useQuery') ? '' : 'opacity-0'}`} />
          </span>
          useQuery
        </Link>
        <Link href="/query/useMutation" 
          className={`flex items-center px-4 py-2 text-sm font-medium ${isActiveQuery('useMutation') ? 'bg-background text-primary border-l-2 border-primary' : 'text-muted-foreground hover:bg-background hover:text-foreground'}`}>
          <span className="w-6">
            <ChevronRight className={`h-4 w-4 ${isActiveQuery('useMutation') ? '' : 'opacity-0'}`} />
          </span>
          useMutation
        </Link>
        <Link href="/query/caching" 
          className={`flex items-center px-4 py-2 text-sm font-medium ${isActiveQuery('caching') ? 'bg-background text-primary border-l-2 border-primary' : 'text-muted-foreground hover:bg-background hover:text-foreground'}`}>
          <span className="w-6">
            <ChevronRight className={`h-4 w-4 ${isActiveQuery('caching') ? '' : 'opacity-0'}`} />
          </span>
          Caching
        </Link>
        <Link href="/query/refetching" 
          className={`flex items-center px-4 py-2 text-sm font-medium ${isActiveQuery('refetching') ? 'bg-background text-primary border-l-2 border-primary' : 'text-muted-foreground hover:bg-background hover:text-foreground'}`}>
          <span className="w-6">
            <ChevronRight className={`h-4 w-4 ${isActiveQuery('refetching') ? '' : 'opacity-0'}`} />
          </span>
          Refetching
        </Link>
      </div>
      
      <div className="mt-auto p-4 border-t border-border">
        <div className="flex flex-col space-y-2">
          <span className="text-sm text-muted-foreground">Your Progress</span>
          <ProgressBar value={progress.percentage} />
          <span className="text-xs text-muted-foreground">{progress.completed} of {progress.total} lessons completed</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
