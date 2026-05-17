import { useEffect, useRef } from 'react'
import { createChart, ColorType, CandlestickSeries, LineStyle, type ISeriesApi } from 'lightweight-charts'
import type { OHLCVBar } from '../hooks/useReplayData'

interface ActiveTrade {
  dir: 'long' | 'short'
  entry: number
  stop: number
  target: number
}

interface Props {
  bars: OHLCVBar[]
  cursor: number
  activeTrade?: ActiveTrade | null
}

export function ReplayChart({ bars, cursor, activeTrade }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef     = useRef<ReturnType<typeof createChart> | null>(null)
  const seriesRef    = useRef<ISeriesApi<'Candlestick'> | null>(null)
  const plEntry      = useRef<unknown>(null)
  const plStop       = useRef<unknown>(null)
  const plTarget     = useRef<unknown>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#05050a' },
        textColor: '#64748b',
      },
      grid: {
        vertLines: { color: 'rgba(255,255,255,0.025)' },
        horzLines: { color: 'rgba(255,255,255,0.025)' },
      },
      crosshair: { mode: 1 },
      rightPriceScale: { borderColor: 'rgba(255,255,255,0.06)' },
      timeScale: {
        borderColor: 'rgba(255,255,255,0.06)',
        timeVisible: true,
        secondsVisible: false,
      },
      width:  containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
    })

    const series = chart.addSeries(CandlestickSeries, {
      upColor:         '#34d399',
      downColor:       '#f87171',
      borderUpColor:   '#34d399',
      borderDownColor: '#f87171',
      wickUpColor:     '#34d399',
      wickDownColor:   '#f87171',
    })

    chartRef.current  = chart
    seriesRef.current = series as ISeriesApi<'Candlestick'>

    const ro = new ResizeObserver(() => {
      if (containerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width:  containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        })
      }
    })
    ro.observe(containerRef.current)

    return () => {
      ro.disconnect()
      chart.remove()
      chartRef.current  = null
      seriesRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!seriesRef.current) return
    const visible = bars.slice(0, cursor)
    ;(seriesRef.current as any).setData(visible)
    if (visible.length > 0) chartRef.current?.timeScale().scrollToRealTime()
  }, [bars, cursor])

  useEffect(() => {
    const s = seriesRef.current as any
    if (!s) return

    if (plEntry.current)  { try { s.removePriceLine(plEntry.current)  } catch {} ; plEntry.current  = null }
    if (plStop.current)   { try { s.removePriceLine(plStop.current)   } catch {} ; plStop.current   = null }
    if (plTarget.current) { try { s.removePriceLine(plTarget.current) } catch {} ; plTarget.current = null }

    if (!activeTrade) return

    plEntry.current  = s.createPriceLine({ price: activeTrade.entry,  color: '#94a3b8', lineStyle: LineStyle.Dashed, lineWidth: 1, axisLabelVisible: true, title: 'Entry' })
    plStop.current   = s.createPriceLine({ price: activeTrade.stop,   color: '#f87171', lineStyle: LineStyle.Dashed, lineWidth: 1, axisLabelVisible: true, title: 'SL' })
    plTarget.current = s.createPriceLine({ price: activeTrade.target, color: '#34d399', lineStyle: LineStyle.Dashed, lineWidth: 1, axisLabelVisible: true, title: 'TP' })
  }, [activeTrade])

  return <div ref={containerRef} className="w-full h-full" />
}
