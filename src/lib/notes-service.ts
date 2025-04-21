// Notes service for handling CRUD operations with Supabase

import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export interface Note {
  id: string;
  title: string;
  content: string;
  summary?: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface CreateNoteInput {
  title: string;
  content: string;
  summary?: string;
}

export interface UpdateNoteInput {
  id: string;
  title?: string;
  content?: string;
  summary?: string;
}

/**
 * Class for managing note operations
 */
export class NotesService {
  /**
   * Fetch all notes for the current user
   */
  static async getNotes(): Promise<Note[]> {
    try {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) {
        console.error("Error fetching notes:", error);
        toast.error("Failed to load notes");
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error in getNotes:", error);
      toast.error("An unexpected error occurred");
      return [];
    }
  }

  /**
   * Fetch a single note by ID
   */
  static async getNoteById(id: string): Promise<Note | null> {
    try {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching note:", error);
        toast.error("Failed to load note");
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error in getNoteById:", error);
      toast.error("An unexpected error occurred");
      return null;
    }
  }

  /**
   * Create a new note
   */
  static async createNote(noteData: CreateNoteInput): Promise<Note | null> {
    try {
      // Get the current user session
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session?.user) {
        console.error("No authenticated user found");
        toast.error("You must be logged in to create notes");
        return null;
      }
      
      // Add the user_id to the note data
      const dataWithUserId = {
        ...noteData,
        user_id: sessionData.session.user.id
      };
      
      const { data, error } = await supabase
        .from("notes")
        .insert([dataWithUserId])
        .select()
        .single();

      if (error) {
        console.error("Error creating note:", error);
        toast.error("Failed to create note");
        return null;
      }

      toast.success("Note created successfully");
      return data;
    } catch (error) {
      console.error("Error in createNote:", error);
      toast.error("An unexpected error occurred");
      return null;
    }
  }

  /**
   * Update an existing note
   */
  static async updateNote(noteData: UpdateNoteInput): Promise<Note | null> {
    try {
      // Set the updated timestamp
      const updateData = {
        ...noteData,
        updated_at: new Date().toISOString(),
      };
      
      // Remove the ID from the update data
      const { id, ...dataToUpdate } = updateData;
      
      const { data, error } = await supabase
        .from("notes")
        .update(dataToUpdate)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating note:", error);
        toast.error("Failed to update note");
        return null;
      }

      toast.success("Note updated successfully");
      return data;
    } catch (error) {
      console.error("Error in updateNote:", error);
      toast.error("An unexpected error occurred");
      return null;
    }
  }

  /**
   * Delete a note
   */
  static async deleteNote(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting note:", error);
        toast.error("Failed to delete note");
        return false;
      }

      toast.success("Note deleted successfully");
      return true;
    } catch (error) {
      console.error("Error in deleteNote:", error);
      toast.error("An unexpected error occurred");
      return false;
    }
  }

  /**
   * Save a summary for a note
   */
  static async saveSummary(noteId: string, summary: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("notes")
        .update({
          summary,
          updated_at: new Date().toISOString()
        })
        .eq("id", noteId);

      if (error) {
        console.error("Error saving summary:", error);
        toast.error("Failed to save summary");
        return false;
      }

      toast.success("Summary saved");
      return true;
    } catch (error) {
      console.error("Error in saveSummary:", error);
      toast.error("An unexpected error occurred");
      return false;
    }
  }
}