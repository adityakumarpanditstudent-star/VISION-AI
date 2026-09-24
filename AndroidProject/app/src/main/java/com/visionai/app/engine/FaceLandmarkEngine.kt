package com.visionai.app.engine

import android.content.Context
import android.os.SystemClock
import androidx.camera.core.ImageProxy
import com.google.mediapipe.framework.image.BitmapImageBuilder
import com.google.mediapipe.tasks.core.BaseOptions
import com.google.mediapipe.tasks.core.Delegate
import com.google.mediapipe.tasks.vision.core.RunningMode
import com.google.mediapipe.tasks.vision.facelandmarker.FaceLandmarker
import com.google.mediapipe.tasks.vision.facelandmarker.FaceLandmarkerResult
import com.visionai.app.model.VisionFrameResult

class FaceLandmarkEngine(
    private val context: Context,
    private val onResult: (VisionFrameResult) -> Unit,
    private val onError: (String) -> Unit
) {
    private var faceLandmarker: FaceLandmarker? = null

    init {
        setupLandmarker()
    }

    private fun setupLandmarker() {
        try {
            val baseOptions = BaseOptions.builder()
                .setModelAssetPath("face_landmarker.task")
                .setDelegate(Delegate.GPU) // High-performance local GPU acceleration
                .build()

            val options = FaceLandmarker.FaceLandmarkerOptions.builder()
                .setBaseOptions(baseOptions)
                .setMinFaceDetectionConfidence(0.5f)
                .setMinTrackingConfidence(0.5f)
                .setMinFacePresenceConfidence(0.5f)
                .setNumFaces(3) // Multi-face detection support
                .setOutputFaceBlendshapes(true)
                .setOutputFacialTransformationMatrixes(true)
                .setRunningMode(RunningMode.LIVE_STREAM)
                .setResultListener { result, inputImage ->
                    val latencyMs = SystemClock.uptimeMillis() - inputImage.timestamp
                    processResult(result, latencyMs)
                }
                .setErrorListener { error ->
                    onError(error.message ?: "FaceLandmarker processing error")
                }
                .build()

            faceLandmarker = FaceLandmarker.createFromOptions(context, options)
        } catch (e: Exception) {
            onError("Failed to initialize MediaPipe Face Landmarker: ${e.localizedMessage}")
        }
    }

    fun processFrame(imageProxy: ImageProxy) {
        val startTime = SystemClock.uptimeMillis()
        val bitmap = imageProxy.toBitmap()
        imageProxy.close() // Avoid blocking camera stream buffers

        val mpImage = BitmapImageBuilder(bitmap).build()
        faceLandmarker?.detectAsync(mpImage, startTime)
    }

    private fun processResult(result: FaceLandmarkerResult, latencyMs: Long) {
        val facesCount = result.faceLandmarks().size
        if (facesCount == 0) {
            onResult(VisionFrameResult.NoFace(latencyMs))
            return
        }

        onResult(
            VisionFrameResult.Success(
                result = result,
                latencyMs = latencyMs,
                isMultipleFaces = facesCount > 1
            )
        )
    }

    fun close() {
        faceLandmarker?.close()
        faceLandmarker = null
    }
}
