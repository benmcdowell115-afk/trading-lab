import { useState, useEffect } from 'react'
import { FlaskConical } from 'lucide-react'

interface Props {
  onLaunch?: () => void
  onSignIn?: () => void
}

const FEATURES = [
  {
    emoji: '🏗️',
    name: 'Strategy Builder',
    desc: 'Drag and drop ICT/SMC concepts into a personal trading system. See synergies light up in real time.',
    tag: 'Core Tool',
    color: '#f59e0b',
  },
  {
    emoji: '📈',
    name: 'Live Chart',
    desc: 'Full TradingView integration with a concept-specific step-by-step drawing guide built right in.',
    tag: 'TradingView',
    color: '#60a5fa',
  },
  {
    emoji: '🧠',
    name: 'Synergy Map',
    desc: 'An interactive web of 50+ trading concepts. Hover any node to explore how your setups connect.',
    tag: '50+ Concepts',
    color: '#c084fc',
  },
  {
    emoji: '📓',
    name: 'Trade Journal',
    desc: 'Log every trade, track win rate, points, and streaks. Spot patterns in your performance over time.',
    tag: 'Analytics',
    color: '#34d399',
  },
  {
    emoji: '📅',
    name: 'Session Planner',
    desc: 'Build session plans around kill zones, macros, and FOMC. Never get blindsided by a news event again.',
    tag: 'Scheduling',
    color: '#fb923c',
  },
  {
    emoji: '📊',
    name: 'Trade Recap',
    desc: 'Upload a CSV from any broker. Get stunning visual trade cards, montages, and video exports instantly.',
    tag: 'Any Broker',
    color: '#f472b6',
  },
]

const STATS = [
  { val: '9',   label: 'Tools'    },
  { val: '50+', label: 'Concepts' },
  { val: '10',  label: 'Themes'   },
]

export function Landing({ onLaunch, onSignIn }: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { const t = setTimeout(() => setMounted(true), 40); return () => clearTimeout(t) }, [])

  return (
    <div className="min-h-screen bg-[#05050a] overflow-y-auto overflow-x-hidden">

      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-16 pb-24 text-center overflow-hidden">

        {/* Floating orbs */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="landing-orb-amber" />
          <div className="landing-orb-blue" />
          <div className="landing-orb-purple" />
        </div>

        {/* Subtle dot grid */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }} />

        {/* Top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.4), transparent)' }} />

        {/* Badge */}
        <div className={`relative z-10 transition-all duration-600 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
          style={{ transitionDelay: '0ms' }}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/25 bg-amber-500/8 mb-10">
            <FlaskConical size={12} className="text-amber-400" />
            <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-amber-300">Chronic Trading Lab</span>
          </div>
        </div>

        {/* Main heading */}
        <div className={`relative z-10 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
          style={{ transitionDelay: '80ms' }}>
          <h1 className="font-black leading-none tracking-[-3px] mb-5 select-none"
            style={{ fontSize: 'clamp(52px, 11vw, 96px)' }}>
            <span className="text-white">Trade</span>
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #f59e0b 10%, #fde68a 50%, #f59e0b 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Smarter.
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <div className={`relative z-10 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
          style={{ transitionDelay: '160ms' }}>
          <p className="text-slate-400 max-w-md mx-auto leading-relaxed mb-10"
            style={{ fontSize: 'clamp(14px, 2vw, 18px)' }}>
            The all-in-one professional platform for ICT, SMC, and futures traders.
            Build your system. Journal your trades. Recap your week.
          </p>
        </div>

        {/* Stats */}
        <div className={`relative z-10 flex items-center gap-8 md:gap-14 justify-center mb-12 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
          style={{ transitionDelay: '240ms' }}>
          {STATS.map((s, i) => (
            <div key={s.label} className="text-center">
              {i > 0 && <div className="hidden" />}
              <p className="font-black text-white leading-none"
                style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontFamily: "'JetBrains Mono', monospace" }}>
                {s.val}
              </p>
              <p className="text-[10px] text-slate-600 uppercase tracking-[0.18em] mt-1.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className={`relative z-10 flex flex-col sm:flex-row items-center gap-3 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
          style={{ transitionDelay: '320ms' }}>
          {onLaunch ? (
            <>
              <button
                onClick={onLaunch}
                className="group flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-[15px] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: '#0a0800',
                  boxShadow: '0 0 50px rgba(245,158,11,0.25), 0 4px 20px rgba(245,158,11,0.15)',
                }}>
                Launch Trading Lab
                <span className="group-hover:translate-x-1 transition-transform duration-200 text-[17px]">→</span>
              </button>
              <div className="flex items-center gap-2 px-5 py-4 rounded-2xl border border-slate-800 bg-slate-900/40">
                <span className="text-[13px] font-medium text-slate-500">📱 Mobile app coming soon</span>
              </div>
            </>
          ) : onSignIn ? (
            <button
              onClick={onSignIn}
              className="group flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-[15px] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#0a0800',
                boxShadow: '0 0 50px rgba(245,158,11,0.25), 0 4px 20px rgba(245,158,11,0.15)',
              }}>
              Sign In with License Key
              <span className="group-hover:translate-x-1 transition-transform duration-200 text-[17px]">→</span>
            </button>
          ) : (
            /* Mobile only — no launch button */
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2.5 px-5 py-4 rounded-2xl border border-amber-500/25 bg-amber-500/6">
                <span className="text-[14px] font-semibold text-amber-300">📱 Mobile app coming soon</span>
              </div>
              <p className="text-[12px] text-slate-600 text-center max-w-xs leading-relaxed">
                The full Trading Lab is optimized for desktop. <br />The native app is on its way.
              </p>
            </div>
          )}
        </div>

        {/* Scroll hint — desktop only */}
        {onLaunch && (
          <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-700 ${mounted ? 'opacity-30' : 'opacity-0'}`}
            style={{ transitionDelay: '600ms' }}>
            <span className="text-[9px] text-slate-600 uppercase tracking-[0.2em]">Scroll to explore</span>
            <div className="w-px h-10 bg-gradient-to-b from-slate-600 to-transparent" />
          </div>
        )}
      </section>

      {/* ══ FEATURES ════════════════════════════════════════════════════ */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-black text-white tracking-tight mb-3"
            style={{ fontSize: 'clamp(26px, 4vw, 42px)' }}>
            Everything you need.
          </h2>
          <p className="text-[14px] text-slate-500 max-w-sm mx-auto leading-relaxed">
            Nine precision-built tools in one unified platform. No subscriptions. No bloat.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div key={f.name}
              className="group relative rounded-2xl p-6 border border-slate-800/70 overflow-hidden cursor-default transition-all duration-300 hover:border-slate-700/70 hover:-translate-y-0.5"
              style={{ background: 'rgba(9,9,18,0.8)' }}>

              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle at 25% 25%, ${f.color}0d 0%, transparent 65%)` }} />

              {/* Bottom accent */}
              <div className="absolute bottom-0 left-4 right-4 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg, transparent, ${f.color}50, transparent)` }} />

              <span className="text-[28px] mb-4 block">{f.emoji}</span>
              <h3 className="text-[14.5px] font-bold text-white mb-2">{f.name}</h3>
              <p className="text-[12px] text-slate-500 leading-relaxed">{f.desc}</p>

              <div className="mt-5 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: f.color }} />
                <span className="text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: f.color, opacity: 0.65 }}>{f.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ MOBILE APP ══════════════════════════════════════════════════ */}
      <section className="px-6 py-16 max-w-xl mx-auto text-center">
        <div className="relative rounded-3xl border border-slate-800/60 overflow-hidden"
          style={{ background: 'rgba(9,9,18,0.9)' }}>

          {/* Background pulse */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(circle at 50% 30%, rgba(245,158,11,0.07) 0%, transparent 65%)' }} />

          <div className="relative px-8 py-12 md:px-14 md:py-14">
            <div className="text-5xl mb-5">📱</div>
            <h2 className="font-black text-white tracking-tight mb-3"
              style={{ fontSize: 'clamp(22px, 3.5vw, 30px)' }}>
              Native Mobile App
            </h2>
            <p className="text-[13px] text-slate-400 leading-relaxed mb-10 max-w-sm mx-auto">
              Journal trades on the go, check your key levels, and review your session plans
              from anywhere — all from a native iOS & Android app.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
              {[
                { icon: '🍎', store: 'App Store',    platform: 'iOS & iPadOS' },
                { icon: '🤖', store: 'Google Play',  platform: 'Android' },
              ].map(s => (
                <div key={s.store}
                  className="flex items-center gap-3 px-5 py-3.5 rounded-2xl border border-slate-800 bg-slate-900/60 opacity-50 cursor-not-allowed select-none">
                  <span className="text-xl">{s.icon}</span>
                  <div className="text-left">
                    <p className="text-[9px] text-slate-600 uppercase tracking-wider">{s.platform}</p>
                    <p className="text-[13px] font-bold text-slate-300">{s.store}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[11px] font-semibold text-amber-400 tracking-wide">In development · Powered by Capacitor</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════════════════ */}
      <footer className="border-t border-slate-800/30 mt-4 px-6 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-center justify-center">
              <FlaskConical size={13} className="text-amber-400" />
            </div>
            <span className="text-[12px] font-black tracking-[0.15em] text-slate-400">CHRONIC TRADING LAB</span>
          </div>
          <p className="text-[11px] text-slate-700">Built for traders, by traders · © 2026</p>
          {onLaunch && (
            <button onClick={onLaunch}
              className="text-[12px] font-semibold text-amber-400/80 hover:text-amber-300 transition-colors">
              Launch App →
            </button>
          )}
        </div>
      </footer>

    </div>
  )
}
