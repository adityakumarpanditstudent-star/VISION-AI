import React from 'react';
import { HeadPose } from '../types/vision';

interface HeadPoseGimbalProps {
  headPose: HeadPose;
}

export const HeadPoseGimbal: React.FC<HeadPoseGimbalProps> = ({ headPose }) => {
  const { yaw, pitch, roll, orientation } = headPose;

  // Calculate SVG gimbal transformations based on orientation
  const yawAngle = Math.max(-45, Math.min(45, yaw));
  const pitchAngle = Math.max(-45, Math.min(45, pitch));
  const rollAngle = Math.max(-45, Math.min(45, roll));

  // Compute 3D vector line endpoints in 120x120 SVG space
  const cx = 60;
  const cy = 60;
  const vecX = cx + (yawAngle / 45) * 26;
  const vecY = cy + (pitchAngle / 45) * 22;

  return (
    <div className="bg-[#191c1f] p-4 rounded-xl flex flex-col gap-3 shadow-md border border-[#3a494b]/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#adc6ff] text-[18px]">
            screen_rotation
          </span>
          <span className="font-headline text-[15px] font-semibold text-[#e1e2e7] uppercase tracking-wide">
            Head Pose & Spatial
          </span>
        </div>
        <span className="font-mono-tech text-[10px] text-[#adc6ff] bg-[#1d2023] px-2 py-0.5 rounded border border-[#3a494b]/30 font-medium">
          3-DOF
        </span>
      </div>

      {/* 3D Gimbal Vector Diagram */}
      <div className="relative bg-[#0c0e12] rounded-lg p-3 flex items-center justify-center h-36 overflow-hidden border border-[#3a494b]/30">
        <svg className="w-32 h-32" viewBox="0 0 120 120">
          {/* Outer Ring (Roll Axis) */}
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="#3a494b"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />

          {/* Pitch Ellipse rotated by current pitch */}
          <ellipse
            cx="60"
            cy="60"
            rx="42"
            ry={Math.max(8, 24 - Math.abs(pitchAngle) * 0.25)}
            fill="none"
            stroke="#adc6ff"
            strokeWidth="1.5"
            transform={`rotate(${rollAngle} 60 60)`}
          />

          {/* Yaw Ellipse rotated by current yaw */}
          <ellipse
            cx="60"
            cy="60"
            rx={Math.max(6, 20 - Math.abs(yawAngle) * 0.2)}
            ry="46"
            fill="none"
            stroke="#00f2fe"
            strokeWidth="1.5"
            transform={`rotate(${yawAngle} 60 60)`}
          />

          {/* Center Anchor Point */}
          <circle cx="60" cy="60" r="3" fill="#67f4b7" />

          {/* Dynamic 3D Spatial Vector pointing to face orientation */}
          <line
            x1="60"
            y1="60"
            x2={vecX}
            y2={vecY}
            stroke="#00f2fe"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          <circle cx={vecX} cy={vecY} r="3" fill="#00f2fe" />

          {/* Roll Reference Line */}
          <line
            x1="60"
            y1="60"
            x2="60"
            y2="20"
            stroke="#adc6ff"
            strokeWidth="1.5"
            strokeDasharray="2 2"
            transform={`rotate(${rollAngle} 60 60)`}
          />
        </svg>

        <div className="absolute top-2 left-2 text-[9px] font-mono-tech text-[#849495]">
          ANGULAR VEL: {(Math.abs(yaw) * 0.008 + 0.01).toFixed(2)} rad/s
        </div>
        <div className="absolute bottom-2 right-2 text-[9px] font-mono-tech text-[#00f2fe] uppercase">
          {orientation}
        </div>
      </div>

      {/* Discrete Degree Readouts */}
      <div className="space-y-1.5 font-mono-tech text-[11px]">
        <div className="flex justify-between items-center bg-[#1d2023] px-2.5 py-1.5 rounded border border-[#3a494b]/20">
          <span className="text-[#849495]">YAW (AZIMUTH):</span>
          <span className="text-[#00f2fe] font-semibold">
            {yaw >= 0 ? `+${yaw.toFixed(1)}°` : `${yaw.toFixed(1)}°`}
          </span>
        </div>
        <div className="flex justify-between items-center bg-[#1d2023] px-2.5 py-1.5 rounded border border-[#3a494b]/20">
          <span className="text-[#849495]">PITCH (ELEVATION):</span>
          <span className="text-[#adc6ff] font-semibold">
            {pitch >= 0 ? `+${pitch.toFixed(1)}°` : `${pitch.toFixed(1)}°`}
          </span>
        </div>
        <div className="flex justify-between items-center bg-[#1d2023] px-2.5 py-1.5 rounded border border-[#3a494b]/20">
          <span className="text-[#849495]">ROLL (TILT):</span>
          <span className="text-[#67f4b7] font-semibold">
            {roll >= 0 ? `+${roll.toFixed(1)}°` : `${roll.toFixed(1)}°`}
          </span>
        </div>
      </div>
    </div>
  );
};
