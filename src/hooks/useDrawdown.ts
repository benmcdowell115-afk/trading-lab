import { useState } from 'react'

export interface DrawdownSettings {
  dailyLimit: number
  profitTarget: number
}

const KEY = 'tl:drawdown'
const DEFAULT: DrawdownSettings = { dailyLimit: 500, profitTarget: 300 }

function load(): DrawdownSettings {
  try { return { ...DEFAULT, ...JSON.parse(localStorage.getItem(KEY) ?? '{}') } }
  catch { return DEFAULT }
}

let _data = load()
type Listener = () => void
const _listeners = new Set<Listener>()

function persist() {
  localStorage.setItem(KEY, JSON.stringify(_data))
  _listeners.forEach(fn => fn())
}

export function useDrawdown() {
  const [, rerender] = useState(0)

  useState(() => {
    const fn = () => rerender(n => n + 1)
    _listeners.add(fn)
    return () => { _listeners.delete(fn) }
  })

  const update = (patch: Partial<DrawdownSettings>) => {
    _data = { ..._data, ...patch }
    persist()
  }

  return { settings: _data, update }
}
