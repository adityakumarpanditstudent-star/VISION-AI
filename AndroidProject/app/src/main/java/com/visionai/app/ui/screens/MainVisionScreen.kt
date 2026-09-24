package com.visionai.app.ui.screens

import androidx.camera.view.PreviewView
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import com.visionai.app.camera.CameraManager
import com.visionai.app.engine.FaceLandmarkEngine
import com.visionai.app.model.VisualizationMode
import com.visionai.app.ui.rendering.FaceMeshRenderer
import com.visionai.app.viewmodel.MainViewModel

@Composable
fun MainVisionScreen(
    viewModel: MainViewModel,
    onStopCamera: () -> Unit,
    onStartCamera: () -> Unit
) {
    val context = LocalContext.current
    val lifecycleOwner = LocalLifecycleOwner.current

    val face by viewModel.trackedFace.collectAsState()
    val mode by viewModel.visualizationMode.collectAsState()
    val density by viewModel.meshDensity.collectAsState()
    val perf by viewModel.performanceStats.collectAsState()
    val imageDimensions by viewModel.imageDimensions.collectAsState()

    var cameraManager by remember { mutableStateOf<CameraManager?>(null) }
    
    val engine = remember {
        FaceLandmarkEngine(
            context = context,
            onResult = { viewModel.updateFaceResult(it) },
            onError = { /* Log error */ }
        )
    }
    
    DisposableEffect(Unit) {
        onDispose { engine.close() }
    }

    Box(modifier = Modifier.fillMaxSize().background(Color(0xFF0C0E12))) {
        // Layer 0: Mirrored CameraX Preview
        AndroidView(
            factory = { ctx ->
                PreviewView(ctx).also { previewView ->
                    cameraManager = CameraManager(ctx, lifecycleOwner) { imageProxy ->
                        val rotation = imageProxy.imageInfo.rotationDegrees
                        val isRotated = rotation == 90 || rotation == 270
                        val imgW = if (isRotated) imageProxy.height.toFloat() else imageProxy.width.toFloat()
                        val imgH = if (isRotated) imageProxy.width.toFloat() else imageProxy.height.toFloat()
                        viewModel.updateImageDimensions(imgW, imgH)
                        
                        engine.processFrame(imageProxy)
                    }
                    cameraManager?.startCamera(previewView)
                }
            },
            modifier = Modifier.fillMaxSize()
        )

        // Layer 1: Face Mesh & HUD Reticle
        FaceMeshRenderer(
            face = face,
            imageDimensions = imageDimensions,
            mode = mode,
            density = density,
            modifier = Modifier.fillMaxSize()
        )

        // Layer 2: Top Bar Telemetry
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
                .align(Alignment.TopCenter),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text("VISIONAI", color = Color(0xFF00F2FE), fontSize = 16.sp, fontWeight = androidx.compose.ui.text.font.FontWeight.Bold)
                Text("REAL-TIME FACIAL VISION", color = Color(0xFF849495), fontSize = 10.sp)
            }
            Surface(
                color = Color(0xCC111417),
                shape = RoundedCornerShape(4.dp)
            ) {
                Row(modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)) {
                    Text("CAMERA ACTIVE  ", color = Color(0xFF67F4B7), fontSize = 11.sp)
                    Text("${perf.fps} FPS", color = Color(0xFF00F2FE), fontSize = 11.sp)
                }
            }
        }

        // Bottom Controls
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
                .align(Alignment.BottomCenter),
            horizontalArrangement = Arrangement.SpaceEvenly
        ) {
            Button(
                onClick = onStopCamera,
                colors = ButtonDefaults.buttonColors(containerColor = Color(0x33FF5449)),
                shape = RoundedCornerShape(4.dp)
            ) {
                Text("STOP CAMERA", color = Color(0xFFFFB4AB), fontSize = 11.sp)
            }

            Button(
                onClick = { viewModel.calibrateDistance(50f) },
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1D2023)),
                shape = RoundedCornerShape(4.dp)
            ) {
                Text("CALIBRATE (50cm)", color = Color(0xFF00F2FE), fontSize = 11.sp)
            }
        }
    }
}
