package com.visionai.app.model

data class FaceQuality(
    val lightingLux: Int,
    val lightingStatus: String,       // EXCELLENT / GOOD / LOW_LIGHT / EXTREME_GLARE
    val motionStability: Float,       // 0-100%
    val angleStatus: String,          // OPTIMAL / ACCEPTABLE / EXTREME_ANGLE
    val positionStatus: String,       // OPTIMAL / TOO_CLOSE / TOO_FAR / PARTIAL_VISIBILITY
    val jitterRmsMm: Float,
    val overallScore: Int,            // 0-100
    val recommendation: String
)
