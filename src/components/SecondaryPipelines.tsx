import React from 'react';
import { TrackedFace, PerformanceStats, DistanceEstimation } from '../types/vision';
import { SessionRecordingsPanel } from './SessionRecordingsPanel';
import { OpticalSensorLogsPanel } from './OpticalSensorLogsPanel';

interface SecondaryPipelinesProps {
  pipelineId: string;
  primaryFace: TrackedFace | null;
  stats: PerformanceStats;
  distance: DistanceEstimation;
  onOpenCalibration: () => void;
  onOpenDiagnostics: () => void;
}

export const SecondaryPipelines: React.FC<SecondaryPipelinesProps> = ({
  pipelineId,
  primaryFace,
  stats,
  distance,
  onOpenCalibration,
  onOpenDiagnostics
}) => {
  if (pipelineId === 'action-units-monitor') {
    return (
      <div className="p-6 space-y-5 bg-[#0c0e12] min-h-[calc(100vh-6rem)] font-mono-tech">
        <div className="bg-[#191c1f] p-5 rounded-xl border border-[#3a494b]/30">
          <div className="flex items-center gap-2 text-[#00f2fe] mb-1">
            <span className="material-symbols-outlined text-[24px]">sentiment_satisfied</span>
            <h2 className="font-headline text-[20px] font-bold text-[#e0fdff]">
              Action Units Monitor (FACS In-Depth)
            </h2>
          </div>
          <p className="text-[12px] text-[#849495]">
            Full kinematic decomposition of 18 facial action units across upper and lower face facial muscle groups.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { au: 'AU01', name: 'Inner Brow Raiser', muscle: 'Frontalis, pars medialis', val: primaryFace?.actionUnits.au1_2_browElevation || 14 },
            { au: 'AU02', name: 'Outer Brow Raiser', muscle: 'Frontalis, pars lateralis', val: primaryFace?.actionUnits.au1_2_browElevation || 12 },
            { au: 'AU04', name: 'Brow Lowerer', muscle: 'Corrugator supercilii', val: primaryFace?.actionUnits.au4_browFurrow || 4 },
            { au: 'AU05', name: 'Upper Lid Raiser', muscle: 'Levator palpebrae', val: primaryFace?.metrics.eyeOpenness || 86 },
            { au: 'AU06', name: 'Cheek Raiser', muscle: 'Orbicularis oculi', val: primaryFace?.actionUnits.au12_lipCornerPull ? Math.round(primaryFace.actionUnits.au12_lipCornerPull * 0.7) : 8 },
            { au: 'AU12', name: 'Lip Corner Puller', muscle: 'Zygomaticus major', val: primaryFace?.actionUnits.au12_lipCornerPull || 12 },
            { au: 'AU14', name: 'Dimpler', muscle: 'Buccinator', val: 6 },
            { au: 'AU15', name: 'Lip Corner Depressor', muscle: 'Depressor anguli oris', val: 5 },
            { au: 'AU25', name: 'Lips Part', muscle: 'Depressor labii inferioris', val: primaryFace?.metrics.mouthOpenness || 7 },
            { au: 'AU26', name: 'Jaw Drop', muscle: 'Masseter / Temporalis', val: primaryFace?.actionUnits.au26_27_jawOpen || 7 },
            { au: 'AU45', name: 'Blink / Aperture', muscle: 'Orbicularis oculi', val: primaryFace?.actionUnits.au45_blinkEyeAperture || 88 },
            { au: 'AU46', name: 'Wink (Unilateral)', muscle: 'Orbicularis oculi', val: Math.abs((primaryFace?.metrics.leftEyeOpenness || 85) - (primaryFace?.metrics.rightEyeOpenness || 85)) }
          ].map((item) => (
            <div key={item.au} className="bg-[#191c1f] p-4 rounded-lg border border-[#3a494b]/20 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="px-1.5 py-0.5 rounded bg-[#00f2fe]/10 text-[#00f2fe] font-bold text-[10px] border border-[#00f2fe]/30">
                  {item.au}
                </span>
                <span className="text-[#67f4b7] font-bold text-[14px]">
                  {item.val}%
                </span>
              </div>
              <div>
                <span className="text-[12px] text-[#e1e2e7] font-semibold block">{item.name}</span>
                <span className="text-[9px] text-[#849495]">{item.muscle}</span>
              </div>
              <div className="w-full h-1.5 bg-[#0c0e12] rounded overflow-hidden">
                <div className="h-full bg-[#00f2fe] rounded" style={{ width: `${item.val}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (pipelineId === 'subject-registry') {
    return (
      <div className="p-6 space-y-5 bg-[#0c0e12] min-h-[calc(100vh-6rem)] font-mono-tech">
        <div className="bg-[#191c1f] p-5 rounded-xl border border-[#3a494b]/30">
          <div className="flex items-center gap-2 text-[#00f2fe] mb-1">
            <span className="material-symbols-outlined text-[24px]">badge</span>
            <h2 className="font-headline text-[20px] font-bold text-[#e0fdff]">
              Subject Registry & Session Metrics
            </h2>
          </div>
          <p className="text-[12px] text-[#849495]">
            Temporary tracking session identification for multi-face disambiguation.
          </p>
        </div>

        <div className="bg-[#191c1f] rounded-xl border border-[#3a494b]/30 overflow-hidden">
          <table className="w-full text-left text-[11px]">
            <thead className="bg-[#1d2023] text-[#849495] uppercase text-[9px] border-b border-[#3a494b]/30">
              <tr>
                <th className="p-3">Track ID</th>
                <th className="p-3">Role</th>
                <th className="p-3">Confidence</th>
                <th className="p-3">Approx Distance</th>
                <th className="p-3">Head Yaw/Pitch</th>
                <th className="p-3">Tracking State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3a494b]/20">
              {primaryFace ? (
                <tr className="hover:bg-[#1d2023]/50">
                  <td className="p-3 text-[#00f2fe] font-bold">#FACE-01</td>
                  <td className="p-3 text-[#67f4b7]">PRIMARY TARGET</td>
                  <td className="p-3">{(primaryFace.confidence * 100).toFixed(1)}%</td>
                  <td className="p-3">{distance.approxDistanceCm} cm</td>
                  <td className="p-3">{primaryFace.headPose.yaw.toFixed(1)}° / {primaryFace.headPose.pitch.toFixed(1)}°</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-[#67f4b7]/15 text-[#67f4b7] text-[9px]">LOCKED</span></td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-[#849495]">
                    No subjects actively tracked. Start the camera to detect faces.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (pipelineId === 'neural-model-calibration') {
    return (
      <div className="p-6 space-y-5 bg-[#0c0e12] min-h-[calc(100vh-6rem)] font-mono-tech">
        <div className="bg-[#191c1f] p-5 rounded-xl border border-[#3a494b]/30 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 text-[#00f2fe] mb-1">
              <span className="material-symbols-outlined text-[24px]">model_training</span>
              <h2 className="font-headline text-[20px] font-bold text-[#e0fdff]">
                Neural Model & Optical Calibration
              </h2>
            </div>
            <p className="text-[12px] text-[#849495]">
              Calibrate camera focal lengths, distance baselines, and geometric thresholds.
            </p>
          </div>
          <button
            onClick={onOpenCalibration}
            className="px-4 py-2 rounded bg-[#00f2fe] text-[#00373a] font-bold text-[11px] cursor-pointer hover:bg-white transition-all shadow-[0_0_12px_rgba(0,242,254,0.3)]"
          >
            START 50CM CALIBRATION
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#191c1f] p-4 rounded-xl border border-[#3a494b]/30 space-y-3">
            <h3 className="text-[#00f2fe] font-bold text-[13px] uppercase">
              Distance Calibration State
            </h3>
            <div className="flex justify-between items-center bg-[#0c0e12] p-3 rounded">
              <span className="text-[#849495]">STATUS:</span>
              <span className={distance.isCalibrated ? 'text-[#67f4b7] font-bold' : 'text-[#adc6ff]'}>
                {distance.isCalibrated ? 'CALIBRATED (50 CM BASELINE)' : 'UNCALIBRATED (FACTORY PROFILE)'}
              </span>
            </div>
            <div className="flex justify-between items-center bg-[#0c0e12] p-3 rounded">
              <span className="text-[#849495]">ACCURACY CONFIDENCE:</span>
              <span className="text-[#00f2fe] font-bold">{distance.confidence}</span>
            </div>
          </div>

          <div className="bg-[#191c1f] p-4 rounded-xl border border-[#3a494b]/30 space-y-3">
            <h3 className="text-[#00f2fe] font-bold text-[13px] uppercase">
              Optical Tensor Parameters
            </h3>
            <div className="flex justify-between items-center bg-[#0c0e12] p-3 rounded">
              <span className="text-[#849495]">INTEROCULAR BASELINE:</span>
              <span className="text-[#e1e2e7] font-bold">6.3 cm (Standard Human)</span>
            </div>
            <div className="flex justify-between items-center bg-[#0c0e12] p-3 rounded">
              <span className="text-[#849495]">EXPONENTIAL SMOOTHING:</span>
              <span className="text-[#67f4b7] font-bold">ALPHA = 0.25 (LOW JITTER)</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Session Recordings
  if (pipelineId === 'session-recordings') {
    return (
      <SessionRecordingsPanel
        primaryFace={primaryFace}
        stats={stats}
      />
    );
  }

  // Optical Sensor Logs
  if (pipelineId === 'optical-sensor-logs') {
    return (
      <OpticalSensorLogsPanel
        primaryFace={primaryFace}
        stats={stats}
      />
    );
  }

  // Fallback
  return (
    <div className="p-6 space-y-5 bg-[#0c0e12] min-h-[calc(100vh-6rem)] font-mono-tech">
      <div className="bg-[#191c1f] p-5 rounded-xl border border-[#3a494b]/30">
        <div className="flex items-center gap-2 text-[#00f2fe] mb-1">
          <span className="material-symbols-outlined text-[24px]">sensors</span>
          <h2 className="font-headline text-[20px] font-bold text-[#e0fdff]">
            Pipeline: {pipelineId}
          </h2>
        </div>
        <p className="text-[12px] text-[#849495]">
          This pipeline is not yet configured.
        </p>
      </div>
    </div>
  );
};

