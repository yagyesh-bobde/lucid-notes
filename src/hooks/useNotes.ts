// src/hooks/useNotes.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NotesService, Note, CreateNoteInput, UpdateNoteInput } from "@/lib/notes-service";
import { toast } from "@/components/ui/sonner";

// Query key constants
export const NOTES_QUERY_KEY = "notes";

/**
 * Custom hook to manage notes data with React Query
 */
export function useNotes() {
  const queryClient = useQueryClient();

  // Fetch all notes with React Query
  const {
    data: notes = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [NOTES_QUERY_KEY],
    queryFn: NotesService.getNotes,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Create a new note
  const createNoteMutation = useMutation({
    mutationFn: (data: CreateNoteInput) => NotesService.createNote(data),
    onSuccess: () => {
      toast.success("Note created successfully");
      queryClient.invalidateQueries({ queryKey: [NOTES_QUERY_KEY] });
    },
    onError: () => {
      toast.error("Failed to create note");
    },
  });

  // Update an existing note
  const updateNoteMutation = useMutation({
    mutationFn: (data: UpdateNoteInput) => NotesService.updateNote(data),
    onSuccess: () => {
      toast.success("Note updated successfully");
      queryClient.invalidateQueries({ queryKey: [NOTES_QUERY_KEY] });
    },
    onError: () => {
      toast.error("Failed to update note");
    },
  });

  // Delete a note
  const deleteNoteMutation = useMutation({
    mutationFn: (id: string) => NotesService.deleteNote(id),
    onSuccess: () => {
      toast.success("Note deleted successfully");
      queryClient.invalidateQueries({ queryKey: [NOTES_QUERY_KEY] });
    },
    onError: () => {
      toast.error("Failed to delete note");
    },
  });

  // Save a summary for a note
  const saveSummaryMutation = useMutation({
    mutationFn: ({ noteId, summary }: { noteId: string; summary: string }) => 
      NotesService.saveSummary(noteId, summary),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTES_QUERY_KEY] });
    },
    onError: () => {
      toast.error("Failed to save summary");
    },
  });

  return {
    notes,
    isLoading,
    isError,
    refetch,
    createNote: createNoteMutation.mutate,
    isCreating: createNoteMutation.isPending,
    updateNote: updateNoteMutation.mutate,
    isUpdating: updateNoteMutation.isPending,
    deleteNote: deleteNoteMutation.mutate,
    isDeleting: deleteNoteMutation.isPending,
    saveSummary: saveSummaryMutation.mutate,
    isSavingSummary: saveSummaryMutation.isPending,
  };
}