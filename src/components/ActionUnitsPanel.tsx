import React from 'react';
import { FacialMetrics, ActionUnits, ExpressionType } from '../types/vision';

interface ActionUnitsPanelProps {
  expression: {
    label: string;
    confidence: number;
  };
  metrics: FacialMetrics;
  actionUnits: ActionUnits;
}

export const ActionUnitsPanel: React.FC<ActionUnitsPanelProps> = ({
  expression,
  metrics,
  actionUnits
}) => {
  return (
    <div className="bg-[#191c1f] p-4 rounded-xl flex flex-col gap-3 shadow-md border border-[#3a494b]/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#00f2fe] text-[18px]">
            psychology
          </span>
          <span className="font-headline text-[15px] font-semibold text-[#e1e2e7] uppercase tracking-wide">
            Action Units FACS
          </span>
        </div>
        <span className="font-mono-tech text-[10px] text-[#67f4b7] bg-[#1d2023] px-2 py-0.5 rounded border border-[#3a494b]/30">
          NEURAL AU ENGINE
        </span>
      </div>

      {/* Primary Kinematic State Indicator */}
      <div className="bg-[#1d2023] p-3 rounded-lg flex items-center justify-between border border-[#3a494b]/30">
        <div className="flex flex-col">
          <span className="font-mono-tech text-[9px] text-[#849495] uppercase">
            NEURAL CLASSIFICATION
          </span>
          <span className="font-headline text-[16px] text-[#00f2fe] font-bold tracking-tight">
            {expression.label.toUpperCase()}
          </span>
        </div>
        <div className="text-right">
          <span className="font-mono-tech text-[9px] text-[#849495] uppercase">
            CONFIDENCE
          </span>
          <div className="font-headline text-[20px] text-[#67f4b7] font-bold">
            {expression.confidence}%
          </div>
        </div>
      </div>

      {/* Non-psychological scientific disclaimer */}
      <div className="p-2 rounded bg-[#0c0e12] text-[#849495] text-[10px] font-mono-tech leading-tight border border-[#3a494b]/20">
        <span className="text-[#00f2fe] font-semibold">NOTICE:</span> True neural blendshape extraction mapped to FACS Action Units.
      </div>

      {/* Dynamic AU Frequency & Intensity Telemetry Bars */}
      <div className="space-y-2.5 mt-1 font-mono-tech text-[11px] max-h-[340px] overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#3a494b transparent' }}>
        {actionUnits.map((au) => (
          <div key={au.id} className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-[#e1e2e7]">{au.id}: {au.name}</span>
              <span className="text-[#00f2fe] font-semibold">{au.value}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#0c0e12] rounded-xs overflow-hidden border border-[#3a494b]/20">
              <div
                className={`h-full rounded-xs transition-all duration-100 ${au.color}`}
                style={{ width: `${Math.min(100, Math.max(0, au.value))}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[9px] text-[#849495]">
              <span>STATUS</span>
              <span className={au.value > au.threshold ? 'text-[#e1e2e7]' : ''}>
                {au.value > au.threshold ? au.activeLabel : au.inactiveLabel}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
