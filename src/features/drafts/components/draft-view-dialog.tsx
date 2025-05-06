import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDrafts } from "@/features/drafts/context/drafts-context";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Download, Tag, Clock, CalendarIcon, User } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { DraftType } from "@/features/drafts/types";

export function DraftViewDialog() {
  const { open, setOpen, currentDraft } = useDrafts();
  const navigate = useNavigate();

  if (!currentDraft) return null;

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  };

  const handleResume = () => {
    if (!currentDraft) return;
    
    setOpen(null);
    
    switch (currentDraft.type) {
      case 'proposal':
        // Store the draft ID in sessionStorage to be picked up by the proposal form
        sessionStorage.setItem('resume_draft_id', currentDraft.id);
        navigate({ to: '/proposal' });
        break;
      case 'policy':
        // Future implementation for policy drafts
        navigate({ to: '/' });
        break;
      case 'claim':
        // Future implementation for claim drafts
        navigate({ to: '/' });
        break;
      default:
        navigate({ to: '/' });
    }
  };

  const getTypeLabel = (type: DraftType): string => {
    switch (type) {
      case 'proposal': return 'Insurance Proposal';
      case 'policy': return 'Insurance Policy';
      case 'claim': return 'Insurance Claim';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  return (
    <Dialog open={open === 'view'} onOpenChange={(open) => !open && setOpen(null)}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{currentDraft.title}</span>
            <Badge variant="outline">
              {currentDraft.status.charAt(0).toUpperCase() + currentDraft.status.slice(1)}
            </Badge>
          </DialogTitle>
          <DialogDescription className="flex flex-wrap gap-2 items-center text-sm">
            <span className="flex items-center gap-1">
              <CalendarIcon className="h-3.5 w-3.5" />
              Created {formatDate(currentDraft.createdAt)}
            </span>
            {currentDraft.updatedAt && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                Updated {formatDate(currentDraft.updatedAt)}
              </span>
            )}
            {currentDraft.createdBy && (
              <span className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                By {currentDraft.createdBy}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Draft Type */}
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-semibold">Type:</span>
            <span>{getTypeLabel(currentDraft.type)}</span>
          </div>

          {/* Tags */}
          {currentDraft.tags && currentDraft.tags.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {currentDraft.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="flex items-center gap-1">
                    <Tag className="h-3.5 w-3.5" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          {Object.keys(currentDraft.metadata).length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Metadata</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(currentDraft.metadata).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-sm text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                    <p>{typeof value === 'object' ? JSON.stringify(value) : String(value)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Content Preview */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Content Preview</h3>
            <div className="border rounded-md p-4 bg-muted/20">
              {typeof currentDraft.content === 'object' ? (
                <pre className="whitespace-pre-wrap text-sm overflow-auto max-h-[300px]">
                  {JSON.stringify(currentDraft.content, null, 2)}
                </pre>
              ) : (
                <p>{String(currentDraft.content)}</p>
              )}
            </div>
          </div>

          {/* Expiration */}
          {currentDraft.expiresAt && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>
                Expires on {formatDate(currentDraft.expiresAt)}
              </span>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(null)}>
            Close
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          {currentDraft.status === 'draft' && (
            <Button onClick={handleResume}>
              <Pencil className="mr-2 h-4 w-4" />
              Resume
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
