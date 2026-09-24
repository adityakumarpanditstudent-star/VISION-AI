import React from 'react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative max-w-lg w-full bg-[#191c1f] border border-[#3a494b] rounded-xl p-6 shadow-2xl flex flex-col gap-4 font-mono-tech">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#3a494b]/40 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#67f4b7] text-[22px]">
              verified_user
            </span>
            <span className="font-headline text-[17px] font-bold text-[#e0fdff] uppercase">
              Privacy & Biometric Protocol
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[#849495] hover:text-white transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Core Notice */}
        <div className="bg-[#67f4b7]/10 border border-[#67f4b7]/30 p-3 rounded-lg text-[#67f4b7] text-[12px] flex items-center gap-2.5">
          <span className="material-symbols-outlined text-[20px] shrink-0">shield</span>
          <span className="font-semibold">
            Camera processing happens strictly locally on this device.
          </span>
        </div>

        {/* Policy Points */}
        <div className="space-y-3 text-[11px] text-[#e1e2e7] leading-relaxed">
          <div className="bg-[#0c0e12] p-3 rounded border border-[#3a494b]/20">
            <h4 className="text-[#00f2fe] font-bold uppercase mb-1">
              1. Local Camera Execution & Zero Cloud Storage
            </h4>
            <p className="text-[#b9cacb]">
              Camera frames are analyzed in real time inside device volatile memory (GPU / NPU / RAM). No frame or video clip is ever transmitted over the network or saved to persistent disk.
            </p>
          </div>

          <div className="bg-[#0c0e12] p-3 rounded border border-[#3a494b]/20">
            <h4 className="text-[#00f2fe] font-bold uppercase mb-1">
              2. No Biometric Identification or Profiling
            </h4>
            <p className="text-[#b9cacb]">
              VisionAI performs anonymous topological tracking (468 geometric landmark coordinates) for facial movement and head-pose analysis. It does NOT identify individuals, cross-reference databases, or store facial recognition templates.
            </p>
          </div>

          <div className="bg-[#0c0e12] p-3 rounded border border-[#3a494b]/20">
            <h4 className="text-[#00f2fe] font-bold uppercase mb-1">
              3. Authentic Data Only — No Face Swapping or Reconstruction
            </h4>
            <p className="text-[#b9cacb]">
              The application explicitly forbids facial generative tampering, beauty smoothing filters, deepfakes, or face swapping. The camera feed represents genuine, unaltered optical reality.
            </p>
          </div>

          <div className="bg-[#0c0e12] p-3 rounded border border-[#3a494b]/20">
            <h4 className="text-[#00f2fe] font-bold uppercase mb-1">
              4. Lifecycle Auto-Release
            </h4>
            <p className="text-[#b9cacb]">
              When the application is minimized, backgrounded, or when you tap STOP CAMERA, the camera hardware pipeline is immediately closed and released to the operating system.
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded bg-[#00f2fe] hover:bg-white text-[#00373a] font-bold text-[12px] uppercase transition-all cursor-pointer shadow-[0_0_12px_rgba(0,242,254,0.3)] mt-1"
        >
          CONFIRM & CLOSE
        </button>
      </div>
    </div>
  );
};
