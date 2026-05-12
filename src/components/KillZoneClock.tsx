import { useKillZone } from '../hooks/useKillZone'
import { Clock, Zap } from 'lucide-react'

export function KillZoneClock() {
  const { time, active, next, nextMacro, timeLeft, timeToNext, timeToMacro } = useKillZone()

  return (
    <div className="flex items-center gap-5">

      {/* NY Clock */}
      <div className="flex items-center gap-2.5">
        <Clock size={13} className="text-slate-600 flex-shrink-0" />
        <div>
          <p className="text-[17px] font-bold text-slate-100 tabular-nums leading-none"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {time.display}
          </p>
          <p className="text-[9px] font-bold text-slate-600 tracking-widest mt-0.5">NEW YORK</p>
        </div>
      </div>

      <div className="w-px h-8 bg-slate-800/80" />

      {/* Kill zone status */}
      <div className="flex items-center gap-2.5">
        {active ? (
          <>
            <div className="relative flex-shrink-0">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: active.color }} />
              <div className="absolute inset-0 rounded-full animate-ping opacity-50" style={{ backgroundColor: active.color }} />
            </div>
            <div>
              <p className="text-[13px] font-bold leading-none" style={{ color: active.textColor }}>
                {active.name}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">{timeLeft} left</p>
            </div>
          </>
        ) : (
          <>
            <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700 flex-shrink-0" />
            <div>
              <p className="text-[12px] font-semibold text-slate-500 leading-none">Off Session</p>
              <p className="text-[10px] text-slate-600 mt-0.5">
                <span style={{ color: next.zone.textColor }}>{next.zone.shortName}</span>
                {' '}in {timeToNext}
              </p>
            </div>
          </>
        )}
      </div>

      <div className="w-px h-8 bg-slate-800/80" />

      {/* Next ICT Macro */}
      <div className="flex items-center gap-2">
        <Zap size={12} className="text-amber-500/60 flex-shrink-0" />
        <div>
          <p className="text-[11px] font-semibold text-slate-400 leading-none">
            Next Macro <span className="text-amber-400">{nextMacro.name}</span>
          </p>
          <p className="text-[10px] text-slate-600 mt-0.5">in {timeToMacro}</p>
        </div>
      </div>

    </div>
  )
}
