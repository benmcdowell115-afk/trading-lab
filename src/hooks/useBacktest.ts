import { useState, useEffect } from 'react'
import type { Instrument } from '../types'
import { POINT_VALUES } from './useSettings'

export interface BacktestTrade {
  id: string
  direction: 'long' | 'short'
  instrument: Instrument
  entryPrice: number
  stopPrice: number
  targetPrice: number
  actualExitPrice: number | null
  result: 'win' | 'loss' | 'breakeven' | null
  rPlanned: number
  rAchieved: number | null
  pnlDollar: number | null
  conceptIds: string[]
  chartDate: string
  notes: string
  createdAt: string
}

export interface BacktestSession {
  id: string
  name: string
  trades: BacktestTrade[]
  createdAt: string
}

const KEY = 'tl:backtest'

export function calcRPlanned(dir: 'long' | 'short', entry: number, stop: number, target: number) {
  const risk = Math.abs(entry - stop)
  if (risk === 0) return 0
  const reward = dir === 'long' ? target - entry : entry - target
  return Math.round((reward / risk) * 100) / 100
}

export function calcRActual(dir: 'long' | 'short', entry: number, stop: number, exit: number) {
  const risk = Math.abs(entry - stop)
  if (risk === 0) return 0
  const pts = dir === 'long' ? exit - entry : entry - exit
  return Math.round((pts / risk) * 100) / 100
}

export function calcPnl(dir: 'long' | 'short', instrument: Instrument, entry: number, exit: number) {
  const pts = dir === 'long' ? exit - entry : entry - exit
  return Math.round(pts * POINT_VALUES[instrument] * 100) / 100
}

export function sessionStats(trades: BacktestTrade[]) {
  const done   = trades.filter(t => t.result !== null)
  const wins   = done.filter(t => t.result === 'win').length
  const losses = done.filter(t => t.result === 'loss').length
  const total  = done.length
  const winRate  = total > 0 ? Math.round((wins / total) * 100) : 0
  const totalR   = Math.round(done.reduce((s, t) => s + (t.rAchieved ?? 0), 0) * 100) / 100
  const avgR     = total > 0 ? Math.round((totalR / total) * 100) / 100 : 0
  const totalPnl = Math.round(done.reduce((s, t) => s + (t.pnlDollar ?? 0), 0) * 100) / 100

  const byConcept: Record<string, { wins: number; total: number }> = {}
  for (const t of done) {
    for (const cid of t.conceptIds) {
      if (!byConcept[cid]) byConcept[cid] = { wins: 0, total: 0 }
      byConcept[cid].total++
      if (t.result === 'win') byConcept[cid].wins++
    }
  }

  return { wins, losses, total, winRate, totalR, avgR, totalPnl, byConcept }
}

export function useBacktest() {
  const [sessions, setSessions] = useState<BacktestSession[]>(() => {
    try { return JSON.parse(localStorage.getItem(KEY) ?? '[]') }
    catch { return [] }
  })

  const [activeId, setActiveId] = useState<string | null>(() => {
    try {
      const s = JSON.parse(localStorage.getItem(KEY) ?? '[]') as BacktestSession[]
      return s.at(-1)?.id ?? null
    }
    catch { return null }
  })

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(sessions)) }, [sessions])

  const activeSession = sessions.find(s => s.id === activeId) ?? null

  const newSession = (name: string) => {
    const s: BacktestSession = {
      id: crypto.randomUUID(), name, trades: [],
      createdAt: new Date().toISOString(),
    }
    setSessions(p => [...p, s])
    setActiveId(s.id)
    return s
  }

  const renameSession = (id: string, name: string) =>
    setSessions(p => p.map(s => s.id === id ? { ...s, name } : s))

  const deleteSession = (id: string) =>
    setSessions(p => {
      const next = p.filter(s => s.id !== id)
      if (activeId === id) setActiveId(next.at(-1)?.id ?? null)
      return next
    })

  const addTrade = (t: Omit<BacktestTrade, 'id' | 'createdAt'>) => {
    if (!activeId) return
    const trade: BacktestTrade = { ...t, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
    setSessions(p => p.map(s => s.id === activeId ? { ...s, trades: [trade, ...s.trades] } : s))
  }

  const updateTrade = (tradeId: string, patch: Partial<BacktestTrade>) => {
    if (!activeId) return
    setSessions(p => p.map(s => s.id === activeId
      ? { ...s, trades: s.trades.map(t => t.id === tradeId ? { ...t, ...patch } : t) }
      : s))
  }

  const deleteTrade = (tradeId: string) => {
    if (!activeId) return
    setSessions(p => p.map(s => s.id === activeId
      ? { ...s, trades: s.trades.filter(t => t.id !== tradeId) }
      : s))
  }

  return {
    sessions, activeSession, activeId,
    setActiveId, newSession, renameSession, deleteSession,
    addTrade, updateTrade, deleteTrade,
  }
}
