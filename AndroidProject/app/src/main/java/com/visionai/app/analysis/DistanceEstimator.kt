package com.visionai.app.analysis

import com.google.mediapipe.tasks.components.containers.NormalizedLandmark
import com.visionai.app.model.DistanceResult
import kotlin.math.hypot

class DistanceEstimator {
    private var calibratedFocalLength: Float = 520f
    private var smoothedDistanceCm: Float = 60f
    var isCalibrated: Boolean = false
        private set

    fun calibrate(landmarks: List<NormalizedLandmark>, knownDistanceCm: Float = 50f) {
        val eyeDistanceNorm = calculateInterocularDistance(landmarks)
        if (eyeDistanceNorm > 0.05f) {
            // F = (PixelDist * Distance) / RealWidth
            calibratedFocalLength = (eyeDistanceNorm * 1000f * knownDistanceCm) / 6.3f
            isCalibrated = true
            smoothedDistanceCm = knownDistanceCm
        }
    }

    fun estimate(landmarks: List<NormalizedLandmark>): DistanceResult {
        val eyeDistanceNorm = calculateInterocularDistance(landmarks)
        if (eyeDistanceNorm <= 0.01f) {
            return DistanceResult(smoothedDistanceCm.toInt(), "MEDIUM", isCalibrated)
        }

        val rawDistCm = (6.3f * calibratedFocalLength) / (eyeDistanceNorm * 1000f)
        val clamped = rawDistCm.coerceIn(15f, 180f)

        // Exponential smoothing (alpha = 0.2)
        smoothedDistanceCm = (0.2f * clamped) + (0.8f * smoothedDistanceCm)

        val confidence = if (isCalibrated) "HIGH" else "MEDIUM"
        return DistanceResult(
            approxDistanceCm = smoothedDistanceCm.toInt(),
            confidence = confidence,
            isCalibrated = isCalibrated
        )
    }

    private fun calculateInterocularDistance(landmarks: List<NormalizedLandmark>): Float {
        if (landmarks.size < 468) return 0f
        val leftEye = landmarks[33]
        val rightEye = landmarks[263]
        return hypot(leftEye.x() - rightEye.x(), leftEye.y() - rightEye.y())
    }
}
