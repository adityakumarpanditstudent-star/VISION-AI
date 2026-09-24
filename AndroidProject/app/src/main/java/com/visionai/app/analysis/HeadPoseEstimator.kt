package com.visionai.app.analysis

import com.google.mediapipe.tasks.components.containers.NormalizedLandmark
import com.visionai.app.model.HeadPose
import kotlin.math.*

class HeadPoseEstimator {

    fun computePose(landmarks: List<NormalizedLandmark>): HeadPose {
        if (landmarks.size < 468) {
            return HeadPose(0f, 0f, 0f, "Looking Center")
        }

        val noseTip = landmarks[1]
        val chin = landmarks[152]
        val leftEyeOuter = landmarks[33]
        val rightEyeOuter = landmarks[263]
        val glabella = landmarks[168]

        // Roll in degrees
        val dy = rightEyeOuter.y() - leftEyeOuter.y()
        val dx = rightEyeOuter.x() - leftEyeOuter.x()
        val rollDeg = Math.toDegrees(atan2(dy.toDouble(), dx.toDouble())).toFloat()

        // Yaw in degrees
        val eyeMidX = (leftEyeOuter.x() + rightEyeOuter.x()) / 2f
        val eyeWidth = abs(rightEyeOuter.x() - leftEyeOuter.x()).coerceAtLeast(0.01f)
        val yawRatio = (noseTip.x() - eyeMidX) / eyeWidth
        val yawDeg = (yawRatio * 115f).coerceIn(-60f, 60f)

        // Pitch in degrees
        val faceHeight = abs(chin.y() - glabella.y()).coerceAtLeast(0.01f)
        val noseRelY = (noseTip.y() - glabella.y()) / faceHeight
        val pitchDeg = ((noseRelY - 0.44f) * 110f).coerceIn(-50f, 50f)

        val orientation = when {
            yawDeg > 15f -> "Looking Right"
            yawDeg < -15f -> "Looking Left"
            pitchDeg > 12f -> "Looking Down"
            pitchDeg < -12f -> "Looking Up"
            abs(rollDeg) > 12f -> if (rollDeg > 0) "Head Tilt Right" else "Head Tilt Left"
            else -> "Looking Center"
        }

        return HeadPose(
            yaw = Math.round(yawDeg * 10f) / 10f,
            pitch = Math.round(pitchDeg * 10f) / 10f,
            roll = Math.round(rollDeg * 10f) / 10f,
            orientation = orientation
        )
    }
}
