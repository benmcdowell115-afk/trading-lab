import { useState, useEffect, useRef } from 'react'
import {
  Plus, Trash2, TrendingUp, TrendingDown, RefreshCw,
  Check, X, ChevronDown, ChevronUp, Crosshair, BarChart2,
  PanelRightClose, PanelRightOpen, Search,
} from 'lucide-react'
import { concepts, getConceptById } from '../data/concepts'
import {
  useBacktest, calcRPlanned, calcRActual, calcPnl, sessionStats,
  type BacktestTrade, type BacktestSession,
} from '../hooks/useBacktest'
import { POINT_VALUES } from '../hooks/useSettings'
import type { Instrument } from '../types'

// ── Constants ────────────────────────────────────────────────────────────────
const INSTRUMENTS: { label: Instrument; symbol: string }[] = [
  { label: 'NQ', symbol: 'CME_MINI:NQ1!' },
  { label: 'ES', symbol: 'CME_MINI:ES1!' },
  { label: 'GC', symbol: 'COMEX:GC1!'    },
  { label: 'SI', symbol: 'COMEX:SI1!'    },
]
const TIMEFRAMES = [
  { label: '1m', value: '1' }, { label: '5m', value: '5' },
  { label: '15m', value: '15' }, { label: '1H', value: '60' },
  { label: '4H', value: '240' }, { label: 'D', value: 'D' },
]
const inst2sym = Object.fromEntries(INSTRUMENTS.map(i => [i.label, i.symbol]))

// ── TradingView chart ─────────────────────────────────────────────────────────
let _tvReady: Promise<void> | null = null
function getTVReady(): Promise<void> {
  if (_tvReady) return _tvReady
  _tvReady = new Promise<void>(resolve => {
    if ((window as any).TradingView) { resolve(); return }
    if (!document.querySelector('script[data-tv]')) {
      const s = document.createElement('script')
      s.src = 'https://s3.tradingview.com/tv.js'
      s.setAttribute('data-tv', '1')
      s.async = true
      document.head.appendChild(s)
    }
    const poll = setInterval(() => {
      if ((window as any).TradingView) { clearInterval(poll); resolve() }
    }, 100)
  })
  return _tvReady
}

function TVChart({ symbol, interval }: { symbol: string; interval: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mountedRef   = useRef(true)
  const idRef        = useRef(`tv_bt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`)
  const [error, setError] = useState(false)

  useEffect(() => {
    mountedRef.current = true
    setError(false)
    const id = idRef.current
    getTVReady().then(() => {
      if (!mountedRef.current || !containerRef.current) return
      try {
        new (window as any).TradingView.widget({
          container_id: id, autosize: true,
          symbol, interval,
          timezone: 'America/New_York', theme: 'dark', style: '1', locale: 'en',
          toolbar_bg: '#06060d', enable_publishing: false,
          allow_symbol_change: true, save_image: false,
          backgroundColor: '#05050a', gridColor: 'rgba(30,32,48,0.6)',
          disabled_features: ['border_around_the_chart'],
        })
      } catch { if (mountedRef.current) setError(true) }
    }).catch(() => { if (mountedRef.current) setError(true) })
    return () => { mountedRef.current = false }
  }, [symbol, interval])

  if (error) return (
    <div className="w-full h-full flex items-center justify-center bg-[#05050a]">
      <p className="text-slate-500 text-[13px]">Chart failed to load — try reload</p>
    </div>
  )
  return (
    <div className="w-full h-full">
      <div id={idRef.current} style={{ width: '100%', height: '100%' }} ref={containerRef} />
    </div>
  )
}

// ── Concept picker ────────────────────────────────────────────────────────────
function ConceptPicker({ selected, onChange }: { selected: string[]; onChange: (ids: string[]) => void }) {
  const [search, setSearch] = useState('')
  const toggle = (id: string) =>
    onChange(selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id])

  const filtered = concepts.filter(c =>
    !search || c.shortName.toLowerCase().includes(search.toLowerCase()) ||
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  const tierDot: Record<string, string> = {
    basic: 'bg-emerald-400', intermediate: 'bg-blue-400', advanced: 'bg-purple-400',
  }

  return (
    <div className="space-y-2">
      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map(id => {
            const c = getConceptById(id)
            return c ? (
              <button key={id} onClick={() => toggle(id)}
                className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-red-500/15 hover:border-red-500/30 hover:text-red-300 transition-all">
                {c.shortName} <X size={8} />
              </button>
            ) : null
          })}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search size={10} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-600" />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search concepts…"
          className="w-full bg-slate-900/70 border border-slate-800 rounded-xl pl-7 pr-3 py-1.5 text-[11px] text-slate-200 placeholder-slate-600 focus:outline-none focus:border-slate-600 transition-all"
        />
      </div>

      {/* Concept grid */}
      <div className="max-h-[130px] overflow-y-auto grid grid-cols-2 gap-1 pr-1">
        {filtered.map(c => (
          <button key={c.id} onClick={() => toggle(c.id)}
            className={`flex items-center gap-1.5 text-left px-2 py-1.5 rounded-lg border text-[10.5px] font-medium transition-all ${
              selected.includes(c.id)
                ? 'bg-amber-500/12 border-amber-500/35 text-amber-300'
                : 'border-slate-800/60 text-slate-500 hover:border-slate-700 hover:text-slate-300 bg-slate-900/20'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${tierDot[c.tier]}`} />
            <span className="truncate">{c.shortName}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Trade card ────────────────────────────────────────────────────────────────
function TradeCard({
  trade, onResult, onDelete,
}: {
  trade: BacktestTrade
  onResult: (id: string, result: 'win' | 'loss' | 'breakeven', exit: number) => void
  onDelete: (id: string) => void
}) {
  const [resolving, setResolving] = useState(false)
  const [exitInput, setExitInput] = useState('')
  const [expanded, setExpanded]   = useState(false)

  const risk    = Math.abs(trade.entryPrice - trade.stopPrice)
  const riskDol = risk * POINT_VALUES[trade.instrument]

  const handleResult = (result: 'win' | 'loss' | 'breakeven') => {
    const exit = parseFloat(exitInput)
    if (isNaN(exit)) return
    onResult(trade.id, result, exit)
    setResolving(false)
    setExitInput('')
  }

  const resultBadge = {
    win:       'bg-emerald-500/12 border-emerald-500/30 text-emerald-400',
    loss:      'bg-red-500/12 border-red-500/30 text-red-400',
    breakeven: 'bg-slate-700/60 border-slate-600 text-slate-400',
  }

  return (
    <div className={`rounded-2xl border overflow-hidden transition-all ${
      trade.result === null
        ? 'bg-[#0d0d18] border-amber-500/20'
        : trade.result === 'win'
        ? 'bg-[#0a0f0d] border-emerald-500/15'
        : trade.result === 'loss'
        ? 'bg-[#0f0a0a] border-red-500/15'
        : 'bg-[#0b0b12] border-slate-800/50'
    }`}>

      {/* Card header */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Direction */}
        <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 ${
          trade.direction === 'long'
            ? 'bg-emerald-500/15 border border-emerald-500/30'
            : 'bg-red-500/15 border border-red-500/30'
        }`}>
          {trade.direction === 'long'
            ? <TrendingUp size={12} className="text-emerald-400" />
            : <TrendingDown size={12} className="text-red-400" />}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-black text-amber-300/80"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {trade.instrument}
            </span>
            <span className="text-[10px] text-slate-600">·</span>
            <span className="text-[10px] text-slate-500">{trade.chartDate}</span>

            {/* Result / pending */}
            {trade.result ? (
              <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full border ${resultBadge[trade.result]}`}>
                {trade.result === 'win' ? `+${trade.rAchieved}R` : trade.result === 'loss' ? `${trade.rAchieved}R` : 'BE'}
              </span>
            ) : (
              <span className="ml-auto text-[9px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/8 text-amber-400 animate-pulse">
                PENDING
              </span>
            )}
          </div>

          {/* Prices */}
          <div className="flex items-center gap-1 mt-0.5 text-[10px]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            <span className="text-slate-400">{trade.entryPrice}</span>
            <span className="text-slate-700">→</span>
            <span className="text-red-400/70">SL {trade.stopPrice}</span>
            <span className="text-slate-700">→</span>
            <span className="text-emerald-400/70">TP {trade.targetPrice}</span>
            <span className="text-slate-700 ml-1">|</span>
            <span className="text-slate-500">{trade.rPlanned}R plan</span>
          </div>
        </div>

        {/* Expand + delete */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={() => setExpanded(e => !e)}
            className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-slate-300 transition-colors">
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          <button onClick={() => onDelete(trade.id)}
            className="w-6 h-6 flex items-center justify-center text-slate-700 hover:text-red-400 transition-colors">
            <Trash2 size={10} />
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-4 pb-3 border-t border-slate-800/40 pt-3 space-y-3">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Risk pts', value: risk.toFixed(2) },
              { label: 'Risk $', value: `$${riskDol.toLocaleString()}` },
              { label: trade.result ? 'P&L' : 'Target R', value: trade.result ? `${trade.pnlDollar! >= 0 ? '+' : ''}$${trade.pnlDollar!.toLocaleString()}` : `${trade.rPlanned}R` },
            ].map(s => (
              <div key={s.label} className="bg-slate-900/50 rounded-xl px-2.5 py-2 text-center">
                <p className="text-[9px] text-slate-600 uppercase tracking-wider">{s.label}</p>
                <p className="text-[12px] font-bold text-slate-200 mt-0.5"
                   style={{ fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Concepts */}
          {trade.conceptIds.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {trade.conceptIds.map(id => {
                const c = getConceptById(id)
                return c ? (
                  <span key={id} className="text-[10px] text-slate-400 bg-slate-800/60 border border-slate-700/40 px-2 py-0.5 rounded-lg">
                    {c.shortName}
                  </span>
                ) : null
              })}
            </div>
          )}

          {/* Notes */}
          {trade.notes && (
            <p className="text-[11px] text-slate-500 leading-relaxed">{trade.notes}</p>
          )}
        </div>
      )}

      {/* Mark result section */}
      {trade.result === null && (
        <div className="px-4 pb-3 border-t border-slate-800/30">
          {!resolving ? (
            <button onClick={() => setResolving(true)}
              className="mt-2.5 w-full py-2 rounded-xl border border-slate-700/50 text-[11px] font-semibold text-slate-500 hover:border-amber-500/30 hover:text-amber-400 hover:bg-amber-500/5 transition-all">
              Mark Result →
            </button>
          ) : (
            <div className="mt-2.5 space-y-2">
              <input
                autoFocus
                value={exitInput} onChange={e => setExitInput(e.target.value)}
                placeholder="Actual exit price"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-[12px] text-slate-100 placeholder-slate-600 focus:outline-none focus:border-slate-500 transition-colors"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              />
              <div className="grid grid-cols-3 gap-1.5">
                <button onClick={() => handleResult('win')}
                  disabled={!exitInput}
                  className="py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-[11px] font-bold hover:bg-emerald-500/20 transition-all disabled:opacity-30">
                  Win
                </button>
                <button onClick={() => handleResult('loss')}
                  disabled={!exitInput}
                  className="py-2 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-[11px] font-bold hover:bg-red-500/20 transition-all disabled:opacity-30">
                  Loss
                </button>
                <button onClick={() => handleResult('breakeven')}
                  disabled={!exitInput}
                  className="py-2 rounded-xl border border-slate-700 bg-slate-800/40 text-slate-400 text-[11px] font-bold hover:bg-slate-700/60 transition-all disabled:opacity-30">
                  BE
                </button>
              </div>
              <button onClick={() => { setResolving(false); setExitInput('') }}
                className="w-full text-[10px] text-slate-700 hover:text-slate-400 transition-colors">
                cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Log trade form ────────────────────────────────────────────────────────────
function LogForm({
  instrument, onLog,
}: {
  instrument: Instrument
  onLog: (t: Omit<BacktestTrade, 'id' | 'createdAt'>) => void
}) {
  const [dir,      setDir]      = useState<'long' | 'short'>('long')
  const [date,     setDate]     = useState(new Date().toISOString().slice(0, 10))
  const [inst,     setInst]     = useState<Instrument>(instrument)
  const [entry,    setEntry]    = useState('')
  const [stop,     setStop]     = useState('')
  const [target,   setTarget]   = useState('')
  const [concepts, setConcepts] = useState<string[]>([])
  const [notes,    setNotes]    = useState('')

  // sync instrument prop
  useEffect(() => { setInst(instrument) }, [instrument])

  const entryN  = parseFloat(entry)
  const stopN   = parseFloat(stop)
  const targetN = parseFloat(target)
  const valid   = !isNaN(entryN) && !isNaN(stopN) && !isNaN(targetN) && stopN !== entryN

  const riskPts  = valid ? Math.abs(entryN - stopN) : null
  const riskDol  = riskPts ? riskPts * POINT_VALUES[inst] : null
  const rPlanned = valid ? calcRPlanned(dir, entryN, stopN, targetN) : null

  const submit = () => {
    if (!valid) return
    onLog({
      direction: dir, instrument: inst,
      entryPrice: entryN, stopPrice: stopN, targetPrice: targetN,
      actualExitPrice: null, result: null,
      rPlanned: rPlanned!, rAchieved: null, pnlDollar: null,
      conceptIds: concepts, chartDate: date, notes,
    })
    setEntry(''); setStop(''); setTarget('')
    setConcepts([]); setNotes('')
  }

  const monoStyle = { fontFamily: "'JetBrains Mono', monospace" }
  const numCls = 'w-full bg-slate-900/70 border border-slate-800 rounded-xl px-3 py-2 text-[12px] text-slate-100 placeholder-slate-600 focus:outline-none focus:border-slate-600 transition-all'

  return (
    <div className="space-y-3">
      {/* Direction + date row */}
      <div className="flex gap-2">
        <div className="flex rounded-xl overflow-hidden border border-slate-800 flex-shrink-0">
          {(['long', 'short'] as const).map(d => (
            <button key={d} onClick={() => setDir(d)}
              className={`px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition-all ${
                dir === d
                  ? d === 'long'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-red-500/20 text-red-300'
                  : 'text-slate-600 hover:text-slate-300'
              }`}>
              {d === 'long' ? '↑ Long' : '↓ Short'}
            </button>
          ))}
        </div>
        <input type="date" value={date} onChange={e => setDate(e.target.value)}
          className="flex-1 bg-slate-900/70 border border-slate-800 rounded-xl px-3 py-2 text-[11px] text-slate-300 focus:outline-none focus:border-slate-600 transition-all" />
      </div>

      {/* Instrument selector */}
      <div className="flex gap-1">
        {(['NQ', 'ES', 'GC', 'SI'] as Instrument[]).map(i => (
          <button key={i} onClick={() => setInst(i)}
            className={`flex-1 py-1.5 rounded-xl border text-[11px] font-bold transition-all ${
              inst === i
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                : 'border-slate-800 text-slate-600 hover:border-slate-700 hover:text-slate-300'
            }`} style={monoStyle}>
            {i}
          </button>
        ))}
      </div>

      {/* Entry / Stop / Target */}
      <div className="grid grid-cols-3 gap-2">
        <div>
          <p className="text-[9px] text-slate-600 font-bold uppercase tracking-wider mb-1">Entry</p>
          <input value={entry} onChange={e => setEntry(e.target.value)} placeholder="20500"
            className={numCls} style={monoStyle} />
        </div>
        <div>
          <p className="text-[9px] text-red-500/70 font-bold uppercase tracking-wider mb-1">Stop</p>
          <input value={stop} onChange={e => setStop(e.target.value)} placeholder="20470"
            className={numCls} style={monoStyle} />
        </div>
        <div>
          <p className="text-[9px] text-emerald-500/70 font-bold uppercase tracking-wider mb-1">Target</p>
          <input value={target} onChange={e => setTarget(e.target.value)} placeholder="20590"
            className={numCls} style={monoStyle} />
        </div>
      </div>

      {/* Live R + risk preview */}
      {valid && (
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-900/50 border border-slate-800/50">
          <div className="text-center flex-1">
            <p className="text-[9px] text-slate-600 uppercase tracking-wider">Risk</p>
            <p className="text-[13px] font-bold text-red-400 mt-0.5" style={monoStyle}>
              {riskPts} pts · ${riskDol?.toLocaleString()}
            </p>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div className="text-center flex-1">
            <p className="text-[9px] text-slate-600 uppercase tracking-wider">Planned R</p>
            <p className={`text-[13px] font-bold mt-0.5 ${rPlanned! >= 2 ? 'text-emerald-400' : rPlanned! >= 1 ? 'text-amber-400' : 'text-red-400'}`}
               style={monoStyle}>
              {rPlanned}R
            </p>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div className="text-center flex-1">
            <p className="text-[9px] text-slate-600 uppercase tracking-wider">Direction</p>
            <p className={`text-[13px] font-bold mt-0.5 ${dir === 'long' ? 'text-emerald-400' : 'text-red-400'}`}>
              {dir === 'long' ? '↑ LONG' : '↓ SHORT'}
            </p>
          </div>
        </div>
      )}

      {/* Concepts */}
      <div>
        <p className="text-[9px] text-slate-600 font-bold uppercase tracking-wider mb-2">ICT Concepts Used</p>
        <ConceptPicker selected={concepts} onChange={setConcepts} />
      </div>

      {/* Notes */}
      <textarea value={notes} onChange={e => setNotes(e.target.value)}
        placeholder="Setup description, what you saw, why you took it…"
        rows={2}
        className="w-full bg-slate-900/70 border border-slate-800 rounded-xl px-3 py-2 text-[11.5px] text-slate-200 placeholder-slate-600 focus:outline-none focus:border-slate-600 transition-all resize-none"
      />

      {/* Submit */}
      <button onClick={submit} disabled={!valid}
        className="w-full py-3 rounded-xl border border-amber-500/35 bg-amber-500/12 text-amber-300 text-[12px] font-bold hover:bg-amber-500/22 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
        Log Trade →
      </button>
    </div>
  )
}

// ── Session stats bar ─────────────────────────────────────────────────────────
function StatsBar({ session }: { session: BacktestSession }) {
  const s = sessionStats(session.trades)
  const pending = session.trades.filter(t => t.result === null).length

  if (session.trades.length === 0) return (
    <div className="px-4 py-3 border-b border-slate-800/40 text-center">
      <p className="text-[11px] text-slate-700">Log your first trade to see stats</p>
    </div>
  )

  return (
    <div className="px-4 py-3 border-b border-slate-800/40 grid grid-cols-4 gap-2">
      {[
        { label: 'Win Rate', value: `${s.winRate}%`, color: s.winRate >= 60 ? 'text-emerald-400' : s.winRate >= 40 ? 'text-amber-400' : 'text-red-400' },
        { label: 'Avg R',    value: s.total > 0 ? (s.avgR >= 0 ? `+${s.avgR}` : `${s.avgR}`) : '—', color: s.avgR >= 0 ? 'text-emerald-400' : 'text-red-400' },
        { label: 'Total R',  value: s.total > 0 ? (s.totalR >= 0 ? `+${s.totalR}` : `${s.totalR}`) : '—', color: s.totalR >= 0 ? 'text-emerald-400' : 'text-red-400' },
        { label: 'W / L',    value: `${s.wins}/${s.losses}`, color: 'text-slate-300' },
      ].map(stat => (
        <div key={stat.label} className="text-center">
          <p className="text-[9px] text-slate-600 uppercase tracking-wider">{stat.label}</p>
          <p className={`text-[13px] font-black mt-0.5 ${stat.color}`}
             style={{ fontFamily: "'JetBrains Mono', monospace" }}>{stat.value}</p>
        </div>
      ))}
      {pending > 0 && (
        <div className="col-span-4 text-center">
          <span className="text-[10px] text-amber-400/70">{pending} pending result{pending !== 1 ? 's' : ''}</span>
        </div>
      )}
    </div>
  )
}

// ── Concept performance breakdown ─────────────────────────────────────────────
function ConceptBreakdown({ session }: { session: BacktestSession }) {
  const s = sessionStats(session.trades)
  const entries = Object.entries(s.byConcept)
    .filter(([, v]) => v.total >= 2)
    .sort((a, b) => (b[1].wins / b[1].total) - (a[1].wins / a[1].total))
    .slice(0, 5)

  if (entries.length === 0) return null

  return (
    <div className="px-4 py-4 border-t border-slate-800/40">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-3">Concept Performance</p>
      <div className="space-y-2">
        {entries.map(([cid, v]) => {
          const c = getConceptById(cid)
          if (!c) return null
          const wr = Math.round((v.wins / v.total) * 100)
          return (
            <div key={cid} className="flex items-center gap-3">
              <span className="text-[11px] text-slate-400 w-28 truncate flex-shrink-0">{c.shortName}</span>
              <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${wr >= 60 ? 'bg-emerald-500' : wr >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                  style={{ width: `${wr}%` }}
                />
              </div>
              <span className={`text-[10px] font-bold w-8 text-right flex-shrink-0 ${wr >= 60 ? 'text-emerald-400' : wr >= 40 ? 'text-amber-400' : 'text-red-400'}`}>
                {wr}%
              </span>
              <span className="text-[9px] text-slate-600 flex-shrink-0">{v.wins}/{v.total}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export function BacktestPage() {
  const { sessions, activeSession, activeId, setActiveId, newSession, deleteSession, addTrade, updateTrade, deleteTrade } = useBacktest()

  const [instrument, setInstrument] = useState<Instrument>('NQ')
  const [tf,         setTf]         = useState('15')
  const [chartKey,   setChartKey]   = useState(0)
  const [panelOpen,  setPanelOpen]  = useState(true)
  const [logOpen,    setLogOpen]    = useState(true)
  const [newName,    setNewName]    = useState('')
  const [creating,   setCreating]   = useState(false)

  const symbol = inst2sym[instrument]

  const handleResult = (tradeId: string, result: 'win' | 'loss' | 'breakeven', exit: number) => {
    const trade = activeSession?.trades.find(t => t.id === tradeId)
    if (!trade) return
    const rAchieved = calcRActual(trade.direction, trade.entryPrice, trade.stopPrice, exit)
    const pnlDollar = calcPnl(trade.direction, trade.instrument, trade.entryPrice, exit)
    updateTrade(tradeId, { result, actualExitPrice: exit, rAchieved, pnlDollar })
  }

  const createSession = () => {
    if (!newName.trim()) return
    newSession(newName.trim())
    setNewName('')
    setCreating(false)
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col md:flex-row h-full overflow-hidden bg-[#05050a]">

      {/* ── Chart side ─────────────────────────────────────────────────────── */}
      <div className={`flex flex-col overflow-hidden transition-all ${
        panelOpen ? 'h-[42vh] md:h-full md:flex-1' : 'flex-1 h-full'
      }`}>
        {/* Chart toolbar */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-800/50 bg-[#06060d] flex-shrink-0 flex-wrap">
          {/* Instrument */}
          <div className="flex gap-1">
            {INSTRUMENTS.map(({ label }) => (
              <button key={label} onClick={() => { setInstrument(label); setChartKey(k => k + 1) }}
                className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border transition-all ${
                  instrument === label
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                    : 'border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300'
                }`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {label}
              </button>
            ))}
          </div>

          <div className="w-px h-4 bg-slate-800" />

          {/* Timeframe */}
          <div className="flex gap-1">
            {TIMEFRAMES.map(t => (
              <button key={t.value} onClick={() => { setTf(t.value); setChartKey(k => k + 1) }}
                className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-xl border transition-all ${
                  tf === t.value
                    ? 'bg-slate-700 border-slate-600 text-slate-100'
                    : 'border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300'
                }`}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => setChartKey(k => k + 1)}
              className="flex items-center gap-1 text-[10px] text-slate-600 hover:text-slate-300 px-2 py-1.5 rounded-lg hover:bg-slate-800/50 transition-all">
              <RefreshCw size={10} /> Reload
            </button>
            {/* Panel toggle */}
            <button onClick={() => setPanelOpen(o => !o)}
              className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-xl border border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300 transition-all">
              {panelOpen ? <PanelRightClose size={12} /> : <PanelRightOpen size={12} />}
              <span className="hidden sm:inline">{panelOpen ? 'Hide' : 'Log'}</span>
            </button>
          </div>
        </div>

        {/* TV Chart */}
        <div className="flex-1 overflow-hidden">
          <TVChart key={`${chartKey}-${symbol}-${tf}`} symbol={symbol} interval={tf} />
        </div>

        {/* Mobile instruction strip */}
        <div className="md:hidden flex items-center justify-center gap-2 px-4 py-2 bg-[#06060d] border-t border-slate-800/40 flex-shrink-0">
          <Crosshair size={11} className="text-amber-400/60" />
          <p className="text-[10px] text-slate-600">Scroll the chart to a setup, then log your trade below</p>
        </div>
      </div>

      {/* ── Session panel ──────────────────────────────────────────────────── */}
      {panelOpen && (
        <div className="flex flex-col flex-1 md:flex-none md:w-[390px] border-t md:border-t-0 md:border-l border-slate-800/50 overflow-hidden bg-[#06060d]">

          {/* Session selector header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800/40 flex-shrink-0">
            <Crosshair size={13} className="text-amber-400 flex-shrink-0" />

            {sessions.length > 0 && !creating ? (
              <>
                <select
                  value={activeId ?? ''}
                  onChange={e => setActiveId(e.target.value)}
                  className="flex-1 bg-transparent text-[12px] font-bold text-white focus:outline-none truncate"
                >
                  {sessions.map(s => (
                    <option key={s.id} value={s.id} style={{ background: '#08080f' }}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <button onClick={() => setCreating(true)}
                  className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-xl border border-slate-800 text-slate-500 hover:border-amber-500/30 hover:text-amber-400 transition-all flex-shrink-0">
                  <Plus size={10} /> New
                </button>
                {activeSession && (
                  <button onClick={() => { if (confirm(`Delete "${activeSession.name}"?`)) deleteSession(activeSession.id) }}
                    className="w-7 h-7 flex items-center justify-center rounded-xl text-slate-700 hover:text-red-400 hover:bg-red-500/8 transition-all flex-shrink-0">
                    <Trash2 size={11} />
                  </button>
                )}
              </>
            ) : (
              <div className="flex-1 flex gap-2">
                <input autoFocus value={newName} onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') createSession(); if (e.key === 'Escape') setCreating(false) }}
                  placeholder="Session name (e.g. NQ 15m May week 1)"
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-[12px] text-slate-100 placeholder-slate-600 focus:outline-none focus:border-slate-500 transition-colors"
                />
                <button onClick={createSession} disabled={!newName.trim()}
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 disabled:opacity-30 transition-all">
                  <Check size={13} />
                </button>
                {sessions.length > 0 && (
                  <button onClick={() => setCreating(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-800 text-slate-600 hover:text-slate-300 transition-all">
                    <X size={13} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* No session state */}
          {!activeSession && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/8 border border-amber-500/15 flex items-center justify-center">
                <Crosshair size={24} className="text-amber-500/40" />
              </div>
              <div className="text-center">
                <p className="text-[14px] font-bold text-slate-400 mb-1">No session yet</p>
                <p className="text-[12px] text-slate-600 leading-relaxed max-w-[240px]">
                  Create a session to start logging backtest trades. Scroll TradingView to any historical date and log what you see.
                </p>
              </div>
              <button onClick={() => setCreating(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 text-[12px] font-bold hover:bg-amber-500/18 transition-all">
                <Plus size={13} /> Start First Session
              </button>
            </div>
          )}

          {/* Active session content */}
          {activeSession && (
            <div className="flex-1 overflow-y-auto">
              {/* Stats */}
              <StatsBar session={activeSession} />

              {/* Log trade form */}
              <div className="border-b border-slate-800/40">
                <button onClick={() => setLogOpen(o => !o)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-800/20 transition-colors">
                  <div className="flex items-center gap-2">
                    <Plus size={12} className="text-amber-400" />
                    <span className="text-[12px] font-bold text-white">Log a Trade</span>
                  </div>
                  {logOpen ? <ChevronUp size={13} className="text-slate-600" /> : <ChevronDown size={13} className="text-slate-600" />}
                </button>
                {logOpen && (
                  <div className="px-4 pb-4">
                    <LogForm instrument={instrument} onLog={addTrade} />
                  </div>
                )}
              </div>

              {/* Trade list */}
              <div className="px-4 py-4 space-y-2.5">
                {activeSession.trades.length === 0 ? (
                  <div className="text-center py-8">
                    <BarChart2 size={24} className="text-slate-800 mx-auto mb-2" />
                    <p className="text-[12px] text-slate-700">No trades logged yet</p>
                    <p className="text-[11px] text-slate-800 mt-1">Scroll the chart to a setup and log it above</p>
                  </div>
                ) : (
                  <>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-700">
                      {activeSession.trades.length} Trade{activeSession.trades.length !== 1 ? 's' : ''}
                    </p>
                    {activeSession.trades.map(t => (
                      <TradeCard key={t.id} trade={t}
                        onResult={handleResult}
                        onDelete={deleteTrade} />
                    ))}
                  </>
                )}
              </div>

              {/* Concept breakdown (only when enough data) */}
              <ConceptBreakdown session={activeSession} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
