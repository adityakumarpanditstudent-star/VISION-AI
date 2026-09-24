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
                val mediapipeResult = result.result as FaceLandmarkerResult
                val face = mediapipeResult.faceLandmarks().firstOrNull()
                val blendshapes = mediapipeResult.faceBlendshapes().orElse(null)?.firstOrNull()
                
                if (face != null) {
                    val points2D = face.map { Point2D(it.x(), it.y()) }
                    
                    // Bounding box calculation for HUD reticle
                    var minX = Float.MAX_VALUE
                    var maxX = Float.MIN_VALUE
                    var minY = Float.MAX_VALUE
                    var maxY = Float.MIN_VALUE
                    points2D.forEach { lm ->
                        if (lm.x < minX) minX = lm.x
                        if (lm.x > maxX) maxX = lm.x
                        if (lm.y < minY) minY = lm.y
                        if (lm.y > maxY) maxY = lm.y
                    }
                    
                    val expressionData = blendshapes?.let { expressionAnalyzer.analyze(it) }
                    
                    val faceData = TrackedFaceData(
                        id = 1,
                        landmarks = points2D,
                        rawLandmarks = face,
                        boundingBox = BoundingBox2D(minX, minY, maxX - minX, maxY - minY),
                        headPose = headPoseEstimator.computePose(face),
                        expression = expressionData?.first ?: ExpressionClassification("UNKNOWN", 0),
                        metrics = expressionData?.second ?: FacialMetrics(0, 0, 0, 0, 0, false, false, 0, 0),
                        distance = distanceEstimator.estimate(face)
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
