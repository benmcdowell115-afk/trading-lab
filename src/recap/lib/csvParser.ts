import Papa from 'papaparse'

export interface Trade {
  id: string
  symbol: string
  side: 'long' | 'short' | 'unknown'
  entryPrice: number
  exitPrice: number
  pnl: number
  pnlPercent: number
  movePct: number
  quantity: number
  openDate: string
  openTimeOfDay: string
  closeDate: string
  closeTimeOfDay: string
  dayOfWeek: string
  duration: string
  isWin: boolean
  fees: number
}

export interface ColumnMap {
  symbol?: string
  side?: string
  entryPrice?: string
  exitPrice?: string
  pnl?: string
  quantity?: string
  openTime?: string
  closeTime?: string
  fees?: string
}

const SYMBOL_KEYS = ['symbol', 'ticker', 'instrument', 'market', 'asset', 'pair', 'contract', 'security']
const SIDE_KEYS = ['side', 'direction', 'type', 'action', 'trade type', 'position', 'buy/sell', 'b/s', 'long/short']
const ENTRY_KEYS = ['entry', 'entry price', 'open price', 'avg entry', 'avg open', 'entry_price', 'openprice', 'avg_entry', 'buyprice', 'buy price']
const EXIT_KEYS = ['exit', 'exit price', 'close price', 'avg exit', 'avg close', 'exit_price', 'closeprice', 'avg_exit', 'sellprice', 'sell price']
const PNL_KEYS = ['pnl', 'p&l', 'profit', 'profit/loss', 'profit & loss', 'net profit', 'net p&l', 'realized pnl', 'realized p&l', 'gain/loss', 'return', 'net', 'profit loss']
const QTY_KEYS = ['qty', 'quantity', 'size', 'volume', 'shares', 'contracts', 'units', 'lots', 'position size']
const FEE_KEYS = ['fees', 'commission', 'commissions', 'fee', 'charges', 'brokerage', 'cost']
const OPEN_TIME_KEYS = ['open time', 'entry time', 'open date', 'entry date', 'date open', 'trade date', 'opentime', 'entrytime', 'opendate', 'entrydate', 'date/time open', 'open_time', 'entry_time']
const CLOSE_TIME_KEYS = ['close time', 'exit time', 'close date', 'exit date', 'date close', 'closetime', 'exittime', 'closedate', 'exitdate', 'date/time close', 'close_time', 'exit_time', 'date']

function matchKey(headers: string[], candidates: string[]): string | undefined {
  const lowerHeaders = headers.map(h => h.toLowerCase().trim())
  for (const candidate of candidates) {
    const idx = lowerHeaders.findIndex(h => h === candidate || h.includes(candidate) || candidate.includes(h))
    if (idx !== -1) return headers[idx]
  }
  return undefined
}

export function detectColumns(headers: string[]): ColumnMap {
  return {
    symbol: matchKey(headers, SYMBOL_KEYS),
    side: matchKey(headers, SIDE_KEYS),
    entryPrice: matchKey(headers, ENTRY_KEYS),
    exitPrice: matchKey(headers, EXIT_KEYS),
    pnl: matchKey(headers, PNL_KEYS),
    quantity: matchKey(headers, QTY_KEYS),
    openTime: matchKey(headers, OPEN_TIME_KEYS),
    closeTime: matchKey(headers, CLOSE_TIME_KEYS),
    fees: matchKey(headers, FEE_KEYS),
  }
}

function parseNum(val: unknown): number {
  if (val === null || val === undefined || val === '') return 0
  const str = String(val).replace(/[$,%\s]/g, '').replace(/\(([^)]+)\)/, '-$1')
  return parseFloat(str) || 0
}

function parseSide(val: unknown): 'long' | 'short' | 'unknown' {
  const s = String(val || '').toLowerCase().trim()
  if (['long', 'buy', 'b', 'l', 'bought'].some(k => s.includes(k))) return 'long'
  if (['short', 'sell', 's', 'sold'].some(k => s.includes(k))) return 'short'
  return 'unknown'
}

function calcDuration(open: string, close: string): string {
  try {
    const o = new Date(open).getTime()
    const c = new Date(close).getTime()
    if (isNaN(o) || isNaN(c)) return '—'
    const diff = Math.abs(c - o)
    const mins = Math.floor(diff / 60000)
    const hrs = Math.floor(mins / 60)
    const days = Math.floor(hrs / 24)
    if (days > 0) return `${days}d ${hrs % 24}h`
    if (hrs > 0) return `${hrs}h ${mins % 60}m`
    if (mins > 0) return `${mins}m`
    return `<1m`
  } catch {
    return '—'
  }
}

function parseDateTime(val: unknown): { date: string; time: string; dow: string; raw: string } {
  if (!val || String(val).trim() === '') return { date: '—', time: '—', dow: '—', raw: '' }
  const raw = String(val)
  const d = new Date(raw)
  if (isNaN(d.getTime())) return { date: raw, time: '—', dow: '—', raw }
  return {
    date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    time: d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    dow: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
    raw,
  }
}

export function parseCSV(file: File): Promise<{ headers: string[]; rows: Record<string, string>[] }> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve({ headers: results.meta.fields || [], rows: results.data as Record<string, string>[] })
      },
      error: reject,
    })
  })
}

export function buildTrades(rows: Record<string, string>[], map: ColumnMap): Trade[] {
  return rows
    .map((row, i) => {
      const symbol = (map.symbol ? String(row[map.symbol] || '').trim().toUpperCase() : '') || `T${i + 1}`
      const side = map.side ? parseSide(row[map.side]) : 'unknown'
      const entryPrice = map.entryPrice ? parseNum(row[map.entryPrice]) : 0
      const exitPrice = map.exitPrice ? parseNum(row[map.exitPrice]) : 0
      const pnl = map.pnl ? parseNum(row[map.pnl]) : (exitPrice - entryPrice) * (side === 'short' ? -1 : 1)
      const quantity = map.quantity ? Math.abs(parseNum(row[map.quantity])) || 1 : 1
      const fees = map.fees ? Math.abs(parseNum(row[map.fees])) : 0

      const openDt = parseDateTime(map.openTime ? row[map.openTime] : null)
      const closeDt = parseDateTime(map.closeTime ? row[map.closeTime] : null)
      const duration = calcDuration(openDt.raw, closeDt.raw)

      const pnlPercent = entryPrice > 0 ? (pnl / (entryPrice * quantity)) * 100 : 0
      const movePct = entryPrice > 0 ? ((exitPrice - entryPrice) / entryPrice) * 100 : 0

      return {
        id: `trade-${i}`,
        symbol,
        side,
        entryPrice,
        exitPrice,
        pnl,
        pnlPercent,
        movePct,
        quantity,
        openDate: openDt.date,
        openTimeOfDay: openDt.time,
        closeDate: closeDt.date,
        closeTimeOfDay: closeDt.time,
        dayOfWeek: openDt.dow,
        duration,
        isWin: pnl >= 0,
        fees,
      }
    })
    .filter(t => t.symbol)
}

export function combineTrades(trades: Trade[]): Trade {
  const totalPnl = trades.reduce((s, t) => s + t.pnl, 0)
  const totalQty = trades.reduce((s, t) => s + t.quantity, 0)
  const symbols = [...new Set(trades.map(t => t.symbol))]
  const sides = [...new Set(trades.map(t => t.side))]
  const totalFees = trades.reduce((s, t) => s + t.fees, 0)

  const avgEntry = totalQty > 0
    ? trades.reduce((s, t) => s + t.entryPrice * t.quantity, 0) / totalQty : 0
  const avgExit = totalQty > 0
    ? trades.reduce((s, t) => s + t.exitPrice * t.quantity, 0) / totalQty : 0

  const first = trades[0]
  const last = trades[trades.length - 1]

  return {
    id: `combined-${Date.now()}`,
    symbol: symbols.length === 1 ? symbols[0] : symbols.slice(0, 3).join('+'),
    side: sides.length === 1 ? sides[0] : 'unknown',
    entryPrice: avgEntry,
    exitPrice: avgExit,
    pnl: totalPnl,
    pnlPercent: avgEntry > 0 ? (totalPnl / (avgEntry * totalQty)) * 100 : 0,
    movePct: avgEntry > 0 ? ((avgExit - avgEntry) / avgEntry) * 100 : 0,
    quantity: totalQty,
    openDate: first.openDate,
    openTimeOfDay: first.openTimeOfDay,
    closeDate: last.closeDate,
    closeTimeOfDay: last.closeTimeOfDay,
    dayOfWeek: first.dayOfWeek,
    duration: `${trades.length} trades`,
    isWin: totalPnl >= 0,
    fees: totalFees,
  }
}

export function calcStats(trades: Trade[]) {
  const wins = trades.filter(t => t.isWin)
  const losses = trades.filter(t => !t.isWin)
  const totalPnl = trades.reduce((s, t) => s + t.pnl, 0)
  const winRate = trades.length > 0 ? (wins.length / trades.length) * 100 : 0
  const avgWin = wins.length > 0 ? wins.reduce((s, t) => s + t.pnl, 0) / wins.length : 0
  const avgLoss = losses.length > 0 ? losses.reduce((s, t) => s + t.pnl, 0) / losses.length : 0
  const bestTrade = trades.reduce((best, t) => (t.pnl > (best?.pnl ?? -Infinity) ? t : best), trades[0])
  const worstTrade = trades.reduce((worst, t) => (t.pnl < (worst?.pnl ?? Infinity) ? t : worst), trades[0])
  const profitFactor = Math.abs(avgLoss) > 0 ? Math.abs(avgWin / avgLoss) : avgWin > 0 ? Infinity : 0

  return { totalPnl, winRate, avgWin, avgLoss, bestTrade, worstTrade, profitFactor, wins: wins.length, losses: losses.length }
}
