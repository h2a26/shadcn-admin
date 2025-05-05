import { Draft } from '../types'

// Storage key for drafts
const STORAGE_KEY = 'shadcn-admin-drafts'

/**
 * Type guard function to validate Draft structure
 * @param item Item to validate
 * @returns Boolean indicating if the item is a valid Draft
 */
const isValidDraft = (item: unknown): item is Draft => {
  return (
    typeof item === 'object' &&
    item !== null &&
    'id' in item &&
    'title' in item &&
    'createdAt' in item &&
    'status' in item &&
    'type' in item &&
    'content' in item
  )
}

/**
 * Safely parse JSON data with type validation
 * @param data JSON string to parse
 * @returns Parsed data or null if invalid
 */
const safelyParseJSON = (data: string): unknown => {
  try {
    return JSON.parse(data)
  } catch {
    return null
  }
}

/**
 * Reset storage to empty array
 */
const resetStorage = (): void => {
  localStorage.setItem(STORAGE_KEY, '[]')
}

/**
 * Retrieves all drafts from local storage
 * @returns Array of saved drafts
 */
export function getDraftsFromStorage(): Draft[] {
  const storedData = localStorage.getItem(STORAGE_KEY)

  // If no data exists, return empty array
  if (!storedData) {
    return []
  }

  const parsedData = safelyParseJSON(storedData)
  
  // Validate that the parsed data is an array
  if (!parsedData || !Array.isArray(parsedData)) {
    resetStorage()
    return []
  }

  // Filter out invalid drafts
  return parsedData.filter(isValidDraft)
}

/**
 * Saves a draft to local storage
 * @param draft Draft data to save (without id and createdAt)
 * @returns The ID of the saved draft
 * @throws Error if saving fails
 */
export function saveDraftToStorage(draft: Omit<Draft, 'id' | 'createdAt'>): string {
  try {
    // Get existing drafts
    const existingDrafts = getDraftsFromStorage()
    
    // Create new draft with ID and timestamp
    const newDraft: Draft = {
      ...draft,
      id: `draft-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
    }
    
    // Save updated drafts array
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([...existingDrafts, newDraft])
    )
    
    return newDraft.id
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`Failed to save draft: ${errorMessage}`)
  }
}

/**
 * Updates an existing draft in local storage
 * @param id ID of the draft to update
 * @param updatedData Updated draft data
 * @returns Boolean indicating success
 */
export function updateDraftInStorage(id: string, updatedData: Partial<Draft>): boolean {
  if (!id || typeof id !== 'string') {
    return false
  }
  
  try {
    const drafts = getDraftsFromStorage()
    const draftIndex = drafts.findIndex(d => d.id === id)
    
    if (draftIndex === -1) {
      return false
    }
    
    // Create updated draft
    const updatedDraft: Draft = {
      ...drafts[draftIndex],
      ...updatedData,
      updatedAt: new Date().toISOString()
    }
    
    // Update drafts array
    const updatedDrafts = [...drafts]
    updatedDrafts[draftIndex] = updatedDraft
    
    // Save to local storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDrafts))
    
    return true
  } catch {
    return false
  }
}

/**
 * Deletes a draft from local storage
 * @param id ID of the draft to delete
 * @returns Boolean indicating success
 */
export function deleteDraftFromStorage(id: string): boolean {
  if (!id || typeof id !== 'string') {
    return false
  }
  
  try {
    const drafts = getDraftsFromStorage()
    const filteredDrafts = drafts.filter(d => d.id !== id)
    
    if (filteredDrafts.length === drafts.length) {
      // No draft was removed
      return false
    }
    
    // Save to local storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredDrafts))
    
    return true
  } catch {
    return false
  }
}

/**
 * Gets a single draft by ID
 * @param id ID of the draft to retrieve
 * @returns The draft or null if not found
 */
export function getDraftById(id: string): Draft | null {
  if (!id || typeof id !== 'string') {
    return null
  }
  
  try {
    const drafts = getDraftsFromStorage()
    const draft = drafts.find(d => d.id === id)
    return draft || null
  } catch {
    return null
  }
}
