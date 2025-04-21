
import React, { useState, useEffect } from "react";
import { AppSidebar } from "@/components/layout/Sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { useNavigate } from "react-router-dom";
import { useAuthProfile } from "@/hooks/useAuthProfile";
import { Button } from "@/components/ui/button";
import { PlusIcon, SearchIcon } from "lucide-react";
import { NoteCard } from "@/components/note-card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { toast } from "@/components/ui/sonner";

// Temporary note data
const initialNotes = [
  { 
    id: "1", 
    title: "Project Ideas", 
    content: "1. Build a note-taking app with AI summarization\n2. Create a personal finance tracker\n3. Develop a habit tracker with streaks and analytics", 
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  { 
    id: "2", 
    title: "Meeting Notes - Q3 Planning", 
    content: "- Review Q2 performance\n- Set new OKRs for Q3\n- Discuss budget allocation\n- Plan team building activities", 
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  { 
    id: "3", 
    title: "Book Recommendations", 
    content: "1. Atomic Habits by James Clear\n2. Deep Work by Cal Newport\n3. The Psychology of Money by Morgan Housel\n4. Designing Data-Intensive Applications by Martin Kleppmann", 
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export default function Dashboard() {
  const { user, loading } = useAuthProfile();
  const [notes, setNotes] = useState(initialNotes);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  
  // Check authentication and redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      toast.error("Please login to access the dashboard");
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
  
  // Filter notes based on search term
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Sidebar (collapsible on mobile) */}
        <AppSidebar />
        {/* Main Content */}
        <main className="flex-1 md:p-12 p-4 overflow-y-auto bg-background">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Your Notes</h2>
            <ThemeToggle />
          </div>
          <div className="mb-6 flex justify-between items-center gap-2">
            <div className="relative w-64">
              <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input 
                className="w-full rounded-md border border-input bg-background pl-8 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" 
                placeholder="Search notes..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" /> New Note
            </Button>
          </div>

          {/* Empty state */}
          {filteredNotes.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No notes found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm ? "Try a different search term" : "Create your first note to get started"}
              </p>
              {!searchTerm && (
                <Button>
                  <PlusIcon className="mr-2 h-4 w-4" /> Create Note
                </Button>
              )}
            </div>
          )}

          {/* Notes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={(note) => console.log("Edit note:", note)}
              />
            ))}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
