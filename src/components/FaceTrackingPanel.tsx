import React from 'react';
import { TrackedFace } from '../types/vision';

interface FaceTrackingPanelProps {
  primaryFace: TrackedFace | null;
  totalFaces: number;
}

export const FaceTrackingPanel: React.FC<FaceTrackingPanelProps> = ({
  primaryFace,
  totalFaces
}) => {
  const isDetected = primaryFace !== null;
  const landmarksCount = isDetected ? 468 : 0;
  const confidencePercent = isDetected ? (primaryFace.confidence * 100).toFixed(1) : '0.0';

  return (
    <div className="bg-[#191c1f] p-4 rounded-xl flex flex-col gap-3 shadow-md border border-[#3a494b]/20 relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#00f2fe] text-[18px]">
            center_focus_strong
          </span>
          <span className="font-headline text-[15px] font-semibold text-[#e1e2e7] uppercase tracking-wide">
            Face Tracking
          </span>
        </div>
        <span className="font-mono-tech text-[10px] text-[#849495]">SEC//01</span>
      </div>

      {/* Detection status pill */}
      <div className="flex items-center justify-between bg-[#1d2023] px-3 py-2 rounded border border-[#3a494b]/30">
        <div className="flex items-center gap-2">
          {isDetected ? (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#67f4b7] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#67f4b7]"></span>
            </span>
          ) : (
            <span className="h-2 w-2 rounded-full bg-[#ffb4ab]"></span>
          )}
          <span
            className={`font-mono-tech text-[11px] font-semibold ${
              isDetected ? 'text-[#67f4b7]' : 'text-[#ffb4ab]'
            }`}
          >
            {isDetected
              ? totalFaces > 1
                ? 'MULTIPLE FACES DETECTED'
                : 'FACE DETECTED'
              : 'FACE NOT DETECTED'}
          </span>
        </div>
        <span className="font-mono-tech text-[10px] text-[#b9cacb] bg-[#282a2e] px-2 py-0.5 rounded">
          {isDetected ? 'STABLE' : 'SEARCHING'}
        </span>
      </div>

      {/* Numerical Stats Grid */}
      <div className="grid grid-cols-3 gap-2 text-center mt-1">
        <div className="bg-[#1d2023] p-2 rounded flex flex-col border border-[#3a494b]/20">
          <span className="font-mono-tech text-[9px] text-[#849495] uppercase">
            SUBJECTS
          </span>
          <span className="font-headline text-[22px] text-[#00f2fe] font-bold">
            {totalFaces.toString().padStart(2, '0')}
          </span>
        </div>

        <div className="bg-[#1d2023] p-2 rounded flex flex-col border border-[#3a494b]/20">
          <span className="font-mono-tech text-[9px] text-[#849495] uppercase">
            LANDMARKS
          </span>
          <span className="font-headline text-[22px] text-[#00f2fe] font-bold">
            {landmarksCount}
          </span>
        </div>

        <div className="bg-[#1d2023] p-2 rounded flex flex-col border border-[#3a494b]/20">
          <span className="font-mono-tech text-[9px] text-[#849495] uppercase">
            CONFIDENCE
          </span>
          <span className="font-headline text-[22px] text-[#67f4b7] font-bold">
            {confidencePercent}%
          </span>
        </div>
      </div>

      {/* Temporal Jitter Waveform */}
      <div className="mt-1 bg-[#0c0e12] p-2.5 rounded flex flex-col gap-1.5 border border-[#3a494b]/30">
        <div className="flex justify-between items-center text-[10px] font-mono-tech text-[#849495]">
          <span>TEMPORAL JITTER FLUX</span>
          <span className="text-[#67f4b7]">
            {isDetected ? `${primaryFace.quality.jitterRmsMm} mm rms` : '---'}
          </span>
        </div>
        <div className="h-9 w-full flex items-end gap-1 px-1">
          <div className="w-full bg-[#00f2fe]/20 h-4 rounded-xs"></div>
          <div className="w-full bg-[#00f2fe]/30 h-6 rounded-xs"></div>
          <div className="w-full bg-[#00f2fe]/40 h-8 rounded-xs"></div>
          <div className="w-full bg-[#00f2fe]/60 h-5 rounded-xs"></div>
          <div className="w-full bg-[#00f2fe]/80 h-7 rounded-xs"></div>
          <div className="w-full bg-[#00f2fe] h-9 rounded-xs"></div>
          <div className="w-full bg-[#00f2fe]/90 h-6 rounded-xs"></div>
          <div className="w-full bg-[#00f2fe]/70 h-4 rounded-xs"></div>
          <div className="w-full bg-[#00f2fe]/50 h-5 rounded-xs"></div>
          <div className="w-full bg-[#00f2fe]/40 h-7 rounded-xs"></div>
          <div className="w-full bg-[#00f2fe]/80 h-5 rounded-xs"></div>
          <div className="w-full bg-[#67f4b7] h-3 rounded-xs"></div>
        </div>
      </div>
    </div>
  );
};
