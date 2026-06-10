import React from "react";
import { useLocation } from "wouter";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const isAuthRoute = location.startsWith("/sign-in") || location.startsWith("/sign-up");

  if (isAuthRoute) {
    return (
      <div className="min-h-[100dvh] flex flex-col bg-background font-sans text-foreground selection:bg-primary/20 selection:text-primary">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background font-sans text-foreground selection:bg-primary/20 selection:text-primary">
      <Header />
      <main className="flex-1 w-full flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
}
