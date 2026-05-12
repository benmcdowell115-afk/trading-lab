import { useState, useEffect, useRef } from 'react'
import {
  FlaskConical, Package, Beaker, Network,
  LayoutTemplate, BookOpen, LineChart, StickyNote,
  Shield, ClipboardCheck, Brain, CalendarDays, Settings, LogOut,
} from 'lucide-react'
import { Builder }        from './pages/Builder'
import { MyBuilds }       from './pages/MyBuilds'
import { ConceptMap }     from './pages/ConceptMap'
import { Templates }      from './pages/Templates'
import { Chart }          from './pages/Chart'
import { Journal }        from './pages/Journal'
import { Plan }           from './pages/Plan'
import { Calendar }       from './pages/Calendar'
import { KillZoneClock }  from './components/KillZoneClock'
import { SessionNotes }   from './components/SessionNotes'
import { TradingRules }   from './components/TradingRules'
import { QuizModal }      from './components/QuizModal'
import { SettingsModal }  from './components/SettingsModal'
import { LoginScreen }    from './components/LoginScreen'
import { useBuilds }      from './hooks/useBuilds'
import { useAuth }        from './hooks/useAuth'
import { syncOnLogin }    from './lib/dataSync'
import type { Build }     from './types'

const SUPABASE_CONFIGURED = !!(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
)

type Tab = 'builder' | 'chart' | 'map' | 'plan' | 'journal' | 'calendar' | 'templates' | 'builds'

const tabs: { id: Tab; label: string; Icon: React.ElementType }[] = [
  { id: 'builder',   label: 'Builder',   Icon: Beaker         },
  { id: 'chart',     label: 'Chart',     Icon: LineChart      },
  { id: 'map',       label: 'Map',       Icon: Network        },
  { id: 'plan',      label: 'Plan',      Icon: ClipboardCheck },
  { id: 'journal',   label: 'Journal',   Icon: BookOpen       },
  { id: 'calendar',  label: 'Calendar',  Icon: CalendarDays   },
  { id: 'templates', label: 'Templates', Icon: LayoutTemplate },
  { id: 'builds',    label: 'Builds',    Icon: Package        },
]

export default function App() {
  const { user, loading: authLoading, signOut } = useAuth()
  const [synced, setSynced] = useState(false)

  // After login, sync Supabase → localStorage, then render the app
  useEffect(() => {
    if (!SUPABASE_CONFIGURED) { setSynced(true); return }
    if (authLoading) return
    if (!user) { setSynced(true); return }
    syncOnLogin(user.id).finally(() => setSynced(true))
  }, [user, authLoading])

  // Show loading spinner while auth resolves
  if (authLoading || !synced) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#05050a] gap-3">
        <div className="w-5 h-5 border-2 border-amber-500/30 border-t-amber-400 rounded-full animate-spin" />
        <span className="text-[13px] text-slate-500 font-medium">Loading…</span>
      </div>
    )
  }

  // Show login if Supabase is configured but user is not authenticated
  if (SUPABASE_CONFIGURED && !user) return <LoginScreen />

  return <AppShell signOut={SUPABASE_CONFIGURED ? signOut : undefined} userEmail={user?.email} />
}

function AppShell({ signOut, userEmail }: { signOut?: () => void; userEmail?: string }) {
  const [tab,          setTab]          = useState<Tab>('builder')
  const mainRef = useRef<HTMLElement>(null)
  const [loadedBuild,  setLoadedBuild]  = useState<Build | null>(null)
  const [notesOpen,    setNotesOpen]    = useState(false)
  const [rulesOpen,    setRulesOpen]    = useState(false)
  const [quizOpen,     setQuizOpen]     = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { loadSharedBuild }             = useBuilds()

  useEffect(() => {
    const shared = loadSharedBuild()
    if (shared) {
      setLoadedBuild(shared)
      setTab('builder')
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [])

  // Reset scroll position on every tab change
  useEffect(() => {
    const timer = setTimeout(() => {
      mainRef.current?.querySelectorAll('[class*="overflow-y"]').forEach(el => {
        (el as HTMLElement).scrollTop = 0
      })
    }, 0)
    return () => clearTimeout(timer)
  }, [tab])

  const handleLoadBuild = (build: Build) => {
    setLoadedBuild(build)
    setTab('builder')
  }

  return (
    <div className="flex flex-col h-screen bg-[#05050a] overflow-hidden">

      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="relative flex-shrink-0 bg-[#06060d] border-b border-slate-800/50">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

        {/* Top row */}
        <div className="flex items-center gap-3 md:gap-6 px-4 md:px-5 h-14 md:h-16">

          {/* Logo */}
          <div className="flex items-center gap-2.5 md:gap-3 flex-shrink-0">
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-500/10">
              <FlaskConical size={15} className="text-amber-400 md:hidden" />
              <FlaskConical size={17} className="text-amber-400 hidden md:block" />
            </div>
            <div>
              <p className="text-[13px] md:text-[15px] font-black tracking-widest text-slate-100 leading-none">TRADING LAB</p>
              <p className="hidden md:block text-[9px] font-bold text-slate-600 tracking-[0.15em] mt-0.5">ICT · SMC · FUTURES</p>
            </div>
          </div>

          {/* Kill zone clock — hidden on mobile */}
          <div className="hidden md:flex flex-1 items-center justify-center">
            <KillZoneClock />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0 ml-auto md:ml-0">
            <button
              onClick={() => setQuizOpen(true)}
              className="flex items-center gap-1.5 md:gap-2 text-[11px] md:text-[12px] font-semibold px-2.5 md:px-3 py-1.5 md:py-2 rounded-xl border border-slate-800 text-slate-500 hover:border-purple-500/40 hover:text-purple-400 hover:bg-purple-500/8 transition-all"
            >
              <Brain size={12} />
              <span className="hidden sm:inline">Quiz</span>
            </button>
            <button
              onClick={() => setRulesOpen(true)}
              className="flex items-center gap-1.5 md:gap-2 text-[11px] md:text-[12px] font-semibold px-2.5 md:px-3 py-1.5 md:py-2 rounded-xl border border-slate-800 text-slate-500 hover:border-red-500/30 hover:text-red-400 hover:bg-red-500/5 transition-all"
            >
              <Shield size={12} />
              <span className="hidden sm:inline">Rules</span>
            </button>
            <button
              onClick={() => setNotesOpen(true)}
              className="flex items-center gap-1.5 md:gap-2 text-[11px] md:text-[12px] font-semibold px-2.5 md:px-3 py-1.5 md:py-2 rounded-xl border border-slate-800 text-slate-500 hover:border-amber-500/40 hover:text-amber-400 hover:bg-amber-500/8 transition-all"
            >
              <StickyNote size={12} />
              <span className="hidden sm:inline">Notes</span>
            </button>
            <button
              onClick={() => setSettingsOpen(true)}
              className="flex items-center gap-1.5 md:gap-2 text-[11px] md:text-[12px] font-semibold px-2.5 md:px-3 py-1.5 md:py-2 rounded-xl border border-slate-800 text-slate-500 hover:border-slate-500 hover:text-slate-300 hover:bg-slate-800/40 transition-all"
            >
              <Settings size={12} />
              <span className="hidden sm:inline">Settings</span>
            </button>
            {signOut && (
              <button
                onClick={signOut}
                title={userEmail ?? 'Sign out'}
                className="flex items-center gap-1.5 md:gap-2 text-[11px] md:text-[12px] font-semibold px-2.5 md:px-3 py-1.5 md:py-2 rounded-xl border border-slate-800 text-slate-500 hover:border-red-500/30 hover:text-red-400 hover:bg-red-500/5 transition-all"
              >
                <LogOut size={12} />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile kill zone clock */}
        <div className="md:hidden px-4 pb-2">
          <KillZoneClock />
        </div>

        {/* Tab bar */}
        <nav className="flex border-t border-slate-800/40 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {tabs.map(({ id, label, Icon }) => {
            const active = tab === id
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex-shrink-0 flex-1 min-w-[64px] flex items-center justify-center gap-1.5 py-2 md:py-2.5 text-[10px] md:text-[11.5px] font-semibold relative transition-all duration-150 border-b-2 px-2
                  ${active
                    ? 'text-slate-100 border-amber-400 bg-slate-800/20'
                    : 'text-slate-600 border-transparent hover:text-slate-300 hover:bg-slate-800/10'
                  }`}
              >
                <Icon size={12} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            )
          })}
        </nav>
      </header>

      {/* ── Page content ── */}
      <main ref={mainRef} className="flex-1 flex flex-col overflow-hidden">
        {tab === 'builder'   && <Builder   initialBuild={loadedBuild} />}
        {tab === 'chart'     && <Chart />}
        {tab === 'map'       && <ConceptMap />}
        {tab === 'plan'      && <Plan />}
        {tab === 'journal'   && <Journal />}
        {tab === 'calendar'  && <Calendar />}
        {tab === 'templates' && <Templates onLoad={handleLoadBuild} />}
        {tab === 'builds'    && <MyBuilds  onLoadBuild={handleLoadBuild} />}
      </main>

      <SessionNotes  open={notesOpen}    onClose={() => setNotesOpen(false)} />
      <TradingRules  open={rulesOpen}    onClose={() => setRulesOpen(false)} />
      <QuizModal     open={quizOpen}     onClose={() => setQuizOpen(false)} />
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}
