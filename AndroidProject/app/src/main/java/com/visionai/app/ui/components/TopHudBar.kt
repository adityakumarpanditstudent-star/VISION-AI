package com.visionai.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun TopHudBar(
    fps: Int,
    latencyMs: Number,
    isActive: Boolean,
    onPrivacy: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color(0xDD0C0E12))
            .statusBarsPadding()
            .padding(horizontal = 16.dp, vertical = 10.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Brand
        Column {
            Text(
                "VISION//AI",
                color = Color(0xFF00F2FE),
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.sp,
                fontFamily = FontFamily.Monospace
            )
            Text(
                "Real-Time Facial Vision",
                color = Color(0xFF849495),
                fontSize = 9.sp,
                fontFamily = FontFamily.Monospace
            )
        }

        // Status badges row
        Row(
            horizontalArrangement = Arrangement.spacedBy(6.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Camera status
            Surface(
                color = if (isActive) Color(0x2267F4B7) else Color(0x22FFB4AB),
                shape = RoundedCornerShape(4.dp)
            ) {
                Row(
                    Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                    horizontalArrangement = Arrangement.spacedBy(4.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(Modifier.size(6.dp).background(
                        if (isActive) Color(0xFF67F4B7) else Color(0xFFFFB4AB),
                        RoundedCornerShape(3.dp)
                    ))
                    Text(
                        if (isActive) "LIVE" else "IDLE",
                        color = if (isActive) Color(0xFF67F4B7) else Color(0xFFFFB4AB),
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        fontFamily = FontFamily.Monospace
                    )
                }
            }

            // FPS badge
            Surface(color = Color(0x220566D9), shape = RoundedCornerShape(4.dp)) {
                Text(
                    "$fps FPS",
                    color = Color(0xFF00F2FE),
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                    fontFamily = FontFamily.Monospace
                )
            }

            // Privacy button
            TextButton(
                onClick = onPrivacy,
                contentPadding = PaddingValues(horizontal = 6.dp, vertical = 2.dp)
            ) {
                Text("PRIVACY", color = Color(0xFF849495), fontSize = 9.sp, fontFamily = FontFamily.Monospace)
            }
        }
    }
}
