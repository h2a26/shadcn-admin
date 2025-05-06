import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDrafts } from '@/features/drafts';
import { format } from "date-fns";
import { useNavigate } from "@tanstack/react-router";
import { Pencil, Trash2, Eye, MoreHorizontal, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Draft, DraftStatus, DraftType, DraftSortField } from "@/features/drafts/types";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function DraftsTable() {
  const { 
    drafts, 
    setCurrentDraft, 
    setOpen, 
    deleteDraft,
    refreshDrafts,
    filters,
    setFilters,
    sortOptions,
    setSortOptions
  } = useDrafts();
  
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredDrafts = drafts.filter(draft => {
    if (filters.status && draft.status !== filters.status) {
      return false;
    }
    
    if (filters.type && draft.type !== filters.type) {
      return false;
    }
    
    if (searchQuery && !draft.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    if (filters.tags && filters.tags.length > 0) {
      if (!draft.tags || !filters.tags.some(tag => draft.tags?.includes(tag))) {
        return false;
      }
    }
    
    return true;
  });
  
  const sortedDrafts = [...filteredDrafts].sort((a, b) => {
    const fieldA = a[sortOptions.field];
    const fieldB = b[sortOptions.field];
    
    if (!fieldA && !fieldB) return 0;
    if (!fieldA) return 1;
    if (!fieldB) return -1;
    
    const comparison = fieldA < fieldB ? -1 : fieldA > fieldB ? 1 : 0;
    return sortOptions.direction === 'asc' ? comparison : -comparison;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return format(date, "h:mm a");
    } else {
      return format(date, "MMM d");
    }
  };

  const handleResume = (draft: Draft) => {
    setCurrentDraft(draft);
    
    switch (draft.type) {
      case 'proposal':
        // Store the draft ID in sessionStorage to be picked up by the proposal form
        sessionStorage.setItem('resume_draft_id', draft.id);
        navigate({ to: '/proposal' });
        break;
      default:
        navigate({ to: '/' });
    }
  };

  const handleView = (draft: Draft) => {
    setCurrentDraft(draft);
    setOpen('view');
  };

  const handleDelete = (draftId: string) => {
    deleteDraft(draftId);
    refreshDrafts();
  };

  const getStatusBadgeVariant = (status: DraftStatus) => {
    switch (status) {
      case 'draft': return 'outline';
      case 'submitted': return 'secondary';
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  const getTypeBadge = (type: DraftType) => {
    switch (type) {
      case 'proposal': return { label: 'Proposal', variant: 'outline' as const };
      case 'policy': return { label: 'Policy', variant: 'secondary' as const };
      default: return { label: type, variant: 'outline' as const };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search drafts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-auto"
          />

          
          <Select
            value={filters.type || "all-types"}
            onValueChange={(value) => 
              setFilters({...filters, type: value === "all-types" ? undefined : value as DraftType})
            }
          >
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-types">All Types</SelectItem>
              <SelectItem value="proposal">Proposal</SelectItem>
              <SelectItem value="policy">Policy</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Select
            value={sortOptions.field}
            onValueChange={(value) => 
              setSortOptions({...sortOptions, field: value as DraftSortField})
            }
          >
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updatedAt">Last Updated</SelectItem>
              <SelectItem value="createdAt">Created Date</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={sortOptions.direction}
            onValueChange={(value) => 
              setSortOptions({...sortOptions, direction: value as 'asc' | 'desc'})
            }
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Newest</SelectItem>
              <SelectItem value="asc">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {sortedDrafts.length === 0 ? (
        <div className="text-center py-12 border rounded-md bg-muted/20">
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="relative text-muted-foreground">
              <Pencil className="h-12 w-12 opacity-20" />
            </div>
            <h3 className="font-semibold text-lg">No drafts found</h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              {searchQuery || filters.status || filters.type
                ? "No drafts match your current filters. Try adjusting your search criteria."
                : "You don't have any saved drafts. Create a new document to get started."}
            </p>
          </div>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedDrafts.map((draft) => {
                const typeBadge = getTypeBadge(draft.type);
                
                return (
                  <TableRow 
                    key={draft.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleView(draft)}
                  >
                    <TableCell className="font-medium">
                      {draft.title}
                    </TableCell>
                    <TableCell>
                      <Badge variant={typeBadge.variant}>
                        {typeBadge.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(draft.status)}>
                        {draft.status.charAt(0).toUpperCase() + draft.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {draft.tags && draft.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {draft.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              <span className="text-xs">{tag}</span>
                            </Badge>
                          ))}
                          {draft.tags.length > 2 && (
                            <Badge variant="outline">+{draft.tags.length - 2}</Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">No tags</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{formatDate(draft.updatedAt || draft.createdAt)}</span>
                        {draft.updatedAt && (
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(draft.updatedAt), "h:mm a")}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenuItem onClick={() => handleResume(draft)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Resume
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleView(draft)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(draft.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
