
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { summarizeText } from "@/lib/gemini";
import { useToast } from "@/hooks/use-toast";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface NoteCardProps {
  note: Note;
  onEdit?: (note: Note) => void;
  onDelete?: (id: string) => void;
}

export function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSummarize = async () => {
    if (isSummarizing) return;
    
    setIsSummarizing(true);
    try {
      const result = await summarizeText(note.content, { maxLength: 50 });
      setSummary(result);
    } catch (error) {
      toast({
        title: "Summarization failed",
        description: "Unable to generate summary. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="line-clamp-1">{note.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        {summary ? (
          <div className="space-y-4">
            <div className="bg-secondary/50 p-3 rounded-md">
              <h4 className="font-medium text-sm mb-1">AI Summary</h4>
              <p className="text-sm">{summary}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setSummary(null)}>
              Show Original
            </Button>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm line-clamp-6">{note.content}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-xs text-muted-foreground">
          {new Date(note.updatedAt).toLocaleDateString()}
        </div>
        <div className="flex gap-2">
          {!summary && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSummarize} 
              disabled={isSummarizing}
            >
              {isSummarizing ? "Summarizing..." : "Summarize"}
            </Button>
          )}
          {onEdit && (
            <Button variant="ghost" size="sm" onClick={() => onEdit(note)}>
              Edit
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
