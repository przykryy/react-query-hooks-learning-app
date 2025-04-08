import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Book, Code } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-12 text-center">
        <Badge variant="outline" className="mb-4 text-primary">Interactive Learning Platform</Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Master React Hooks <span className="text-primary">&</span> TanStack Query</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Learn through interactive tutorials, live code examples, and practical exercises designed to improve your React skills.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge className="bg-primary/10 text-primary border-none">React</Badge>
              <Book className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-2xl">React Hooks</CardTitle>
            <CardDescription>
              Deep dive into React's hook system with hands-on examples
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Badge variant="outline" className="mr-2 w-6 h-6 p-0 flex items-center justify-center rounded-full">1</Badge>
                <span>useState - State management basics</span>
              </li>
              <li className="flex items-center">
                <Badge variant="outline" className="mr-2 w-6 h-6 p-0 flex items-center justify-center rounded-full">2</Badge>
                <span>useEffect - Side effects and lifecycle</span>
              </li>
              <li className="flex items-center">
                <Badge variant="outline" className="mr-2 w-6 h-6 p-0 flex items-center justify-center rounded-full">3</Badge>
                <span>useContext - Global state management</span>
              </li>
              <li className="flex items-center">
                <Badge variant="outline" className="mr-2 w-6 h-6 p-0 flex items-center justify-center rounded-full">4</Badge>
                <span>useReducer - Complex state logic</span>
              </li>
              <li className="text-muted-foreground mt-2 ml-8">+ 3 more hooks</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/hooks/useState" className="text-primary hover:underline flex items-center">
              Start learning <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </CardFooter>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge className="bg-secondary/10 text-secondary border-none">TanStack</Badge>
              <Code className="h-5 w-5 text-secondary" />
            </div>
            <CardTitle className="text-2xl">React Query</CardTitle>
            <CardDescription>
              Master data fetching and state synchronization with TanStack Query
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Badge variant="outline" className="mr-2 w-6 h-6 p-0 flex items-center justify-center rounded-full">1</Badge>
                <span>Query Basics - Core concepts</span>
              </li>
              <li className="flex items-center">
                <Badge variant="outline" className="mr-2 w-6 h-6 p-0 flex items-center justify-center rounded-full">2</Badge>
                <span>useQuery - Data fetching patterns</span>
              </li>
              <li className="flex items-center">
                <Badge variant="outline" className="mr-2 w-6 h-6 p-0 flex items-center justify-center rounded-full">3</Badge>
                <span>useMutation - Data modifications</span>
              </li>
              <li className="flex items-center">
                <Badge variant="outline" className="mr-2 w-6 h-6 p-0 flex items-center justify-center rounded-full">4</Badge>
                <span>Caching - Optimized performance</span>
              </li>
              <li className="text-muted-foreground mt-2 ml-8">+ 1 more topic</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/query/basics" className="text-secondary hover:underline flex items-center">
              Start learning <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-4">Why Learn With Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="bg-primary/10 p-3 rounded-lg inline-block mb-3">
              <Code className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Interactive Code Examples</h3>
            <p className="text-muted-foreground">
              Edit and run code directly in your browser with real-time preview.
            </p>
          </div>
          <div>
            <div className="bg-secondary/10 p-3 rounded-lg inline-block mb-3">
              <Book className="h-5 w-5 text-secondary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Comprehensive Tutorials</h3>
            <p className="text-muted-foreground">
              Learn concepts with step-by-step explanations and practical examples.
            </p>
          </div>
          <div>
            <div className="bg-accent/10 p-3 rounded-lg inline-block mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent"><path d="m9 12 2 2 4-4"/><path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z"/></svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Test Your Knowledge</h3>
            <p className="text-muted-foreground">
              Reinforce learning with quizzes and hands-on challenges after each module.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-muted-foreground mb-4">Ready to dive in?</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/hooks/useState">
            <div className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium">
              Start with React Hooks
            </div>
          </Link>
          <Link href="/query/basics">
            <div className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-6 py-3 rounded-md font-medium">
              Explore TanStack Query
            </div>
          </Link>
        </div>
      </div>
      <div className="mt-12 text-center">
        <img src="/images/made-by-kris.png" alt="Made by Kris" className="mx-auto rounded-full w-24 h-24" />
      </div>
    </div>
  );
};

export default Home;
