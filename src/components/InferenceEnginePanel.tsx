import React from 'react';
import { PerformanceStats } from '../types/vision';

interface InferenceEnginePanelProps {
  stats: PerformanceStats;
  isHighPrecision: boolean;
}

export const InferenceEnginePanel: React.FC<InferenceEnginePanelProps> = ({
  stats,
  isHighPrecision
}) => {
  return (
    <div className="bg-[#191c1f] p-4 rounded-xl flex flex-col gap-3 shadow-md border border-[#3a494b]/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#adc6ff] text-[18px]">
            memory
          </span>
          <span className="font-headline text-[15px] font-semibold text-[#e1e2e7] uppercase tracking-wide">
            Inference Engine
          </span>
        </div>
        <span className="font-mono-tech text-[10px] text-[#67f4b7] bg-[#1d2023] px-2 py-0.5 rounded border border-[#3a494b]/30 font-semibold">
          ONLINE
        </span>
      </div>

      <div className="space-y-1.5 font-mono-tech text-[11px]">
        <div className="flex justify-between items-center bg-[#1d2023] px-2.5 py-1.5 rounded border border-[#3a494b]/20">
          <span className="text-[#849495]">ACCELERATOR:</span>
          <span className="text-[#00f2fe] font-semibold">
            {stats.processingBackend === 'LOCAL_WEBGPU' ? 'WebGPU Tensor Core' : 'Client WASM SIMD'}
          </span>
        </div>

        <div className="flex justify-between items-center bg-[#1d2023] px-2.5 py-1.5 rounded border border-[#3a494b]/20">
          <span className="text-[#849495]">MODEL ARCH:</span>
          <span className="text-[#00f2fe] font-semibold">
            MediaPipe FaceMesh 468
          </span>
        </div>

        <div className="flex justify-between items-center bg-[#1d2023] px-2.5 py-1.5 rounded border border-[#3a494b]/20">
          <span className="text-[#849495]">TOTAL LATENCY:</span>
          <span className="text-[#67f4b7] font-bold">
            {stats.latencyMs} ms ({stats.fps} FPS)
          </span>
        </div>

        <div className="flex justify-between items-center bg-[#1d2023] px-2.5 py-1.5 rounded border border-[#3a494b]/20">
          <span className="text-[#849495]">PIPELINE EXEC:</span>
          <span className="text-[#adc6ff] font-semibold">
            Zero-Cloud / On-Device
          </span>
        </div>
      </div>

      <div className="mt-0.5 pt-2 bg-[#1d2023] rounded-lg p-2.5 flex items-center justify-between border border-[#3a494b]/20">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[#67f4b7] text-[16px]">
            verified
          </span>
          <span className="font-mono-tech text-[10px] text-[#e1e2e7]">
            HARDWARE ENCLAVE SECURED
          </span>
        </div>
        <span className="font-mono-tech text-[9px] text-[#849495]">
          {isHighPrecision ? 'FP32 QUANT' : 'INT8 QUANT'}
        </span>
      </div>
    </div>
  );
};
