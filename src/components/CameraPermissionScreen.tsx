import React from 'react';

interface CameraPermissionScreenProps {
  isDenied: boolean;
  onEnableCamera: () => void;
  onContinueWithDemo: () => void;
}

export const CameraPermissionScreen: React.FC<CameraPermissionScreenProps> = ({
  isDenied,
  onEnableCamera,
  onContinueWithDemo
}) => {
  return (
    <div className="fixed inset-0 bg-[#0c0e12] z-50 flex items-center justify-center p-6">
      {/* Background ambient mesh grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#00f2fe15_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40"></div>

      <div className="relative max-w-md w-full bg-[#191c1f] border border-[#3a494b]/50 rounded-2xl p-8 flex flex-col items-center text-center shadow-2xl">
        <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-[#00f2fe]/10 border border-[#00f2fe]/40 text-[#00f2fe] mb-6 shadow-[0_0_20px_rgba(0,242,254,0.2)]">
          <span className="material-symbols-outlined text-[36px]">filter_center_focus</span>
        </div>

        <h1 className="font-headline text-[32px] font-bold text-[#e0fdff] tracking-widest uppercase">
          VISIONAI
        </h1>

        <p className="font-headline text-[17px] text-[#adc6ff] font-medium tracking-wide mt-1">
          Real-Time Facial Vision
        </p>

        <div className="w-12 h-0.5 bg-[#00f2fe]/40 my-5"></div>

        <p className="text-[#e1e2e7] text-[14px] leading-relaxed mb-6 font-sans">
          Camera access is required for real-time facial landmark and expression analysis.
        </p>

        {isDenied && (
          <div className="w-full bg-[#ffb4ab]/15 border border-[#ffb4ab]/30 rounded-lg p-3 mb-6 text-[#ffb4ab] text-[12px] font-mono-tech flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>Camera permission was denied. Click below to allow or launch the synthetic test matrix.</span>
          </div>
        )}

        <button
          onClick={onEnableCamera}
          className="w-full py-3.5 px-6 rounded bg-[#00f2fe] hover:bg-white text-[#00373a] font-mono-tech text-[13px] font-bold tracking-wider transition-all duration-200 cursor-pointer shadow-[0_0_16px_rgba(0,242,254,0.35)] flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">videocam</span>
          <span>ENABLE CAMERA</span>
        </button>

        <button
          onClick={onContinueWithDemo}
          className="w-full mt-3 py-2.5 px-4 rounded bg-[#1d2023] hover:bg-[#282a2e] text-[#b9cacb] hover:text-[#00f2fe] font-mono-tech text-[12px] border border-[#3a494b]/40 transition-all cursor-pointer"
        >
          CONTINUE WITH SYNTHETIC SENSOR MATRIX
        </button>

        <div className="mt-6 flex items-center gap-2 text-[#849495] font-mono-tech text-[10px]">
          <span className="material-symbols-outlined text-[14px] text-[#67f4b7]">lock</span>
          <span>Strict on-device edge processing. Zero frames uploaded.</span>
        </div>
      </div>
    </div>
  );
};
