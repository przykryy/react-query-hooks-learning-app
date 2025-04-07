import React from 'react';
import { Link, useLocation } from 'wouter';
import LearningObjectives from '@/components/tutorial/LearningObjectives';
import CodeExample from '@/components/tutorial/CodeExample';
import Quiz from '@/components/tutorial/Quiz';
import NextSteps from '@/components/tutorial/NextSteps';
import { ChevronRight } from 'lucide-react';
import { useProgress } from '@/hooks/use-progress';

const basicMemoExample = `import React, { useState, useMemo } from 'react';

// A compute-heavy function to calculate prime numbers
function calculatePrimes(max) {
  console.log('Calculating primes...'); // To show when calculation runs
  
  // Simple function to check if a number is prime
  const isPrime = num => {
    for (let i = 2; i < num; i++) {
      if (num % i === 0) return false;
    }
    return num > 1;
  };
  
  const primes = [];
  for (let i = 2; i <= max; i++) {
    if (isPrime(i)) {
      primes.push(i);
    }
  }
  
  return primes;
}

function PrimeCalculator() {
  const [maxNumber, setMaxNumber] = useState(100);
  const [toggle, setToggle] = useState(false);
  
  // useMemo will only recalculate when maxNumber changes
  // not when toggle changes
  const primes = useMemo(() => {
    return calculatePrimes(maxNumber);
  }, [maxNumber]);
  
  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Prime Number Calculator</h2>
      
      <div className="mb-4">
        <label className="block mb-2">
          Calculate primes up to:
          <input
            type="number"
            value={maxNumber}
            onChange={e => setMaxNumber(Number(e.target.value))}
            className="ml-2 px-3 py-1 bg-muted rounded border border-input"
          />
        </label>
      </div>
      
      <div className="mb-4">
        <button
          onClick={() => setToggle(t => !t)}
          className="px-4 py-2 bg-muted rounded"
        >
          Toggle State: {toggle ? 'ON' : 'OFF'}
        </button>
        <p className="text-sm text-muted-foreground mt-1">
          (This button doesn't affect the prime calculation)
        </p>
      </div>
      
      <div className="mt-4">
        <h3 className="font-medium mb-2">Found {primes.length} primes:</h3>
        <div className="bg-sidebar p-3 rounded-md max-h-40 overflow-y-auto">
          <div className="flex flex-wrap gap-1">
            {primes.map(prime => (
              <span key={prime} className="px-2 py-1 bg-muted rounded text-sm">
                {prime}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// For our example display
export default function App() {
  return <PrimeCalculator />;
}`;

const expensivePropsExample = `import React, { useState, useMemo } from 'react';

// ProductList component that accepts a list of products and filters
function ProductList({ products, filterText }) {
  console.log('ProductList render');
  
  // Expensive filter operation
  const filteredProducts = useMemo(() => {
    console.log('Filtering products...');
    return products.filter(product =>
      product.name.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [products, filterText]);
  
  return (
    <div className="mt-4">
      <h3 className="font-medium mb-2">
        Products matching "{filterText}" ({filteredProducts.length}):
      </h3>
      <ul className="bg-sidebar p-3 rounded-md max-h-40 overflow-y-auto">
        {filteredProducts.map(product => (
          <li key={product.id} className="p-2 mb-2 bg-muted rounded">
            <div className="font-medium">{product.name}</div>
            <div className="text-sm text-muted-foreground">
              ${product.price.toFixed(2)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Main app component
function ProductFilterApp() {
  const [filterText, setFilterText] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  
  // Create a large array of products
  const allProducts = useMemo(() => {
    console.log('Creating product list...');
    return Array.from({ length: 100 }, (_, i) => ({
      id: i,
      name: \`Product \${i + 1}\`,
      price: Math.random() * 100 + 1
    }));
  }, []);
  
  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Product Filter</h2>
      
      <div className="mb-4">
        <label className="block mb-2">
          Filter products:
          <input
            type="text"
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
            className="ml-2 px-3 py-1 bg-muted rounded border border-input"
            placeholder="Type to filter..."
          />
        </label>
      </div>
      
      <div className="mb-4">
        <button
          onClick={() => setDarkMode(d => !d)}
          className="px-4 py-2 bg-muted rounded"
        >
          Toggle Theme: {darkMode ? 'Dark' : 'Light'}
        </button>
        <p className="text-sm text-muted-foreground mt-1">
          (UI theme toggle doesn't affect product filtering)
        </p>
      </div>
      
      {/* Pass filtered products to the component */}
      <ProductList 
        products={allProducts} 
        filterText={filterText} 
      />
    </div>
  );
}

// For our example display
export default function App() {
  return <ProductFilterApp />;
}`;

const quizQuestions = [
  {
    id: 'q1',
    question: 'What is the primary purpose of useMemo?',
    options: [
      { id: 'a', text: 'To cache function definitions between renders' },
      { id: 'b', text: 'To memoize the results of expensive calculations' },
      { id: 'c', text: 'To prevent components from re-rendering' },
      { id: 'd', text: 'To manage side effects in functional components' }
    ],
    correctAnswer: 'b'
  },
  {
    id: 'q2',
    question: 'When does a memoized value recalculate?',
    options: [
      { id: 'a', text: 'On every render' },
      { id: 'b', text: 'When the component mounts' },
      { id: 'c', text: 'When any of the dependencies in the dependency array change' },
      { id: 'd', text: 'Only when explicitly triggered by a function call' }
    ],
    correctAnswer: 'c'
  },
  {
    id: 'q3',
    question: 'What happens if you omit the dependency array in useMemo?',
    options: [
      { id: 'a', text: 'The value is calculated once and never recalculated' },
      { id: 'b', text: 'The value is recalculated on every render' },
      { id: 'c', text: 'React throws an error' },
      { id: 'd', text: 'It falls back to useState behavior' }
    ],
    correctAnswer: 'b'
  },
  {
    id: 'q4',
    question: 'In which case would useMemo provide the least benefit?',
    options: [
      { id: 'a', text: 'When calculating the factorial of a large number' },
      { id: 'b', text: 'When filtering a large array of objects' },
      { id: 'c', text: 'When transforming a large dataset' },
      { id: 'd', text: 'When concatenating two short strings' }
    ],
    correctAnswer: 'd'
  }
];

const UseMemo = () => {
  const [location] = useLocation();
  const { markTutorialViewed } = useProgress();
  
  // Mark tutorial as viewed when component mounts
  React.useEffect(() => {
    markTutorialViewed('useMemo');
  }, [markTutorialViewed]);

  return (
    <div className="p-6 md:p-8">
      {/* Breadcrumb navigation */}
      <div className="text-sm mb-6 flex items-center text-muted-foreground">
        <Link href="/">
          <a className="hover:text-primary transition-colors">Home</a>
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link href="/hooks/use-memo">
          <a className="hover:text-primary transition-colors">React Hooks</a>
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-primary">useMemo</span>
      </div>
      
      {/* Page title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">useMemo Hook</h1>
        <p className="text-muted-foreground max-w-3xl">
          Learn how to optimize performance by memoizing expensive calculations with React's useMemo hook.
          This tutorial covers caching computed values and preventing unnecessary recalculations.
        </p>
      </div>
      
      {/* Learning objectives */}
      <LearningObjectives
        objectives={[
          "Understand the concept of memoization and when to use it",
          "Learn how to implement useMemo to cache expensive calculations",
          "Optimize component performance by preventing unnecessary work",
          "Master dependency arrays to control when calculations are refreshed",
          "Apply useMemo in practical scenarios like filtering and sorting"
        ]}
      />
      
      {/* Introduction to useMemo */}
      <div className="mb-10 max-w-3xl">
        <h2 className="text-2xl font-semibold mb-4">Introduction to useMemo</h2>
        <p className="mb-4">
          The <code className="bg-sidebar text-primary px-1 py-0.5 rounded">useMemo</code> hook lets you memoize (cache) the result of an expensive calculation.
          It helps optimize performance by avoiding recalculation of values that haven't changed.
        </p>
        
        <p className="mb-4">
          When a component re-renders, all code inside it executes again. This isn't a problem for most operations,
          but can cause performance issues if you're doing computationally expensive work like:
        </p>
        
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>Filtering or sorting large arrays</li>
          <li>Complex mathematical calculations</li>
          <li>Data transformations on large objects</li>
          <li>Expensive DOM calculations</li>
        </ul>
        
        <p className="mb-4">Here's the basic syntax of useMemo:</p>
        
        <div className="bg-sidebar rounded-md p-4 my-4 font-code text-sm">
          <pre>const memoizedValue = useMemo(function() {'{'}
  // Perform expensive calculation
  return computeExpensiveValue(a, b);
{'}'}, [a, b]); // Only recalculate if a or b changes</pre>
        </div>
        
        <p className="mb-2">
          useMemo takes two arguments:
        </p>
        <ol className="list-decimal pl-6 space-y-2 mb-4">
          <li>A "create" function that returns a value to be memoized</li>
          <li>A dependency array of values that, when changed, will trigger recalculation</li>
        </ol>
      </div>
      
      {/* Example 1: Basic Memoization */}
      <div className="mb-10" id="examples">
        <h2 className="text-2xl font-semibold mb-4">Example 1: Memoizing an Expensive Calculation</h2>
        <p className="mb-4 max-w-3xl">
          This example demonstrates how useMemo can optimize performance by caching the results of an
          expensive calculation (finding prime numbers) and only recalculating when necessary.
        </p>
        
        <CodeExample 
          title="Prime Number Calculator with useMemo"
          initialCode={basicMemoExample}
          explanation={
            <div>
              <h4 className="font-medium mb-2">Key Concepts</h4>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>useMemo caches the result of <code>calculatePrimes</code> until <code>maxNumber</code> changes</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>When the toggle button is clicked, the component re-renders but doesn't recalculate primes</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>The calculation only runs when the <code>maxNumber</code> changes, as specified in the dependency array</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Without useMemo, every render would trigger the expensive calculation again</span>
                </li>
              </ul>
            </div>
          }
          analysis={
            <div>
              <h4 className="font-medium mb-2">Code Analysis</h4>
              <p className="mb-2">Let's analyze the memoization pattern:</p>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>The <code>calculatePrimes</code> function is intentionally expensive (O(n²) complexity)</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>We've added a console.log to show when the calculation runs - you'll see it only logs when maxNumber changes</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>The toggle button demonstrates that other state changes don't trigger recalculation</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>This pattern is perfect for expensive calculations that depend on specific inputs</span>
                </li>
              </ul>
            </div>
          }
          challenge={
            <div>
              <h4 className="font-medium mb-2">Challenge</h4>
              <p>Enhance this example with these features:</p>
              <ol className="list-decimal pl-5 space-y-1 mt-2">
                <li>Add options to filter the primes (e.g., show only primes ending in 1, 3, 7, or 9)</li>
                <li>Add a visual performance indicator that shows calculation time</li>
                <li>Implement a "custom range" that finds primes between min and max values</li>
              </ol>
            </div>
          }
        />
      </div>
      
      {/* Example 2: Props and Expensive Rendering */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Example 2: Memoizing with Props</h2>
        <p className="mb-4 max-w-3xl">
          This example demonstrates using useMemo with props to optimize filtering operations
          and prevent unnecessary recalculation when other state changes.
        </p>
        
        <CodeExample 
          title="Product Filtering with useMemo"
          initialCode={expensivePropsExample}
          explanation={
            <div>
              <h4 className="font-medium mb-2">Key Concepts</h4>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Using useMemo to create a static list of products once on initial render</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Memoizing the filtered products to prevent recalculation when unrelated props change</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>The filtering operation only runs when either products or filterText changes</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>The dark mode toggle doesn't affect the filtered results, demonstrating proper memoization</span>
                </li>
              </ul>
            </div>
          }
          analysis={
            <div>
              <h4 className="font-medium mb-2">Code Analysis</h4>
              <p className="mb-2">Let's examine the multiple uses of useMemo in this example:</p>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>In the main component, we use useMemo to generate products just once (empty dependency array)</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>In the ProductList component, we use useMemo to filter products only when products or filterText change</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>Console logs show when each calculation is performed, helping visualize optimization</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <span>This pattern is common for derived data in lists, tables, and filtered collections</span>
                </li>
              </ul>
            </div>
          }
          challenge={
            <div>
              <h4 className="font-medium mb-2">Challenge</h4>
              <p>Extend this product filtering example:</p>
              <ol className="list-decimal pl-5 space-y-1 mt-2">
                <li>Add sorting options (by name, price ascending/descending)</li>
                <li>Implement price range filtering with min and max inputs</li>
                <li>Add a category filter that filters by product category</li>
              </ol>
            </div>
          }
        />
      </div>
      
      {/* When to Use useMemo */}
      <div className="mb-10 max-w-3xl">
        <div className="bg-muted rounded-lg p-5">
          <h3 className="flex items-center text-lg font-medium mb-3">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-primary mr-2">
              <path d="M21 10.0836V10.0836C21 6.74281 21 5.07241 20.0311 4.08994C19.0622 3.10748 17.413 3.10748 14.1147 3.10748H9.88526C6.58704 3.10748 4.93793 3.10748 3.96894 4.08994C3 5.07241 3 6.74281 3 10.0836V15.9164C3 19.2572 3 20.9276 3.96894 21.9101C4.93793 22.8925 6.58704 22.8925 9.88526 22.8925H14.1147C17.413 22.8925 19.0622 22.8925 20.0311 21.9101C21 20.9276 21 19.2572 21 15.9164V15.9164" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M8.5 12H15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M12 8.5V15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            When to Use useMemo
          </h3>
          <p className="mb-3">
            While useMemo is powerful, it shouldn't be used for every calculation. Only memoize when there's a clear performance benefit:
          </p>
          <ul className="space-y-2">
            <li className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
              <span><strong>DO use useMemo</strong> for computationally expensive operations (O(n²) or worse)</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
              <span><strong>DO use useMemo</strong> when processing large datasets (hundreds/thousands of items)</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
              <span><strong>DO use useMemo</strong> to avoid re-creating reference values passed to React.memo components</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
              <span><strong>DON'T use useMemo</strong> for simple calculations that are fast (string concatenation, basic math)</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
              <span><strong>DON'T use useMemo</strong> prematurely - measure performance first to confirm a benefit</span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Quiz Section */}
      <div id="quiz">
        <Quiz 
          title="Quiz: useMemo Concepts"
          questions={quizQuestions}
          tutorialId="useMemo"
        />
      </div>
      
      {/* Next steps section */}
      <NextSteps currentPath="/hooks/use-memo" category="hooks" />
    </div>
  );
};

export default UseMemo;
