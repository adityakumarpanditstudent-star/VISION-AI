package com.visionai.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.visionai.app.analysis.*
import com.visionai.app.model.*
import com.google.mediapipe.tasks.vision.facelandmarker.FaceLandmarkerResult
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class MainViewModel : ViewModel() {

    sealed class CameraState {
        object PermissionRequired : CameraState()
        object PermissionDenied : CameraState()
        object Initializing : CameraState()
        object Active : CameraState()
        object Stopped : CameraState()
    }

    private val _cameraState = MutableStateFlow<CameraState>(CameraState.PermissionRequired)
    val cameraState: StateFlow<CameraState> = _cameraState.asStateFlow()

    private val _trackedFace = MutableStateFlow<TrackedFaceData?>(null)
    val trackedFace: StateFlow<TrackedFaceData?> = _trackedFace.asStateFlow()

    private val _imageDimensions = MutableStateFlow(Pair(1f, 1f))
    val imageDimensions: StateFlow<Pair<Float, Float>> = _imageDimensions.asStateFlow()

    private val _visualizationMode = MutableStateFlow(VisualizationMode.ANALYSIS)
    val visualizationMode: StateFlow<VisualizationMode> = _visualizationMode.asStateFlow()

    private val _meshDensity = MutableStateFlow("468_PTS")
    val meshDensity: StateFlow<String> = _meshDensity.asStateFlow()

    private val _performanceStats = MutableStateFlow(
        PerformanceStats(fps = 60, latencyMs = 16, backend = "Local Edge GPU")
    )
    val performanceStats: StateFlow<PerformanceStats> = _performanceStats.asStateFlow()

    private val distanceEstimator = DistanceEstimator()
    private val expressionAnalyzer = ExpressionAnalyzer()
    private val headPoseEstimator = HeadPoseEstimator()

    fun onPermissionResult(isGranted: Boolean) {
        _cameraState.value = if (isGranted) CameraState.Active else CameraState.PermissionDenied
    }

    fun setVisualizationMode(mode: VisualizationMode) {
        _visualizationMode.value = mode
    }

    fun setMeshDensity(density: String) {
        _meshDensity.value = density
    }

    fun calibrateDistance(knownDistanceCm: Float = 50f) {
        _trackedFace.value?.let { face ->
            distanceEstimator.calibrate(face.rawLandmarks, knownDistanceCm)
        }
    }

    fun stopCamera() {
        _cameraState.value = CameraState.Stopped
    }

    fun startCamera() {
        _cameraState.value = CameraState.Active
    }

    fun onAppForegrounded() {
        if (_cameraState.value == CameraState.Stopped) {
            _cameraState.value = CameraState.Active
        }
    }

    fun onAppBackgrounded() {
        // Safe release of camera when paused
    }

    fun updateFaceResult(result: VisionFrameResult) {
        when (result) {
            is VisionFrameResult.Success -> {
                val face = result.result.faceLandmarks().firstOrNull()
                val blendshapes = result.result.faceBlendshapes()?.firstOrNull()
                
                if (face != null) {
                    val rawLandmarks = face.map { FaceLandmark(it.x(), it.y(), it.z()) }
                    
                    // Bounding box calculation for HUD reticle
                    var minX = Float.MAX_VALUE
                    var maxX = Float.MIN_VALUE
                    var minY = Float.MAX_VALUE
                    var maxY = Float.MIN_VALUE
                    rawLandmarks.forEach { lm ->
                        if (lm.x < minX) minX = lm.x
                        if (lm.x > maxX) maxX = lm.x
                        if (lm.y < minY) minY = lm.y
                        if (lm.y > maxY) maxY = lm.y
                    }
                    
                    val faceData = TrackedFaceData(
                        landmarks = rawLandmarks,
                        rawLandmarks = rawLandmarks,
                        boundingBox = BoundingBox(minX, minY, maxX - minX, maxY - minY),
                        smileScore = blendshapes?.find { it.categoryName() == "mouthSmileLeft" }?.score() ?: 0f,
                        eyeOpenness = blendshapes?.find { it.categoryName() == "eyeBlinkLeft" }?.score()?.let { 1f - it } ?: 1f,
                        headPose = HeadPose(0f, 0f, 0f), // Can be derived from transformation matrix
                        distanceCm = 50f
                    )
                    
                    _trackedFace.value = faceData
                    _performanceStats.value = _performanceStats.value.copy(latencyMs = result.latencyMs)
                }
            }
            is VisionFrameResult.NoFace -> {
                _trackedFace.value = null
                _performanceStats.value = _performanceStats.value.copy(latencyMs = result.latencyMs)
            }
            is VisionFrameResult.Error -> {
                // Handle error
            }
        }
    }

    fun updateImageDimensions(width: Float, height: Float) {
        if (_imageDimensions.value.first != width || _imageDimensions.value.second != height) {
            _imageDimensions.value = Pair(width, height)
        }
    }
}
