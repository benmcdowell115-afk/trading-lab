export type Tier = 'basic' | 'intermediate' | 'advanced'
export type Instrument =
  | 'NQ' | 'ES' | 'GC' | 'SI'                        // futures (kept for existing data)
  | 'EURUSD' | 'GBPUSD' | 'USDJPY' | 'GBPJPY'        // major forex pairs
  | 'AUDUSD' | 'NZDUSD' | 'USDCAD' | 'USDCHF'        // additional forex
export type Category = 'structure' | 'liquidity' | 'entry' | 'timing' | 'bias' | 'model'

export interface Synergy {
  conceptId: string
  strength: 1 | 2 | 3  // 1=decent, 2=strong, 3=essential
  note: string
}

export interface Concept {
  id: string
  name: string
  shortName: string
  tier: Tier
  category: Category
  description: string
  howToUse: string
  instruments: Instrument[]
  synergies: Synergy[]
  tags: string[]
}

export interface Build {
  id: string
  name: string
  instrument: Instrument
  conceptIds: string[]
  notes: string
  createdAt: string
}
