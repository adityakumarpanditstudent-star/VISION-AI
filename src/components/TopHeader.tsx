import React from 'react';
import { PerformanceStats, AppCameraState } from '../types/vision';

interface TopHeaderProps {
  stats: PerformanceStats;
  cameraState: AppCameraState;
  onOpenDiagnostics: () => void;
  onOpenPrivacy: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  stats,
  cameraState,
  onOpenDiagnostics,
  onOpenPrivacy
}) => {
  const isCameraActive = cameraState === 'ACTIVE' || cameraState === 'FACE_DETECTED' || cameraState === 'MULTIPLE_FACES';

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#0c0e12]/95 backdrop-blur-xl border-b border-[#3a494b]/40 z-50 flex items-center justify-between px-4 sm:px-6">
      {/* Left Brand & Engine Info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded flex items-center justify-center bg-[#00f2fe]/10 border border-[#00f2fe]/40 text-[#00f2fe]">
            <span className="material-symbols-outlined text-[20px]">filter_center_focus</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-headline text-[17px] tracking-wider text-[#e0fdff] font-bold">
                VISION//AI
              </span>
              <span className="px-1.5 py-0.5 rounded bg-[#00f2fe]/20 border border-[#00f2fe]/40 text-[#6ff6ff] font-mono-tech text-[10px] uppercase font-semibold">
                Mesh-468
              </span>
            </div>
            <span className="font-mono-tech text-[9px] text-[#849495] tracking-wider uppercase">
              Laboratory Vision Engine v4.2
            </span>
          </div>
        </div>

        <div className="h-6 w-px bg-[#3a494b]/30 hidden xl:block"></div>

        {/* Real-time Status Badges */}
        <div className="hidden xl:flex items-center gap-2 font-mono-tech text-[11px]">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#191c1f] border ${isCameraActive ? 'border-[#67f4b7]/40 text-[#67f4b7]' : 'border-[#ffb4ab]/40 text-[#ffb4ab]'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isCameraActive ? 'bg-[#67f4b7] animate-pulse' : 'bg-[#ffb4ab]'}`}></span>
            <span>{isCameraActive ? 'CAMERA ACTIVE' : 'CAMERA INACTIVE'}</span>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#191c1f] border border-[#3a494b]/40 text-[#00f2fe]">
            <span className="material-symbols-outlined text-[14px]">speed</span>
            <span>{stats.fps} FPS</span>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#191c1f] border border-[#3a494b]/40 text-[#b9cacb]">
            <span className="material-symbols-outlined text-[14px]">timer</span>
            <span>LATENCY {stats.latencyMs}ms</span>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#191c1f] border border-[#3a494b]/40 text-[#adc6ff]">
            <span className="material-symbols-outlined text-[14px]">lock</span>
            <span>ENCRYPTION: HARDWARE-SECURE</span>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenPrivacy}
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#191c1f] border border-[#3a494b]/40 text-[#849495] hover:text-[#67f4b7] hover:border-[#67f4b7]/50 font-mono-tech text-[10px] transition-all cursor-pointer"
          title="Strict local edge processing. No frames uploaded."
        >
          <span className="material-symbols-outlined text-[14px] text-[#67f4b7]">verified_user</span>
          <span>LOCAL EDGE PROCESSING</span>
        </button>

        <div className="h-5 w-px bg-[#3a494b]/30 hidden lg:block"></div>

        <button
          onClick={onOpenDiagnostics}
          className="flex items-center gap-1 px-2.5 py-1 rounded border border-[#3a494b]/40 text-[#b9cacb] hover:border-[#00f2fe] hover:text-[#00f2fe] transition-all font-mono-tech text-[11px] bg-[#191c1f] cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">terminal</span>
          <span className="hidden md:inline">DIAGNOSTICS</span>
        </button>

        <div className="font-mono-tech text-[10px] text-[#849495] hidden 2xl:block">
          SYS::2026.09-UTC
        </div>
      </div>
    </header>
  );
};
