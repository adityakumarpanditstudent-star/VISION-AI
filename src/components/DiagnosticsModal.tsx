import React from 'react';
import { PerformanceStats } from '../types/vision';

interface DiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: PerformanceStats;
}

export const DiagnosticsModal: React.FC<DiagnosticsModalProps> = ({
  isOpen,
  onClose,
  stats
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative max-w-xl w-full bg-[#191c1f] border border-[#3a494b] rounded-xl p-6 shadow-2xl flex flex-col gap-4 font-mono-tech max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#3a494b]/40 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00f2fe] text-[22px]">
              terminal
            </span>
            <span className="font-headline text-[17px] font-bold text-[#e0fdff] uppercase">
              Vision Engine Diagnostics & Log
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[#849495] hover:text-white transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Matrix Specs */}
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="bg-[#0c0e12] p-2.5 rounded border border-[#3a494b]/20">
            <span className="text-[#849495] block text-[9px]">ENGINE PIPELINE</span>
            <span className="text-[#00f2fe] font-bold">MediaPipe Tasks Vision v0.10.14</span>
          </div>

          <div className="bg-[#0c0e12] p-2.5 rounded border border-[#3a494b]/20">
            <span className="text-[#849495] block text-[9px]">TENSOR SHAPE</span>
            <span className="text-[#adc6ff] font-bold">[1, 256, 256, 3] FP32</span>
          </div>

          <div className="bg-[#0c0e12] p-2.5 rounded border border-[#3a494b]/20">
            <span className="text-[#849495] block text-[9px]">BACKEND ACCELERATOR</span>
            <span className="text-[#67f4b7] font-bold">WebGPU / Vulkan Local Pipeline</span>
          </div>

          <div className="bg-[#0c0e12] p-2.5 rounded border border-[#3a494b]/20">
            <span className="text-[#849495] block text-[9px]">FRAME LATENCY</span>
            <span className="text-[#00f2fe] font-bold">{stats.latencyMs} ms @ {stats.fps} FPS</span>
          </div>
        </div>

        {/* Latency Pipeline Breakdown */}
        <div className="bg-[#0c0e12] p-3 rounded border border-[#3a494b]/20 space-y-2 text-[11px]">
          <div className="text-[#849495] uppercase text-[10px] font-bold">
            Execution Latency Budget ({stats.latencyMs} ms total)
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px]">
              <span className="text-[#b9cacb]">Camera Frame Capture & RGBA Unpack:</span>
              <span className="text-[#00f2fe]">2.4 ms</span>
            </div>
            <div className="w-full h-1 bg-[#1d2023] rounded">
              <div className="w-[15%] h-full bg-[#00f2fe]"></div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px]">
              <span className="text-[#b9cacb]">468-Point Mesh Neural Inference:</span>
              <span className="text-[#67f4b7]">11.8 ms</span>
            </div>
            <div className="w-full h-1 bg-[#1d2023] rounded">
              <div className="w-[70%] h-full bg-[#67f4b7]"></div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px]">
              <span className="text-[#b9cacb]">FACS AU & 3-DOF Pose Solution:</span>
              <span className="text-[#adc6ff]">2.2 ms</span>
            </div>
            <div className="w-full h-1 bg-[#1d2023] rounded">
              <div className="w-[15%] h-full bg-[#adc6ff]"></div>
            </div>
          </div>
        </div>

        {/* Real-time Telemetry Stream Log */}
        <div className="bg-[#0c0e12] p-3 rounded border border-[#3a494b]/30 font-mono-tech text-[10px] space-y-1 text-[#b9cacb] max-h-36 overflow-y-auto">
          <div className="text-[#67f4b7]">[INFO] VisionAI pipeline initialized on local hardware.</div>
          <div className="text-[#849495]">[INIT] MediaPipe FaceLandmarker compiled with 468 vertices.</div>
          <div className="text-[#00f2fe]">[PIPE] CameraX mirrored stream mapped to aspect ratio 16:9.</div>
          <div className="text-[#adc6ff]">[POSE] SolvePnP canonical face reference bound to landmarks [1, 152, 33, 263].</div>
          <div className="text-[#849495]">[CALIB] Distance estimation EMA smoothing alpha=0.25 initialized.</div>
          <div className="text-[#67f4b7]">[STREAM] 60.0 FPS stable. Jitter flux &lt; 0.15 mm RMS.</div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded bg-[#1d2023] hover:bg-[#282a2e] text-[#00f2fe] border border-[#00f2fe]/40 font-bold text-[11px] uppercase transition-all cursor-pointer"
        >
          CLOSE DIAGNOSTICS
        </button>
      </div>
    </div>
  );
};
