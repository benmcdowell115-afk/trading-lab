import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save } from 'lucide-react'
import type { Build, Instrument } from '../types'

const instruments: Instrument[] = ['NQ', 'ES', 'GC', 'SI']

interface Props {
  open: boolean
  onClose: () => void
  onSave: (build: Build) => void
  selectedIds: string[]
  existingBuild?: Build | null
}

export function SaveBuildModal({ open, onClose, onSave, selectedIds, existingBuild }: Props) {
  const [name, setName] = useState(existingBuild?.name ?? '')
  const [instrument, setInstrument] = useState<Instrument>(existingBuild?.instrument ?? 'NQ')
  const [notes, setNotes] = useState(existingBuild?.notes ?? '')

  const handleSave = () => {
    if (!name.trim()) return
    onSave({
      id: existingBuild?.id ?? crypto.randomUUID(),
      name: name.trim(),
      instrument,
      conceptIds: selectedIds,
      notes,
      createdAt: existingBuild?.createdAt ?? new Date().toISOString(),
    })
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.16 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-md bg-[#0d0d16] border border-slate-700/60 rounded-2xl p-6 space-y-5 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-slate-100">Save Build</h2>
              <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all">
                <X size={15} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[12px] font-semibold text-slate-400">Build name</label>
                <input
                  autoFocus
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSave()}
                  placeholder="e.g. NQ Morning Scalp"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-[13px] text-slate-100 placeholder-slate-600 focus:outline-none focus:border-slate-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[12px] font-semibold text-slate-400">Instrument</label>
                <div className="grid grid-cols-4 gap-2">
                  {instruments.map(inst => (
                    <button
                      key={inst}
                      onClick={() => setInstrument(inst)}
                      className={`py-2.5 rounded-xl border text-[13px] font-bold transition-all
                        ${instrument === inst
                          ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                          : 'border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'}`}
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {inst}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[12px] font-semibold text-slate-400">Notes <span className="text-slate-600 font-normal">(optional)</span></label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Rules, conditions, reminders..."
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-[13px] text-slate-100 placeholder-slate-600 focus:outline-none focus:border-slate-500 transition-colors resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2.5 pt-1">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 text-[13px] font-medium text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!name.trim()}
                className="flex-1 py-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[13px] font-semibold hover:bg-amber-500/25 hover:border-amber-500/60 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Save size={14} /> Save Build
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
