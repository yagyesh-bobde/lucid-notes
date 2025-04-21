import React, { useState, useEffect } from "react";
import { AppSidebar } from "@/components/layout/Sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { useNavigate } from "react-router-dom";
import { useAuthProfile } from "@/hooks/useAuthProfile";
import { Button } from "@/components/ui/button";
import { PlusIcon, SearchIcon, RefreshCw } from "lucide-react";
import { NoteCard } from "@/components/note-card";
import { NoteEditor } from "@/components/note-editor";
import { SidebarProvider } from "@/components/ui/sidebar";
import { toast } from "@/components/ui/sonner";
import { NotesService, Note, CreateNoteInput, UpdateNoteInput } from "@/lib/notes-service";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Dashboard() {
  const { user, loading } = useAuthProfile();
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [editorMode, setEditorMode] = useState<'create' | 'edit'>('create');
  const navigate = useNavigate();
  
  // Check authentication and redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      toast.error("Please login to access the dashboard");
      navigate("/auth");
    }
  }, [user, loading, navigate]);
  
  // Fetch notes from Supabase
  const fetchNotes = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const fetchedNotes = await NotesService.getNotes();
      setNotes(fetchedNotes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast.error("Failed to load notes");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load notes on initial render
  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);
  
  // Handle note creation
  const handleCreateNote = async (data: CreateNoteInput) => {
    try {
      const newNote = await NotesService.createNote(data);
      if (newNote) {
        fetchNotes(); // Refresh the notes list
      }
    } catch (error) {
      console.error("Error creating note:", error);
      toast.error("Failed to create note");
    }
  };
  
  // Handle note update
  const handleUpdateNote = async (data: UpdateNoteInput) => {
    try {
      const updatedNote = await NotesService.updateNote(data);
      if (updatedNote) {
        fetchNotes(); // Refresh the notes list
      }
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("Failed to update note");
    }
  };
  
  // Handle note deletion
  const handleDeleteNote = async () => {
    if (!noteToDelete) return;
    
    try {
      const success = await NotesService.deleteNote(noteToDelete);
      if (success) {
        fetchNotes(); // Refresh the notes list
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
    } finally {
      setIsDeleteDialogOpen(false);
      setNoteToDelete(null);
    }
  };
  
  // Open the editor to create a new note
  const openCreateEditor = () => {
    setEditingNote(null);
    setEditorMode('create');
    setIsEditorOpen(true);
  };
  
  // Open the editor to edit an existing note
  const openEditEditor = (note: Note) => {
    setEditingNote(note);
    setEditorMode('edit');
    setIsEditorOpen(true);
  };
  
  // Handle save from the editor
  const handleSaveNote = async (data: CreateNoteInput | UpdateNoteInput) => {
    if ('id' in data) {
      await handleUpdateNote(data);
    } else {
      await handleCreateNote(data);
    }
  };
  
  // Open delete confirmation dialog
  const confirmDelete = (id: string) => {
    setNoteToDelete(id);
    setIsDeleteDialogOpen(true);
  };
  
  // Filter notes based on search term
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        {/* Sidebar (collapsible on mobile) */}
        <AppSidebar />
        
        {/* Main Content */}
        <main className="flex-1 md:p-12 p-4 overflow-y-auto bg-background">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Your Notes</h2>
            <ThemeToggle />
          </div>
          
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-64">
              <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input 
                className="w-full rounded-md border border-input bg-background pl-8 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" 
                placeholder="Search notes..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button 
                onClick={fetchNotes} 
                variant="outline" 
                size="icon" 
                className="h-9 w-9"
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="sr-only">Refresh</span>
              </Button>
              <Button onClick={openCreateEditor} className="w-full sm:w-auto">
                <PlusIcon className="mr-2 h-4 w-4" /> New Note
              </Button>
            </div>
          </div>

          {/* Empty state */}
          {filteredNotes.length === 0 && !isLoading && (
            <div className="text-center py-12 border border-dashed rounded-lg">
              <h3 className="text-xl font-medium mb-2">No notes found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm ? "Try a different search term" : "Create your first note to get started"}
              </p>
              {!searchTerm && (
                <Button onClick={openCreateEditor}>
                  <PlusIcon className="mr-2 h-4 w-4" /> Create Note
                </Button>
              )}
            </div>
          )}
          
          {/* Loading state */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-64 rounded-lg border border-border bg-card animate-pulse">
                  <div className="h-full"></div>
                </div>
              ))}
            </div>
          )}

          {/* Notes Grid */}
          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map(note => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={openEditEditor}
                  onDelete={confirmDelete}
                  onRefresh={fetchNotes}
                />
              ))}
            </div>
          )}
        </main>
      </div>
      
      {/* Note Editor Dialog */}
      <NoteEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveNote}
        note={editingNote}
        mode={editorMode}
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this note.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteNote}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
}