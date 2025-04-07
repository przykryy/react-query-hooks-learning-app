import React from 'react';
import { useLocation } from 'wouter';
import { Menu, HelpCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface TopBarProps {
  toggleSidebar: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ toggleSidebar }) => {
  const [location] = useLocation();

  return (
    <div className="bg-card border-b border-border p-4 flex items-center justify-between">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="md:hidden mr-4 text-muted-foreground hover:text-foreground"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-semibold text-foreground">React Learning App</h2>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="secondary" size="sm" className="text-sm">
          <HelpCircle className="mr-1 h-4 w-4" />
          Help
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default TopBar;
