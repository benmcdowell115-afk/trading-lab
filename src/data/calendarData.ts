export interface FOMCDate { date: string; label: string }

export const FOMC_2026: FOMCDate[] = [
  { date: '2026-01-28', label: 'Jan 27–28' },
  { date: '2026-03-18', label: 'Mar 17–18' },
  { date: '2026-04-29', label: 'Apr 28–29' },
  { date: '2026-06-10', label: 'Jun 9–10'  },
  { date: '2026-07-29', label: 'Jul 28–29' },
  { date: '2026-09-16', label: 'Sep 15–16' },
  { date: '2026-10-28', label: 'Oct 27–28' },
  { date: '2026-12-09', label: 'Dec 8–9'   },
]

export const WEEKLY_SCHEDULE = [
  { day: 'Monday',    events: ['ISM Manufacturing (1st Mon)', 'JOLTS (1st Mon/Tue)'] },
  { day: 'Tuesday',   events: ['CPI (mid-month)', 'Retail Sales (mid-month)', 'JOLTS (first Tue)'] },
  { day: 'Wednesday', events: ['PPI (mid-month)', 'FOMC Decision (8×/year · 2:00 PM EST)'] },
  { day: 'Thursday',  events: ['Initial Claims (every Thu · 8:30 AM EST)', 'GDP (quarterly)'] },
  { day: 'Friday',    events: ['NFP (first Fri · 8:30 AM EST)', 'ISM Services (3rd Fri)'] },
]
