import { useState } from 'react'

export interface OHLCVBar {
  time: number // unix seconds
  open: number
  high: number
  low: number
  close: number
}

const CACHE_PREFIX = 'tl:replay-cache:'
const CACHE_TTL    = 1000 * 60 * 60 * 24 // 24h

interface CacheEntry { bars: OHLCVBar[]; savedAt: number }

function tdSymbol(inst: string) {
  if (inst.length === 6) return `${inst.slice(0,3)}/${inst.slice(3)}`
  return inst
}

function tdInterval(tf: string) {
  const map: Record<string, string> = {
    '1m':'1min','5m':'5min','15m':'15min','1H':'1h','4H':'4h','D':'1day',
  }
  return map[tf] ?? '15min'
}

export const TD_KEY_STORAGE = 'tl:tdkey'

export function useReplayData() {
  const [bars,    setBars]    = useState<OHLCVBar[]>([])
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  const load = async (instrument: string, tf: string, startDate: string, apiKey: string) => {
    if (!apiKey.trim()) {
      setError('no-key')
      return
    }

    const ck = `${CACHE_PREFIX}${instrument}-${tf}-${startDate}`
    try {
      const raw = localStorage.getItem(ck)
      if (raw) {
        const entry: CacheEntry = JSON.parse(raw)
        if (Date.now() - entry.savedAt < CACHE_TTL) {
          setBars(entry.bars)
          setError(null)
          return
        }
      }
    } catch {}

    setLoading(true)
    setError(null)
    try {
      const sym = tdSymbol(instrument)
      const ivl = tdInterval(tf)
      const url = `https://api.twelvedata.com/time_series?symbol=${encodeURIComponent(sym)}&interval=${ivl}&start_date=${startDate}&outputsize=500&apikey=${apiKey.trim()}`
      const res  = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      if (data.status === 'error') throw new Error(data.message ?? 'Twelve Data error')
      if (!Array.isArray(data.values) || data.values.length === 0)
        throw new Error('No data for this instrument/date — try a different date or check the instrument name.')

      const parsed: OHLCVBar[] = (data.values as Record<string, string>[])
        .reverse()
        .map(v => ({
          time:  Math.floor(new Date(v.datetime).getTime() / 1000),
          open:  parseFloat(v.open),
          high:  parseFloat(v.high),
          low:   parseFloat(v.low),
          close: parseFloat(v.close),
        }))

      try {
        localStorage.setItem(ck, JSON.stringify({ bars: parsed, savedAt: Date.now() } satisfies CacheEntry))
      } catch {}

      setBars(parsed)
    } catch (e: unknown) {
      setError((e as Error).message ?? 'Failed to load data')
      setBars([])
    } finally {
      setLoading(false)
    }
  }

  const clear = () => { setBars([]); setError(null) }

  return { bars, loading, error, load, clear }
}
