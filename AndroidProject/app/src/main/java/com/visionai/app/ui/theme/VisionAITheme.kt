package com.visionai.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    primary = Color(0xFF00F2FE),
    onPrimary = Color(0xFF003739),
    primaryContainer = Color(0xFF004F52),
    onPrimaryContainer = Color(0xFF6FF6FF),
    secondary = Color(0xFF67F4B7),
    onSecondary = Color(0xFF003828),
    background = Color(0xFF0C0E12),
    onBackground = Color(0xFFE1E2E7),
    surface = Color(0xFF191C1F),
    onSurface = Color(0xFFE1E2E7),
    surfaceVariant = Color(0xFF1D2023),
    onSurfaceVariant = Color(0xFFB9CACB),
    outline = Color(0xFF3A494B),
    error = Color(0xFFFFB4AB),
    onError = Color(0xFF690005)
)

@Composable
fun VisionAITheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        content = content
    )
}
