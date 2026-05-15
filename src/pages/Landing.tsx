import { useState, useEffect } from 'react'
import { FlaskConical, ArrowRight, ExternalLink } from 'lucide-react'

const WHOP_URL = import.meta.env.VITE_WHOP_BUY_URL as string | undefined

interface Props {
  isAuthenticated?: boolean
  onSignIn?: () => void
  onLaunch?: () => void
}

// ── Decorative concept-map background ──────────────────────────────────────
const MAP_NODES = [
  { x: 600, y: 300, r: 22, label: 'Liquidity',       color: '#34d399' },
  { x: 350, y: 200, r: 18, label: 'Market Structure', color: '#34d399' },
  { x: 870, y: 240, r: 17, label: 'FVG',              color: '#34d399' },
  { x: 460, y: 390, r: 17, label: 'Order Block',      color: '#60a5fa' },
  { x: 760, y: 390, r: 16, label: 'Premium/Disc.',    color: '#60a5fa' },
  { x: 200, y: 320, r: 15, label: 'Swing H&L',        color: '#34d399' },
  { x: 310, y: 470, r: 15, label: 'Draw on Liq.',     color: '#f59e0b' },
  { x: 680, y: 480, r: 15, label: 'Displacement',     color: '#60a5fa' },
  { x: 500, y: 140, r: 15, label: 'AMD',              color: '#c084fc' },
  { x: 130, y: 180, r: 14, label: 'MTFA',             color: '#c084fc' },
  { x: 900, y: 380, r: 14, label: 'OTE',              color: '#f59e0b' },
  { x: 840, y: 120, r: 14, label: 'Kill Zones',       color: '#c084fc' },
  { x: 440, y: 540, r: 13, label: 'Inducement',       color: '#60a5fa' },
  { x: 720, y: 560, r: 13, label: 'Breaker Block',    color: '#60a5fa' },
  { x: 180, y: 460, r: 13, label: 'DOL',              color: '#f59e0b' },
  { x: 980, y: 280, r: 12, label: 'EQH / EQL',        color: '#34d399' },
  { x: 600, y: 160, r: 12, label: 'Key Opens',        color: '#c084fc' },
  { x: 290, y: 580, r: 12, label: 'PDH / PDL',        color: '#34d399' },
  { x: 820, y: 490, r: 11, label: 'Mitigation',       color: '#60a5fa' },
  { x: 100, y: 370, r: 11, label: 'NWOG',             color: '#f59e0b' },
]

const MAP_EDGES = [
  [0,1],[0,2],[0,4],[0,6],[0,7],
  [1,3],[1,5],[1,8],[1,9],
  [2,4],[2,10],[2,15],
  [3,6],[3,7],[3,12],
  [4,7],[4,10],
  [5,6],[5,14],[5,19],
  [6,14],[6,17],
  [7,12],[7,13],[7,18],
  [8,11],[8,16],[8,0],
  [9,14],[9,19],
  [10,13],[10,18],
  [11,16],[11,0],
  [12,17],[13,18],
]

function ConceptMapBg({ opacity = 0.07 }: { opacity?: number }) {
  return (
    <svg
      viewBox="0 0 1100 680"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid slice"
      style={{ opacity }}
      aria-hidden
    >
      {MAP_EDGES.map(([a, b], i) => {
        const na = MAP_NODES[a], nb = MAP_NODES[b]
        return (
          <line key={i}
            x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
            stroke="rgba(255,255,255,0.45)" strokeWidth="1"
          />
        )
      })}
      {MAP_NODES.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={n.r} fill={n.color} fillOpacity="0.3" stroke={n.color} strokeWidth="1.5" strokeOpacity="0.7" />
          <text x={n.x} y={n.y + n.r + 11} textAnchor="middle" fill="white" fontSize="9" fontFamily="system-ui" fontWeight="600" fillOpacity="0.75">
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  )
}

// ── Concept pill strip ──────────────────────────────────────────────────────
const CONCEPT_PILLS = [
  { label: 'Market Structure', color: '#34d399' },
  { label: 'Liquidity',        color: '#34d399' },
  { label: 'FVG',              color: '#34d399' },
  { label: 'Order Block',      color: '#60a5fa' },
  { label: 'AMD Cycle',        color: '#c084fc' },
  { label: 'Kill Zones',       color: '#c084fc' },
  { label: 'Displacement',     color: '#60a5fa' },
  { label: 'OTE',              color: '#f59e0b' },
  { label: 'Premium/Discount', color: '#60a5fa' },
  { label: 'Inducement',       color: '#60a5fa' },
  { label: 'Breaker Block',    color: '#60a5fa' },
  { label: 'DOL',              color: '#f59e0b' },
  { label: 'MTFA',             color: '#c084fc' },
  { label: 'EQH / EQL',        color: '#34d399' },
  { label: 'Swing H&L',        color: '#34d399' },
  { label: 'NWOG',             color: '#f59e0b' },
  { label: 'Mitigation',       color: '#60a5fa' },
  { label: 'PDH / PDL',        color: '#34d399' },
]

// ── Tool cards ──────────────────────────────────────────────────────────────
const TOOLS = [
  { emoji: '🏗️', name: 'Strategy Builder',  desc: 'Stack ICT/SMC concepts into a personal trading system. Synergies light up in real time.',  color: '#f59e0b' },
  { emoji: '📈', name: 'Live Chart',         desc: 'Full TradingView integration with a concept-specific drawing guide.',                        color: '#60a5fa' },
  { emoji: '🧠', name: 'Synergy Map',        desc: 'Interactive network of 50+ concepts. Hover any node to see how setups connect.',            color: '#c084fc' },
  { emoji: '📓', name: 'Trade Journal',      desc: 'Log trades, track win rate and points. Spot patterns in your performance over time.',       color: '#34d399' },
  { emoji: '📅', name: 'Session Planner',    desc: 'Build plans around kill zones, macros, and FOMC. Never get blindsided by news.',            color: '#fb923c' },
  { emoji: '📊', name: 'Trade Recap',        desc: 'Upload any broker CSV. Get stunning visual trade cards, montages, and video exports.',      color: '#f472b6' },
]

// ── Component ───────────────────────────────────────────────────────────────
export function Landing({ isAuthenticated, onSignIn, onLaunch }: Props) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVisible(true), 40); return () => clearTimeout(t) }, [])

  const anim = (delay: number) => ({
    className: `transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`,
    style:     { transitionDelay: `${delay}ms` },
  })

  return (
    <div className="min-h-screen bg-[#05050a] text-white overflow-x-hidden">

      {/* ── Sticky nav ───────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-slate-800/50 bg-[#05050a]/85 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500/25 to-amber-600/10 border border-amber-500/30 flex items-center justify-center">
              <FlaskConical size={13} className="text-amber-400" />
            </div>
            <span className="text-[13px] font-black tracking-widest text-white">TRADING LAB</span>
            <span className="hidden sm:block text-[10px] text-slate-700 font-bold tracking-[0.15em] uppercase ml-1">by Chronic Trading</span>
          </div>

          <div className="flex items-center gap-3">
            {WHOP_URL && !isAuthenticated && (
              <a href={WHOP_URL} target="_blank" rel="noopener noreferrer"
                className="hidden sm:block text-[12px] font-semibold text-slate-500 hover:text-slate-300 transition-colors">
                Get Access
              </a>
            )}
            {isAuthenticated ? (
              <button onClick={onLaunch}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12.5px] font-bold transition-all hover:scale-[1.02]"
                style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#0a0800' }}>
                Launch Lab <ArrowRight size={13} />
              </button>
            ) : (
              <button onClick={onSignIn}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-amber-500/30 bg-amber-500/8 text-amber-300 text-[12.5px] font-bold hover:bg-amber-500/18 hover:border-amber-400/40 transition-all">
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-14 pb-24 px-6 text-center overflow-hidden">

        {/* Concept map background */}
        <ConceptMapBg opacity={0.09} />

        {/* Radial fade overlay */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 75% 65% at 50% 50%, transparent 0%, #05050a 72%)' }} />

        {/* Amber glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 55% 55% at 50% 45%, rgba(245,158,11,0.07) 0%, transparent 70%)' }} />

        {/* Top border line */}
        <div className="absolute top-14 inset-x-0 h-px pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.3), transparent)' }} />

        <div className="relative z-10 max-w-4xl mx-auto w-full">

          {/* Badge */}
          <div {...anim(0)} className={`${anim(0).className} mb-8`} style={anim(0).style}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/6">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" style={{ boxShadow: '0 0 6px #f59e0b' }} />
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-amber-400/80">Chronic Trading</span>
            </div>
          </div>

          {/* Headline */}
          <div {...anim(80)} className={`${anim(80).className} mb-6`} style={anim(80).style}>
            <h1 className="font-black leading-[0.88] tracking-tight select-none" style={{ fontSize: 'clamp(54px, 10.5vw, 94px)', letterSpacing: '-3px' }}>
              <span className="text-white">The Professional</span><br />
              <span style={{
                background: 'linear-gradient(125deg, #fbbf24 0%, #f59e0b 35%, #fef3c7 65%, #f59e0b 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                Trading System.
              </span>
            </h1>
          </div>

          {/* Sub */}
          <div {...anim(160)} className={`${anim(160).className} mb-10`} style={anim(160).style}>
            <p className="text-slate-400 max-w-xl mx-auto leading-relaxed" style={{ fontSize: 'clamp(15px, 2vw, 18px)' }}>
              Nine precision-built tools for ICT, SMC, and futures traders.<br className="hidden sm:block" />
              Build your system. Journal your edge. Recap every week.
            </p>
          </div>

          {/* CTAs */}
          <div {...anim(240)} className={`${anim(240).className} flex flex-col sm:flex-row items-center justify-center gap-3 mb-16`} style={anim(240).style}>
            {isAuthenticated ? (
              <button onClick={onLaunch}
                className="group flex items-center gap-3 px-9 py-4 rounded-2xl font-bold text-[15px] transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#0a0800', boxShadow: '0 0 50px rgba(245,158,11,0.22), 0 4px 20px rgba(245,158,11,0.14)' }}>
                Launch Trading Lab
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <>
                <button onClick={onSignIn}
                  className="group flex items-center gap-3 px-9 py-4 rounded-2xl font-bold text-[15px] transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#0a0800', boxShadow: '0 0 50px rgba(245,158,11,0.22), 0 4px 20px rgba(245,158,11,0.14)' }}>
                  Sign In with License Key
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
                {WHOP_URL && (
                  <a href={WHOP_URL} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-7 py-4 rounded-2xl font-semibold text-[14px] border border-slate-700/60 text-slate-400 hover:border-slate-600 hover:text-white hover:bg-slate-800/30 transition-all">
                    Get Access on Whop <ExternalLink size={13} />
                  </a>
                )}
              </>
            )}
          </div>

          {/* Stats */}
          <div {...anim(320)} className={`${anim(320).className} flex items-center justify-center gap-0`} style={anim(320).style}>
            {[
              { val: '50+', sub: 'ICT Concepts' },
              { val: '9',   sub: 'Pro Tools'    },
              { val: '1',   sub: 'Platform'     },
            ].map((s, i) => (
              <div key={s.sub} className="flex items-stretch">
                {i > 0 && <div className="w-px bg-slate-800 mx-8 md:mx-12 self-stretch" />}
                <div className="text-center">
                  <p className="font-black text-white leading-none" style={{ fontSize: 'clamp(26px,5vw,38px)', fontFamily: "'JetBrains Mono',monospace" }}>{s.val}</p>
                  <p className="text-[10px] text-slate-600 uppercase tracking-[0.2em] mt-1.5">{s.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-1000 ${visible ? 'opacity-20' : 'opacity-0'}`}
          style={{ transitionDelay: '900ms' }}>
          <div className="w-px h-10 bg-gradient-to-b from-slate-500 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ── Concept pill strip ───────────────────────────────────── */}
      <div className="relative border-y border-slate-800/40 overflow-hidden py-5"
        style={{ background: 'linear-gradient(90deg, #05050a 0%, rgba(245,158,11,0.025) 50%, #05050a 100%)' }}>
        <div className="flex items-center gap-3 px-6 flex-wrap justify-center max-w-5xl mx-auto">
          {CONCEPT_PILLS.map(p => (
            <span key={p.label}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-semibold tracking-[0.08em] uppercase whitespace-nowrap"
              style={{ color: p.color, background: `${p.color}10`, border: `1px solid ${p.color}25` }}>
              <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: p.color, opacity: 0.7 }} />
              {p.label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Tools ────────────────────────────────────────────────── */}
      <section className="px-6 py-28">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-amber-500/60 mb-3">What's inside</p>
            <h2 className="font-black text-white mb-4" style={{ fontSize: 'clamp(28px,4vw,42px)', letterSpacing: '-1px' }}>
              Every tool you need. Nothing you don't.
            </h2>
            <p className="text-[14px] text-slate-500 max-w-md mx-auto">
              Nine precision-built tools in one dark, focused platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOOLS.map(t => (
              <div key={t.name}
                className="group relative rounded-2xl p-6 overflow-hidden transition-all duration-300 cursor-default hover:-translate-y-1.5"
                style={{ background: 'rgba(7,7,14,0.98)', border: `1px solid rgba(255,255,255,0.06)` }}>

                {/* Hover top glow line */}
                <div className="absolute top-0 inset-x-0 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, transparent 0%, ${t.color}80 50%, transparent 100%)` }} />

                {/* Hover fill glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${t.color}08, transparent 70%)` }} />

                <span className="text-[30px] mb-4 block">{t.emoji}</span>
                <h3 className="text-[14px] font-bold text-white mb-2">{t.name}</h3>
                <p className="text-[12.5px] text-slate-500 leading-relaxed">{t.desc}</p>

                <div className="mt-5 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: t.color, opacity: 0.6 }} />
                  <div className="h-px flex-1 max-w-[48px]" style={{ background: `linear-gradient(90deg, ${t.color}50, transparent)` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-slate-800/50" style={{ minHeight: '520px' }}>

        {/* Concept map — rendered directly at target opacity (no wrapper div) */}
        <ConceptMapBg opacity={0.13} />

        {/* Strong radial fade so edges darken, center stays readable */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 65% 70% at 50% 50%, transparent 20%, #05050a 80%)' }} />

        {/* Amber bloom from bottom */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(245,158,11,0.09) 0%, transparent 65%)' }} />

        {/* Top amber accent line */}
        <div className="absolute top-0 inset-x-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.4), transparent)' }} />

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-28 text-center flex flex-col items-center">

          <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-amber-500/70 mb-7">
            {isAuthenticated ? "You're In" : 'Get Started'}
          </p>

          <h2 className="font-black text-white mb-6 w-full"
            style={{ fontSize: 'clamp(40px, 7vw, 72px)', lineHeight: 0.92, letterSpacing: '-3px' }}>
            {isAuthenticated
              ? <>Your lab<br /><span style={{ background: 'linear-gradient(125deg,#fbbf24,#f59e0b 40%,#fde68a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>is waiting.</span></>
              : <>Trade smarter.<br /><span style={{ background: 'linear-gradient(125deg,#fbbf24,#f59e0b 40%,#fde68a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Starting now.</span></>
            }
          </h2>

          <p className="text-[15px] text-slate-400 max-w-xs mx-auto mb-12 leading-relaxed">
            {isAuthenticated
              ? 'Jump back in. Your builds, journal, and plans are ready.'
              : 'One license. Every tool. Sync across all your devices.'}
          </p>

          {isAuthenticated ? (
            <button onClick={onLaunch}
              className="inline-flex items-center gap-3 px-12 py-5 rounded-2xl font-bold text-[16px] transition-all hover:scale-[1.03] active:scale-[0.97]"
              style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#0a0800', boxShadow: '0 0 80px rgba(245,158,11,0.25), 0 8px 32px rgba(245,158,11,0.14)' }}>
              Launch Trading Lab <ArrowRight size={18} />
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <button onClick={onSignIn}
                className="flex items-center gap-3 px-10 py-4.5 rounded-2xl font-bold text-[15px] transition-all hover:scale-[1.03] active:scale-[0.97]"
                style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#0a0800', boxShadow: '0 0 60px rgba(245,158,11,0.22), 0 6px 28px rgba(245,158,11,0.12)', padding: '1rem 2.5rem' }}>
                Sign In <ArrowRight size={16} />
              </button>
              {WHOP_URL && (
                <a href={WHOP_URL} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-2xl font-semibold text-[14px] border border-slate-700/60 text-slate-400 hover:border-amber-500/35 hover:text-amber-300 hover:bg-amber-500/5 transition-all"
                  style={{ padding: '1rem 2rem' }}>
                  Get Access on Whop <ExternalLink size={13} />
                </a>
              )}
            </div>
          )}

          {/* Bottom tagline */}
          <p className="mt-14 text-[11px] text-slate-700 tracking-[0.2em] uppercase font-semibold">
            ICT · SMC · Futures · One Platform
          </p>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="border-t border-slate-800/30 px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <FlaskConical size={12} className="text-amber-500/40" />
            <span className="text-[11px] font-black tracking-widest text-slate-700 uppercase">Trading Lab</span>
          </div>
          <p className="text-[11px] text-slate-800 tracking-[0.15em] uppercase">ICT · SMC · Futures · by Chronic Trading</p>
        </div>
      </footer>
    </div>
  )
}
