import React from 'react';
import { DistanceEstimation } from '../types/vision';

interface DepthEstimationPanelProps {
  distance: DistanceEstimation;
  onOpenCalibration: () => void;
}

export const DepthEstimationPanel: React.FC<DepthEstimationPanelProps> = ({
  distance,
  onOpenCalibration
}) => {
  const { approxDistanceCm, confidence, isCalibrated, status } = distance;

  // Calculate percentage along the 20cm to 120cm meter
  const meterPercent = Math.max(
    5,
    Math.min(95, ((approxDistanceCm - 20) / (120 - 20)) * 100)
  );

  return (
    <div className="bg-[#191c1f] p-4 rounded-xl flex flex-col gap-3 shadow-md border border-[#3a494b]/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#67f4b7] text-[18px]">
            straighten
          </span>
          <span className="font-headline text-[15px] font-semibold text-[#e1e2e7] uppercase tracking-wide">
            Depth Estimation
          </span>
        </div>
        <button
          onClick={onOpenCalibration}
          className="text-[#00f2fe] hover:text-white bg-[#00f2fe]/10 hover:bg-[#00f2fe]/20 px-2 py-0.5 rounded border border-[#00f2fe]/30 font-mono-tech text-[10px] uppercase font-semibold transition-all cursor-pointer"
        >
          CALIBRATE
        </button>
      </div>

      <div className="flex items-baseline justify-between">
        <div className="flex items-baseline gap-1.5">
          <span className="font-headline text-[32px] text-[#e0fdff] font-bold">
            {approxDistanceCm}
          </span>
          <span className="font-headline text-[16px] text-[#b9cacb]">cm</span>
          <span className="font-mono-tech text-[10px] text-[#849495] ml-1">
            (APPROX.)
          </span>
        </div>

        <span
          className={`px-2 py-0.5 rounded font-mono-tech text-[10px] font-semibold uppercase ${
            status === 'NOMINAL_RANGE'
              ? 'bg-[#67f4b7]/15 text-[#67f4b7]'
              : status === 'TOO_CLOSE'
              ? 'bg-[#ffb4ab]/20 text-[#ffb4ab]'
              : 'bg-[#adc6ff]/20 text-[#adc6ff]'
          }`}
        >
          {status === 'NOMINAL_RANGE'
            ? 'NOMINAL RANGE'
            : status === 'TOO_CLOSE'
            ? 'TOO CLOSE'
            : 'FAR RANGE'}
        </span>
      </div>

      {/* Interactive Depth Bar Meter */}
      <div className="space-y-1.5 mt-1">
        <div className="relative w-full h-3.5 bg-[#0c0e12] rounded overflow-hidden flex items-center border border-[#3a494b]/30">
          {/* Sweet spot background band (50-75cm zone, roughly 30% to 55%) */}
          <div className="absolute left-[30%] w-[25%] h-full bg-[#67f4b7]/20 border-x border-[#67f4b7]/30"></div>

          {/* Actual reading fill bar */}
          <div
            className="h-full bg-[#00f2fe] rounded-xs transition-all duration-300 opacity-80"
            style={{ width: `${meterPercent}%` }}
          ></div>

          {/* Target indicator line */}
          <div
            className="absolute top-0 bottom-0 w-1.5 bg-white shadow-[0_0_6px_#00f2fe] transition-all duration-300"
            style={{ left: `calc(${meterPercent}% - 3px)` }}
          ></div>
        </div>

        <div className="flex justify-between text-[9px] font-mono-tech text-[#849495]">
          <span>20cm (CLOSE)</span>
          <span className="text-[#67f4b7] font-bold">OPTIMAL (50-75cm)</span>
          <span>120cm (FAR)</span>
        </div>
      </div>

      <div className="flex justify-between items-center text-[10px] font-mono-tech text-[#849495] bg-[#1d2023] px-2.5 py-1.5 rounded border border-[#3a494b]/20">
        <span>CONFIDENCE: <strong className={isCalibrated ? 'text-[#67f4b7]' : 'text-[#adc6ff]'}>{confidence}</strong></span>
        <span>STATUS: {isCalibrated ? 'CALIBRATED' : 'UNCALIBRATED'}</span>
      </div>
    </div>
  );
};
