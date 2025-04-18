import React, { useMemo } from 'react';
import { useParams, Link } from 'wouter';
import { ArrowLeft, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import CodeExample from '@/components/CodeExample';
import QuizComponent from '@/components/QuizComponent';
import { getHookModule, getNextHook, getPreviousHook } from '@/lib/codeExamples';
import { HookType } from '@/types';

const HookDetails: React.FC = () => {
  const params = useParams<{ hookId: HookType }>();
  const hookId = params.hookId as HookType;
  
  const module = useMemo(() => getHookModule(hookId), [hookId]);
  const prevModule = useMemo(() => getPreviousHook(hookId), [hookId]);
  const nextModule = useMemo(() => getNextHook(hookId), [hookId]);
  
  if (!module) {
    return (
      <div className="max-w-5xl mx-auto flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Hook Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The requested hook tutorial doesn't exist or is still under development.
          </p>
          <Link href="/">
            <div className="inline-flex items-center text-primary hover:underline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return Home
            </div>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Module Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-2">
          <Badge className="text-sm bg-primary bg-opacity-10 text-primary">React Hooks</Badge>
          <span className="text-sm text-muted-foreground">•</span>
          <span className="text-sm text-muted-foreground">
            {module.moduleOrder > 0 
              ? `Lesson ${module.moduleOrder} of 7`
              : 'Introduction'
            }
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">{module.title}</h1>
        <p className="text-muted-foreground mb-4">{module.description}</p>
        
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">Topics covered:</span>
          {module.codeExamples.map(ex => (
            <Badge key={ex.id} variant="secondary" className="bg-muted text-foreground px-2 py-0.5">
              {ex.title}
            </Badge>
          ))}
        </div>
      </div>

      {/* Main content */}
      {module.codeExamples.map((example, index) => (
        <div key={example.id} className="mb-8">
          {index > 0 && <Separator className="mb-8" />}
          <h2 className="text-xl font-semibold text-foreground mb-4">{example.title}</h2>
          <p className="text-muted-foreground mb-6">{example.description}</p>
          <CodeExample example={example} />
        </div>
      ))}

      {/* Rules and Best Practices */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-foreground mb-4">Rules & Best Practices</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-card p-4 rounded-lg">
            <div className="flex items-center mb-2 text-accent">
              <CheckCircle className="h-5 w-5 mr-2" />
              <h3 className="font-medium">Do</h3>
            </div>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex">
                <span className="mr-2">•</span>
                <span>Call hooks at the top level of your component</span>
              </li>
              <li className="flex">
                <span className="mr-2">•</span>
                <span>Use functional updates when new state depends on old state</span>
              </li>
              <li className="flex">
                <span className="mr-2">•</span>
                <span>Follow the naming convention (useXxx) for custom hooks</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-card p-4 rounded-lg">
            <div className="flex items-center mb-2 text-destructive">
              <AlertCircle className="h-5 w-5 mr-2" />
              <h3 className="font-medium">Don't</h3>
            </div>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex">
                <span className="mr-2">•</span>
                <span>Call hooks inside conditions or loops</span>
              </li>
              <li className="flex">
                <span className="mr-2">•</span>
                <span>Modify state directly without the setter function</span>
              </li>
              <li className="flex">
                <span className="mr-2">•</span>
                <span>Forget dependencies in useEffect or useMemo</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Quiz Section */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-foreground mb-4">Test Your Knowledge</h2>
        <QuizComponent 
          quiz={module.quiz} 
          moduleId={module.id} 
        />
      </div>
      
      {/* Navigation Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center py-4 border-t border-border mt-8">
        {prevModule ? (
          <Link href={`/hooks/${prevModule}`}>
            <div className="flex items-center text-muted-foreground hover:text-foreground mb-4 sm:mb-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span>{prevModule}</span>
            </div>
          </Link>
        ) : (
          <Link href="/">
            <div className="flex items-center text-muted-foreground hover:text-foreground mb-4 sm:mb-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span>Home</span>
            </div>
          </Link>
        )}
        
        {nextModule && (
          <Link href={`/hooks/${nextModule}`}>
            <div className="flex items-center text-primary hover:text-primary/90">
              <span>{nextModule}</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default HookDetails;
