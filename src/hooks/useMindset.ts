import { useState, useEffect } from 'react'

export interface MindsetEntry {
  id: string
  score: 1 | 2 | 3 | 4 | 5
  note: string
  timestamp: string
}

const KEY = 'tl:mindset'

export function useMindset() {
  const [entries, setEntries] = useState<MindsetEntry[]>(() => {
    try { return JSON.parse(localStorage.getItem(KEY) ?? '[]') }
    catch { return [] }
  })

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(entries)) }, [entries])

  const addEntry = (score: MindsetEntry['score'], note: string) => {
    setEntries(p => [{
      id: crypto.randomUUID(),
      score,
      note: note.trim(),
      timestamp: new Date().toISOString(),
    }, ...p])
  }

  const deleteEntry = (id: string) => setEntries(p => p.filter(e => e.id !== id))

  return { entries, addEntry, deleteEntry }
}
