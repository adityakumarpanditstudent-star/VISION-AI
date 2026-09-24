package com.visionai.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog

@Composable
fun CalibrationDialog(onConfirm: (Float) -> Unit, onDismiss: () -> Unit) {
    var distanceText by remember { mutableStateOf("50") }
    val distance = distanceText.toFloatOrNull()

    Dialog(onDismissRequest = onDismiss) {
        Column(
            modifier = Modifier
                .background(Color(0xFF191C1F), RoundedCornerShape(12.dp))
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Text(
                "CALIBRATE DISTANCE",
                color = Color(0xFF00F2FE),
                fontSize = 15.sp,
                fontWeight = FontWeight.Bold,
                fontFamily = FontFamily.Monospace
            )
            Text(
                "Place your face at a known distance from the camera and enter that distance below.",
                color = Color(0xFFB9CACB),
                fontSize = 12.sp,
                textAlign = TextAlign.Center
            )
            OutlinedTextField(
                value = distanceText,
                onValueChange = { distanceText = it.filter { c -> c.isDigit() || c == '.' } },
                label = { Text("Distance (cm)", color = Color(0xFF849495)) },
                singleLine = true,
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = Color(0xFF00F2FE),
                    unfocusedBorderColor = Color(0xFF3A494B),
                    focusedTextColor = Color(0xFFE1E2E7),
                    unfocusedTextColor = Color(0xFFE1E2E7)
                )
            )
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                TextButton(onClick = onDismiss) {
                    Text("CANCEL", color = Color(0xFF849495))
                }
                Button(
                    onClick = { if (distance != null && distance > 10f) onConfirm(distance) },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Color(0xFF00F2FE),
                        contentColor = Color(0xFF003739)
                    ),
                    enabled = distance != null && distance > 10f
                ) {
                    Text("CONFIRM", fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@Composable
fun PrivacyInfoDialog(onDismiss: () -> Unit) {
    Dialog(onDismissRequest = onDismiss) {
        Column(
            modifier = Modifier
                .background(Color(0xFF191C1F), RoundedCornerShape(12.dp))
                .padding(24.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Text(
                "LOCAL EDGE PROCESSING",
                color = Color(0xFF00F2FE),
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                fontFamily = FontFamily.Monospace
            )
            listOf(
                "Camera permission required for real-time analysis.",
                "All processing runs entirely on this device.",
                "No camera frames are uploaded to any server.",
                "No facial images are stored permanently.",
                "No biometric profiles are created or transmitted.",
                "Analysis data exists only in volatile session RAM."
            ).forEach { item ->
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("\u2022", color = Color(0xFF67F4B7), fontSize = 12.sp)
                    Text(item, color = Color(0xFFB9CACB), fontSize = 11.sp)
                }
            }
            Button(
                onClick = onDismiss,
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color(0xFF1D2023),
                    contentColor = Color(0xFF00F2FE)
                )
            ) {
                Text("CLOSE", fontWeight = FontWeight.Bold)
            }
        }
    }
}
