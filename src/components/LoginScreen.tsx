import { useState } from 'react'
import { FlaskConical, Check, ArrowRight, ExternalLink } from 'lucide-react'
import { supabase } from '../lib/supabase'

const WHOP_BUY_URL = import.meta.env.VITE_WHOP_BUY_URL as string | undefined

// Each Whop license key maps to one Supabase account.
// We synthesise an email so Supabase can manage the session.
function keyToEmail(key: string) {
  return `${key.toLowerCase().replace(/[^a-z0-9]/g, '')}@license.tradinglab.app`
}

async function validateWhopKey(key: string): Promise<{ valid: boolean; error?: string }> {
  try {
    const res = await fetch('/.netlify/functions/validate-whop', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key }),
    })
    const data = await res.json()
    return { valid: data.valid, error: data.error }
  } catch {
    return { valid: false, error: 'Could not reach the server — check your connection' }
  }
}

async function signInWithKey(key: string): Promise<string | null> {
  const email    = keyToEmail(key)
  const password = key

  // Try sign-in first (returning user)
  const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password })
  if (!signInErr) return null

  // Account doesn't exist yet — create it
  const { error: signUpErr } = await supabase.auth.signUp({ email, password })
  if (signUpErr) return signUpErr.message

  // Sign in after creating
  const { error: finalErr } = await supabase.auth.signInWithPassword({ email, password })
  return finalErr?.message ?? null
}

export function LoginScreen() {
  const [key,     setKey]     = useState('')
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [done,    setDone]    = useState(false)

  const activate = async () => {
    const trimmed = key.trim()
    if (!trimmed) { setError('Paste your Whop license key'); return }

    setLoading(true); setError('')

    // 1. Validate with Whop
    const { valid, error: whopErr } = await validateWhopKey(trimmed)
    if (!valid) {
      setLoading(false)
      setError(whopErr ?? 'That key is not active. Check it and try again.')
      return
    }

    // 2. Sign into Supabase
    const authErr = await signInWithKey(trimmed)
    if (authErr) {
      setLoading(false)
      setError(`Auth error: ${authErr}`)
      return
    }

    setDone(true)
    // App.tsx will detect the new Supabase session and re-render automatically
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#05050a] px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(245,158,11,0.04)_0%,_transparent_70%)]" />

      <div className="relative w-full max-w-sm space-y-8 text-center">

        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/8 border border-amber-500/30 flex items-center justify-center shadow-2xl shadow-amber-500/10">
            <FlaskConical size={28} className="text-amber-400" />
          </div>
          <div>
            <p className="text-[22px] font-black tracking-widest text-slate-100 leading-none">TRADING LAB</p>
            <p className="text-[11px] font-bold text-slate-600 tracking-[0.2em] mt-1.5">ICT · SMC · FUTURES</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#0c0c15] border border-slate-800/60 rounded-3xl p-7 shadow-2xl text-left space-y-5">
          {!done ? (
            <>
              <div>
                <p className="text-[16px] font-bold text-white">Activate your copy</p>
                <p className="text-[12px] text-slate-500 mt-1 leading-relaxed">
                  Paste the license key from your Whop dashboard below.
                </p>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    value={key}
                    onChange={e => { setKey(e.target.value); setError('') }}
                    onKeyDown={e => e.key === 'Enter' && activate()}
                    placeholder="XXXX-XXXX-XXXX-XXXX"
                    autoFocus
                    spellCheck={false}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="none"
                    data-form-type="other"
                    className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-3 text-[13px] text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500/40 transition-colors tracking-widest"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  />
                </div>

                {error && (
                  <p className="text-[11px] text-red-400 leading-relaxed">{error}</p>
                )}

                <button
                  onClick={activate}
                  disabled={loading || !key.trim()}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500/15 border border-amber-500/35 text-amber-300 text-[13px] font-semibold hover:bg-amber-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading
                    ? <div className="w-4 h-4 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
                    : <><ArrowRight size={14} /> Activate</>
                  }
                </button>
              </div>

              {/* Buy link */}
              {WHOP_BUY_URL && (
                <div className="text-center border-t border-slate-800/50 pt-4">
                  <p className="text-[11px] text-slate-600 mb-2">Don't have a license?</p>
                  <a
                    href={WHOP_BUY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    Get access on Whop <ExternalLink size={11} />
                  </a>
                </div>
              )}
            </>
          ) : (
            <div className="text-center space-y-4 py-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center mx-auto">
                <Check size={20} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-[15px] font-bold text-white">You're in</p>
                <p className="text-[12px] text-slate-500 mt-2">Loading your data…</p>
              </div>
            </div>
          )}
        </div>

        <p className="text-[10px] text-slate-700 leading-relaxed">
          Your builds, journal, and mastery progress sync across devices automatically.
        </p>
      </div>
    </div>
  )
}
