import React from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

interface HeaderProps {
  toggleMobileMenu: () => void;
}

const Header = ({ toggleMobileMenu }: HeaderProps) => {
  const [location] = useLocation();

  return (
    <header className="bg-sidebar border-b border-muted">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img src="/images/made-by-kris.png" alt="Made by Kris" className="mx-auto rounded-full w-12 h-12" />
          <Link href="/">
            <a className="flex items-center space-x-2">
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
        
          <Button variant="ghost" size="icon" className="hover:text-primary transition-colors md:hidden" onClick={toggleMobileMenu}>
            <Menu className="h-5 w-5" />
          </Button>
          
        </div>
      </div>
    </header>
  );
};

export default Header;
