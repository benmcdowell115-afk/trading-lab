/**
 * Inline SVG diagrams for the Playbook — one per ICT concept.
 * Each diagram shows the setup structure: pattern → entry → target.
 */

const BG  = '#07070f'
const DIM = 'rgba(255,255,255,0.3)'
const LN  = 'rgba(255,255,255,0.2)'
const G   = '#22c55e'  // bullish / target
const R   = '#ef4444'  // bearish / stop

type SVGProps = React.SVGAttributes<SVGElement>

function Base({ children, h = 110, ...p }: { children: React.ReactNode; h?: number } & SVGProps) {
  return (
    <svg viewBox={`0 0 260 ${h}`} width="100%" style={{ maxHeight: h + 4, display: 'block' }} aria-hidden {...p}>
      <rect width="260" height={h} fill={BG} rx="10"/>
      {[0.33, 0.66].map(pct => (
        <line key={pct} x1="10" y1={h*pct} x2="250" y2={h*pct} stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
      ))}
      {children}
    </svg>
  )
}

function C({ x, y, h, w=10, bull=true, wt=4, wb=4 }: { x:number;y:number;h:number;w?:number;bull?:boolean;wt?:number;wb?:number }) {
  const col = bull ? G : R
  const cx  = x + w/2
  return (
    <g>
      <line x1={cx} y1={y-wt} x2={cx} y2={y+h+wb} stroke={col} strokeWidth="1" opacity="0.7"/>
      <rect x={x} y={y} width={w} height={Math.max(h,2)} fill={col} fillOpacity="0.82" rx="1"/>
    </g>
  )
}

function Lbl({ x, y, t, col=DIM, sz=7, a='middle' }: { x:number;y:number;t:string;col?:string;sz?:number;a?:string }) {
  return <text x={x} y={y} fill={col} fontSize={sz} textAnchor={a as any} fontFamily="system-ui" fontWeight="700">{t}</text>
}

function Arr({ x1,y1,x2,y2,col='#f59e0b' }: { x1:number;y1:number;x2:number;y2:number;col?:string }) {
  const dx=x2-x1, dy=y2-y1, len=Math.sqrt(dx*dx+dy*dy)
  const ux=dx/len, uy=dy/len
  const ax=x2-ux*7, ay=y2-uy*7
  const px=-uy*4, py=ux*4
  return (
    <g>
      <line x1={x1} y1={y1} x2={ax} y2={ay} stroke={col} strokeWidth="1.5"/>
      <polygon points={`${x2},${y2} ${ax+px},${ay+py} ${ax-px},${ay-py}`} fill={col}/>
    </g>
  )
}

function Zone({ x,y,w,h,col }: { x:number;y:number;w:number;h:number;col:string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={col} fillOpacity="0.14"/>
      <line x1={x} y1={y} x2={x+w} y2={y} stroke={col} strokeWidth="1" opacity="0.55"/>
      <line x1={x} y1={y+h} x2={x+w} y2={y+h} stroke={col} strokeWidth="0.8" strokeDasharray="3,2" opacity="0.4"/>
    </g>
  )
}

// ── Individual diagrams ────────────────────────────────────────────────────────

function DiagFVG({ dir }: { dir: 'long'|'short' }) {
  const bull = dir === 'long'
  return (
    <Base>
      {bull ? <>
        <C x={30} y={68} h={28} bull={false} wt={5} wb={4}/>
        <C x={55} y={22} h={52} bull wt={4} wb={5}/>
        <Zone x={35} y={42} w={28} h={26} col="#f59e0b"/>
        <Lbl x={72} y={56} t="FVG" col="#f59e0b" sz={7.5} a="start"/>
        <C x={90} y={28} h={22} bull={false} wt={3} wb={3}/>
        <C x={115} y={38} h={20} bull={false} wt={3} wb={3}/>
        <C x={140} y={44} h={18} bull wt={6} wb={3}/>
        <Arr x1={155} y1={95} x2={148} y2={60} col="#f59e0b"/>
        <Lbl x={158} y={100} t="Entry at CE" col="#f59e0b" sz={7} a="start"/>
        <line x1="30" y1="22" x2="230" y2="22" stroke={G} strokeWidth="1" strokeDasharray="4,3"/>
        <Lbl x={232} y={25} t="Target" col={G} sz={6.5} a="start"/>
        <Lbl x={130} y={107} t="FVG midpoint (CE) = highest-probability bullish entry" col={DIM} sz={6.5}/>
      </> : <>
        <C x={30} y={22} h={28} bull wt={5} wb={4}/>
        <C x={55} y={36} h={52} bull={false} wt={4} wb={5}/>
        <Zone x={35} y={36} w={28} h={26} col="#f59e0b"/>
        <Lbl x={72} y={54} t="FVG" col="#f59e0b" sz={7.5} a="start"/>
        <C x={90} y={50} h={22} bull wt={3} wb={3}/>
        <C x={115} y={40} h={20} bull wt={3} wb={3}/>
        <C x={140} y={36} h={18} bull={false} wt={6} wb={3}/>
        <Arr x1={155} y1={20} x2={148} y2={48} col="#f59e0b"/>
        <Lbl x={158} y={16} t="Sell at CE" col="#f59e0b" sz={7} a="start"/>
        <line x1="30" y1="90" x2="230" y2="90" stroke={R} strokeWidth="1" strokeDasharray="4,3"/>
        <Lbl x={232} y={93} t="Target" col={R} sz={6.5} a="start"/>
        <Lbl x={130} y={107} t="Bearish FVG retracement → short entry at midpoint" col={DIM} sz={6.5}/>
      </>}
    </Base>
  )
}

function DiagOrderBlock({ dir }: { dir: 'long'|'short' }) {
  const bull = dir === 'long'
  return (
    <Base>
      {bull ? <>
        <C x={20} y={68} h={24} bull wt={4} wb={4}/>
        <C x={44} y={65} h={26} bull wt={3} wb={3}/>
        <C x={68} y={70} h={22} bull={false} wt={3} wb={4}/>
        <Zone x={68} y={70} w={12} h={22} col="#c084fc"/>
        <Lbl x={82} y={86} t="OB" col="#c084fc" sz={7.5} a="start"/>
        <C x={95} y={18} h={62} bull wt={4} wb={5}/>
        <C x={120} y={14} h={45} bull wt={3} wb={4}/>
        <C x={145} y={28} h={22} bull={false} wt={3} wb={3}/>
        <C x={170} y={66} h={20} bull wt={5} wb={3}/>
        <Arr x1={195} y1={100} x2={178} y2={80} col="#c084fc"/>
        <Lbl x={198} y={105} t="Enter OB" col="#c084fc" sz={7} a="start"/>
        <line x1="20" y1="14" x2="240" y2="14" stroke={G} strokeWidth="1" strokeDasharray="4,3"/>
        <Lbl x={130} y={107} t="Last bearish candle before displacement = Bullish OB" col={DIM} sz={6.5}/>
      </> : <>
        <C x={20} y={22} h={24} bull={false} wt={4} wb={4}/>
        <C x={44} y={18} h={26} bull={false} wt={3} wb={3}/>
        <C x={68} y={14} h={22} bull wt={3} wb={4}/>
        <Zone x={68} y={14} w={12} h={22} col="#c084fc"/>
        <Lbl x={82} y={22} t="OB" col="#c084fc" sz={7.5} a="start"/>
        <C x={95} y={28} h={62} bull={false} wt={4} wb={5}/>
        <C x={120} y={50} h={45} bull={false} wt={3} wb={4}/>
        <C x={145} y={50} h={22} bull wt={3} wb={3}/>
        <C x={170} y={22} h={20} bull={false} wt={5} wb={3}/>
        <Arr x1={195} y1={10} x2={180} y2={26} col="#c084fc"/>
        <Lbl x={198} y={8} t="Sell OB" col="#c084fc" sz={7} a="start"/>
        <line x1="20" y1="95" x2="240" y2="95" stroke={R} strokeWidth="1" strokeDasharray="4,3"/>
        <Lbl x={130} y={107} t="Last bullish candle before displacement = Bearish OB" col={DIM} sz={6.5}/>
      </>}
    </Base>
  )
}

function DiagLiquiditySweep({ dir }: { dir: 'long'|'short' }) {
  const bull = dir === 'long'
  return (
    <Base>
      {bull ? <>
        <line x1="15" y1="75" x2="240" y2="75" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="5,3"/>
        <Lbl x={17} y={71} t="SSL — Sell Stops" col="#f59e0b" sz={6.5} a="start"/>
        <C x={25} y={35} h={24} bull wt={4} wb={4}/>
        <C x={50} y={38} h={22} bull wt={4} wb={3}/>
        <C x={75} y={42} h={20} bull wt={4} wb={3}/>
        <C x={100} y={58} h={35} bull={false} wt={5} wb={14}/>
        <Lbl x={118} y={102} t="Sweep!" col={R} sz={7.5} a="start"/>
        <C x={130} y={40} h={48} bull wt={4} wb={4}/>
        <Lbl x={145} y={35} t="Reversal" col={G} sz={7} a="start"/>
        <C x={158} y={28} h={35} bull wt={3} wb={3}/>
        <C x={183} y={18} h={28} bull wt={3} wb={3}/>
        <line x1="15" y1="18" x2="230" y2="18" stroke={G} strokeWidth="1" strokeDasharray="4,3"/>
        <Lbl x={130} y={107} t="SSL swept → displacement reversal → buy the run" col={DIM} sz={6.5}/>
      </> : <>
        <line x1="15" y1="32" x2="240" y2="32" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="5,3"/>
        <Lbl x={17} y={28} t="BSL — Buy Stops" col="#f59e0b" sz={6.5} a="start"/>
        <C x={25} y={52} h={24} bull={false} wt={4} wb={4}/>
        <C x={50} y={50} h={22} bull={false} wt={4} wb={3}/>
        <C x={75} y={46} h={20} bull={false} wt={4} wb={3}/>
        <C x={100} y={12} h={35} bull wt={14} wb={5}/>
        <Lbl x={118} y={10} t="Sweep!" col={G} sz={7.5} a="start"/>
        <C x={130} y={22} h={48} bull={false} wt={4} wb={4}/>
        <Lbl x={145} y={78} t="Reversal" col={R} sz={7} a="start"/>
        <C x={158} y={48} h={35} bull={false} wt={3} wb={3}/>
        <C x={183} y={62} h={28} bull={false} wt={3} wb={3}/>
        <line x1="15" y1="90" x2="230" y2="90" stroke={R} strokeWidth="1" strokeDasharray="4,3"/>
        <Lbl x={130} y={107} t="BSL swept → displacement reversal → sell the reversal" col={DIM} sz={6.5}/>
      </>}
    </Base>
  )
}

function DiagJudasSwing({ dir }: { dir: 'long'|'short' }) {
  const bull = dir === 'long'
  return (
    <Base>
      {bull ? <>
        <line x1="15" y1="65" x2="240" y2="65" stroke={LN} strokeWidth="1" strokeDasharray="4,3"/>
        <Lbl x={17} y={61} t="Session low" col={DIM} sz={6.5} a="start"/>
        <C x={25} y={28} h={22} bull={false} wt={4} wb={4}/>
        <C x={50} y={35} h={22} bull={false} wt={4} wb={3}/>
        <C x={75} y={50} h={28} bull={false} wt={4} wb={14}/>
        <Lbl x={90} y={100} t="Judas ↓" col={R} sz={7.5} a="start"/>
        <C x={110} y={16} h={62} bull wt={4} wb={5}/>
        <Lbl x={126} y={12} t="Real ↑" col={G} sz={8} a="start"/>
        <C x={138} y={12} h={42} bull wt={3} wb={4}/>
        <C x={163} y={8}  h={32} bull wt={3} wb={3}/>
        <line x1="15" y1="8" x2="230" y2="8" stroke={G} strokeWidth="1" strokeDasharray="4,3"/>
        <Lbl x={130} y={107} t="False bearish open sweeps SSL → true bullish run" col={DIM} sz={6.5}/>
      </> : <>
        <line x1="15" y1="45" x2="240" y2="45" stroke={LN} strokeWidth="1" strokeDasharray="4,3"/>
        <Lbl x={17} y={41} t="Session high" col={DIM} sz={6.5} a="start"/>
        <C x={25} y={60} h={22} bull wt={4} wb={4}/>
        <C x={50} y={53} h={22} bull wt={4} wb={3}/>
        <C x={75} y={18} h={28} bull wt={14} wb={4}/>
        <Lbl x={90} y={12} t="Judas ↑" col={G} sz={7.5} a="start"/>
        <C x={110} y={28} h={62} bull={false} wt={4} wb={5}/>
        <Lbl x={126} y={98} t="Real ↓" col={R} sz={8} a="start"/>
        <C x={138} y={56} h={42} bull={false} wt={3} wb={4}/>
        <C x={163} y={68} h={32} bull={false} wt={3} wb={3}/>
        <line x1="15" y1="100" x2="230" y2="100" stroke={R} strokeWidth="1" strokeDasharray="4,3"/>
        <Lbl x={130} y={107} t="False bullish open sweeps BSL → true bearish collapse" col={DIM} sz={6.5}/>
      </>}
    </Base>
  )
}

function DiagDisplacement({ dir }: { dir: 'long'|'short' }) {
  const bull = dir === 'long'
  return (
    <Base>
      {bull ? <>
        <C x={20} y={68} h={20} bull={false} wt={3} wb={3}/>
        <C x={40} y={65} h={22} bull={false} wt={3} wb={3}/>
        <C x={60} y={70} h={18} bull wt={3} wb={3}/>
        <C x={80} y={66} h={20} bull={false} wt={3} wb={3}/>
        <C x={105} y={15} h={72} bull wt={4} wb={4}/>
        <Zone x={80} y={38} w={30} h={28} col="#f59e0b"/>
        <Lbl x={112} y={12} t="Displacement!" col={G} sz={8} a="start"/>
        <Lbl x={112} y={50} t="FVG" col="#f59e0b" sz={7} a="start"/>
        <C x={140} y={30} h={28} bull wt={3} wb={3}/>
        <C x={165} y={22} h={22} bull wt={3} wb={3}/>
        <line x1="15" y1="15" x2="220" y2="15" stroke={G} strokeWidth="1" strokeDasharray="4,3"/>
        <Lbl x={130} y={107} t="Institutional displacement leaves FVG — enter on return" col={DIM} sz={6.5}/>
      </> : <>
        <C x={20} y={22} h={20} bull wt={3} wb={3}/>
        <C x={40} y={18} h={22} bull wt={3} wb={3}/>
        <C x={60} y={16} h={18} bull={false} wt={3} wb={3}/>
        <C x={80} y={16} h={20} bull wt={3} wb={3}/>
        <C x={105} y={18} h={72} bull={false} wt={4} wb={4}/>
        <Zone x={80} y={34} w={30} h={28} col="#f59e0b"/>
        <Lbl x={112} y={95} t="Displacement!" col={R} sz={8} a="start"/>
        <Lbl x={112} y={52} t="FVG" col="#f59e0b" sz={7} a="start"/>
        <C x={140} y={50} h={28} bull={false} wt={3} wb={3}/>
        <C x={165} y={66} h={22} bull={false} wt={3} wb={3}/>
        <line x1="15" y1="95" x2="220" y2="95" stroke={R} strokeWidth="1" strokeDasharray="4,3"/>
        <Lbl x={130} y={107} t="Bearish displacement — sell return to FVG" col={DIM} sz={6.5}/>
      </>}
    </Base>
  )
}

function DiagAMD({ dir }: { dir: 'long'|'short' }) {
  const sections = [
    { x:15,  label:'A', name:'Accumulation', col:'#60a5fa' },
    { x:95,  label:'M', name:'Manipulation', col:dir==='long'?'#f87171':'#34d399' },
    { x:175, label:'D', name:'Distribution',  col:dir==='long'?'#34d399':'#f87171' },
  ]
  return (
    <Base h={105}>
      {sections.map(s => (
        <g key={s.label}>
          <rect x={s.x} y={18} width={68} height={68} fill={s.col} fillOpacity="0.06" rx="3"/>
          <text x={s.x+34} y={58} fill={s.col} fontSize={22} textAnchor="middle" fontFamily="system-ui" fontWeight="900" opacity="0.45">{s.label}</text>
          <Lbl x={s.x+34} y={74} t={s.name} col={s.col} sz={6.5}/>
        </g>
      ))}
      <polyline points="20,68 45,62 58,66 70,64" stroke="#60a5fa" strokeWidth="1.5" fill="none"/>
      {dir==='long'
        ? <><polyline points="102,52 115,65 125,75 135,85" stroke="#f87171" strokeWidth="2" fill="none"/>
             <polyline points="183,78 195,55 208,38 220,22" stroke="#34d399" strokeWidth="2.5" fill="none"/></>
        : <><polyline points="102,55 115,42 125,30 135,18" stroke="#34d399" strokeWidth="2" fill="none"/>
             <polyline points="183,26 195,48 208,65 220,82" stroke="#f87171" strokeWidth="2.5" fill="none"/></>
      }
      <Lbl x={130} y={102} t="Range → false move → real institutional direction" col={DIM} sz={6.5}/>
    </Base>
  )
}

function DiagOTE({ dir }: { dir: 'long'|'short' }) {
  const bull = dir === 'long'
  return (
    <Base>
      {bull ? <>
        <polyline points="20,95 75,20" stroke={G} strokeWidth="2" fill="none"/>
        <polyline points="75,20 120,52" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,3" fill="none"/>
        {[[0.5,'50% EQ','#94a3b8',60],[0.618,'61.8% OTE','#f59e0b',66],[0.79,'79%','#60a5fa',73]].map(([,lbl,col,y])=>(
          <g key={String(lbl)}>
            <line x1="75" y1={y as number} x2="230" y2={y as number} stroke={String(col)} strokeWidth="0.8" strokeDasharray="4,3"/>
            <Lbl x={77} y={(y as number)-2} t={String(lbl)} col={String(col)} sz={6.5} a="start"/>
          </g>
        ))}
        <Zone x={75} y={60} w={60} h={13} col="#f59e0b"/>
        <C x={120} y={52} h={22} bull wt={4} wb={3}/>
        <C x={145} y={38} h={24} bull wt={3} wb={3}/>
        <polyline points="145,40 170,28 195,18" stroke={G} strokeWidth="2" fill="none"/>
        <Arr x1={175} y1={100} x2={135} y2={72} col="#f59e0b"/>
        <Lbl x={178} y={105} t="OTE entry" col="#f59e0b" sz={7} a="start"/>
        <Lbl x={130} y={107} t="Displace → retrace into OTE (61.8–79%) → continue" col={DIM} sz={6.5}/>
      </> : <>
        <polyline points="20,20 75,95" stroke={R} strokeWidth="2" fill="none"/>
        <polyline points="75,95 120,62" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,3" fill="none"/>
        {[[0.5,'50% EQ','#94a3b8',55],[0.618,'61.8% OTE','#f59e0b',48],[0.79,'79%','#60a5fa',42]].map(([,lbl,col,y])=>(
          <g key={String(lbl)}>
            <line x1="75" y1={y as number} x2="230" y2={y as number} stroke={String(col)} strokeWidth="0.8" strokeDasharray="4,3"/>
            <Lbl x={77} y={(y as number)-2} t={String(lbl)} col={String(col)} sz={6.5} a="start"/>
          </g>
        ))}
        <Zone x={75} y={42} w={60} h={13} col="#f59e0b"/>
        <Arr x1={175} y1={15} x2={135} y2={42} col="#f59e0b"/>
        <Lbl x={178} y={12} t="OTE short" col="#f59e0b" sz={7} a="start"/>
        <Lbl x={130} y={107} t="Bearish displacement → OTE retracement → short" col={DIM} sz={6.5}/>
      </>}
    </Base>
  )
}

function DiagSilverBullet({ dir }: { dir: 'long'|'short' }) {
  const bull = dir === 'long'
  // Timeline showing 10AM–11AM window
  const tx = (h: number) => 15 + (h/24)*230
  return (
    <Base h={105}>
      <rect x="15" y="28" width="230" height="22" fill="rgba(255,255,255,0.03)" rx="2"/>
      <rect x={tx(10)} y="28" width={tx(11)-tx(10)} height="22" fill="#f59e0b" fillOpacity="0.2" rx="2"/>
      <Lbl x={(tx(10)+tx(11))/2} y={39} t="SILVER BULLET" col="#f59e0b" sz={7}/>
      <Lbl x={(tx(10)+tx(11))/2} y={47} t="10–11AM EST" col="#f59e0b" sz={6}/>
      {[0,6,12,18,24].map(h => (
        <g key={h}>
          <line x1={tx(h)} y1="50" x2={tx(h)} y2="55" stroke={LN} strokeWidth="1"/>
          <Lbl x={tx(h)} y={63} t={`${h}h`} col={DIM} sz={5.5}/>
        </g>
      ))}
      {/* Setup within window */}
      <polyline
        points={bull
          ? `${tx(10.1)},85 ${tx(10.25)},92 ${tx(10.3)},72 ${tx(10.5)},62 ${tx(10.7)},50 ${tx(10.9)},40`
          : `${tx(10.1)},40 ${tx(10.25)},32 ${tx(10.3)},55 ${tx(10.5)},68 ${tx(10.7)},78 ${tx(10.9)},90`
        }
        stroke={bull?G:R} strokeWidth="2" fill="none"/>
      <Lbl x={130} y={100} t="Sweep FVG within 10–11AM window only" col={DIM} sz={6.5}/>
    </Base>
  )
}

function DiagMarketStructure({ dir }: { dir: 'long'|'short' }) {
  const bull = dir === 'long'
  const pts  = bull
    ? [[15,95],[45,65],[65,78],[105,42],[130,55],[170,22],[195,35]] as [number,number][]
    : [[15,22],[45,55],[65,42],[105,78],[130,65],[170,95],[195,82]] as [number,number][]
  const labels = bull
    ? [['HH',45,65],['HL',65,78],['HH',105,42],['HL',130,55],['HH',170,22]] as [string,number,number][]
    : [['LL',45,55],['LH',65,42],['LL',105,78],['LH',130,65],['LL',170,95]] as [string,number,number][]
  return (
    <Base>
      <polyline points={pts.map(p=>p.join(',')).join(' ')} stroke={bull?G:R} strokeWidth="2" fill="none"/>
      {labels.map(([l,x,y]) => (
        <g key={`${l}${x}`}>
          <circle cx={x} cy={y} r="2.5" fill={bull?G:R}/>
          <Lbl x={x} y={bull?y-6:y+12} t={l} col={bull?G:R} sz={6.5}/>
        </g>
      ))}
      <Arr x1={210} y1={bull?90:25} x2={200} y2={bull?40:85} col={bull?G:R}/>
      <Lbl x={130} y={107} t={bull?'Bullish structure: HH + HL sequence → buy pullbacks':'Bearish: LL + LH sequence → sell rallies'} col={DIM} sz={6.5}/>
    </Base>
  )
}

function DiagKillZones({ dir: _dir }: { dir: 'long'|'short' }) {
  const tx = (h: number) => 15 + (h/24)*230
  const zones = [
    { s:19, e:23, c:'#c084fc', l:'Asia'   },
    { s:2,  e:5,  c:'#60a5fa', l:'London' },
    { s:8.5,e:11, c:'#f59e0b', l:'NY AM'  },
    { s:13.5,e:16,c:'#34d399', l:'NY PM'  },
  ]
  return (
    <Base h={105}>
      <line x1="15" y1="55" x2="245" y2="55" stroke={LN} strokeWidth="1"/>
      {zones.map(z => (
        <g key={z.l}>
          <rect x={tx(z.s)} y="32" width={tx(z.e)-tx(z.s)} height="30" fill={z.c} fillOpacity="0.18" rx="2"/>
          <Lbl x={(tx(z.s)+tx(z.e))/2} y={46} t={z.l} col={z.c} sz={6.5}/>
          <Lbl x={(tx(z.s)+tx(z.e))/2} y={57} t={`${z.s>12?z.s-12:z.s}${z.s>=12?'PM':'AM'}`} col={z.c} sz={5.5}/>
        </g>
      ))}
      {[0,6,12,18,24].map(h=>(
        <g key={h}><line x1={tx(h)} y1="62" x2={tx(h)} y2="67" stroke={LN} strokeWidth="1"/><Lbl x={tx(h)} y={75} t={`${h}h`} col={DIM} sz={5.5}/></g>
      ))}
      <Lbl x={130} y={92} t="Only enter setups inside colored kill zone windows" col={DIM} sz={6.5}/>
    </Base>
  )
}

function DiagPremiumDiscount({ dir }: { dir: 'long'|'short' }) {
  const bull = dir === 'long'
  return (
    <Base>
      <rect x="25" y="15" width="210" height="42" fill="#f87171" fillOpacity="0.05"/>
      <rect x="25" y="57" width="210" height="42" fill="#34d399" fillOpacity="0.05"/>
      <line x1="25" y1="15" x2="235" y2="15" stroke="#f87171" strokeWidth="1.5"/>
      <line x1="25" y1="57" x2="235" y2="57" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5,3"/>
      <line x1="25" y1="99" x2="235" y2="99" stroke="#34d399" strokeWidth="1.5"/>
      <Lbl x={27} y={11} t="Swing High / Premium" col="#f87171" sz={6.5} a="start"/>
      <Lbl x={27} y={54} t="50% EQ" col="#f59e0b" sz={7} a="start"/>
      <Lbl x={27} y={112} t="Swing Low / Discount" col="#34d399" sz={6.5} a="start"/>
      <Lbl x={220} y={40} t={bull?'SELL':'BUY'} col={bull?'#f87171':'#34d399'} sz={10} a="end"/>
      <Lbl x={220} y={82} t={bull?'BUY':'SELL'} col={bull?'#34d399':'#f87171'} sz={10} a="end"/>
      <Arr x1={185} y1={bull?102:12} x2={185} y2={bull?75:40} col={bull?'#34d399':'#f87171'}/>
      <Lbl x={130} y={107} t={bull?'Buy in discount (below 50%), sell in premium (above 50%)':'Sell premium entries, target discount below'} col={DIM} sz={6.5}/>
    </Base>
  )
}

function DiagEqualHighsLows({ dir }: { dir: 'long'|'short' }) {
  const bull = dir === 'long'
  return bull ? (
    <Base>
      <polyline points="15,90 40,58 60,72 90,45 110,60 140,45 160,58" stroke={LN} strokeWidth="1.5" fill="none"/>
      <line x1="15" y1="72" x2="220" y2="72" stroke="#60a5fa" strokeWidth="1.2" strokeDasharray="5,3"/>
      {[40,90,140].map(x=><circle key={x} cx={x} cy={x===40?58:x===90?45:45} r="2.5" fill="#60a5fa"/>)}
      <Lbl x={180} y={69} t="EQL" col="#60a5fa" sz={8}/>
      <Lbl x={180} y={79} t="Sell stops" col="#60a5fa" sz={6.5}/>
      <C x={160} y={48} h={34} bull={false} wt={5} wb={14}/>
      <Lbl x={178} y={92} t="Sweep ↓" col="#f87171" sz={7} a="start"/>
      <C x={185} y={18} h={42} bull wt={4} wb={5}/>
      <Lbl x={185} y={14} t="Reversal" col={G} sz={7} a="start"/>
      <line x1="15" y1="18" x2="220" y2="18" stroke={G} strokeWidth="1" strokeDasharray="4,3"/>
      <Lbl x={130} y={107} t="Equal lows swept → SSL cleared → bullish reversal" col={DIM} sz={6.5}/>
    </Base>
  ) : (
    <Base>
      <polyline points="15,25 40,55 60,40 90,65 110,50 140,65 160,52" stroke={LN} strokeWidth="1.5" fill="none"/>
      <line x1="15" y1="42" x2="220" y2="42" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="5,3"/>
      {[40,90,140].map(x=><circle key={x} cx={x} cy={x===40?55:x===90?65:65} r="2.5" fill="#f59e0b"/>)}
      <Lbl x={180} y={39} t="EQH" col="#f59e0b" sz={8}/>
      <Lbl x={180} y={49} t="Buy stops" col="#f59e0b" sz={6.5}/>
      <C x={160} y={24} h={34} bull wt={14} wb={5}/>
      <Lbl x={178} y={18} t="Sweep ↑" col={G} sz={7} a="start"/>
      <C x={185} y={58} h={42} bull={false} wt={4} wb={5}/>
      <line x1="15" y1="100" x2="220" y2="100" stroke={R} strokeWidth="1" strokeDasharray="4,3"/>
      <Lbl x={130} y={107} t="Equal highs swept → BSL cleared → bearish reversal" col={DIM} sz={6.5}/>
    </Base>
  )
}

function DiagDrawOnLiquidity({ dir }: { dir: 'long'|'short' }) {
  const bull = dir === 'long'
  return (
    <Base>
      <line x1="15" y1={bull?18:95} x2="240" y2={bull?18:95} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5,3"/>
      <Lbl x={17} y={bull?14:110} t="DOL — Draw on Liquidity" col="#f59e0b" sz={7} a="start"/>
      <polyline points={bull?"30,90 55,78 80,72 105,65 130,58":"30,22 55,32 80,38 105,45 130,52"} stroke={LN} strokeWidth="1.5" fill="none"/>
      <Arr x1={130} y1={bull?52:58} x2={200} y2={bull?22:88} col="#f59e0b"/>
      <polyline points={bull?"130,58 155,45 175,30 200,18":"130,52 155,65 175,78 200,95"} stroke={bull?G:R} strokeWidth="2" strokeDasharray="5,3" fill="none"/>
      <Lbl x={175} y={bull?44:72} t="Price drawn to DOL" col="#f59e0b" sz={7}/>
      <Lbl x={130} y={107} t="Identify the draw first — price always seeking liquidity" col={DIM} sz={6.5}/>
    </Base>
  )
}

function DiagDailyBias({ dir }: { dir: 'long'|'short' }) {
  const bull = dir === 'long'
  return (
    <Base h={105}>
      <rect x={15} y={20} width={65} height={70} fill={bull?'#34d399':'#f87171'} fillOpacity="0.04" rx="3"/>
      <Lbl x={47} y={38} t="Asia" col={DIM} sz={8}/>
      <polyline points={bull?"20,82 30,75 38,78 45,72 55,68 62,70 72,65":"20,28 30,35 38,32 45,38 55,42 62,40 72,45"} stroke="#60a5fa" strokeWidth="1.5" fill="none"/>
      <rect x={90} y={20} width={65} height={70} fill="#f87171" fillOpacity="0.04" rx="3"/>
      <Lbl x={122} y={38} t="London" col={DIM} sz={8}/>
      <polyline points={bull?"95,60 105,72 115,80 128,88":"95,50 105,38 115,30 128,22"} stroke="#f87171" strokeWidth="2" fill="none"/>
      <Lbl x={122} y={95} t={bull?"Judas ↓":"Judas ↑"} col="#f87171" sz={7}/>
      <rect x={165} y={20} width={75} height={70} fill={bull?'#34d399':'#f87171'} fillOpacity="0.04" rx="3"/>
      <Lbl x={202} y={38} t="NY" col={DIM} sz={8}/>
      <polyline points={bull?"170,85 182,65 195,48 208,32 228,18":"170,25 182,45 195,62 208,78 228,92"} stroke={bull?G:R} strokeWidth="2.5" fill="none"/>
      <Lbl x={202} y={95} t={bull?"True ↑":"True ↓"} col={bull?G:R} sz={7}/>
      <Lbl x={130} y={102} t="Define bias pre-session → only trade in that direction" col={DIM} sz={6.5}/>
    </Base>
  )
}

function DiagBreakerBlock({ dir }: { dir: 'long'|'short' }) {
  const bull = dir === 'long'
  return (
    <Base>
      {bull ? <>
        <C x={20} y={62} h={28} bull wt={4} wb={4}/>
        <Zone x={20} y={62} w={12} h={28} col="#c084fc"/>
        <Lbl x={34} y={58} t="Bearish OB" col="#c084fc" sz={6.5} a="start"/>
        <C x={50} y={28} h={52} bull={false} wt={5} wb={5}/>
        <C x={78} y={58} h={32} bull wt={4} wb={4}/>
        <C x={103} y={38} h={42} bull wt={3} wb={4}/>
        <line x1="20" y1="62" x2="220" y2="62" stroke={G} strokeWidth="1.2" strokeDasharray="4,3"/>
        <Lbl x={175} y={58} t="Breaker (Support)" col={G} sz={7}/>
        <C x={130} y={52} h={22} bull={false} wt={4} wb={3}/>
        <C x={155} y={58} h={18} bull wt={5} wb={3}/>
        <Arr x1={180} y1={100} x2={163} y2={74} col={G}/>
        <Lbl x={183} y={105} t="Enter here" col={G} sz={7} a="start"/>
        <Lbl x={130} y={107} t="Failed bearish OB gets violated → becomes bullish support" col={DIM} sz={6.5}/>
      </> : <>
        <C x={20} y={20} h={28} bull={false} wt={4} wb={4}/>
        <Zone x={20} y={20} w={12} h={28} col="#c084fc"/>
        <Lbl x={34} y={35} t="Bullish OB" col="#c084fc" sz={6.5} a="start"/>
        <C x={50} y={28} h={52} bull wt={5} wb={5}/>
        <C x={78} y={22} h={32} bull={false} wt={4} wb={4}/>
        <C x={103} y={28} h={42} bull={false} wt={3} wb={4}/>
        <line x1="20" y1="48" x2="220" y2="48" stroke={R} strokeWidth="1.2" strokeDasharray="4,3"/>
        <Lbl x={175} y={44} t="Breaker (Resist.)" col={R} sz={7}/>
        <C x={130} y={30} h={22} bull wt={4} wb={3}/>
        <C x={155} y={42} h={18} bull={false} wt={5} wb={3}/>
        <Arr x1={180} y1={10} x2={163} y2={42} col={R}/>
        <Lbl x={183} y={8} t="Sell here" col={R} sz={7} a="start"/>
        <Lbl x={130} y={107} t="Failed bullish OB gets violated → becomes resistance" col={DIM} sz={6.5}/>
      </>}
    </Base>
  )
}

function DiagInducement({ dir }: { dir: 'long'|'short' }) {
  const bull = dir === 'long'
  return (
    <Base>
      {bull ? <>
        <polyline points="15,90 45,55 65,68" stroke={LN} strokeWidth="1.5" fill="none"/>
        <circle cx={45} cy={55} r="3" fill="#f59e0b"/>
        <Lbl x={45} y={49} t="Inducement" col="#f59e0b" sz={7}/>
        <Lbl x={45} y={40} t="(minor high)" col="#f59e0b" sz={6.5}/>
        <polyline points="65,68 82,58 95,68" stroke={LN} strokeWidth="1.5" fill="none"/>
        <circle cx={82} cy={55} r="2.5" fill="#f87171"/>
        <Lbl x={85} y={51} t="Swept" col="#f87171" sz={6.5} a="start"/>
        <polyline points="95,68 120,75 145,80 170,88 200,95" stroke="#f87171" strokeWidth="2" fill="none"/>
        <Lbl x={150} y={80} t="Real SSL target" col="#34d399" sz={7}/>
        <line x1="15" y1="95" x2="220" y2="95" stroke="#34d399" strokeWidth="1" strokeDasharray="4,3"/>
        <Arr x1={100} y1={45} x2={85} y2={58} col="#f87171"/>
        <Lbl x={130} y={107} t="Minor inducement swept → now target the real liquidity pool" col={DIM} sz={6.5}/>
      </> : <>
        <polyline points="15,25 45,60 65,48" stroke={LN} strokeWidth="1.5" fill="none"/>
        <circle cx={45} cy={60} r="3" fill="#f59e0b"/>
        <Lbl x={45} y={70} t="Inducement" col="#f59e0b" sz={7}/>
        <polyline points="65,48 82,58 95,48" stroke={LN} strokeWidth="1.5" fill="none"/>
        <circle cx={82} cy={58} r="2.5" fill="#34d399"/>
        <Lbl x={85} y={70} t="Swept" col="#34d399" sz={6.5} a="start"/>
        <polyline points="95,48 120,38 145,30 170,22 200,15" stroke={G} strokeWidth="2" fill="none"/>
        <Lbl x={150} y={38} t="Real BSL target" col="#f87171" sz={7}/>
        <line x1="15" y1="15" x2="220" y2="15" stroke="#f87171" strokeWidth="1" strokeDasharray="4,3"/>
        <Lbl x={130} y={107} t="Inducement baits shorts → real target above" col={DIM} sz={6.5}/>
      </>}
    </Base>
  )
}

function DiagIctMacros({ dir }: { dir: 'long'|'short' }) {
  const bull = dir === 'long'
  const tx = (h: number) => 15 + (h/24)*230
  const macros = [{s:8.83,e:9.17,c:'#f59e0b'},{s:9.83,e:10.17,c:'#f59e0b'},{s:10.83,e:11.17,c:'#f59e0b'},{s:13.17,e:13.5,c:'#60a5fa'}]
  return (
    <Base h={105}>
      <rect x="15" y="28" width="230" height="20" fill="rgba(255,255,255,0.03)" rx="2"/>
      {macros.map((m,i) => (
        <rect key={i} x={tx(m.s)} y="28" width={tx(m.e)-tx(m.s)} height="20" fill={m.c} fillOpacity="0.25" rx="1"/>
      ))}
      {[0,6,12,18,24].map(h=>(
        <g key={h}><line x1={tx(h)} y1="48" x2={tx(h)} y2="53" stroke={LN} strokeWidth="1"/><Lbl x={tx(h)} y={61} t={`${h}h`} col={DIM} sz={5.5}/></g>
      ))}
      <polyline
        points={bull
          ? `${tx(9)},90 ${tx(9.1)},98 ${tx(9.2)},78 ${tx(9.4)},65 ${tx(9.6)},52 ${tx(9.8)},40`
          : `${tx(9)},30 ${tx(9.1)},22 ${tx(9.2)},42 ${tx(9.4)},55 ${tx(9.6)},68 ${tx(9.8)},80`
        }
        stroke={bull?G:R} strokeWidth="2" fill="none"/>
      <Lbl x={130} y={94} t="Setups occurring inside macro windows are highest probability" col={DIM} sz={6.5}/>
    </Base>
  )
}

// ── Registry ──────────────────────────────────────────────────────────────────
type DiagComp = (props: { dir: 'long'|'short' }) => React.ReactElement | null

const PLAYBOOK_DIAGRAMS: Record<string, DiagComp> = {
  'fvg':              DiagFVG,
  'order-block':      DiagOrderBlock,
  'displacement':     DiagDisplacement,
  'liquidity':        DiagLiquiditySweep,
  'judas-swing':      DiagJudasSwing,
  'amd':              DiagAMD,
  'ote':              DiagOTE,
  'silver-bullet':    DiagSilverBullet,
  'market-structure': DiagMarketStructure,
  'kill-zones':       DiagKillZones,
  'premium-discount': DiagPremiumDiscount,
  'equal-highs-lows': DiagEqualHighsLows,
  'draw-on-liquidity':DiagDrawOnLiquidity,
  'daily-bias':       DiagDailyBias,
  'breaker-block':    DiagBreakerBlock,
  'inducement':       DiagInducement,
  'ict-macros':       DiagIctMacros,
  'mtfa':             DiagMarketStructure, // re-use structure diagram
}

export function PlaybookDiagram({ conceptId, dir }: { conceptId: string; dir: 'long'|'short' }) {
  const Comp = PLAYBOOK_DIAGRAMS[conceptId]
  if (!Comp) return null
  return (
    <div style={{
      borderRadius: 12, overflow: 'hidden',
      border: `1px solid rgba(255,255,255,0.06)`,
      background: BG,
    }}>
      <Comp dir={dir} />
    </div>
  )
}
