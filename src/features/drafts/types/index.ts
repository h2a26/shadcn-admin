/**
 * Types for the Drafts Feature
 * 
 * This module defines the types used throughout the drafts feature.
 */

/**
 * Represents the status of a draft
 */
export type DraftStatus = 'draft' | 'submitted' | 'approved' | 'rejected';

/**
 * Base interface for all draft types
 */
export interface DraftBase {
  id: string;
  title: string;
  createdAt: string;
  updatedAt?: string;
  status: DraftStatus;
  type: DraftType;
}

/**
 * Types of drafts supported by the system
 */
export type DraftType = 'proposal' | 'policy' | 'claim' | 'other';

/**
 * Draft with additional metadata and content
 */
export interface Draft extends DraftBase {
  content: unknown;
  metadata: Record<string, unknown>;
  createdBy?: string;
  lastModifiedBy?: string;
  tags?: string[];
  expiresAt?: string;
}

/**
 * Interface for draft filters
 */
export interface DraftFilters {
  status?: DraftStatus;
  type?: DraftType;
  searchQuery?: string;
  dateRange?: {
    start?: Date;
    end?: Date;
  };
  tags?: string[];
}

/**
 * Draft sort options
 */
export type DraftSortField = 'createdAt' | 'updatedAt' | 'title';
export type SortDirection = 'asc' | 'desc';

export interface DraftSortOptions {
  field: DraftSortField;
  direction: SortDirection;
}
