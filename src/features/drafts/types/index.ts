export type DraftStatus = 'draft' | 'submitted' | 'approved' | 'rejected'

interface DraftBase {
  id: string
  title: string
  createdAt: string
  updatedAt?: string
  status: DraftStatus
  type: DraftType
}

export type DraftType = 'proposal' | 'policy' | 'other'

export interface Draft extends DraftBase {
  content: unknown
  metadata: Record<string, unknown>
  createdBy?: string
  lastModifiedBy?: string
  tags?: string[]
  expiresAt?: string
}

export interface DraftFilters {
  status?: DraftStatus
  type?: DraftType
  searchQuery?: string
  dateRange?: {
    start?: Date
    end?: Date
  }
  tags?: string[]
}

type DraftSortField = 'createdAt' | 'updatedAt' | 'title'
type SortDirection = 'asc' | 'desc'

export interface DraftSortOptions {
  field: DraftSortField
  direction: SortDirection
}

export type { DraftSortField }
