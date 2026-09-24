import React, { useState, useEffect, useRef, useCallback } from "react";
import { TrackedFace, PerformanceStats } from "../types/vision";

interface SnapshotEntry {
  id: string;
  timestamp: number;
  expression: string;
  confidence: number;
  eyeOpenness: number;
  smileIntensity: number;
  headYaw: number;
  headPitch: number;
  distanceCm: number;
  fps: number;
}

interface SessionRecordingsPanelProps {
  primaryFace: TrackedFace | null;
  stats: PerformanceStats;
}

export const SessionRecordingsPanel: React.FC<SessionRecordingsPanelProps> = ({ primaryFace, stats }) => {
  const [snapshots, setSnapshots] = useState<SnapshotEntry[]>([]);
  const [isAutoCapture, setIsAutoCapture] = useState(false);
  const [autoCaptureInterval, setAutoCaptureInterval] = useState(5);
  const [sessionStartTime] = useState(Date.now());
  const [tick, setTick] = useState(0);
  const [selectedSnapshot, setSelectedSnapshot] = useState<SnapshotEntry | null>(null);
  const [expressionLog, setExpressionLog] = useState<{ time: string; label: string; conf: number }[]>([]);
  const intervalRef = useRef<number | null>(null);
  const lastExprRef = useRef<string>("");

  // Tick the clock
  useEffect(() => {
    const t = setInterval(() => setTick(p => p + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const captureSnapshot = useCallback(() => {
    if (!primaryFace) return;
    const entry: SnapshotEntry = {
      id: "SNAP-" + Date.now().toString(36).toUpperCase(),
      timestamp: Date.now(),
      expression: primaryFace.expression.label,
      confidence: primaryFace.expression.confidence,
      eyeOpenness: primaryFace.metrics.eyeOpenness,
      smileIntensity: primaryFace.metrics.smileIntensity,
      headYaw: primaryFace.headPose.yaw,
      headPitch: primaryFace.headPose.pitch,
      distanceCm: primaryFace.distance.approxDistanceCm,
      fps: stats.fps,
    };
    setSnapshots(prev => [entry, ...prev].slice(0, 20));
  }, [primaryFace, stats.fps]);

  useEffect(() => {
    if (isAutoCapture) {
      intervalRef.current = window.setInterval(captureSnapshot, autoCaptureInterval * 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isAutoCapture, autoCaptureInterval, captureSnapshot]);

  useEffect(() => {
    if (!primaryFace) return;
    const currentExpr = primaryFace.expression.label;
    if (currentExpr !== lastExprRef.current) {
      lastExprRef.current = currentExpr;
      const now = new Date();
      const hh = now.getHours().toString().padStart(2, "0");
      const mm = now.getMinutes().toString().padStart(2, "0");
      const ss = now.getSeconds().toString().padStart(2, "0");
      setExpressionLog(prev => [
        { time: hh + ":" + mm + ":" + ss, label: currentExpr, conf: primaryFace.expression.confidence },
        ...prev
      ].slice(0, 30));
    }
  }, [primaryFace?.expression.label]);

  const sessionDurationSec = Math.floor((Date.now() - sessionStartTime) / 1000);
  const sessionMin = Math.floor(sessionDurationSec / 60);
  const sessionSec = sessionDurationSec % 60;

  return (
    <div className="p-4 sm:p-6 space-y-4 bg-[#0c0e12] min-h-[calc(100vh-6rem)] font-mono-tech">
      {/* Header */}
      <div className="bg-[#191c1f] p-5 rounded-xl border border-[#3a494b]/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-[#00f2fe] text-[22px]">videocam</span>
              <h2 className="font-headline text-[20px] font-bold text-[#e0fdff]">Session Recordings &amp; Snapshots</h2>
            </div>
            <p className="text-[12px] text-[#849495]">
              Capture and review per-frame facial metric snapshots. All data stored locally in volatile session memory.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <span className="text-[9px] text-[#849495] block">SESSION UPTIME</span>
              <span className="text-[#00f2fe] font-bold text-[14px]">
                {sessionMin.toString().padStart(2, "0")}:{sessionSec.toString().padStart(2, "0")}
              </span>
            </div>
            <div className="w-px h-8 bg-[#3a494b]/40" />
            <div className="text-right">
              <span className="text-[9px] text-[#849495] block">SNAPSHOTS</span>
              <span className="text-[#67f4b7] font-bold text-[14px]">{snapshots.length.toString().padStart(2, "0")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Controls */}
        <div className="flex flex-col gap-4">
          <div className="bg-[#191c1f] p-4 rounded-xl border border-[#3a494b]/30 space-y-3">
            <h3 className="text-[11px] text-[#849495] uppercase tracking-widest">CAPTURE CONTROLS</h3>
            <button
              onClick={captureSnapshot}
              disabled={!primaryFace}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#00f2fe] hover:bg-white text-[#00373a] font-bold text-[12px] transition-all shadow-[0_0_12px_rgba(0,242,254,0.3)] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[18px]">photo_camera</span>
              CAPTURE SNAPSHOT
            </button>
            <div className="bg-[#0c0e12] p-3 rounded border border-[#3a494b]/20 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-[#e1e2e7]">Auto-Capture</span>
                <button
                  onClick={() => setIsAutoCapture(!isAutoCapture)}
                  className={"relative w-10 h-5 rounded-full transition-all cursor-pointer " + (isAutoCapture ? "bg-[#00f2fe]" : "bg-[#3a494b]")}
                >
                  <span className={"absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all " + (isAutoCapture ? "left-5" : "left-0.5")} />
                </button>
              </div>
              {isAutoCapture && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] text-[#849495]">Every</span>
                  {[3, 5, 10, 30].map(s => (
                    <button
                      key={s}
                      onClick={() => setAutoCaptureInterval(s)}
                      className={"px-2 py-0.5 rounded text-[10px] cursor-pointer transition-all " + (autoCaptureInterval === s ? "bg-[#00f2fe] text-[#00373a] font-bold" : "bg-[#282a2e] text-[#849495]")}
                    >
                      {s}s
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => setSnapshots([])}
              disabled={snapshots.length === 0}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded bg-[#1d2023] hover:bg-[#282a2e] text-[#ffb4ab] font-bold text-[11px] transition-all border border-[#ffb4ab]/30 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
              CLEAR ALL SNAPSHOTS
            </button>
          </div>

          <div className="bg-[#191c1f] p-4 rounded-xl border border-[#3a494b]/30 space-y-2">
            <h3 className="text-[11px] text-[#849495] uppercase tracking-widest mb-2">LIVE FRAME METRICS</h3>
            {primaryFace ? (
              <>
                {[
                  { label: "EXPRESSION", value: primaryFace.expression.label.split(" ")[0].toUpperCase(), color: "#00f2fe" },
                  { label: "CONFIDENCE", value: primaryFace.expression.confidence + "%", color: "#67f4b7" },
                  { label: "EYE OPENNESS", value: primaryFace.metrics.eyeOpenness + "%", color: "#adc6ff" },
                  { label: "SMILE", value: primaryFace.metrics.smileIntensity + "%", color: "#00f2fe" },
                  { label: "DISTANCE", value: primaryFace.distance.approxDistanceCm + " cm", color: "#67f4b7" },
                  { label: "HEAD YAW", value: primaryFace.headPose.yaw.toFixed(1) + "°", color: "#adc6ff" },
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-center bg-[#0c0e12] px-2.5 py-1.5 rounded">
                    <span className="text-[10px] text-[#849495]">{item.label}</span>
                    <span className="text-[11px] font-bold" style={{ color: item.color }}>{item.value}</span>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center text-[#849495] text-[11px] py-4">No face detected.</div>
            )}
          </div>
        </div>

        {/* Right: Timeline + Log */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {selectedSnapshot && (
            <div className="bg-[#191c1f] p-4 rounded-xl border border-[#00f2fe]/40 space-y-3 relative">
              <button onClick={() => setSelectedSnapshot(null)} className="absolute top-3 right-3 text-[#849495] hover:text-white cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
              <h3 className="text-[12px] text-[#00f2fe] font-bold">SNAPSHOT DETAIL — {selectedSnapshot.id}</h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "EXPRESSION", value: selectedSnapshot.expression.split(" ").slice(0, 2).join(" ") },
                  { label: "CONFIDENCE", value: selectedSnapshot.confidence + "%" },
                  { label: "EYE OPENNESS", value: selectedSnapshot.eyeOpenness + "%" },
                  { label: "SMILE", value: selectedSnapshot.smileIntensity + "%" },
                  { label: "YAW", value: selectedSnapshot.headYaw.toFixed(1) + "°" },
                  { label: "PITCH", value: selectedSnapshot.headPitch.toFixed(1) + "°" },
                  { label: "DISTANCE", value: selectedSnapshot.distanceCm + " cm" },
                  { label: "FPS", value: String(selectedSnapshot.fps) },
                  { label: "TIME", value: new Date(selectedSnapshot.timestamp).toLocaleTimeString() },
                ].map(item => (
                  <div key={item.label} className="bg-[#0c0e12] p-2 rounded text-center">
                    <span className="text-[9px] text-[#849495] block">{item.label}</span>
                    <span className="text-[12px] text-[#00f2fe] font-bold block truncate">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-[#191c1f] rounded-xl border border-[#3a494b]/30 overflow-hidden">
            <div className="px-4 py-2.5 border-b border-[#3a494b]/30 flex items-center justify-between">
              <span className="text-[11px] text-[#849495] uppercase tracking-widest">SNAPSHOT TIMELINE</span>
              <span className="text-[10px] text-[#00f2fe]">{snapshots.length} / 20 FRAMES</span>
            </div>
            <div className="divide-y divide-[#3a494b]/20 max-h-[320px] overflow-y-auto">
              {snapshots.length === 0 ? (
                <div className="p-8 text-center text-[#849495] text-[11px]">
                  <span className="material-symbols-outlined text-[32px] block mb-2 text-[#3a494b]">photo_camera</span>
                  No snapshots captured yet. Press CAPTURE SNAPSHOT or enable auto-capture.
                </div>
              ) : (
                snapshots.map((snap, i) => (
                  <button
                    key={snap.id}
                    onClick={() => setSelectedSnapshot(snap)}
                    className={"w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-[#1d2023]/50 transition-all cursor-pointer " + (selectedSnapshot?.id === snap.id ? "bg-[#00f2fe]/5 border-l-2 border-[#00f2fe]" : "")}
                  >
                    <span className="text-[10px] text-[#3a494b] w-4 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-[10px] text-[#849495] w-20 shrink-0">{new Date(snap.timestamp).toLocaleTimeString()}</span>
                    <span className="text-[10px] text-[#00f2fe] font-bold truncate flex-1">{snap.id}</span>
                    <span className="text-[10px] text-[#e1e2e7] truncate hidden sm:block w-28">{snap.expression.split(" ")[0]}</span>
                    <span className="text-[10px] text-[#67f4b7] w-12 text-right shrink-0">{snap.confidence}%</span>
                    <span className="text-[10px] text-[#849495] w-14 text-right shrink-0">{snap.distanceCm}cm</span>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="bg-[#191c1f] rounded-xl border border-[#3a494b]/30 overflow-hidden">
            <div className="px-4 py-2.5 border-b border-[#3a494b]/30 flex items-center justify-between">
              <span className="text-[11px] text-[#849495] uppercase tracking-widest">EXPRESSION CHANGE LOG</span>
              <span className="flex items-center gap-1.5 text-[10px] text-[#67f4b7]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#67f4b7] animate-pulse inline-block" />
                LIVE
              </span>
            </div>
            <div className="max-h-[180px] overflow-y-auto p-2 space-y-1">
              {expressionLog.length === 0 ? (
                <div className="text-center text-[#849495] text-[11px] py-4">Waiting for expression changes...</div>
              ) : (
                expressionLog.map((entry, i) => (
                  <div key={i} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[#1d2023]/40">
                    <span className="text-[9px] text-[#3a494b] w-16 shrink-0">{entry.time}</span>
                    <span className="text-[10px] text-[#e1e2e7] flex-1 truncate">{entry.label}</span>
                    <span className="text-[10px] text-[#67f4b7] shrink-0">{entry.conf}%</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#191c1f] p-3 rounded-lg border border-[#3a494b]/20 flex items-center gap-2">
        <span className="material-symbols-outlined text-[#67f4b7] text-[18px]">lock</span>
        <span className="text-[11px] text-[#849495]">
          All snapshot data is stored exclusively in volatile session memory. No images or biometric data are written to disk or transmitted.
        </span>
      </div>
    </div>
  );
};
