package com.visionai.app.model

import com.google.mediapipe.tasks.components.containers.NormalizedLandmark

sealed class VisionFrameResult {
    data class Success(
        val result: Any,
        val latencyMs: Long,
        val isMultipleFaces: Boolean
    ) : VisionFrameResult()

    data class NoFace(val latencyMs: Long) : VisionFrameResult()
    data class Error(val message: String) : VisionFrameResult()
}

enum class VisualizationMode {
    NORMAL, LANDMARK, MESH, SCAN, ANALYSIS
}

data class Point2D(val x: Float, val y: Float)

data class BoundingBox2D(
    val xMin: Float,
    val yMin: Float,
    val width: Float,
    val height: Float
)

data class HeadPose(
    val yaw: Float,
    val pitch: Float,
    val roll: Float,
    val orientation: String
)

data class ExpressionClassification(
    val label: String,
    val confidence: Int
)

data class FacialMetrics(
    val smileIntensity: Int,
    val eyebrowElevation: Int,
    val eyeOpenness: Int,
    val leftEyeOpenness: Int,
    val rightEyeOpenness: Int,
    val isBlinking: Boolean,
    val bothEyesClosed: Boolean,
    val mouthOpenness: Int,
    val jawMm: Int
)

data class DistanceResult(
    val approxDistanceCm: Int,
    val confidence: String,
    val isCalibrated: Boolean
)

data class PerformanceStats(
    val fps: Int,
    val latencyMs: Long,
    val backend: String
)

data class TrackedFaceData(
    val id: Int,
    val landmarks: List<Point2D>,
    val rawLandmarks: List<NormalizedLandmark>,
    val boundingBox: BoundingBox2D,
    val headPose: HeadPose,
    val expression: ExpressionClassification,
    val metrics: FacialMetrics,
    val distance: DistanceResult
)
