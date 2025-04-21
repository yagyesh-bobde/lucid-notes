
import React, { useEffect } from "react";
import { AppSidebar } from "@/components/layout/Sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuthProfile } from "@/hooks/useAuthProfile";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

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
        <main className="flex-1 md:p-12 p-4 overflow-y-auto bg-background">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Canvas</h2>
            <ThemeToggle />
          </div>
          
          {/* Canvas content area */}
          <div className="w-full h-[calc(100vh-10rem)] bg-background border border-border rounded-lg overflow-hidden">
            {/* Canvas implementation goes here */}
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              Canvas tool will be implemented here
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
