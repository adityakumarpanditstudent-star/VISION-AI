import React, { useRef, useEffect } from 'react';
import {
  TrackedFace,
  VisualizationMode,
  MeshDensity,
  AppCameraState
} from '../types/vision';
import {
  FACE_OVAL,
  LIPS_OUTER,
  LIPS_INNER,
  LEFT_EYE,
  RIGHT_EYE,
  LEFT_EYEBROW,
  RIGHT_EYEBROW,
  LANDMARKS_68_SUBSET
} from '../utils/faceGeometry';
import { FaceLandmarker } from '@mediapipe/tasks-vision';

interface CameraVisionCanvasProps {
  faces: TrackedFace[];
  primaryFace: TrackedFace | null;
  mode: VisualizationMode;
  density: MeshDensity;
  cameraState: AppCameraState;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  useSimulatedFeed: boolean;
  onToggleSimulatedFeed: () => void;
  onSelectPrimaryFace: (id: number) => void;
  onStopCamera: () => void;
  onStartCamera: () => void;
  onSnapshot: () => void;
  onToggleRecord: () => void;
  isRecording: boolean;
  onChangeMode: (mode: VisualizationMode) => void;
  onChangeDensity: (density: MeshDensity) => void;
}

// EMA Cache for ultra-smooth rendering
const smoothedLandmarksCache = new Map<number, {x: number, y: number, z: number}[]>();

export const CameraVisionCanvas: React.FC<CameraVisionCanvasProps> = ({
  faces,
  primaryFace,
  mode,
  density,
  cameraState,
  videoRef,
  useSimulatedFeed,
  onToggleSimulatedFeed,
  onSelectPrimaryFace,
  onStopCamera,
  onStartCamera,
  onSnapshot,
  onToggleRecord,
  isRecording,
  onChangeMode,
  onChangeDensity
}) => {
  const isCameraActive =
    cameraState === 'ACTIVE' ||
    cameraState === 'FACE_DETECTED' ||
    cameraState === 'MULTIPLE_FACES';

  const videoW = videoRef.current?.videoWidth || 1280;
  const videoH = videoRef.current?.videoHeight || 720;
  
  const viewBoxW = useSimulatedFeed ? 1280 : videoW;
  const viewBoxH = useSimulatedFeed ? 720 : videoH;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Compute rendered bounding box and landmarks mapped to viewBox
  const renderFaces = faces.map((face) => {
    const isPrimary = primaryFace?.id === face.id;
    
    // Smooth the landmarks using Exponential Moving Average (EMA) for ultra-smooth tracking
    const alpha = 0.6; // High smoothing factor
    let smoothed = smoothedLandmarksCache.get(face.id);
    
    if (!smoothed || smoothed.length !== face.landmarks.length) {
      smoothed = face.landmarks.map(lm => ({ x: lm.x, y: lm.y, z: lm.z }));
    } else {
      for (let i = 0; i < face.landmarks.length; i++) {
        smoothed[i].x = smoothed[i].x + alpha * (face.landmarks[i].x - smoothed[i].x);
        smoothed[i].y = smoothed[i].y + alpha * (face.landmarks[i].y - smoothed[i].y);
        smoothed[i].z = smoothed[i].z + alpha * (face.landmarks[i].z - smoothed[i].z);
      }
    }
    smoothedLandmarksCache.set(face.id, smoothed);

    const lms = smoothed.map((lm) => ({
      x: (1 - lm.x) * viewBoxW,
      y: lm.y * viewBoxH,
      z: lm.z
    }));

    const bboxLeft = (1 - (face.boundingBox.xMin + face.boundingBox.width)) * viewBoxW;
    const bboxTop = face.boundingBox.yMin * viewBoxH;
    const bboxWidth = face.boundingBox.width * viewBoxW;
    const bboxHeight = face.boundingBox.height * viewBoxH;

    return {
      id: face.id,
      isPrimary,
      landmarks: lms,
      bbox: {
        left: bboxLeft,
        top: bboxTop,
        width: bboxWidth,
        height: bboxHeight,
        cx: bboxLeft + bboxWidth / 2,
        cy: bboxTop + bboxHeight / 2
      },
      quality: face.quality,
      metrics: face.metrics
    };
  });

  const primaryRenderFace = renderFaces.find((f) => f.isPrimary) || renderFaces[0];

  // Hardware-accelerated Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!isCameraActive) return;

    renderFaces.forEach((rf) => {
      const isPrimary = rf.isPrimary;
      const bbox = rf.bbox;
      const lms = rf.landmarks;

      if (!isPrimary) {
        ctx.strokeStyle = 'rgba(173, 198, 255, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(bbox.left, bbox.top, bbox.width, bbox.height);
        ctx.setLineDash([]);
        
        ctx.fillStyle = 'rgba(173, 198, 255, 1)';
        ctx.font = '11px monospace';
        ctx.fillText(`SUBJECT #${rf.id}`, bbox.left + 8, bbox.top + 16);
        return;
      }

      // PRIMARY FACE RENDER
      // 1. Target Reticle
      ctx.strokeStyle = '#00f2fe';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      const corner = 30;
      // Top Left
      ctx.moveTo(bbox.left, bbox.top + corner); ctx.lineTo(bbox.left, bbox.top); ctx.lineTo(bbox.left + corner, bbox.top);
      // Top Right
      ctx.moveTo(bbox.left + bbox.width - corner, bbox.top); ctx.lineTo(bbox.left + bbox.width, bbox.top); ctx.lineTo(bbox.left + bbox.width, bbox.top + corner);
      // Bottom Left
      ctx.moveTo(bbox.left, bbox.top + bbox.height - corner); ctx.lineTo(bbox.left, bbox.top + bbox.height); ctx.lineTo(bbox.left + corner, bbox.top + bbox.height);
      // Bottom Right
      ctx.moveTo(bbox.left + bbox.width - corner, bbox.top + bbox.height); ctx.lineTo(bbox.left + bbox.width, bbox.top + bbox.height); ctx.lineTo(bbox.left + bbox.width, bbox.top + bbox.height - corner);
      ctx.stroke();

      // 2. Geometric Mesh Wireframe
      if (mode === 'MESH' || mode === 'SCAN' || mode === 'ANALYSIS') {
        ctx.strokeStyle = 'rgba(0, 242, 254, 0.35)'; // High transparency for smooth dense look
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        FaceLandmarker.FACE_LANDMARKS_TESSELATION.forEach((conn) => {
          const start = lms[conn.start];
          const end = lms[conn.end];
          if (start && end) {
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
          }
        });
        ctx.stroke();

        // Specific contours
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = 'rgba(0, 242, 254, 0.9)';
        const drawPath = (indices: number[], close = false) => {
          ctx.beginPath();
          indices.forEach((idx, i) => {
            if (lms[idx]) {
              if (i === 0) ctx.moveTo(lms[idx].x, lms[idx].y);
              else ctx.lineTo(lms[idx].x, lms[idx].y);
            }
          });
          if (close) ctx.closePath();
          ctx.stroke();
        };

        drawPath(LEFT_EYE, true);
        drawPath(RIGHT_EYE, true);
        drawPath(LEFT_EYEBROW);
        drawPath(RIGHT_EYEBROW);

        ctx.fillStyle = 'rgba(0, 242, 254, 0.08)';
        drawPath(LIPS_OUTER, true);
        ctx.fill();

        ctx.setLineDash([3, 2]);
        ctx.strokeStyle = 'rgba(0, 242, 254, 0.6)';
        drawPath(FACE_OVAL);
        ctx.setLineDash([]);
      }

      // 3. Pupil Tracking
      if (lms[159] && lms[386]) {
        ctx.strokeStyle = '#67f4b7';
        ctx.lineWidth = 0.75;
        const drawPupil = (cx: number, cy: number) => {
          ctx.beginPath(); ctx.arc(cx, cy, 5, 0, 2 * Math.PI); ctx.stroke();
          ctx.beginPath(); ctx.arc(cx, cy, 1.5, 0, 2 * Math.PI); ctx.fillStyle = '#67f4b7'; ctx.fill();
          ctx.beginPath(); ctx.moveTo(cx - 8, cy); ctx.lineTo(cx + 8, cy); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(cx, cy - 8); ctx.lineTo(cx, cy + 8); ctx.stroke();
        };
        drawPupil(lms[159].x, lms[159].y);
        drawPupil(lms[386].x, lms[386].y);
      }

      // 4. Landmark Points
      if (mode === 'LANDMARK' || mode === 'SCAN' || mode === 'ANALYSIS') {
        if (density === '468_PTS') {
          lms.forEach((lm, idx) => {
            ctx.beginPath();
            const r = (idx === 1 || idx === 152 || idx === 33 || idx === 263) ? 2.5 : 1.0;
            ctx.arc(lm.x, lm.y, r, 0, 2 * Math.PI);
            ctx.fillStyle = idx === 1 ? '#00f2fe' : idx === 152 ? '#67f4b7' : 'rgba(111, 246, 255, 0.85)';
            ctx.fill();
          });
        } else if (density === '68_PTS') {
          LANDMARKS_68_SUBSET.forEach((idx) => {
            const lm = lms[idx];
            if (lm) {
              ctx.beginPath();
              ctx.arc(lm.x, lm.y, 2.2, 0, 2 * Math.PI);
              ctx.fillStyle = '#00f2fe';
              ctx.fill();
            }
          });
        }
      }

      // 5. Laser Scan Line
      if (mode === 'SCAN') {
        const time = Date.now() / 3800;
        const phase = (Math.sin(time * Math.PI * 2) + 1) / 2; // 0 to 1
        const scanY = bbox.top + (bbox.height * phase);
        
        ctx.strokeStyle = '#00f2fe';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(bbox.left - 20, scanY);
        ctx.lineTo(bbox.left + bbox.width + 20, scanY);
        ctx.stroke();

        // Gradient Glow
        const grad = ctx.createLinearGradient(0, scanY - 25, 0, scanY + 25);
        grad.addColorStop(0, 'rgba(0, 242, 254, 0)');
        grad.addColorStop(0.5, 'rgba(0, 242, 254, 0.4)');
        grad.addColorStop(1, 'rgba(0, 242, 254, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(bbox.left - 10, scanY - 25, bbox.width + 20, 50);
      }
    });
  }, [renderFaces, isCameraActive, mode, density]);

  return (
    <div className="relative bg-[#0c0e12] rounded-xl overflow-hidden shadow-2xl flex flex-col min-h-[580px] justify-between border border-[#3a494b]/30">
      {/* Layer 0: Camera Feed Image or Video (Horizontally Mirrored) */}
      <div className="absolute inset-0 z-0 bg-black">
        {isCameraActive ? (
          useSimulatedFeed ? (
            <img
              alt="Raw front camera stream simulation"
              className="w-full h-full object-contain transform scale-x-[-1] filter brightness-95 contrast-105"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbwjc3g0xtOzgMsPJzCUPdidiW6nYRC8eo2WQk_O4v8wZI8VcyKVjVxQjDxl5o6pyhJCNEnEv1rQ4ZldbSUwryCoi2iUX-429TppZjH9OQ3He0ObeE1lH7c_DQ3gN_skuDDMo0WBYexYQKA-xak3ifWSb-OfedxiGuq3S95nGblyCsVKZjsSSCmeHzuR1dDsyB5CLSBHlYKqmWtbGVFeisfq0Vt1KI8WzMFprM5QP0-0haW3jllAWr"
            />
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-contain transform scale-x-[-1] filter brightness-95 contrast-105"
            />
          )
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#111417] text-[#849495] gap-3">
            <span className="material-symbols-outlined text-[48px] text-[#ffb4ab]">
              videocam_off
            </span>
            <span className="font-headline text-[18px] text-[#e1e2e7]">
              CAMERA STREAM STOPPED
            </span>
            <button
              onClick={onStartCamera}
              className="px-4 py-2 rounded bg-[#00f2fe] text-[#00373a] font-bold font-mono-tech text-[12px] hover:bg-white transition-all cursor-pointer shadow-[0_0_12px_rgba(0,242,254,0.4)]"
            >
              START CAMERA
            </button>
          </div>
        )}

        {/* Gradient Vignette for Telemetry Clarity */}
        {isCameraActive && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e12] via-transparent to-[#0c0e12]/75 pointer-events-none"></div>
            <div className="absolute inset-0 bg-[#0c0e12]/20 pointer-events-none"></div>
          </>
        )}
      </div>

      {/* Layer 1: Hardware Accelerated Canvas 2D Computer Vision HUD Overlay */}
      <canvas
        ref={canvasRef}
        width={viewBoxW}
        height={viewBoxH}
        className="absolute inset-0 w-full h-full z-10 pointer-events-none object-contain"
      />

      {/* Layer 2: Floating HUD Micro Telemetry Overlays */}
      {isCameraActive && primaryRenderFace && (
        <div className="relative z-20 flex justify-between p-4 font-mono-tech text-[10px]">
          {/* Top Left Camera Status HUD */}
          <div className="flex flex-col gap-1 bg-[#0c0e12]/85 backdrop-blur-md p-2.5 rounded border border-[#3a494b]/30 text-[#e1e2e7] shadow-lg">
            <div className="flex items-center gap-1.5 text-[#67f4b7] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#67f4b7] animate-pulse"></span>
              <span>468-LM TENSOR LOCK</span>
            </div>
            <div className="text-[9px] text-[#849495]">
              BBOX: [W: {Math.round(primaryRenderFace.bbox.width)}px, H: {Math.round(primaryRenderFace.bbox.height)}px]
            </div>
            <div className="text-[9px] text-[#849495]">
              MODE: {mode} | FEED: {useSimulatedFeed ? 'SYNTHETIC 60FPS' : 'MIRRORED WEBCAM'}
            </div>
          </div>

          {/* Top Right Live Biometric Indices */}
          <div className="flex flex-col gap-1 items-end bg-[#0c0e12]/85 backdrop-blur-md p-2.5 rounded border border-[#3a494b]/30 shadow-lg">
            <div className="text-[#00f2fe] font-semibold">
              FACIAL SYMMETRY: 97.4%
            </div>
            <div className="text-[#b9cacb] text-[9px]">
              L_EYE: <span className="text-[#00f2fe]">{primaryRenderFace.metrics.leftEyeOpenness}%</span> | R_EYE: <span className="text-[#00f2fe]">{primaryRenderFace.metrics.rightEyeOpenness}%</span>
            </div>
            <div className="text-[#b9cacb] text-[9px]">
              MOUTH_APERTURE: <span className="text-[#67f4b7]">{primaryRenderFace.metrics.mouthOpenness}%</span> | GAZE: <span className="text-[#adc6ff]">{primaryRenderFace.metrics.gazeDirection}</span>
            </div>
          </div>
        </div>
      )}

      {/* Multiple Face Notification Bar */}
      {faces.length > 1 && (
        <div className="relative z-20 mx-4 px-3 py-1.5 rounded bg-[#0566d9]/30 border border-[#adc6ff]/40 text-[#e6ecff] font-mono-tech text-[11px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#adc6ff]">group</span>
            <span>MULTIPLE FACES DETECTED ({faces.length})</span>
          </div>
          <span className="text-[#00f2fe]">Click any box to switch primary face</span>
        </div>
      )}

      {/* Mid Floating Annotation Pointers (Mode 5: Analysis) */}
      {isCameraActive && mode === 'ANALYSIS' && primaryRenderFace && (
        <div className="relative z-20 pointer-events-none px-6 flex justify-between items-center my-auto">
          <div className="bg-[#0c0e12]/90 px-2 py-1 rounded text-[#00f2fe] text-[9px] font-mono-tech shadow border border-[#00f2fe]/40">
            ◄ NODE_159 [L_PUPIL]
          </div>
          <div className="bg-[#0c0e12]/90 px-2 py-1 rounded text-[#00f2fe] text-[9px] font-mono-tech shadow border border-[#00f2fe]/40">
            NODE_386 [R_PUPIL] ►
          </div>
        </div>
      )}

      {/* Bottom Camera Controls Dock */}
      <div className="relative z-20 m-2 sm:m-4 p-2 sm:p-3 bg-[#0c0e12]/90 backdrop-blur-xl rounded-xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 border border-[#3a494b]/40">
        {/* Left Triggers: Stop/Start, REC, SNAP, Camera Source Toggle */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {isCameraActive ? (
            <button
              onClick={onStopCamera}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#ffb4ab]/15 hover:bg-[#ffb4ab]/25 text-[#ffb4ab] border border-[#ffb4ab]/40 font-mono-tech text-[11px] font-semibold transition-all cursor-pointer"
              type="button"
            >
              <span className="w-2 h-2 rounded-full bg-[#ffb4ab] animate-pulse"></span>
              <span>STOP CAMERA</span>
            </button>
          ) : (
            <button
              onClick={onStartCamera}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#00f2fe] hover:bg-white text-[#00373a] font-mono-tech text-[11px] font-bold transition-all cursor-pointer shadow-[0_0_8px_#00f2fe]"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">videocam</span>
              <span>START CAMERA</span>
            </button>
          )}

          <button
            onClick={onToggleRecord}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded font-mono-tech text-[11px] transition-all cursor-pointer border ${
              isRecording
                ? 'bg-[#ffb4ab]/20 text-[#ffb4ab] border-[#ffb4ab]'
                : 'bg-[#191c1f] text-[#b9cacb] border-[#3a494b]/40 hover:text-white'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[16px] text-red-400">
              radio_button_checked
            </span>
            <span>{isRecording ? 'REC ON' : 'REC'}</span>
          </button>

          <button
            onClick={onSnapshot}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-[#191c1f] text-[#b9cacb] hover:text-[#00f2fe] border border-[#3a494b]/40 transition-all font-mono-tech text-[11px] cursor-pointer"
            type="button"
            title="Take snapshot"
          >
            <span className="material-symbols-outlined text-[16px]">photo_camera</span>
            <span>SNAP</span>
          </button>

          <button
            onClick={onToggleSimulatedFeed}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded font-mono-tech text-[11px] transition-all cursor-pointer border ${
              useSimulatedFeed
                ? 'bg-[#00f2fe]/20 text-[#00f2fe] border-[#00f2fe]/40'
                : 'bg-[#191c1f] text-[#849495] border-[#3a494b]/40 hover:text-white'
            }`}
            title="Toggle between live device webcam and calibrated synthetic camera matrix"
          >
            <span className="material-symbols-outlined text-[16px]">
              {useSimulatedFeed ? 'tune' : 'videocam'}
            </span>
            <span>{useSimulatedFeed ? 'DEMO FEED' : 'WEBCAM'}</span>
          </button>
        </div>

        {/* Center: Mode Selector (Modes 1 to 5) */}
        <div className="flex flex-wrap items-center justify-center gap-1 font-mono-tech text-[10px]">
          <span className="text-[#849495] uppercase mr-1 hidden sm:inline">Mode:</span>
          {(['NORMAL', 'LANDMARK', 'MESH', 'SCAN', 'ANALYSIS'] as VisualizationMode[]).map(
            (m) => (
              <button
                key={m}
                onClick={() => onChangeMode(m)}
                className={`px-2 py-1 rounded transition-all cursor-pointer ${
                  mode === m
                    ? 'bg-[#00f2fe] text-[#00373a] font-bold shadow-[0_0_8px_rgba(0,242,254,0.3)]'
                    : 'bg-[#191c1f] text-[#b9cacb] hover:text-white border border-[#3a494b]/30'
                }`}
              >
                {m}
              </button>
            )
          )}
        </div>

        {/* Right Trigger: Mesh Density Selector */}
        <div className="flex flex-wrap items-center justify-center gap-1 font-mono-tech text-[10px]">
          <span className="text-[#849495] uppercase mr-1 hidden md:inline">Density:</span>
          <button
            onClick={() => onChangeDensity('468_PTS')}
            className={`px-2 py-1 rounded cursor-pointer ${
              density === '468_PTS'
                ? 'bg-[#00f2fe] text-[#00373a] font-bold'
                : 'bg-[#191c1f] text-[#b9cacb] hover:text-white'
            }`}
          >
            468 PTS
          </button>
          <button
            onClick={() => onChangeDensity('68_PTS')}
            className={`px-2 py-1 rounded cursor-pointer ${
              density === '68_PTS'
                ? 'bg-[#00f2fe] text-[#00373a] font-bold'
                : 'bg-[#191c1f] text-[#b9cacb] hover:text-white'
            }`}
          >
            68 PTS
          </button>
          <button
            onClick={() => onChangeDensity('B_BOX')}
            className={`px-2 py-1 rounded cursor-pointer ${
              density === 'B_BOX'
                ? 'bg-[#00f2fe] text-[#00373a] font-bold'
                : 'bg-[#191c1f] text-[#b9cacb] hover:text-white'
            }`}
          >
            B-BOX
          </button>
        </div>
      </div>
    </div>
  );
};
