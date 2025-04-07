import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BookOpen, Code, Gift } from 'lucide-react';
import { tutorials } from '@/lib/tutorials';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-10 max-w-7xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Learn React Hooks & TanStack Query</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          An interactive learning platform for mastering React's hook system and 
          data management with TanStack Query through hands-on examples and practice.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/hooks/use-state">
            <Button className="gap-2" size="lg">
              Start Learning <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/tanstack/introduction">
            <Button variant="outline" className="gap-2" size="lg">
              TanStack Query <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        <Card>
          <CardHeader>
            <BookOpen className="h-10 w-10 text-primary mb-4" />
            <CardTitle>Comprehensive Tutorials</CardTitle>
            <CardDescription>
              Detailed explanations of React Hooks and TanStack Query concepts with real-world examples.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Our tutorials start from the basics and gradually progress to advanced patterns,
              making complex concepts accessible to developers of all skill levels.
            </p>
            <Link href="/hooks/use-state">
              <Button variant="secondary" className="w-full">Browse Tutorials</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <Code className="h-10 w-10 text-primary mb-4" />
            <CardTitle>Interactive Code Examples</CardTitle>
            <CardDescription>
              Edit and run real React code directly in your browser to see concepts in action.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Every tutorial includes interactive code examples that allow you to experiment
              with the concepts right away. Modify the code and instantly see the results.
            </p>
            <Link href="/hooks/use-state#examples">
              <Button variant="secondary" className="w-full">Try Examples</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <Gift className="h-10 w-10 text-primary mb-4" />
            <CardTitle>Practice & Assessment</CardTitle>
            <CardDescription>
              Test your knowledge with quizzes and challenges after each learning module.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Reinforce your learning with quizzes and coding challenges that test your
              understanding of each concept and help you identify areas for improvement.
            </p>
            <Link href="/hooks/use-state#quiz">
              <Button variant="secondary" className="w-full">Take a Quiz</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Popular Tutorials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-3 flex items-center">
              <span className="text-primary mr-2">React</span> Hooks
            </h3>
            <div className="space-y-2">
              {tutorials.hooks.slice(0, 4).map(hook => (
                <Link key={hook.path} href={hook.path}>
                  <a className="block p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{hook.title}</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{hook.shortDescription}</p>
                  </a>
                </Link>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-3 flex items-center">
              <span className="text-secondary mr-2">TanStack</span> Query
            </h3>
            <div className="space-y-2">
              {tutorials.tanstack.slice(0, 4).map(query => (
                <Link key={query.path} href={query.path}>
                  <a className="block p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{query.title}</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{query.shortDescription}</p>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Master React?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Start your journey to becoming a React and TanStack Query expert with our
          interactive tutorials and hands-on examples.
        </p>
        <Link href="/hooks/use-state">
          <Button className="gap-2" size="lg">
            Begin Learning <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
