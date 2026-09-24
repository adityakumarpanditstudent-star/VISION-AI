/**
 * Types & data structures for VisionAI Biometric Vision Suite
 */

export interface NormalizedLandmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export interface BoundingBox {
  xMin: number;
  yMin: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

export interface HeadPose {
  yaw: number;     // Azimuth (-90 to +90 degrees)
  pitch: number;   // Elevation (-90 to +90 degrees)
  roll: number;    // Tilt (-90 to +90 degrees)
  orientation: string; // e.g. "Looking Center", "Looking Left", "Head Tilt Right"
}

export type ExpressionType = string;

export interface FacialMetrics {
  smileIntensity: number;     // 0 - 100%
  eyebrowElevation: number;   // 0 - 100%
  eyeOpenness: number;        // 0 - 100%
  leftEyeOpenness: number;    // 0 - 100%
  rightEyeOpenness: number;   // 0 - 100%
  isBlinking: boolean;
  bothEyesClosed: boolean;
  mouthOpenness: number;      // 0 - 100%
  jawOpeningMm: number;       // approximate mm or normalized %
  gazeDirection: 'CENTER' | 'LEFT' | 'RIGHT' | 'UP' | 'DOWN';
}

export interface DynamicActionUnit {
  id: string;
  name: string;
  value: number;
  threshold: number;
  color: string;
  activeLabel: string;
  inactiveLabel: string;
}

export type ActionUnits = DynamicActionUnit[];

export interface DistanceEstimation {
  approxDistanceCm: number;      // e.g. 62 cm
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  isCalibrated: boolean;
  calibrationDistanceCm: number;
  status: 'TOO_CLOSE' | 'NOMINAL_RANGE' | 'FAR';
}

export interface FaceQuality {
  lightingLux: number;
  lightingStatus: 'EXCELLENT' | 'GOOD' | 'LOW_LIGHT' | 'EXTREME_GLARE';
  motionStability: number;       // 0 - 100%
  angleStatus: 'OPTIMAL' | 'ACCEPTABLE' | 'EXTREME_ANGLE';
  positionStatus: 'OPTIMAL' | 'TOO_CLOSE' | 'TOO_FAR' | 'PARTIAL_VISIBILITY';
  jitterRmsMm: number;
  overallScore: number;          // 0 - 100%
  recommendation: string;
}

export interface TrackedFace {
  id: number;
  isPrimary: boolean;
  landmarks: NormalizedLandmark[];
  boundingBox: BoundingBox;
  confidence: number;
  headPose: HeadPose;
  metrics: FacialMetrics;
  actionUnits: ActionUnits;
  expression: {
    label: ExpressionType;
    confidence: number;
  };
  distance: DistanceEstimation;
  quality: FaceQuality;
}

export type VisualizationMode =
  | 'NORMAL'    // Mode 1: Only camera preview
  | 'LANDMARK'  // Mode 2: Display landmark points
  | 'MESH'      // Mode 3: Display connected facial geometry
  | 'SCAN'      // Mode 4: Display mesh + animated scanning effect
  | 'ANALYSIS'; // Mode 5: Display mesh + measurements + facial movement information

export type MeshDensity = '468_PTS' | '68_PTS' | 'B_BOX';

export interface PerformanceStats {
  fps: number;
  latencyMs: number;
  resolution: string;
  frameDropCount: number;
  processingBackend: 'LOCAL_WEBGPU' | 'LOCAL_WASM' | 'LOCAL_CPU';
}

export type AppCameraState =
  | 'PERMISSION_REQUIRED'
  | 'PERMISSION_DENIED'
  | 'INITIALIZING'
  | 'ACTIVE'
  | 'NO_FACE'
  | 'FACE_DETECTED'
  | 'MULTIPLE_FACES'
  | 'CAMERA_UNAVAILABLE'
  | 'MODEL_LOADING'
  | 'STOPPED';
