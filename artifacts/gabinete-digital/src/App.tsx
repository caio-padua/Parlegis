import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/react";
import { ptBR } from "@clerk/localizations";

import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout/Layout";
import NotFound from "@/pages/not-found";

// Page Imports
import Home from "@/pages/home";
import SignInPage from "@/pages/sign-in";
import SignUpPage from "@/pages/sign-up";
import BiografiaPage from "@/pages/biografia";
import MandatoPage from "@/pages/mandato";
import ProjetosPage from "@/pages/projetos";
import ProjetoDetailPage from "@/pages/projeto-detail";
import DemandasPage from "@/pages/demandas";
import AcompanharPage from "@/pages/acompanhar";
import AgendaPage from "@/pages/agenda";
import NoticiasPage from "@/pages/noticias";
import NoticiaDetailPage from "@/pages/noticia-detail";
import PortalPage from "@/pages/portal";
import AdminPage from "@/pages/admin";

// Clerk Auth setup
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const CLERK_PROXY_URL = import.meta.env.VITE_CLERK_PROXY_URL;

function publishableKeyFromHost(hostname: string, key = ""): string {
  return key;
}

const clerkPubKey = publishableKeyFromHost(window.location.hostname, PUBLISHABLE_KEY);

if (!clerkPubKey) {
  throw new Error("Missing Publishable Key");
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/sign-in/*?" component={SignInPage} />
        <Route path="/sign-up/*?" component={SignUpPage} />
        <Route path="/biografia" component={BiografiaPage} />
        <Route path="/mandato" component={MandatoPage} />
        <Route path="/projetos" component={ProjetosPage} />
        <Route path="/projetos/:id" component={ProjetoDetailPage} />
        <Route path="/demandas" component={DemandasPage} />
        <Route path="/acompanhar" component={AcompanharPage} />
        <Route path="/agenda" component={AgendaPage} />
        <Route path="/noticias" component={NoticiasPage} />
        <Route path="/noticias/:id" component={NoticiaDetailPage} />
        <Route path="/portal" component={PortalPage} />
        <Route path="/admin" component={AdminPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={CLERK_PROXY_URL}
      localization={ptBR}
      appearance={{
        layout: {
          socialButtonsPlacement: "bottom",
          socialButtonsVariant: "blockButton",
        },
        elements: {
          formButtonPrimary: 
            "bg-[#8B1E2D] hover:bg-[#8B1E2D]/90 text-white font-sans rounded-md text-sm font-medium transition-colors shadow-sm",
          card: "bg-white shadow-xl border border-gray-100 rounded-xl",
          headerTitle: "font-serif text-2xl font-bold text-[#102D3C]",
          headerSubtitle: "font-sans text-gray-500",
          socialButtonsBlockButton: "border-gray-200 hover:bg-gray-50 text-gray-700 font-sans font-medium",
          formFieldLabel: "font-sans font-medium text-gray-700",
          formFieldInput: "font-sans rounded-md border-gray-300 focus:ring-[#8B1E2D] focus:border-[#8B1E2D]",
          footerActionLink: "text-[#8B1E2D] hover:text-[#8B1E2D]/80 font-sans font-medium",
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default App;
