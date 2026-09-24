package com.visionai.app.camera

import android.content.Context
import android.util.Log
import androidx.camera.core.*
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.core.content.ContextCompat
import androidx.lifecycle.LifecycleOwner
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors

class CameraManager(
    private val context: Context,
    private val lifecycleOwner: LifecycleOwner,
    private val onFrameAvailable: (ImageProxy) -> Unit
) {
    private var cameraProvider: ProcessCameraProvider? = null
    private var camera: Camera? = null
    private val cameraExecutor: ExecutorService = Executors.newSingleThreadExecutor()

    var isRunning: Boolean = false
        private set

    fun startCamera(previewView: PreviewView) {
        val cameraProviderFuture = ProcessCameraProvider.getInstance(context)

        cameraProviderFuture.addListener({
            try {
                cameraProvider = cameraProviderFuture.get()

                // Mirror front camera display for authentic selfie experience
                previewView.scaleX = -1f

                val preview = Preview.Builder()
                    .setTargetAspectRatio(AspectRatio.RATIO_16_9)
                    .build()
                    .also {
                        it.setSurfaceProvider(previewView.surfaceProvider)
                    }

                val imageAnalyzer = ImageAnalysis.Builder()
                    .setTargetAspectRatio(AspectRatio.RATIO_16_9)
                    .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
                    .setOutputImageFormat(ImageAnalysis.OUTPUT_IMAGE_FORMAT_RGBA_8888)
                    .build()
                    .also { analyzer ->
                        analyzer.setAnalyzer(cameraExecutor) { imageProxy ->
                            onFrameAvailable(imageProxy)
                        }
                    }

                val cameraSelector = CameraSelector.DEFAULT_FRONT_CAMERA

                cameraProvider?.unbindAll()
                camera = cameraProvider?.bindToLifecycle(
                    lifecycleOwner,
                    cameraSelector,
                    preview,
                    imageAnalyzer
                )
                isRunning = true
            } catch (e: Exception) {
                Log.e("CameraManager", "Use case binding failed", e)
                isRunning = false
            }
        }, ContextCompat.getMainExecutor(context))
    }

    fun stopCamera() {
        cameraProvider?.unbindAll()
        camera = null
        isRunning = false
    }

    fun shutdown() {
        stopCamera()
        cameraExecutor.shutdown()
    }
}
