import React from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Search, Menu, User } from 'lucide-react';

interface HeaderProps {
  toggleMobileMenu: () => void;
}

const Header = ({ toggleMobileMenu }: HeaderProps) => {
  const [location] = useLocation();

  return (
    <header className="bg-sidebar border-b border-muted">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/">
            <a className="flex items-center space-x-2">
              <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-primary">
                <path d="M12 13.5C14.2091 13.5 16 11.7091 16 9.5C16 7.29086 14.2091 5.5 12 5.5C9.79086 5.5 8 7.29086 8 9.5C8 11.7091 9.79086 13.5 12 13.5Z" stroke="currentColor" strokeWidth="2" />
                <path d="M21.6394 11.5C21.8707 10.8833 22 10.2053 22 9.5C22 8.79469 21.8707 8.11669 21.6394 7.5C21.2889 6.54077 20.7006 5.71579 19.9281 5.12602C19.1556 4.53625 18.2292 4.20406 17.2695 4.1725C16.3098 4.14095 15.3655 4.41144 14.5533 4.95101C13.7411 5.49058 13.094 6.27545 12.6889 7.2M2.36056 7.5C2.12933 8.11669 2 8.79469 2 9.5C2 10.2053 2.12933 10.8833 2.36056 11.5C2.71107 12.4592 3.29939 13.2842 4.07192 13.874C4.84445 14.4637 5.77081 14.7959 6.73048 14.8275C7.69016 14.859 8.63452 14.5886 9.44673 14.049C10.2589 13.5094 10.906 12.7246 11.3111 11.8" stroke="currentColor" strokeWidth="2" />
                <path d="M12 13.5V21.5" stroke="currentColor" strokeWidth="2" />
                <path d="M17 16.5H7" stroke="currentColor" strokeWidth="2" />
              </svg>
              <h1 className="text-xl font-semibold">React <span className="text-primary">Hooks</span> & <span className="text-secondary">TanStack Query</span></h1>
            </a>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/">
            <a className={`hover:text-primary transition-colors ${location === '/' ? 'text-primary' : ''}`}>Home</a>
          </Link>
          <Link href="/hooks/use-state">
            <a className={`hover:text-primary transition-colors ${location.startsWith('/hooks') ? 'text-primary' : ''}`}>Hooks</a>
          </Link>
          <Link href="/tanstack/introduction">
            <a className={`hover:text-primary transition-colors ${location.startsWith('/tanstack') ? 'text-primary' : ''}`}>TanStack Query</a>
          </Link>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="hover:text-primary transition-colors">
            <Search className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon" className="hover:text-primary transition-colors md:hidden" onClick={toggleMobileMenu}>
            <Menu className="h-5 w-5" />
          </Button>
          
          <Button variant="secondary" size="sm" className="flex items-center space-x-1">
            <User className="h-4 w-4 mr-1" />
            <span>Sign In</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
