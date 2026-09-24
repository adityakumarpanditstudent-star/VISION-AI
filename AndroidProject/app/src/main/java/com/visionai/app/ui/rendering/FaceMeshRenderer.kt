package com.visionai.app.ui.rendering

import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Stroke
import com.google.mediapipe.tasks.vision.facelandmarker.FaceLandmarker
import com.visionai.app.model.TrackedFaceData
import com.visionai.app.model.VisualizationMode

@Composable
fun FaceMeshRenderer(
    face: TrackedFaceData?,
    imageDimensions: Pair<Float, Float>,
    mode: VisualizationMode,
    density: String,
    modifier: Modifier = Modifier
) {
    val infiniteTransition = rememberInfiniteTransition(label = "Laser")
    val laserY by infiniteTransition.animateFloat(
        initialValue = 0.2f,
        targetValue = 0.8f,
        animationSpec = infiniteRepeatable(
            animation = tween(3500, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "LaserY"
    )

    Canvas(modifier = modifier.fillMaxSize()) {
        if (face == null || mode == VisualizationMode.NORMAL) return@Canvas

        val w = size.width
        val h = size.height
        val landmarks = face.landmarks

        val imageW = imageDimensions.first
        val imageH = imageDimensions.second

        val imageAspect = imageW / imageH
        val viewAspect = w / h

        var scale = 1f
        var offsetX = 0f
        var offsetY = 0f

        // CameraX PreviewView FILL_CENTER logic
        if (imageAspect > viewAspect) {
            // Image is wider than view, crop sides
            scale = h / imageH
            offsetX = (w - imageW * scale) / 2f
        } else {
            // Image is taller than view, crop top/bottom
            scale = w / imageW
            offsetY = (h - imageH * scale) / 2f
        }

        fun mapCoordinate(nx: Float, ny: Float): Offset {
            val px = nx * imageW
            val py = ny * imageH
            var mappedX = px * scale + offsetX
            val mappedY = py * scale + offsetY
            
            // Mirror for front camera selfie view
            mappedX = w - mappedX
            
            return Offset(mappedX, mappedY)
        }

        // Render geometric facial mesh wireframe (dense topology)
        if (mode == VisualizationMode.MESH || mode == VisualizationMode.SCAN || mode == VisualizationMode.ANALYSIS) {
            val connectors = FaceLandmarker.FACE_LANDMARKS_TESSELATION
            val wireColor = Color(0x6600F2FE) // Slightly more transparent for dense mesh
            
            for (connection in connectors) {
                val startIdx = connection.start()
                val endIdx = connection.end()
                
                if (startIdx < landmarks.size && endIdx < landmarks.size) {
                    val startPt = mapCoordinate(landmarks[startIdx].x, landmarks[startIdx].y)
                    val endPt = mapCoordinate(landmarks[endIdx].x, landmarks[endIdx].y)
                    drawLine(
                        color = wireColor,
                        start = startPt,
                        end = endPt,
                        strokeWidth = 1.0f // Thinner lines for dense mesh
                    )
                }
            }
        }

        // Render landmark points
        if (mode == VisualizationMode.LANDMARK || mode == VisualizationMode.ANALYSIS) {
            val stride = if (density == "468_PTS") 1 else 7
            for (i in landmarks.indices step stride) {
                val lm = landmarks[i]
                val pt = mapCoordinate(lm.x, lm.y)
                drawCircle(
                    color = Color(0xFF6FF6FF),
                    radius = 2.0f,
                    center = pt
                )
            }
        }

        // Animated laser scan effect in SCAN or ANALYSIS mode
        if (mode == VisualizationMode.SCAN) {
            val scanY = laserY * h
            drawLine(
                color = Color(0xFF00F2FE),
                start = Offset(w * 0.15f, scanY),
                end = Offset(w * 0.85f, scanY),
                strokeWidth = 3f
            )
        }

        // Target reticle bounding box
        val bbox = face.boundingBox
        val topLeft = mapCoordinate(bbox.xMin + bbox.width, bbox.yMin) // Note: width is reversed due to mirroring
        val bottomRight = mapCoordinate(bbox.xMin, bbox.yMin + bbox.height)
        
        val left = topLeft.x
        val top = topLeft.y
        val right = bottomRight.x
        val bottom = bottomRight.y
        
        val cornerLen = 30f

        // Corner brackets
        val bracketColor = Color(0xFF00F2FE)
        // Top-left
        drawLine(bracketColor, Offset(left, top), Offset(left + cornerLen, top), 3f)
        drawLine(bracketColor, Offset(left, top), Offset(left, top + cornerLen), 3f)
        // Top-right
        drawLine(bracketColor, Offset(right, top), Offset(right - cornerLen, top), 3f)
        drawLine(bracketColor, Offset(right, top), Offset(right, top + cornerLen), 3f)
        // Bottom-left
        drawLine(bracketColor, Offset(left, bottom), Offset(left + cornerLen, bottom), 3f)
        drawLine(bracketColor, Offset(left, bottom), Offset(left, bottom - cornerLen), 3f)
        // Bottom-right
        drawLine(bracketColor, Offset(right, bottom), Offset(right - cornerLen, bottom), 3f)
        drawLine(bracketColor, Offset(right, bottom), Offset(right, bottom - cornerLen), 3f)
    }
}
