import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import MainLayout from "@/components/layout/MainLayout";
import Home from "@/pages/home";

// React Hooks Pages
import UseState from "@/pages/hooks/useState";
import UseEffect from "@/pages/hooks/useEffect";
import UseContext from "@/pages/hooks/useContext";
import UseRef from "@/pages/hooks/useRef";
import UseMemo from "@/pages/hooks/useMemo";
import UseCallback from "@/pages/hooks/useCallback";
import UseReducer from "@/pages/hooks/useReducer";
import CustomHooks from "@/pages/hooks/custom-hooks";

// TanStack Query Pages
import Introduction from "@/pages/tanstack/introduction";
import QueryClientProviderPage from "@/pages/tanstack/query-client-provider";
import UseQueryPage from "@/pages/tanstack/useQuery";
import UseMutationPage from "@/pages/tanstack/useMutation";
import Invalidation from "@/pages/tanstack/invalidation";
import Caching from "@/pages/tanstack/caching";
import Pagination from "@/pages/tanstack/pagination";

function Router() {
  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={Home} />
        
        {/* React Hooks Routes */}
        <Route path="/hooks/use-state" component={UseState} />
        <Route path="/hooks/use-effect" component={UseEffect} />
        <Route path="/hooks/use-context" component={UseContext} />
        <Route path="/hooks/use-ref" component={UseRef} />
        <Route path="/hooks/use-memo" component={UseMemo} />
        <Route path="/hooks/use-callback" component={UseCallback} />
        <Route path="/hooks/use-reducer" component={UseReducer} />
        <Route path="/hooks/custom-hooks" component={CustomHooks} />
        
        {/* TanStack Query Routes */}
        <Route path="/tanstack/introduction" component={Introduction} />
        <Route path="/tanstack/query-client-provider" component={QueryClientProviderPage} />
        <Route path="/tanstack/use-query" component={UseQueryPage} />
        <Route path="/tanstack/use-mutation" component={UseMutationPage} />
        <Route path="/tanstack/invalidation" component={Invalidation} />
        <Route path="/tanstack/caching" component={Caching} />
        <Route path="/tanstack/pagination" component={Pagination} />
        
        {/* Fallback to 404 */}
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
