import React from 'react';
import { Github, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-sidebar border-t border-muted py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center text-sm">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-primary mr-2">
                <path d="M12 13.5C14.2091 13.5 16 11.7091 16 9.5C16 7.29086 14.2091 5.5 12 5.5C9.79086 5.5 8 7.29086 8 9.5C8 11.7091 9.79086 13.5 12 13.5Z" stroke="currentColor" strokeWidth="2" />
                <path d="M21.6394 11.5C21.8707 10.8833 22 10.2053 22 9.5C22 8.79469 21.8707 8.11669 21.6394 7.5C21.2889 6.54077 20.7006 5.71579 19.9281 5.12602C19.1556 4.53625 18.2292 4.20406 17.2695 4.1725C16.3098 4.14095 15.3655 4.41144 14.5533 4.95101C13.7411 5.49058 13.094 6.27545 12.6889 7.2M2.36056 7.5C2.12933 8.11669 2 8.79469 2 9.5C2 10.2053 2.12933 10.8833 2.36056 11.5C2.71107 12.4592 3.29939 13.2842 4.07192 13.874C4.84445 14.4637 5.77081 14.7959 6.73048 14.8275C7.69016 14.859 8.63452 14.5886 9.44673 14.049C10.2589 13.5094 10.906 12.7246 11.3111 11.8" stroke="currentColor" strokeWidth="2" />
                <path d="M12 13.5V21.5" stroke="currentColor" strokeWidth="2" />
                <path d="M17 16.5H7" stroke="currentColor" strokeWidth="2" />
              </svg>
              <span>React Hooks & TanStack Query Learning Platform</span>
            </div>
          </div>
          
          <div className="flex space-x-6">
            <a href="https://github.com" className="text-muted-foreground hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">
              <Github className="h-5 w-5" />
            </a>
            <a href="https://twitter.com" className="text-muted-foreground hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
