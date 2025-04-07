import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { tutorials } from '@/lib/tutorials';

interface NextStepsProps {
  currentPath: string;
  category: 'hooks' | 'tanstack';
}

const NextSteps: React.FC<NextStepsProps> = ({ currentPath, category }) => {
  const tutorialsToShow = category === 'hooks' ? tutorials.hooks : tutorials.tanstack;
  
  // Find current tutorial index
  const currentIndex = tutorialsToShow.findIndex(tutorial => tutorial.path === currentPath);
  
  // Get next tutorial in the same category
  const nextTutorial = currentIndex < tutorialsToShow.length - 1 
    ? tutorialsToShow[currentIndex + 1] 
    : null;
  
  // Get relevant tutorials to suggest (mix of current category and others)
  const relevantTutorials = tutorialsToShow
    .filter((_, index) => index !== currentIndex && index !== currentIndex + 1)
    .slice(0, nextTutorial ? 2 : 3);
  
  // Add a tutorial from the other category if we have space
  const otherCategoryTutorial = category === 'hooks' 
    ? tutorials.tanstack[0] 
    : tutorials.hooks[0];
  
  return (
    <div className="mb-10 max-w-3xl">
      <h2 className="text-2xl font-semibold mb-4">Next Steps</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {nextTutorial && (
          <Link href={nextTutorial.path}>
            <a className="block bg-muted rounded-lg p-4 hover:bg-muted/80 transition-all transform hover:-translate-y-0.5">
              <h3 className="font-medium mb-2 flex items-center">
                <ArrowRight className="h-4 w-4 text-primary mr-2" />
                {nextTutorial.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {nextTutorial.description}
              </p>
            </a>
          </Link>
        )}
        
        {relevantTutorials.map(tutorial => (
          <Link key={tutorial.path} href={tutorial.path}>
            <a className="block bg-muted rounded-lg p-4 hover:bg-muted/80 transition-all transform hover:-translate-y-0.5">
              <h3 className="font-medium mb-2 flex items-center">
                <ArrowRight className="h-4 w-4 text-primary mr-2" />
                {tutorial.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {tutorial.description}
              </p>
            </a>
          </Link>
        ))}
        
        <Link href={otherCategoryTutorial.path}>
          <a className="block bg-muted rounded-lg p-4 hover:bg-muted/80 transition-all transform hover:-translate-y-0.5">
            <h3 className="font-medium mb-2 flex items-center">
              <ArrowRight className="h-4 w-4 text-secondary mr-2" />
              {otherCategoryTutorial.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {otherCategoryTutorial.description}
            </p>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default NextSteps;
