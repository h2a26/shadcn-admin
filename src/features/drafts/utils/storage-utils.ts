import { Draft } from '../types'

const STORAGE_KEY = 'shadcn-admin-drafts'

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

const safelyParseJSON = (data: string): unknown => {
  try {
    return JSON.parse(data)
  } catch {
    return null
  }
}

const resetStorage = (): void => {
  localStorage.setItem(STORAGE_KEY, '[]')
}

export function getDraftsFromStorage(): Draft[] {
  const storedData = localStorage.getItem(STORAGE_KEY)

  if (!storedData) {
    return []
  }

  const parsedData = safelyParseJSON(storedData)
  
  if (!parsedData || !Array.isArray(parsedData)) {
    resetStorage()
    return []
  }

  return parsedData.filter(isValidDraft)
}

export function saveDraftToStorage(draft: Omit<Draft, 'id' | 'createdAt'>): string {
  try {
    const existingDrafts = getDraftsFromStorage()
    
    const newDraft: Draft = {
      ...draft,
      id: `draft-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
    }
    
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

export function updateDraftInStorage(id: string, updatedData: Partial<Draft>): boolean {
  if (!id) {
    return false
  }
  
  try {
    const drafts = getDraftsFromStorage()
    const draftIndex = drafts.findIndex(d => d.id === id)
    
    if (draftIndex === -1) {
      return false
    }
    
    const updatedDraft: Draft = {
      ...drafts[draftIndex],
      ...updatedData,
      updatedAt: new Date().toISOString()
    }
    
    const updatedDrafts = [...drafts]
    updatedDrafts[draftIndex] = updatedDraft
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDrafts))
    
    return true
  } catch {
    return false
  }
}

export function deleteDraftFromStorage(id: string): boolean {
  if (!id) {
    return false
  }
  
  try {
    const drafts = getDraftsFromStorage()
    const filteredDrafts = drafts.filter(d => d.id !== id)
    
    if (filteredDrafts.length === drafts.length) {
      return false
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredDrafts))
    
    return true
  } catch {
    return false
  }
}

export function getDraftById(id: string): Draft | null {
  if (!id) {
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