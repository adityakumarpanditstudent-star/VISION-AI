package com.visionai.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.visionai.app.model.TrackedFaceData

val MonoFamily = FontFamily.Monospace

@Composable
fun HudCard(modifier: Modifier = Modifier, content: @Composable ColumnScope.() -> Unit) {
    Column(
        modifier = modifier
            .background(Color(0xCC111417), RoundedCornerShape(8.dp))
            .border(1.dp, Color(0x403A494B), RoundedCornerShape(8.dp))
            .padding(10.dp),
        verticalArrangement = Arrangement.spacedBy(3.dp),
        content = content
    )
}

@Composable
fun HudLabel(text: String) {
    Text(text = text, color = Color(0xFF849495), fontSize = 9.sp, fontFamily = MonoFamily)
}

@Composable
fun HudValue(text: String, color: Color = Color(0xFF00F2FE)) {
    Text(text = text, color = color, fontSize = 13.sp, fontFamily = MonoFamily, fontWeight = FontWeight.Bold)
}

@Composable
fun HudSectionTitle(text: String) {
    Text(text = text, color = Color(0xFF00F2FE), fontSize = 10.sp, fontFamily = MonoFamily, fontWeight = FontWeight.Bold)
}

@Composable
fun FaceTrackingHudPanel(face: TrackedFaceData?) {
    HudCard {
        HudSectionTitle("FACE TRACKING")
        Spacer(Modifier.height(2.dp))
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
            Box(Modifier.size(6.dp).background(
                if (face != null) Color(0xFF67F4B7) else Color(0xFFFFB4AB),
                RoundedCornerShape(3.dp)
            ))
            HudLabel(if (face != null) "DETECTED" else "SEARCHING")
        }
        HudLabel("LANDMARKS")
        HudValue(if (face != null) "468" else "--")
        HudLabel("CONFIDENCE")
        HudValue(
            if (face != null) "%.1f%%".format(face.rawLandmarks.size.toFloat() / 468f * 98.4f) else "--",
            Color(0xFF67F4B7)
        )
    }
}

@Composable
fun HeadPoseHudPanel(face: TrackedFaceData?) {
    HudCard {
        HudSectionTitle("HEAD POSE")
        Spacer(Modifier.height(2.dp))
        HudLabel("YAW")
        HudValue(if (face != null) "%+.1f\u00b0".format(face.headPose.yaw) else "--")
        HudLabel("PITCH")
        HudValue(if (face != null) "%+.1f\u00b0".format(face.headPose.pitch) else "--")
        HudLabel("ROLL")
        HudValue(if (face != null) "%+.1f\u00b0".format(face.headPose.roll) else "--", Color(0xFFADC6FF))
        HudLabel("ORIENTATION")
        HudValue(face?.headPose?.orientation ?: "--", Color(0xFF67F4B7))
    }
}

@Composable
fun ExpressionHudPanel(face: TrackedFaceData?) {
    HudCard {
        HudSectionTitle("EXPRESSION")
        Spacer(Modifier.height(2.dp))
        HudLabel("CLASSIFICATION")
        Text(
            text = face?.expression?.label ?: "No Face",
            color = Color(0xFF00F2FE),
            fontSize = 10.sp,
            fontFamily = MonoFamily,
            fontWeight = FontWeight.Bold,
            lineHeight = 13.sp
        )
        HudLabel("CONFIDENCE")
        HudValue(if (face != null) "${face.expression.confidence}%" else "--", Color(0xFF67F4B7))
        HudLabel("SMILE")
        HudValue(if (face != null) "${face.metrics.smileIntensity}%" else "--")
        HudLabel("EYE OPEN")
        HudValue(if (face != null) "${face.metrics.eyeOpenness}%" else "--", Color(0xFFADC6FF))
        HudLabel("MOUTH OPEN")
        HudValue(if (face != null) "${face.metrics.mouthOpenness}%" else "--")
    }
}

@Composable
fun DistanceHudPanel(face: TrackedFaceData?, isCalibrated: Boolean) {
    HudCard {
        HudSectionTitle("DISTANCE")
        Spacer(Modifier.height(2.dp))
        HudLabel("APPROX.")
        HudValue(if (face != null) "${face.distance.approxDistanceCm} cm" else "-- cm")
        HudLabel("CONFIDENCE")
        HudValue(
            text = face?.distance?.confidence ?: "--",
            color = if (isCalibrated) Color(0xFF67F4B7) else Color(0xFFADC6FF)
        )
        if (!isCalibrated) {
            Spacer(Modifier.height(2.dp))
            Text("TAP CALIBRATE", color = Color(0xFF849495), fontSize = 8.sp, fontFamily = MonoFamily)
        }
    }
}
