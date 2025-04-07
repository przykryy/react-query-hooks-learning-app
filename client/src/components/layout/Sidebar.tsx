import React from 'react';
import { Link, useLocation } from 'wouter';
import { Input } from '@/components/ui/input';
import { Search, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { tutorials } from '@/lib/tutorials';
import { useProgress } from '@/hooks/use-progress';

const Sidebar = () => {
  const [location] = useLocation();
  const { progress } = useProgress();

  return (
    <aside className="w-64 bg-sidebar h-full border-r border-muted overflow-y-auto">
      <div className="p-4 border-b border-muted">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search tutorials..."
            className="w-full bg-muted pl-8 pr-3 text-sm"
          />
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold mb-3">Your Progress</h3>
        
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span>React Hooks Basics</span>
            <span className="text-primary">{progress?.reactHooksBasics || 0}%</span>
          </div>
          <progress className="w-full h-2 rounded-full" value={progress?.reactHooksBasics || 0} max="100"></progress>
        </div>
        
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span>Advanced Hooks</span>
            <span className="text-primary">{progress?.advancedHooks || 0}%</span>
          </div>
          <progress className="w-full h-2 rounded-full" value={progress?.advancedHooks || 0} max="100"></progress>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>TanStack Query</span>
            <span className="text-primary">{progress?.tanstackQuery || 0}%</span>
          </div>
          <progress className="w-full h-2 rounded-full" value={progress?.tanstackQuery || 0} max="100"></progress>
        </div>
      </div>
      
      <nav className="p-4">
        <h3 className="font-semibold mb-3">React Hooks</h3>
        <ul className="space-y-1 text-sm">
          {tutorials.hooks.map((hook) => (
            <li key={hook.path}>
              <Link href={hook.path}>
                <a className={`flex items-center px-2 py-1.5 rounded ${location === hook.path ? 'bg-muted text-primary' : 'hover:bg-muted'}`}>
                  <ChevronRight className="h-4 w-4 mr-2" />
                  {hook.title}
                </a>
              </Link>
            </li>
          ))}
        </ul>
        
        <h3 className="font-semibold mt-6 mb-3">TanStack React Query</h3>
        <ul className="space-y-1 text-sm">
          {tutorials.tanstack.map((query) => (
            <li key={query.path}>
              <Link href={query.path}>
                <a className={`flex items-center px-2 py-1.5 rounded ${location === query.path ? 'bg-muted text-primary' : 'hover:bg-muted'}`}>
                  <ChevronRight className="h-4 w-4 mr-2" />
                  {query.title}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
