import type { ColumnMap } from '../lib/csvParser'

interface Props {
  headers: string[]
  map: ColumnMap
  onChange: (map: ColumnMap) => void
  onConfirm: () => void
}

const FIELDS: { key: keyof ColumnMap; label: string; required: boolean }[] = [
  { key: 'symbol', label: 'Symbol / Ticker', required: true },
  { key: 'side', label: 'Side (Long/Short)', required: false },
  { key: 'entryPrice', label: 'Entry Price', required: false },
  { key: 'exitPrice', label: 'Exit Price', required: false },
  { key: 'pnl', label: 'P&L / Profit', required: true },
  { key: 'quantity', label: 'Quantity / Size', required: false },
  { key: 'openTime', label: 'Open / Entry Time', required: false },
  { key: 'closeTime', label: 'Close / Exit Time', required: false },
]

export function ColumnMapper({ headers, map, onChange, onConfirm }: Props) {
  const hasMinimum = !!map.symbol && !!map.pnl

  return (
    <div
      className="rounded-2xl p-8 flex flex-col gap-6 max-w-xl w-full"
      style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div>
        <h3 className="font-bold text-white text-lg mb-1">Map Your Columns</h3>
        <p className="text-sm text-white/40">
          We couldn't auto-detect all columns. Match them up below.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {FIELDS.map(({ key, label, required }) => (
          <div key={key} className="flex items-center gap-4">
            <div className="flex-1 flex items-center gap-2">
              <span className="text-sm text-white/70 font-medium min-w-[160px]">{label}</span>
              {required && <span className="text-[10px] text-rose-400 font-mono">required</span>}
            </div>
            <select
              className="flex-1 rounded-lg px-3 py-2 text-sm font-mono text-white/80 outline-none appearance-none cursor-pointer"
              style={{
                background: '#1a1a2e',
                border: `1px solid ${map[key] ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.08)'}`,
              }}
              value={map[key] || ''}
              onChange={e => onChange({ ...map, [key]: e.target.value || undefined })}
            >
              <option value="">— skip —</option>
              {headers.map(h => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <button
        onClick={onConfirm}
        disabled={!hasMinimum}
        className="mt-2 rounded-xl py-3 px-6 font-bold text-sm transition-all duration-200"
        style={{
          background: hasMinimum ? 'linear-gradient(135deg, #7c3aed, #06b6d4)' : 'rgba(255,255,255,0.05)',
          color: hasMinimum ? '#fff' : 'rgba(255,255,255,0.3)',
          cursor: hasMinimum ? 'pointer' : 'not-allowed',
          boxShadow: hasMinimum ? '0 0 20px rgba(124,58,237,0.3)' : 'none',
        }}
      >
        Generate Cards →
      </button>
    </div>
  )
}
