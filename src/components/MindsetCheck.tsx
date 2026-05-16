import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Smile, Trash2 } from 'lucide-react'
import { useMindset, type MindsetEntry } from '../hooks/useMindset'

const SCORES: {
  score: MindsetEntry['score']
  label: string
  emoji: string
  color: string
  bg: string
}[] = [
  { score: 1, label: 'Revenge', emoji: '😤', color: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/30'       },
  { score: 2, label: 'Off',     emoji: '😕', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30'  },
  { score: 3, label: 'Okay',   emoji: '😐', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30'  },
  { score: 4, label: 'Sharp',  emoji: '😊', color: 'text-blue-400',   bg: 'bg-blue-500/10 border-blue-500/30'      },
  { score: 5, label: 'Locked', emoji: '🔒', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
]

interface Props {
  open: boolean
  onClose: () => void
}

export function MindsetCheck({ open, onClose }: Props) {
  const { entries, addEntry, deleteEntry } = useMindset()
  const [selected, setSelected] = useState<MindsetEntry['score'] | null>(null)
  const [note, setNote] = useState('')

  const todayStr  = new Date().toISOString().slice(0, 10)
  const todayEntry = entries.find(e => e.timestamp.startsWith(todayStr))

  const avgScore = entries.length > 0
    ? entries.reduce((s, e) => s + e.score, 0) / entries.length : 0

  const handleSave = () => {
    if (!selected) return
    addEntry(selected, note)
    setSelected(null)
    setNote('')
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-stretch justify-end bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: 440 }} animate={{ x: 0 }} exit={{ x: 440 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
            className="w-[440px] h-full bg-[#08080f] border-l border-slate-800/70 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/60">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/25 flex items-center justify-center">
                  <Smile size={14} className="text-violet-400" />
                </div>
                <div>
                  <p className="text-[15px] font-bold text-white">Mindset Check</p>
                  <p className="text-[10px] text-slate-600 mt-0.5">
                    {entries.length > 0 ? `${entries.length} check-in${entries.length !== 1 ? 's' : ''} · avg ${avgScore.toFixed(1)}/5` : 'No check-ins yet'}
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all">
                <X size={14} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">

              {/* Today's check-in — already logged */}
              {todayEntry ? (
                <div className={`rounded-2xl border px-4 py-4 ${SCORES[todayEntry.score - 1].bg}`}>
                  <p className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold mb-2">Today's Mindset</p>
                  <div className="flex items-center gap-3">
                    <span className="text-[30px] leading-none">{SCORES[todayEntry.score - 1].emoji}</span>
                    <div>
                      <p className={`text-[20px] font-black leading-none ${SCORES[todayEntry.score - 1].color}`}>
                        {SCORES[todayEntry.score - 1].label}
                      </p>
                      <p className="text-[10px] text-slate-600 mt-0.5">{todayEntry.score} / 5</p>
                    </div>
                  </div>
                  {todayEntry.note && (
                    <p className="text-[12px] text-slate-400 mt-3 leading-relaxed">{todayEntry.note}</p>
                  )}
                </div>
              ) : (
                <>
                  {/* Score picker */}
                  <div>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">How are you feeling right now?</p>
                    <div className="grid grid-cols-5 gap-2">
                      {SCORES.map(s => (
                        <button key={s.score} onClick={() => setSelected(s.score)}
                          className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all ${
                            selected === s.score ? s.bg : 'border-slate-800 bg-slate-900/30 hover:border-slate-700'
                          }`}
                        >
                          <span className="text-[22px] leading-none">{s.emoji}</span>
                          <span className={`text-[9px] font-bold uppercase tracking-wide ${selected === s.score ? s.color : 'text-slate-600'}`}>
                            {s.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Note + save */}
                  <div className="space-y-2">
                    <textarea
                      value={note} onChange={e => setNote(e.target.value)}
                      placeholder="Optional note (e.g. poor sleep, big news day, after a loss...)"
                      rows={3}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-[12.5px] text-slate-100 placeholder-slate-600 focus:outline-none focus:border-slate-500 transition-colors resize-none"
                    />
                    <button
                      onClick={handleSave} disabled={!selected}
                      className="w-full py-2.5 rounded-xl border border-violet-500/30 bg-violet-500/10 text-violet-300 text-[12px] font-semibold hover:bg-violet-500/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Log Check-In
                    </button>
                  </div>
                </>
              )}

              {/* History */}
              {entries.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2.5">History</p>
                  <div className="space-y-1.5">
                    {entries.map(e => {
                      const s = SCORES[e.score - 1]
                      const label = new Date(e.timestamp).toLocaleDateString('en-US', {
                        weekday: 'short', month: 'short', day: 'numeric',
                      })
                      return (
                        <div key={e.id} className="flex items-start gap-3 bg-slate-900/40 border border-slate-800/50 rounded-xl px-3 py-2.5">
                          <span className="text-[18px] leading-none flex-shrink-0">{s.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`text-[11px] font-bold ${s.color}`}>{s.label}</span>
                              <span className="text-[10px] text-slate-600">{label}</span>
                            </div>
                            {e.note && <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{e.note}</p>}
                          </div>
                          <button onClick={() => deleteEntry(e.id)}
                            className="w-5 h-5 flex items-center justify-center text-slate-700 hover:text-red-400 transition-colors flex-shrink-0">
                            <Trash2 size={10} />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
