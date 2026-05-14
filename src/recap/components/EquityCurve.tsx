import type { Trade } from '../lib/csvParser'
import type { ThemeConfig } from '../lib/themes'

interface Props {
  trades: Trade[]
  theme: ThemeConfig
  width?: number
  height?: number
}

function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return ''
  let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i - 1], c = pts[i]
    const cpx1 = (p.x + (c.x - p.x) * 0.4).toFixed(2)
    const cpx2 = (c.x - (c.x - p.x) * 0.4).toFixed(2)
    d += ` C ${cpx1} ${p.y.toFixed(2)} ${cpx2} ${c.y.toFixed(2)} ${c.x.toFixed(2)} ${c.y.toFixed(2)}`
  }
  return d
}

export function EquityCurve({ trades, theme, width = 560, height = 110 }: Props) {
  if (trades.length < 2) return null

  const cumulative = trades.reduce<number[]>((acc, t) => {
    acc.push((acc[acc.length - 1] ?? 0) + t.pnl)
    return acc
  }, [])
  const points = [0, ...cumulative]

  const minV = Math.min(...points)
  const maxV = Math.max(...points)
  const range = maxV - minV || 1

  const pad = { top: 12, bottom: 24, left: 8, right: 8 }
  const W = width - pad.left - pad.right
  const H = height - pad.top - pad.bottom

  const pts = points.map((v, i) => ({
    x: pad.left + (i / (points.length - 1)) * W,
    y: pad.top + (1 - (v - minV) / range) * H,
  }))

  const zeroY = minV < 0 && maxV > 0
    ? pad.top + (1 - (0 - minV) / range) * H
    : null

  const linePath = smoothPath(pts)
  const areaPath = `${linePath} L ${pts[pts.length - 1].x} ${pad.top + H} L ${pts[0].x} ${pad.top + H} Z`

  const finalVal = points[points.length - 1]
  const lineColor = finalVal >= 0 ? theme.profit : theme.loss
  const areaId = `curve-area-${theme.key}`
  const lineId = `curve-line-${theme.key}`

  const fmt$ = (v: number) => {
    const s = v >= 0 ? '+' : '-'
    const a = Math.abs(v)
    return a >= 1000 ? `${s}$${(a / 1000).toFixed(1)}K` : `${s}$${a.toFixed(0)}`
  }

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} overflow="visible">
      <defs>
        <linearGradient id={areaId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lineColor} stopOpacity="0.25" />
          <stop offset="80%" stopColor={lineColor} stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id={lineId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={lineColor} stopOpacity="0.4" />
          <stop offset="100%" stopColor={lineColor} stopOpacity="1" />
        </linearGradient>
        <filter id="curve-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Zero line */}
      {zeroY !== null && (
        <line
          x1={pad.left} y1={zeroY} x2={pad.left + W} y2={zeroY}
          stroke={theme.divider} strokeWidth="1" strokeDasharray="4 4"
        />
      )}

      {/* Area fill */}
      <path d={areaPath} fill={`url(#${areaId})`} />

      {/* Main line (glow) */}
      <path d={linePath} fill="none" stroke={lineColor} strokeWidth="2.5"
        strokeLinejoin="round" strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 4px ${lineColor}80)` }}
      />

      {/* Trade dots */}
      {pts.slice(1).map((p, i) => {
        const t = trades[i]
        const dotColor = t.isWin ? theme.profit : theme.loss
        const r = Math.min(2 + Math.abs(t.pnl) / (range / 6 + 1), 5)
        return (
          <circle key={i} cx={p.x} cy={p.y} r={r}
            fill={dotColor} opacity="0.8"
            style={{ filter: `drop-shadow(0 0 3px ${dotColor}90)` }}
          />
        )
      })}

      {/* End value label */}
      <text
        x={pts[pts.length - 1].x + 6}
        y={pts[pts.length - 1].y + 4}
        fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="700"
        fill={lineColor}
      >
        {fmt$(finalVal)}
      </text>

      {/* Start label */}
      <text x={pts[0].x} y={pad.top + H + 16}
        fontSize="9" fontFamily="JetBrains Mono, monospace"
        fill={theme.textMuted} textAnchor="middle"
      >
        START
      </text>

      {/* Trade count label */}
      <text x={pts[pts.length - 1].x} y={pad.top + H + 16}
        fontSize="9" fontFamily="JetBrains Mono, monospace"
        fill={theme.textMuted} textAnchor="end"
      >
        {trades.length} TRADES
      </text>
    </svg>
  )
}
