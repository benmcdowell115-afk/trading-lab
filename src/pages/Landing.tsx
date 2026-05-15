import { useState, useEffect } from 'react'
import { FlaskConical, ArrowRight, ExternalLink } from 'lucide-react'

const WHOP_URL = import.meta.env.VITE_WHOP_BUY_URL as string | undefined

interface Props {
  isAuthenticated?: boolean
  onSignIn?: () => void
  onLaunch?: () => void
}

const TOOLS = [
  { emoji: '🏗️', name: 'Strategy Builder',  desc: 'Build your ICT/SMC system by stacking concepts. See synergies light up in real time.',      color: '#f59e0b' },
  { emoji: '📈', name: 'Live Chart',         desc: 'TradingView integration with a concept-specific drawing guide built right in.',               color: '#60a5fa' },
  { emoji: '🧠', name: 'Synergy Map',        desc: 'Interactive web of 50+ concepts. Hover any node to see how your setups connect.',             color: '#c084fc' },
  { emoji: '📓', name: 'Trade Journal',      desc: 'Log trades, track win rate, points, and streaks. Spot patterns in your performance.',         color: '#34d399' },
  { emoji: '📅', name: 'Session Planner',    desc: 'Build session plans around kill zones, macros, and FOMC. Never get blindsided again.',        color: '#fb923c' },
  { emoji: '📊', name: 'Trade Recap',        desc: 'Upload any broker CSV. Get stunning visual trade cards, montages, and video exports.',        color: '#f472b6' },
]

export function Landing({ isAuthenticated, onSignIn, onLaunch }: Props) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVisible(true), 30); return () => clearTimeout(t) }, [])

  const fade = () =>
    `transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`
  const style = (delay: number) => ({ transitionDelay: `${delay}ms` })

  return (
    <div className="min-h-screen bg-[#05050a] text-white overflow-x-hidden">

      {/* ── Sticky Nav ─────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/60 bg-[#05050a]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500/25 to-amber-600/10 border border-amber-500/30 flex items-center justify-center">
              <FlaskConical size={13} className="text-amber-400" />
            </div>
            <span className="text-[13px] font-black tracking-widest text-slate-100">TRADING LAB</span>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <button
                onClick={onLaunch}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12.5px] font-bold transition-all"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#0a0800' }}
              >
                Launch Lab <ArrowRight size={13} />
              </button>
            ) : (
              <>
                {WHOP_URL && (
                  <a href={WHOP_URL} target="_blank" rel="noopener noreferrer"
                    className="text-[12px] font-semibold text-slate-500 hover:text-slate-300 transition-colors hidden sm:block">
                    Get Access
                  </a>
                )}
                <button
                  onClick={onSignIn}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-amber-500/35 bg-amber-500/10 text-amber-300 text-[12.5px] font-bold hover:bg-amber-500/20 transition-all"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center min-h-screen pt-14 pb-20 px-6 text-center overflow-hidden">

        {/* Ambient glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full opacity-[0.07]"
            style={{ background: 'radial-gradient(ellipse, #f59e0b 0%, transparent 70%)' }} />
          <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full opacity-[0.04]"
            style={{ background: 'radial-gradient(circle, #60a5fa 0%, transparent 70%)' }} />
          <div className="absolute bottom-1/3 right-1/4 w-[250px] h-[250px] rounded-full opacity-[0.04]"
            style={{ background: 'radial-gradient(circle, #c084fc 0%, transparent 70%)' }} />
        </div>

        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        {/* Top accent line */}
        <div className="absolute top-14 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.3), transparent)' }} />

        <div className="relative z-10 max-w-3xl mx-auto">

          {/* Badge */}
          <div className={`${fade()} mb-8`} style={style(0)}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/6 text-amber-400">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase">Chronic Trading</span>
            </div>
          </div>

          {/* Headline */}
          <div className={`${fade()} mb-6`} style={style(80)}>
            <h1 className="font-black leading-[0.9] tracking-[-3px] select-none" style={{ fontSize: 'clamp(58px, 12vw, 100px)' }}>
              <span className="text-white">The Pro</span>
              <br />
              <span style={{
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 40%, #fde68a 70%, #f59e0b 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                Trading Lab.
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <div className={`${fade()} mb-10`} style={style(160)}>
            <p className="text-slate-400 max-w-lg mx-auto leading-relaxed" style={{ fontSize: 'clamp(15px, 2vw, 18px)' }}>
              The all-in-one professional toolkit for ICT, SMC, and futures traders.
              Build your system. Journal your trades. Master your edge.
            </p>
          </div>

          {/* CTA buttons */}
          <div className={`${fade()} flex flex-col sm:flex-row items-center justify-center gap-3 mb-14`} style={style(240)}>
            {isAuthenticated ? (
              <button
                onClick={onLaunch}
                className="group flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-[15px] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#0a0800', boxShadow: '0 0 60px rgba(245,158,11,0.2), 0 4px 24px rgba(245,158,11,0.12)' }}
              >
                Launch Trading Lab
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <>
                <button
                  onClick={onSignIn}
                  className="group flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-[15px] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#0a0800', boxShadow: '0 0 60px rgba(245,158,11,0.2), 0 4px 24px rgba(245,158,11,0.12)' }}
                >
                  Sign In with License Key
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
                {WHOP_URL && (
                  <a href={WHOP_URL} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-7 py-4 rounded-2xl font-semibold text-[14px] border border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200 hover:bg-slate-800/40 transition-all">
                    Get Access on Whop <ExternalLink size={13} />
                  </a>
                )}
              </>
            )}
          </div>

          {/* Stats strip */}
          <div className={`${fade()} flex items-center justify-center gap-8 md:gap-12`} style={style(320)}>
            {[
              { val: '50+', label: 'ICT Concepts' },
              { val: '9',   label: 'Pro Tools'    },
              { val: '1',   label: 'Platform'     },
            ].map((s, i) => (
              <div key={s.label} className="flex items-center gap-8 md:gap-12">
                {i > 0 && <div className="w-px h-8 bg-slate-800" />}
                <div className="text-center">
                  <p className="text-[28px] md:text-[32px] font-black text-white leading-none" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{s.val}</p>
                  <p className="text-[10px] text-slate-600 uppercase tracking-[0.2em] mt-1">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 ${visible ? 'opacity-25' : 'opacity-0'} transition-opacity duration-1000`}
          style={{ transitionDelay: '800ms' }}>
          <span className="text-[9px] text-slate-600 uppercase tracking-[0.25em]">Explore</span>
          <div className="w-px h-8 bg-gradient-to-b from-slate-600 to-transparent" />
        </div>
      </section>

      {/* ── Tools Grid ─────────────────────────────────────────── */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-14">
            <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-amber-500/70 mb-3">What's Inside</p>
            <h2 className="font-black text-white tracking-tight mb-3" style={{ fontSize: 'clamp(28px, 4vw, 42px)' }}>
              Every tool you need.
            </h2>
            <p className="text-[14px] text-slate-500 max-w-sm mx-auto">
              Nine precision-built tools in one unified platform. No subscriptions. No bloat.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOOLS.map((t) => (
              <div key={t.name}
                className="group relative rounded-2xl p-6 border border-slate-800/60 overflow-hidden transition-all duration-300 hover:border-slate-700/60 hover:-translate-y-1 hover:shadow-2xl"
                style={{ background: 'rgba(8,8,16,0.9)' }}>

                {/* Top color bar */}
                <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, transparent, ${t.color}, transparent)` }} />

                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 20% 20%, ${t.color}10 0%, transparent 60%)` }} />

                <span className="text-[30px] mb-4 block">{t.emoji}</span>
                <h3 className="text-[14px] font-bold text-white mb-2">{t.name}</h3>
                <p className="text-[12px] text-slate-500 leading-relaxed">{t.desc}</p>

                <div className="mt-5 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: t.color }} />
                  <span className="w-8 h-px" style={{ background: `${t.color}40` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ─────────────────────────────────────────── */}
      <section className="px-6 pb-24">
        <div className="max-w-2xl mx-auto">
          <div className="relative rounded-3xl border border-slate-800/60 overflow-hidden text-center px-8 py-14 md:px-16 md:py-16"
            style={{ background: 'rgba(8,8,16,0.95)' }}>

            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.08) 0%, transparent 60%)' }} />
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.4), transparent)' }} />

            <div className="relative">
              <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-amber-500/60 mb-4">
                {isAuthenticated ? 'Welcome Back' : 'Ready to Level Up?'}
              </p>
              <h2 className="font-black text-white mb-3" style={{ fontSize: 'clamp(24px, 3vw, 32px)' }}>
                {isAuthenticated ? 'Your lab is waiting.' : 'Start trading smarter today.'}
              </h2>
              <p className="text-[13px] text-slate-500 mb-8 max-w-sm mx-auto">
                {isAuthenticated
                  ? 'Jump back into your builds, journal, and session plans.'
                  : 'Get your Whop license key and access all 9 tools instantly.'}
              </p>

              {isAuthenticated ? (
                <button
                  onClick={onLaunch}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-[15px] transition-all hover:scale-[1.02]"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#0a0800' }}
                >
                  Launch Trading Lab <ArrowRight size={16} />
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={onSignIn}
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-[15px] transition-all hover:scale-[1.02]"
                    style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#0a0800' }}
                  >
                    Sign In <ArrowRight size={15} />
                  </button>
                  {WHOP_URL && (
                    <a href={WHOP_URL} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl font-semibold text-[14px] border border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white transition-all">
                      Get Access <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="border-t border-slate-800/40 px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FlaskConical size={13} className="text-amber-500/60" />
            <span className="text-[11px] font-bold tracking-widest text-slate-700 uppercase">Chronic Trading Lab</span>
          </div>
          <p className="text-[11px] text-slate-700">ICT · SMC · Futures</p>
        </div>
      </footer>
    </div>
  )
}
