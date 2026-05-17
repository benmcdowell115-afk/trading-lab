import { useState } from 'react'
import { ChevronDown, ChevronUp, ExternalLink, GraduationCap, TrendingUp, TrendingDown, CheckCircle, XCircle, MinusCircle } from 'lucide-react'
import { concepts, getConceptById } from '../data/concepts'
import { setupLibrary, getSetupsForConcept, getConceptsWithSetups, type SetupExample } from '../data/setupLibrary'

const CATEGORY_ORDER = ['structure', 'liquidity', 'entry', 'timing', 'bias', 'model'] as const

const categoryLabel: Record<string, string> = {
  structure: 'Structure',
  liquidity: 'Liquidity',
  entry:     'Entry',
  timing:    'Timing',
  bias:      'Bias',
  model:     'Model',
}

const categoryColor: Record<string, string> = {
  structure: 'text-emerald-400',
  liquidity: 'text-blue-400',
  entry:     'text-amber-400',
  timing:    'text-purple-400',
  bias:      'text-orange-400',
  model:     'text-pink-400',
}

const resultConfig = {
  worked:  { label: 'Worked',  Icon: CheckCircle,  color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/25' },
  partial: { label: 'Partial', Icon: MinusCircle,  color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/25'   },
  failed:  { label: 'Failed',  Icon: XCircle,      color: 'text-red-400',     bg: 'bg-red-500/10 border-red-500/25'       },
}

const tfColor: Record<string, string> = {
  '1m': 'text-red-400', '3m': 'text-orange-400', '5m': 'text-amber-400',
  '15m': 'text-yellow-400', '1H': 'text-blue-400', '4H': 'text-purple-400', 'D': 'text-pink-400',
}

const instrumentColor: Record<string, string> = {
  NQ: 'text-amber-300', ES: 'text-blue-300', GC: 'text-yellow-300', SI: 'text-slate-300',
}

const sessionColor: Record<string, string> = {
  Asia: 'text-purple-400', London: 'text-blue-400', 'NY AM': 'text-emerald-400', 'NY PM': 'text-orange-400',
}

// ── Setup Card ────────────────────────────────────────────────────────────────
function SetupCard({ setup }: { setup: SetupExample }) {
  const [expanded, setExpanded] = useState(false)
  const res = resultConfig[setup.result]
  const ResIcon = res.Icon

  const tvUrl = `https://www.tradingview.com/chart/?symbol=${setup.tvSymbol}&interval=${setup.tvInterval}`

  return (
    <div className="bg-[#0b0b14] border border-slate-800/60 rounded-2xl overflow-hidden transition-all duration-200 hover:border-slate-700/60">
      {/* Card header */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full text-left px-5 py-4 flex items-start gap-4"
      >
        {/* Direction icon */}
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
          setup.direction === 'long'
            ? 'bg-emerald-500/10 border border-emerald-500/25'
            : 'bg-red-500/10 border border-red-500/25'
        }`}>
          {setup.direction === 'long'
            ? <TrendingUp size={13} className="text-emerald-400" />
            : <TrendingDown size={13} className="text-red-400" />}
        </div>

        <div className="flex-1 min-w-0">
          {/* Tags row */}
          <div className="flex items-center gap-1.5 flex-wrap mb-2">
            <span className={`text-[10px] font-black uppercase tracking-wider ${instrumentColor[setup.instrument]}`}
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {setup.instrument}
            </span>
            <span className="text-slate-700 text-[9px]">·</span>
            <span className={`text-[10px] font-bold ${tfColor[setup.timeframe]}`}>{setup.timeframe}</span>
            <span className="text-slate-700 text-[9px]">·</span>
            <span className={`text-[10px] font-semibold ${sessionColor[setup.session]}`}>{setup.session}</span>
            <span className="ml-auto flex-shrink-0">
              <span className={`inline-flex items-center gap-1 text-[9.5px] font-bold px-2 py-0.5 rounded-full border ${res.bg} ${res.color}`}>
                <ResIcon size={9} />
                {setup.rrAchieved ? `${setup.rrAchieved}R` : res.label}
              </span>
            </span>
          </div>

          {/* Title */}
          <p className="text-[13px] font-bold text-white leading-snug">{setup.title}</p>

          {/* What happened — truncated */}
          {!expanded && (
            <p className="text-[11.5px] text-slate-500 mt-1.5 leading-relaxed line-clamp-2">{setup.what}</p>
          )}
        </div>

        <div className="flex-shrink-0 ml-1 text-slate-600">
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </button>

      {/* Expanded body */}
      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-slate-800/40 pt-4">
          {/* What happened */}
          <div>
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">What Happened</p>
            <p className="text-[12.5px] text-slate-300 leading-relaxed">{setup.what}</p>
          </div>

          {/* Entry / Target / Invalidation grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'Entry',        text: setup.entry,        color: 'border-blue-500/20 bg-blue-500/5',     tc: 'text-blue-300'    },
              { label: 'Target',       text: setup.target,       color: 'border-emerald-500/20 bg-emerald-500/5', tc: 'text-emerald-300' },
              { label: 'Invalidation', text: setup.invalidation, color: 'border-red-500/20 bg-red-500/5',       tc: 'text-red-300'     },
            ].map(row => (
              <div key={row.label} className={`rounded-xl border px-3 py-2.5 ${row.color}`}>
                <p className={`text-[9px] font-black uppercase tracking-wider mb-1 ${row.tc}`}>{row.label}</p>
                <p className="text-[11px] text-slate-300 leading-relaxed">{row.text}</p>
              </div>
            ))}
          </div>

          {/* Key lesson */}
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
            <p className="text-[9px] font-black uppercase tracking-wider text-amber-400 mb-1.5">Key Lesson</p>
            <p className="text-[12px] text-amber-200/80 leading-relaxed">{setup.keyLesson}</p>
          </div>

          {/* Related concepts + TV link */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            {setup.relatedConcepts.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-slate-600 font-semibold">Also involved:</span>
                {setup.relatedConcepts.map(cid => {
                  const c = getConceptById(cid)
                  return c ? (
                    <span key={cid} className="text-[10px] text-slate-500 bg-slate-800/60 border border-slate-700/40 px-2 py-0.5 rounded-lg">
                      {c.shortName}
                    </span>
                  ) : null
                })}
              </div>
            )}
            <a
              href={tvUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-xl border border-blue-500/30 bg-blue-500/8 text-blue-300 hover:bg-blue-500/18 transition-all flex-shrink-0"
            >
              Study on TradingView <ExternalLink size={10} />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main Playbook Page ────────────────────────────────────────────────────────
export function Playbook() {
  const conceptsWithSetups = getConceptsWithSetups()
  const [selectedId, setSelectedId] = useState<string>(conceptsWithSetups[0] ?? '')

  // Group concepts by category, only include those that have setups
  const grouped = CATEGORY_ORDER.map(cat => ({
    cat,
    items: concepts.filter(c => c.category === cat && conceptsWithSetups.includes(c.id)),
  })).filter(g => g.items.length > 0)

  const selected     = getConceptById(selectedId)
  const setups       = selectedId ? getSetupsForConcept(selectedId) : []
  const totalSetups  = setupLibrary.length

  return (
    <div className="flex h-full overflow-hidden bg-[#05050a]">

      {/* ── Left sidebar — concept list ──────────────────────────────── */}
      <div className="w-[220px] flex-shrink-0 border-r border-slate-800/50 flex flex-col overflow-hidden bg-[#06060d]">
        {/* Sidebar header */}
        <div className="px-4 py-4 border-b border-slate-800/40 flex-shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap size={13} className="text-amber-400" />
            <span className="text-[13px] font-bold text-white">Playbook</span>
          </div>
          <p className="text-[10px] text-slate-600">{totalSetups} curated ICT setups</p>
        </div>

        {/* Concept list */}
        <div className="flex-1 overflow-y-auto py-2">
          {grouped.map(({ cat, items }) => (
            <div key={cat}>
              <p className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] ${categoryColor[cat]}`}>
                {categoryLabel[cat]}
              </p>
              {items.map(concept => {
                const count = getSetupsForConcept(concept.id).length
                const isActive = selectedId === concept.id
                return (
                  <button
                    key={concept.id}
                    onClick={() => setSelectedId(concept.id)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-all ${
                      isActive
                        ? 'bg-slate-800/60 border-r-2 border-amber-400'
                        : 'hover:bg-slate-800/20 border-r-2 border-transparent'
                    }`}
                  >
                    <span className={`text-[11.5px] font-semibold truncate ${isActive ? 'text-white' : 'text-slate-400'}`}>
                      {concept.shortName}
                    </span>
                    <span className={`text-[10px] font-bold ml-2 flex-shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-700'}`}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* ── Right content — setup cards ──────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedId && selected ? (
          <>
            {/* Content header */}
            <div className="flex-shrink-0 px-6 py-5 border-b border-slate-800/40 bg-[#06060d]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[9px] font-black uppercase tracking-widest ${categoryColor[selected.category]}`}>
                      {categoryLabel[selected.category]}
                    </span>
                  </div>
                  <h2 className="text-[18px] font-black text-white leading-tight">{selected.name}</h2>
                  <p className="text-[12px] text-slate-500 mt-1.5 leading-relaxed max-w-xl">{selected.description}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-[28px] font-black text-slate-200 leading-none" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {setups.length}
                  </p>
                  <p className="text-[9px] text-slate-600 uppercase tracking-wider mt-0.5">setup{setups.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>

            {/* Setup cards */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {setups.length > 0 ? (
                <div className="space-y-3 max-w-3xl">
                  {setups.map(s => <SetupCard key={s.id} setup={s} />)}
                </div>
              ) : (
                <div className="flex items-center justify-center h-40">
                  <p className="text-[13px] text-slate-700">No setups yet for this concept.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <GraduationCap size={32} className="text-slate-800 mx-auto mb-3" />
              <p className="text-[14px] text-slate-600">Select a concept to see setups</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
