import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useLocation } from 'wouter';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header toggleMobileMenu={toggleMobileMenu} />
      
      <div className="flex-grow flex">
        {/* Desktop sidebar - hidden on mobile */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        
        {/* Mobile sidebar - only visible when toggled */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden" onClick={toggleMobileMenu}>
            <div className="bg-sidebar w-64 h-full overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <Sidebar />
            </div>
          </div>
        )}
        
        {/* Main content area */}
        <div className="flex-grow overflow-auto">
          {children}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default MainLayout;
