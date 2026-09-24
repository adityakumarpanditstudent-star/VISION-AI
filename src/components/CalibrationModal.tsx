import React, { useState } from 'react';
import { DistanceEstimation } from '../types/vision';

interface CalibrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  distance: DistanceEstimation;
  onConfirmCalibration: (knownDistanceCm: number) => void;
}

export const CalibrationModal: React.FC<CalibrationModalProps> = ({
  isOpen,
  onClose,
  distance,
  onConfirmCalibration
}) => {
  const [targetDistance, setTargetDistance] = useState<number>(50);
  const [isCalibrating, setIsCalibrating] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCalibrate = () => {
    setIsCalibrating(true);
    setTimeout(() => {
      onConfirmCalibration(targetDistance);
      setIsCalibrating(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative max-w-md w-full bg-[#191c1f] border border-[#3a494b] rounded-xl p-6 shadow-2xl flex flex-col gap-4 font-mono-tech">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#3a494b]/40 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00f2fe] text-[20px]">
              straighten
            </span>
            <span className="font-headline text-[17px] font-bold text-[#e0fdff] uppercase">
              Calibrate Distance
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[#849495] hover:text-white transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-[#0c0e12] p-4 rounded-lg border border-[#3a494b]/30 space-y-3">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-[#00f2fe]/20 text-[#00f2fe] flex items-center justify-center text-[12px] font-bold shrink-0 mt-0.5">
              1
            </span>
            <p className="text-[12px] text-[#e1e2e7] leading-relaxed">
              Place your face approximately <strong className="text-[#00f2fe]">50 cm</strong> from the camera (roughly an arm's reach).
            </p>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-[#00f2fe]/20 text-[#00f2fe] flex items-center justify-center text-[12px] font-bold shrink-0 mt-0.5">
              2
            </span>
            <p className="text-[12px] text-[#e1e2e7] leading-relaxed">
              Ensure your head is upright and looking directly forward into the camera reticle.
            </p>
          </div>
        </div>

        {/* Current Sensor Reading */}
        <div className="flex items-center justify-between bg-[#1d2023] p-3 rounded border border-[#3a494b]/30 text-[12px]">
          <span className="text-[#849495]">CURRENT MEASUREMENT:</span>
          <span className="text-[#00f2fe] font-bold font-headline text-[18px]">
            {distance.approxDistanceCm} cm
          </span>
        </div>

        {/* Reference Distance Selection */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-[#849495]">
            <span>REFERENCE DISTANCE:</span>
            <span className="text-[#67f4b7] font-bold">{targetDistance} cm</span>
          </div>
          <input
            type="range"
            min="30"
            max="80"
            step="5"
            value={targetDistance}
            onChange={(e) => setTargetDistance(Number(e.target.value))}
            className="w-full accent-[#00f2fe] cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-[#849495]">
            <span>30 cm (Close)</span>
            <span>50 cm (Standard Arm's Reach)</span>
            <span>80 cm (Desk Distant)</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded bg-[#1d2023] hover:bg-[#282a2e] text-[#b9cacb] text-[11px] border border-[#3a494b]/30 transition-all cursor-pointer"
          >
            CANCEL
          </button>
          <button
            onClick={handleCalibrate}
            disabled={isCalibrating}
            className="flex-1 py-2 rounded bg-[#00f2fe] hover:bg-white text-[#00373a] font-bold text-[11px] transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(0,242,254,0.3)] disabled:opacity-50"
          >
            {isCalibrating ? (
              <>
                <span className="material-symbols-outlined text-[16px] animate-spin">
                  progress_activity
                </span>
                <span>CALIBRATING...</span>
              </>
            ) : (
              <span>CONFIRM 50 CM</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
