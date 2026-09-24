package com.visionai.app.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.visionai.app.model.VisualizationMode

@Composable
fun BottomControlBar(
    modifier: Modifier = Modifier,
    currentMode: VisualizationMode,
    onModeChange: (VisualizationMode) -> Unit,
    onStopCamera: () -> Unit,
    onStartCamera: () -> Unit,
    isActive: Boolean,
    onCalibrate: () -> Unit
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .background(Color(0xCC0C0E12))
            .padding(horizontal = 12.dp, vertical = 8.dp)
            .navigationBarsPadding(),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        // Mode selector row
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceEvenly
        ) {
            val modes = listOf(
                VisualizationMode.NORMAL to "NORMAL",
                VisualizationMode.LANDMARK to "LNDMK",
                VisualizationMode.MESH to "MESH",
                VisualizationMode.SCAN to "SCAN",
                VisualizationMode.ANALYSIS to "ANALY"
            )
            modes.forEach { (mode, label) ->
                val isSelected = currentMode == mode
                TextButton(
                    onClick = { onModeChange(mode) },
                    modifier = Modifier
                        .then(
                            if (isSelected)
                                Modifier.background(Color(0xFF00F2FE), RoundedCornerShape(4.dp))
                            else
                                Modifier.border(1.dp, Color(0x403A494B), RoundedCornerShape(4.dp))
                        )
                        .height(32.dp),
                    contentPadding = PaddingValues(horizontal = 6.dp)
                ) {
                    Text(
                        label,
                        color = if (isSelected) Color(0xFF003739) else Color(0xFF849495),
                        fontSize = 9.sp,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                    )
                }
            }
        }

        // Action buttons row
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceEvenly,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Button(
                onClick = if (isActive) onStopCamera else onStartCamera,
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (isActive) Color(0x44FF5449) else Color(0xFF00F2FE),
                    contentColor = if (isActive) Color(0xFFFFB4AB) else Color(0xFF003739)
                ),
                shape = RoundedCornerShape(4.dp),
                modifier = Modifier.height(36.dp)
            ) {
                Text(
                    if (isActive) "STOP CAMERA" else "START CAMERA",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold
                )
            }

            Button(
                onClick = onCalibrate,
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color(0xFF1D2023),
                    contentColor = Color(0xFF00F2FE)
                ),
                shape = RoundedCornerShape(4.dp),
                modifier = Modifier.height(36.dp),
                border = BorderStroke(1.dp, Color(0x4000F2FE))
            ) {
                Text("CALIBRATE 50cm", fontSize = 10.sp, fontWeight = FontWeight.Bold)
            }
        }
    }
}
