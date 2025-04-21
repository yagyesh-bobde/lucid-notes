// src/pages/canvas.tsx
import React, { useEffect } from "react";
import { AppSidebar } from "@/components/layout/Sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuthProfile } from "@/hooks/useAuthProfile";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { IdeationCanvas } from "@/components/ideation-canvas";

export default function CanvasPage() {
  const { user, loading } = useAuthProfile();
  const navigate = useNavigate();
  
  // Check authentication and redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      toast.error("Please login to access the canvas");
      navigate("/auth");
    }
  }, [user, loading, navigate]);
  
  // If still loading, show a loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 md:p-6 p-2 overflow-hidden bg-background flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Ideation Canvas</h2>
            {/* <ThemeToggle /> */}
          </div>
          
          {/* Canvas content area */}
          <div className="w-full h-[calc(100vh-8rem)] bg-background border border-border rounded-lg overflow-hidden">
            <IdeationCanvas />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}