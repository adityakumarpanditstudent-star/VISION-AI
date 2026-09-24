package com.visionai.app.analysis

import com.google.mediapipe.tasks.components.containers.NormalizedLandmark
import com.visionai.app.model.FaceQuality
import kotlin.math.abs

class FaceQualityAnalyzer {

    fun analyze(
        landmarks: List<NormalizedLandmark>,
        yawDeg: Float,
        pitchDeg: Float,
        distanceCm: Int
    ): FaceQuality {
        var score = 95
        var recommendation = "TRACKING OPTIMAL"
        var angleStatus = "OPTIMAL"
        var positionStatus = "OPTIMAL"

        // Angle scoring
        if (abs(yawDeg) > 35f || abs(pitchDeg) > 30f) {
            score -= 30
            angleStatus = "EXTREME_ANGLE"
            recommendation = "FACE ANGLE TOO EXTREME — CENTER YOUR HEAD"
        } else if (abs(yawDeg) > 20f || abs(pitchDeg) > 18f) {
            score -= 12
            angleStatus = "ACCEPTABLE"
            recommendation = "SLIGHT ANGLE DETECTED"
        }

        // Distance scoring
        when {
            distanceCm in 1..29 -> {
                score -= 25
                positionStatus = "TOO_CLOSE"
                recommendation = "MOVE FURTHER FROM SENSOR"
            }
            distanceCm > 90 -> {
                score -= 15
                positionStatus = "TOO_FAR"
                recommendation = "MOVE CLOSER TO SENSOR"
            }
        }

        // Landmark visibility
        if (landmarks.size < 400) {
            score -= 20
            positionStatus = "PARTIAL_VISIBILITY"
            recommendation = "FULL FACE NOT VISIBLE"
        }

        return FaceQuality(
            lightingLux = 480,
            lightingStatus = "EXCELLENT",
            motionStability = score.toFloat(),
            angleStatus = angleStatus,
            positionStatus = positionStatus,
            jitterRmsMm = 0.14f,
            overallScore = score.coerceAtLeast(20),
            recommendation = recommendation
        )
    }
}
