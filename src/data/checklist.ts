export type ChecklistPhase =
  | 'pre-session'
  | 'draw'
  | 'structure'
  | 'timing'
  | 'setup'
  | 'entry'
  | 'model'

export interface ChecklistItem {
  id: string
  text: string
  phase: ChecklistPhase
}

export const phaseLabels: Record<ChecklistPhase, string> = {
  'pre-session': 'Pre-Session',
  'draw':        'Draw on Liquidity',
  'structure':   'Market Structure',
  'timing':      'Timing',
  'setup':       'Setup Identification',
  'entry':       'Entry Refinement',
  'model':       'Model Confirmation',
}

// Items indexed by concept ID — only appear when that concept is in the build
const conceptItems: Record<string, ChecklistItem[]> = {
  'daily-bias': [
    { id: 'db-1', phase: 'pre-session', text: 'Review 4H and Daily chart — what is the dominant structure direction?' },
    { id: 'db-2', phase: 'pre-session', text: 'Where did price close relative to the previous day\'s range?' },
    { id: 'db-3', phase: 'pre-session', text: 'Did overnight action confirm or challenge your bias?' },
    { id: 'db-4', phase: 'pre-session', text: 'State your bias clearly: Bullish or Bearish. No maybes.' },
  ],
  'ipda': [
    { id: 'ipda-1', phase: 'pre-session', text: 'Mark the 20, 40, and 60-day lookback highs and lows on the daily chart' },
    { id: 'ipda-2', phase: 'draw',        text: 'Identify the nearest untouched IPDA level in the direction of bias — this is your draw on liquidity' },
    { id: 'ipda-3', phase: 'draw',        text: 'Confirm all intraday entries are in service of delivering to that IPDA level' },
  ],
  'quarterly-theory': [
    { id: 'qt-1', phase: 'pre-session', text: 'What quarterly phase is the weekly chart in? (Q1 accumulation / Q2 manipulation / Q3 distribution / Q4 rebalance)' },
    { id: 'qt-2', phase: 'pre-session', text: 'What quarterly phase is the daily chart in?' },
    { id: 'qt-3', phase: 'pre-session', text: 'Do the weekly and daily phases agree on a direction?' },
  ],
  'opening-gaps': [
    { id: 'og-1', phase: 'pre-session', text: 'Mark the previous day\'s 4 PM close — is there an NDOG to fill?' },
    { id: 'og-2', phase: 'pre-session', text: 'If Monday, mark Friday\'s close — is there an NWOG?' },
    { id: 'og-3', phase: 'draw',        text: 'Factor the gap fill into your draw on liquidity — it may be the first target of the session' },
  ],
  'data-highs-lows': [
    { id: 'dhl-1', phase: 'pre-session', text: 'Check the economic calendar — any high-impact releases today? (NFP, CPI, FOMC)' },
    { id: 'dhl-2', phase: 'pre-session', text: 'Mark highs and lows from the most recent data event candles as liquidity levels' },
    { id: 'dhl-3', phase: 'timing',      text: 'Do NOT enter within 2 minutes of a scheduled news release' },
  ],
  'liquidity': [
    { id: 'liq-1', phase: 'draw', text: 'Mark all Buy-Side Liquidity (BSL) — resting above swing highs and equal highs' },
    { id: 'liq-2', phase: 'draw', text: 'Mark all Sell-Side Liquidity (SSL) — resting below swing lows and equal lows' },
    { id: 'liq-3', phase: 'draw', text: 'Which pool was most recently swept? Which is the current draw?' },
  ],
  'equal-highs-lows': [
    { id: 'eql-1', phase: 'draw', text: 'Scan the prior session for equal highs (EQH) — mark these as BSL targets' },
    { id: 'eql-2', phase: 'draw', text: 'Scan for equal lows (EQL) — mark these as SSL targets' },
    { id: 'eql-3', phase: 'draw', text: 'The nearest EQH or EQL in your bias direction is likely the first draw of the session' },
  ],
  'engineered-liquidity': [
    { id: 'el-1', phase: 'draw',  text: 'Identify any consolidation zones — these are not random, they are liquidity being engineered' },
    { id: 'el-2', phase: 'setup', text: 'Where are stop orders accumulating above and below the range?' },
    { id: 'el-3', phase: 'setup', text: 'Wait for the sweep of one side of the range before entering in the opposite direction' },
  ],
  'market-structure': [
    { id: 'ms-1', phase: 'structure', text: 'Mark the most recent swing high and swing low on your trading timeframe' },
    { id: 'ms-2', phase: 'structure', text: 'Was the last significant move a BOS (continuation) or CHoCH (reversal)?' },
    { id: 'ms-3', phase: 'structure', text: 'Does internal (lower TF) structure agree with the higher timeframe bias?' },
  ],
  'premium-discount': [
    { id: 'pd-1', phase: 'structure', text: 'Identify the current dealing range — mark the swing high and swing low' },
    { id: 'pd-2', phase: 'structure', text: 'Mark the 50% equilibrium level' },
    { id: 'pd-3', phase: 'entry',     text: 'Bullish bias: only enter from discount (below EQ). Bearish bias: only enter from premium (above EQ)' },
  ],
  'kill-zones': [
    { id: 'kz-1', phase: 'timing', text: 'What kill zone are you in? London (2–5 AM) / NY AM (8:30–11 AM) / NY PM (1:30–4 PM)' },
    { id: 'kz-2', phase: 'timing', text: 'Avoid entries in the final 15 minutes of a kill zone window' },
    { id: 'kz-3', phase: 'timing', text: 'Outside kill zones: wait. Price outside these windows is typically algorithm noise' },
  ],
  'key-opens': [
    { id: 'ko-1', phase: 'timing', text: 'Mark today\'s Midnight Open (00:00 EST) as a key reference level' },
    { id: 'ko-2', phase: 'timing', text: 'Mark the NY Open price (9:30 AM EST)' },
    { id: 'ko-3', phase: 'timing', text: 'Is price above or below the Midnight Open? This defines premium/discount for the day' },
  ],
  'ict-macros': [
    { id: 'mac-1', phase: 'timing', text: 'Is a macro window approaching? Key times: 2:33, 4:03, 8:50, 9:50, 10:50, 11:50 AM, 1:10, 3:15 PM EST' },
    { id: 'mac-2', phase: 'timing', text: 'Identify the nearest FVG or liquidity level — the macro will likely deliver there' },
    { id: 'mac-3', phase: 'timing', text: 'Wait for confirmation at the start of the window, not in anticipation of it' },
  ],
  'silver-bullet': [
    { id: 'sb-1', phase: 'timing', text: 'Are you within a Silver Bullet window? 3–4 AM / 10–11 AM / 2–3 PM EST' },
    { id: 'sb-2', phase: 'setup',  text: 'Has price created a displacement with a clear FVG within this window?' },
    { id: 'sb-3', phase: 'entry',  text: 'One trade per window — wait for the clean FVG retest, do not force it' },
  ],
  'amd': [
    { id: 'amd-1', phase: 'setup', text: 'Which AMD phase is price in right now? Accumulation / Manipulation / Distribution?' },
    { id: 'amd-2', phase: 'setup', text: 'Has the manipulation (Judas) phase completed — liquidity swept on the wrong side?' },
    { id: 'amd-3', phase: 'setup', text: 'Only enter during the distribution phase — not during accumulation or manipulation' },
  ],
  'judas-swing': [
    { id: 'js-1', phase: 'setup', text: 'Has a Judas Swing run against your daily bias at the session open?' },
    { id: 'js-2', phase: 'setup', text: 'Which liquidity was swept — SSL (bullish day) or BSL (bearish day)?' },
    { id: 'js-3', phase: 'setup', text: 'Wait for a low-TF CHoCH after the Judas to confirm the real direction before entering' },
  ],
  'displacement': [
    { id: 'disp-1', phase: 'setup', text: 'Was there a clear displacement move — large candles, minimal overlap, decisive direction?' },
    { id: 'disp-2', phase: 'setup', text: 'Did displacement create a valid FVG (gap between candle 1 wick and candle 3 wick)?' },
    { id: 'disp-3', phase: 'setup', text: 'No displacement = no valid OB, no reliable FVG. Do not enter without it.' },
  ],
  'inducement': [
    { id: 'idm-1', phase: 'setup', text: 'Has inducement been built — a smaller swing that will trap early retail entries?' },
    { id: 'idm-2', phase: 'setup', text: 'Has the inducement level been swept, or are you still waiting for that sweep?' },
    { id: 'idm-3', phase: 'entry', text: 'Only enter after inducement has been taken — not before' },
  ],
  'order-block': [
    { id: 'ob-1', phase: 'entry', text: 'Identify the last opposing candle before the most recent displacement move' },
    { id: 'ob-2', phase: 'entry', text: 'Is price returning to this zone from the correct side (above for bull OB, below for bear OB)?' },
    { id: 'ob-3', phase: 'entry', text: 'Is the OB in the correct premium/discount zone for your bias direction?' },
  ],
  'fvg': [
    { id: 'fvg-1', phase: 'entry', text: 'Identify open FVGs on 5m and 15m in the direction of bias — created by displacement' },
    { id: 'fvg-2', phase: 'entry', text: 'Is the FVG in premium (for sells) or discount (for buys)?' },
    { id: 'fvg-3', phase: 'entry', text: 'First or second revisit to the FVG is the cleanest. Third visits are lower probability.' },
  ],
  'rejection-block': [
    { id: 'rb-1', phase: 'entry', text: 'Identify any candle with a wick 2–3x the body size at your key PD array' },
    { id: 'rb-2', phase: 'entry', text: 'The body of the candle is your entry zone — enter on retest of the body' },
    { id: 'rb-3', phase: 'entry', text: 'Look for an FVG or OB within the rejection block body for precision entry' },
  ],
  'breaker-block': [
    { id: 'bb-1', phase: 'entry', text: 'Identify any prior OBs that price has already broken through' },
    { id: 'bb-2', phase: 'entry', text: 'Is price returning to this zone from the opposite side? That\'s your Breaker Block' },
    { id: 'bb-3', phase: 'entry', text: 'Confirm structure has shifted before treating a breaker as an entry zone' },
  ],
  'mitigation-block': [
    { id: 'mb-1', phase: 'entry', text: 'After an initial impulse, mark any consolidation clusters within the move' },
    { id: 'mb-2', phase: 'entry', text: 'Is price pulling back into this zone for a continuation entry?' },
    { id: 'mb-3', phase: 'entry', text: 'Best used in clear trending conditions — not in ranging/choppy markets' },
  ],
  'ote': [
    { id: 'ote-1', phase: 'entry', text: 'Swing Fibonacci from the origin of the move to its endpoint' },
    { id: 'ote-2', phase: 'entry', text: 'Is price retracing into the 0.62–0.79 zone (OTE)? The 0.705 level is the sweet spot' },
    { id: 'ote-3', phase: 'entry', text: 'Combine with an OB or FVG within the OTE zone for the highest precision entry' },
  ],
  'fibonacci': [
    { id: 'fib-1', phase: 'entry', text: 'Swing fib from the relevant swing low to high (for sells) or high to low (for buys)' },
    { id: 'fib-2', phase: 'entry', text: 'Mark -0.27, -0.62, and -1.0 extension levels as your take-profit targets' },
    { id: 'fib-3', phase: 'entry', text: 'Does the -0.62 or -1.0 target align with a liquidity pool or EQH/EQL? That confirms the draw.' },
  ],
  'market-maker-buy': [
    { id: 'mmb-1', phase: 'model', text: 'Phase 1: Has price accumulated (ranged) below a key swing high?' },
    { id: 'mmb-2', phase: 'model', text: 'Phase 2: Did Judas sweep SSL (taking out lows, manipulation downward)?' },
    { id: 'mmb-3', phase: 'model', text: 'Phase 3: Has CHoCH formed — confirming the reversal to the upside?' },
    { id: 'mmb-4', phase: 'model', text: 'Phase 4: Has there been displacement through a key swing high, creating FVGs?' },
    { id: 'mmb-5', phase: 'model', text: 'Phase 5: Is price now retracing into the OTE zone for your entry?' },
  ],
  'market-maker-sell': [
    { id: 'mms-1', phase: 'model', text: 'Phase 1: Has price distributed (ranged) above a key swing low?' },
    { id: 'mms-2', phase: 'model', text: 'Phase 2: Did Judas sweep BSL (taking out highs, manipulation upward)?' },
    { id: 'mms-3', phase: 'model', text: 'Phase 3: Has CHoCH formed — confirming the reversal to the downside?' },
    { id: 'mms-4', phase: 'model', text: 'Phase 4: Has there been displacement through a key swing low, creating FVGs?' },
    { id: 'mms-5', phase: 'model', text: 'Phase 5: Is price now retracing into OTE (in premium) for your entry?' },
  ],
}

const phaseOrder: ChecklistPhase[] = ['pre-session', 'draw', 'structure', 'timing', 'setup', 'entry', 'model']

export function generateChecklist(conceptIds: string[]): Map<ChecklistPhase, ChecklistItem[]> {
  const result = new Map<ChecklistPhase, ChecklistItem[]>()

  for (const phase of phaseOrder) {
    result.set(phase, [])
  }

  for (const id of conceptIds) {
    const items = conceptItems[id] ?? []
    for (const item of items) {
      result.get(item.phase)!.push(item)
    }
  }

  // Remove empty phases
  for (const phase of phaseOrder) {
    if (result.get(phase)!.length === 0) result.delete(phase)
  }

  return result
}
