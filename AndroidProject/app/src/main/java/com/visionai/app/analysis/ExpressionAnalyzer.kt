package com.visionai.app.analysis

import com.google.mediapipe.tasks.components.containers.Category
import com.visionai.app.model.FacialMetrics
import com.visionai.app.model.ExpressionClassification

class ExpressionAnalyzer {

    fun analyze(blendshapes: List<Category>): Pair<ExpressionClassification, FacialMetrics> {
        val blendMap = blendshapes.associate { it.categoryName() to it.score() }

        fun getScore(name: String) = blendMap[name] ?: 0f

        val smileL = getScore("mouthSmileLeft")
        val smileR = getScore("mouthSmileRight")
        val smile = maxOf(smileL, smileR)

        val browInnerUp = getScore("browInnerUp")
        val browOuterUpL = getScore("browOuterUpLeft")
        val browOuterUpR = getScore("browOuterUpRight")
        val browUp = maxOf(browInnerUp, browOuterUpL, browOuterUpR)

        val browDownL = getScore("browDownLeft")
        val browDownR = getScore("browDownRight")
        val browDown = maxOf(browDownL, browDownR)

        val mouthFrownL = getScore("mouthFrownLeft")
        val mouthFrownR = getScore("mouthFrownRight")
        val mouthFrown = maxOf(mouthFrownL, mouthFrownR)

        val jawOpen = getScore("jawOpen")
        val mouthPucker = getScore("mouthPucker")
        val mouthFunnel = getScore("mouthFunnel")
        val eyeWide = maxOf(getScore("eyeWideLeft"), getScore("eyeWideRight"))
        val eyeSquint = maxOf(getScore("eyeSquintLeft"), getScore("eyeSquintRight"))
        val noseSneer = maxOf(getScore("noseSneerLeft"), getScore("noseSneerRight"))
        val mouthDimpleL = getScore("mouthDimpleLeft")
        val mouthDimpleR = getScore("mouthDimpleRight")
        
        val blinkL = getScore("eyeBlinkLeft")
        val blinkR = getScore("eyeBlinkRight")
        val blink = maxOf(blinkL, blinkR)
        val mouthPress = maxOf(getScore("mouthPressLeft"), getScore("mouthPressRight"))

        var label = "NEUTRAL / RESTING"
        var confidence = 98

        if (blink > 0.7f) {
            if (blinkL > 0.7f && blinkR < 0.2f) { label = "LEFT EYE WINK"; confidence = (blinkL * 100).toInt() }
            else if (blinkR > 0.7f && blinkL < 0.2f) { label = "RIGHT EYE WINK"; confidence = (blinkR * 100).toInt() }
            else { label = "EYES CLOSED / BLINKING"; confidence = (blink * 100).toInt() }
        } else if (smile > 0.5f && eyeSquint > 0.3f) {
            label = "GENUINE JOY (DUCHENNE)"; confidence = (smile * 100).toInt()
        } else if (smile > 0.4f) {
            label = "HAPPINESS / SMILING"; confidence = (smile * 100).toInt()
        } else if (browUp > 0.5f && jawOpen > 0.3f && eyeWide > 0.4f) {
            label = "ASTONISHMENT / SHOCK"; confidence = (((browUp + jawOpen) / 2f) * 100).toInt()
        } else if (browUp > 0.4f && eyeWide > 0.4f) {
            label = "SURPRISE"; confidence = (browUp * 100).toInt()
        } else if (browDown > 0.3f && mouthFrown > 0.2f) {
            label = "ANGER / FRUSTRATION"; confidence = (((browDown + mouthFrown) / 2f) * 100).toInt()
        } else if (mouthFrown > 0.08f && browInnerUp > 0.1f && smile < 0.1f) {
            label = "SADNESS / DISTRESS"; confidence = maxOf(70, (maxOf(mouthFrown, browInnerUp) * 100f + 50f).toInt())
        } else if (mouthFrown > 0.12f && smile < 0.1f && browDown < 0.3f) {
            label = "SADNESS / FROWNING"; confidence = maxOf(65, (mouthFrown * 100f + 40f).toInt())
        } else if (noseSneer > 0.4f) {
            label = "DISGUST / SNEER"; confidence = (noseSneer * 100).toInt()
        } else if (browDown > 0.4f && eyeSquint > 0.4f) {
            label = "SUSPICION / FOCUS"; confidence = (eyeSquint * 100).toInt()
        } else if (jawOpen > 0.6f) {
            label = "YAWNING / MOUTH OPEN"; confidence = (jawOpen * 100).toInt()
        } else if (smileL > 0.3f && smileR < 0.1f) {
            label = "LEFT SMIRK"; confidence = (smileL * 100).toInt()
        } else if (smileR > 0.3f && smileL < 0.1f) {
            label = "RIGHT SMIRK"; confidence = (smileR * 100).toInt()
        } else if (mouthPress > 0.4f) {
            label = "LIPS PRESSED / TENSE"; confidence = (mouthPress * 100).toInt()
        } else if (mouthDimpleL > 0.4f && mouthDimpleR > 0.4f) {
            label = "DIMPLED SMILE / AWKWARD"; confidence = (mouthDimpleL * 100).toInt()
        } else if (browInnerUp > 0.4f && browOuterUpL < 0.2f && browOuterUpR < 0.2f) {
            label = "WORRY / ANXIETY"; confidence = (browInnerUp * 100).toInt()
        }

        val classification = ExpressionClassification(label, confidence)

        val metrics = FacialMetrics(
            smileIntensity = (smile * 100).toInt(),
            eyebrowElevation = (browInnerUp * 100).toInt(),
            eyeOpenness = ((1f - blink) * 100).toInt().coerceIn(0, 100),
            leftEyeOpenness = ((1f - blinkL) * 100).toInt().coerceIn(0, 100),
            rightEyeOpenness = ((1f - blinkR) * 100).toInt().coerceIn(0, 100),
            isBlinking = blink > 0.7f,
            bothEyesClosed = blinkL > 0.7f && blinkR > 0.7f,
            mouthOpenness = (jawOpen * 100).toInt().coerceIn(0, 100),
            jawMm = (jawOpen * 28).toInt()
        )

        return Pair(classification, metrics)
    }
}
