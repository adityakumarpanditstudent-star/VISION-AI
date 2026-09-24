package com.visionai.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun CameraPermissionScreen(
    isDenied: Boolean,
    onEnableCameraClicked: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF0C0E12))
            .padding(24.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(16.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Text(
                text = "VISIONAI",
                color = Color(0xFF00F2FE),
                fontSize = 32.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 2.sp
            )

            Text(
                text = "Real-Time Facial Vision",
                color = Color(0xFFADC6FF),
                fontSize = 18.sp,
                fontWeight = FontWeight.Medium
            )

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = "Camera access is required for real-time facial landmark and expression analysis.",
                color = Color(0xFFE1E2E7),
                fontSize = 14.sp,
                textAlign = TextAlign.Center,
                lineHeight = 20.sp,
                modifier = Modifier.padding(horizontal = 16.dp)
            )

            if (isDenied) {
                Text(
                    text = "Permission was previously denied. Please grant permission to continue.",
                    color = Color(0xFFFFB4AB),
                    fontSize = 12.sp,
                    textAlign = TextAlign.Center
                )
            }

            Spacer(modifier = Modifier.height(24.dp))

            Button(
                onClick = onEnableCameraClicked,
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color(0xFF00F2FE),
                    contentColor = Color(0xFF00373A)
                ),
                shape = RoundedCornerShape(4.dp),
                modifier = Modifier
                    .fillMaxWidth(0.75f)
                    .height(48.dp)
            ) {
                Text(
                    text = "ENABLE CAMERA",
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.sp
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "Processing happens strictly on this device. Zero frames uploaded.",
                color = Color(0xFF849495),
                fontSize = 11.sp,
                textAlign = TextAlign.Center
            )
        }
    }
}
