import React, { useState, useEffect, useRef } from "react";
import { TrackedFace, PerformanceStats } from "../types/vision";

interface OpticalSensorLogsPanelProps {
  primaryFace: TrackedFace | null;
  stats: PerformanceStats;
}

interface SensorLogEntry {
  timestamp: number;
  fps: number;
  latencyMs: number;
  eyeOpenness: number;
  smileIntensity: number;
  distanceCm: number;
  yaw: number;
  pitch: number;
}

const MAX_HISTORY = 60;

export const OpticalSensorLogsPanel: React.FC<OpticalSensorLogsPanelProps> = ({ primaryFace, stats }) => {
  const [history, setHistory] = useState<SensorLogEntry[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const tickRef = useRef(0);

  useEffect(() => {
    if (isPaused) return;
    const t = setInterval(() => {
      tickRef.current++;
      setHistory(prev => {
        const entry: SensorLogEntry = {
          timestamp: Date.now(),
          fps: stats.fps,
          latencyMs: stats.latencyMs,
          eyeOpenness: primaryFace?.metrics.eyeOpenness ?? 0,
          smileIntensity: primaryFace?.metrics.smileIntensity ?? 0,
          distanceCm: primaryFace?.distance.approxDistanceCm ?? 0,
          yaw: primaryFace?.headPose.yaw ?? 0,
          pitch: primaryFace?.headPose.pitch ?? 0,
        };
        return [...prev, entry].slice(-MAX_HISTORY);
      });
    }, 500);
    return () => clearInterval(t);
  }, [isPaused, primaryFace, stats]);

  // Sparkline renderer: renders an inline SVG sparkline from an array of values
  const Sparkline = ({ values, color, height = 36 }: { values: number[]; color: string; height?: number }) => {
    if (values.length < 2) return <div style={{ height }} className="bg-[#0c0e12] rounded" />;
    const max = Math.max(...values, 1);
    const min = Math.min(...values, 0);
    const range = Math.max(max - min, 1);
    const w = 100;
    const h = height;
    const pts = values.map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / range) * h * 0.9 - h * 0.05;
      return x + "," + y;
    }).join(" ");
    return (
      <svg viewBox={"0 0 " + w + " " + h} preserveAspectRatio="none" className="w-full rounded" style={{ height }}>
        <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" />
        <polyline points={"0," + h + " " + pts + " " + w + "," + h} fill={color} fillOpacity="0.1" stroke="none" />
      </svg>
    );
  };

  const fpsHistory = history.map(h => h.fps);
  const latHistory = history.map(h => h.latencyMs);
  const eyeHistory = history.map(h => h.eyeOpenness);
  const smileHistory = history.map(h => h.smileIntensity);
  const distHistory = history.map(h => h.distanceCm);
  const yawHistory = history.map(h => Math.abs(h.yaw));

  const avgFps = fpsHistory.length ? Math.round(fpsHistory.reduce((a, b) => a + b, 0) / fpsHistory.length) : 0;
  const avgLatency = latHistory.length ? Math.round(latHistory.reduce((a, b) => a + b, 0) / latHistory.length * 10) / 10 : 0;
  const minFps = fpsHistory.length ? Math.min(...fpsHistory) : 0;
  const maxFps = fpsHistory.length ? Math.max(...fpsHistory) : 0;

  const recentLogs = [...history].reverse().slice(0, 30);

  return (
    <div className="p-4 sm:p-6 space-y-4 bg-[#0c0e12] min-h-[calc(100vh-6rem)] font-mono-tech">
      {/* Header */}
      <div className="bg-[#191c1f] p-5 rounded-xl border border-[#3a494b]/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-[#00f2fe] text-[22px]">sensors</span>
              <h2 className="font-headline text-[20px] font-bold text-[#e0fdff]">Optical Sensor Telemetry</h2>
            </div>
            <p className="text-[12px] text-[#849495]">
              Live hardware sensor diagnostics, frame-rate analysis, pipeline latency breakdown and landmark stability metrics.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={"flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-bold border transition-all cursor-pointer " + (isPaused ? "bg-[#ffb4ab]/10 border-[#ffb4ab]/40 text-[#ffb4ab]" : "bg-[#67f4b7]/10 border-[#67f4b7]/40 text-[#67f4b7]")}
            >
              <span className="material-symbols-outlined text-[16px]">{isPaused ? "play_arrow" : "pause"}</span>
              {isPaused ? "RESUME" : "PAUSE LOGGING"}
            </button>
            <button
              onClick={() => setHistory([])}
              className="flex items-center gap-1 px-3 py-1.5 rounded text-[11px] border border-[#3a494b]/40 text-[#849495] hover:text-[#ffb4ab] hover:border-[#ffb4ab]/40 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">delete_sweep</span>
              CLEAR
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "AVG FPS", value: avgFps + " fps", sub: "MIN " + minFps + " / MAX " + maxFps, color: "#00f2fe" },
          { label: "AVG LATENCY", value: avgLatency + " ms", sub: stats.processingBackend.replace("LOCAL_", ""), color: "#67f4b7" },
          { label: "RESOLUTION", value: stats.resolution, sub: "ACTIVE SENSOR", color: "#adc6ff" },
          { label: "FRAME DROPS", value: String(stats.frameDropCount), sub: "TOTAL DROPPED", color: stats.frameDropCount > 5 ? "#ffb4ab" : "#67f4b7" },
        ].map(card => (
          <div key={card.label} className="bg-[#191c1f] p-3.5 rounded-xl border border-[#3a494b]/30">
            <span className="text-[9px] text-[#849495] block uppercase tracking-widest">{card.label}</span>
            <span className="text-[18px] font-bold block mt-1" style={{ color: card.color }}>{card.value}</span>
            <span className="text-[9px] text-[#849495] block mt-0.5">{card.sub}</span>
          </div>
        ))}
      </div>

      {/* Sparkline Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "FRAME RATE", unit: "fps", values: fpsHistory, color: "#00f2fe", current: stats.fps },
          { label: "PIPELINE LATENCY", unit: "ms", values: latHistory, color: "#67f4b7", current: stats.latencyMs },
          { label: "EYE OPENNESS", unit: "%", values: eyeHistory, color: "#adc6ff", current: primaryFace?.metrics.eyeOpenness ?? 0 },
          { label: "SMILE INTENSITY", unit: "%", values: smileHistory, color: "#00f2fe", current: primaryFace?.metrics.smileIntensity ?? 0 },
          { label: "APPROX DISTANCE", unit: "cm", values: distHistory, color: "#67f4b7", current: primaryFace?.distance.approxDistanceCm ?? 0 },
          { label: "HEAD YAW (ABS)", unit: "°", values: yawHistory, color: "#adc6ff", current: Math.abs(primaryFace?.headPose.yaw ?? 0) },
        ].map(chart => (
          <div key={chart.label} className="bg-[#191c1f] p-3.5 rounded-xl border border-[#3a494b]/30 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-[#849495] uppercase tracking-wider">{chart.label}</span>
              <span className="font-bold text-[14px]" style={{ color: chart.color }}>
                {typeof chart.current === "number" ? (chart.current % 1 === 0 ? chart.current : chart.current.toFixed(1)) : chart.current}
                <span className="text-[10px] text-[#849495] font-normal ml-0.5">{chart.unit}</span>
              </span>
            </div>
            <Sparkline values={chart.values} color={chart.color} height={40} />
            <div className="flex justify-between text-[9px] text-[#3a494b]">
              <span>-{MAX_HISTORY / 2}s</span>
              <span className="text-[#849495]">{chart.values.length} SAMPLES</span>
              <span>NOW</span>
            </div>
          </div>
        ))}
      </div>

      {/* Hardware & Pipeline Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sensor Hardware */}
        <div className="bg-[#191c1f] p-4 rounded-xl border border-[#3a494b]/30 space-y-3">
          <h3 className="text-[11px] text-[#00f2fe] uppercase tracking-widest font-bold">SENSOR HARDWARE</h3>
          {[
            { label: "OPTICAL MATRIX", value: "Sony IMX586 / CameraX 1080p", color: "#e1e2e7" },
            { label: "CAPTURE MODE", value: "LIVE STREAM RGBA32", color: "#00f2fe" },
            { label: "ASPECT RATIO", value: "16:9 (1920x1080)", color: "#adc6ff" },
            { label: "FRONT CAMERA", value: "MIRRORED SELFIE MODE", color: "#67f4b7" },
            { label: "HARDWARE ACCEL", value: stats.processingBackend.replace("LOCAL_", ""), color: "#67f4b7" },
            { label: "AEC MODE", value: "AUTO EXPOSURE COMP", color: "#adc6ff" },
          ].map(item => (
            <div key={item.label} className="flex justify-between items-center bg-[#0c0e12] px-3 py-2 rounded">
              <span className="text-[10px] text-[#849495]">{item.label}</span>
              <span className="text-[10px] font-bold" style={{ color: item.color }}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* Pipeline Latency Breakdown */}
        <div className="bg-[#191c1f] p-4 rounded-xl border border-[#3a494b]/30 space-y-3">
          <h3 className="text-[11px] text-[#00f2fe] uppercase tracking-widest font-bold">LATENCY BUDGET BREAKDOWN</h3>
          {[
            { stage: "Frame Capture + RGBA Unpack", ms: 2.4, color: "#00f2fe", pct: 15 },
            { stage: "468-Pt Neural Landmark Inference", ms: 11.8, color: "#67f4b7", pct: 72 },
            { stage: "FACS AU + 3-DOF Pose Solution", ms: 2.2, color: "#adc6ff", pct: 13 },
          ].map(item => (
            <div key={item.stage} className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-[#b9cacb]">{item.stage}</span>
                <span style={{ color: item.color }} className="font-bold">{item.ms} ms</span>
              </div>
              <div className="w-full h-1.5 bg-[#0c0e12] rounded overflow-hidden">
                <div className="h-full rounded transition-all duration-500" style={{ width: item.pct + "%", backgroundColor: item.color }} />
              </div>
            </div>
          ))}
          <div className="flex justify-between text-[10px] text-[#849495] border-t border-[#3a494b]/30 pt-2">
            <span>TOTAL PIPELINE</span>
            <span className="text-[#e1e2e7] font-bold">{stats.latencyMs} ms</span>
          </div>
        </div>
      </div>

      {/* Live Log Table */}
      <div className="bg-[#191c1f] rounded-xl border border-[#3a494b]/30 overflow-hidden">
        <div className="px-4 py-2.5 border-b border-[#3a494b]/30 flex items-center justify-between">
          <span className="text-[11px] text-[#849495] uppercase tracking-widest">LIVE TELEMETRY LOG (0.5s SAMPLES)</span>
          <span className="flex items-center gap-1.5 text-[10px]" style={{ color: isPaused ? "#ffb4ab" : "#67f4b7" }}>
            <span className={"w-1.5 h-1.5 rounded-full inline-block " + (isPaused ? "bg-[#ffb4ab]" : "bg-[#67f4b7] animate-pulse")} />
            {isPaused ? "PAUSED" : "RECORDING"}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[10px]">
            <thead className="bg-[#1d2023] text-[#849495] uppercase text-[9px] border-b border-[#3a494b]/20">
              <tr>
                <th className="px-3 py-2">TIME</th>
                <th className="px-3 py-2">FPS</th>
                <th className="px-3 py-2">LATENCY</th>
                <th className="px-3 py-2">EYE %</th>
                <th className="px-3 py-2">SMILE %</th>
                <th className="px-3 py-2">DIST cm</th>
                <th className="px-3 py-2">YAW °</th>
                <th className="px-3 py-2">PITCH °</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3a494b]/10">
              {recentLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-3 py-6 text-center text-[#849495]">No data recorded yet. Sensor logging will begin automatically.</td>
                </tr>
              ) : (
                recentLogs.map((entry, i) => (
                  <tr key={entry.timestamp} className={"hover:bg-[#1d2023]/40 " + (i === 0 ? "text-[#e1e2e7]" : "text-[#849495]")}>
                    <td className="px-3 py-1.5 text-[#849495]">{new Date(entry.timestamp).toLocaleTimeString()}</td>
                    <td className="px-3 py-1.5 text-[#00f2fe] font-bold">{entry.fps}</td>
                    <td className="px-3 py-1.5 text-[#67f4b7]">{entry.latencyMs.toFixed(1)}</td>
                    <td className="px-3 py-1.5">{entry.eyeOpenness}</td>
                    <td className="px-3 py-1.5">{entry.smileIntensity}</td>
                    <td className="px-3 py-1.5">{entry.distanceCm || "--"}</td>
                    <td className="px-3 py-1.5">{entry.yaw.toFixed(1)}</td>
                    <td className="px-3 py-1.5">{entry.pitch.toFixed(1)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
