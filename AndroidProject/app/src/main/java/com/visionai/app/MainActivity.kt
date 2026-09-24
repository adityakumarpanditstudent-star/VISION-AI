package com.visionai.app

import android.Manifest
import android.content.pm.PackageManager
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.viewModels
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.core.content.ContextCompat
import com.visionai.app.ui.screens.MainVisionScreen
import com.visionai.app.ui.screens.CameraPermissionScreen
import com.visionai.app.ui.theme.VisionAITheme
import com.visionai.app.viewmodel.MainViewModel

class MainActivity : ComponentActivity() {

    private val viewModel: MainViewModel by viewModels()

    private val cameraPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted: Boolean ->
        viewModel.onPermissionResult(isGranted)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        checkInitialCameraPermission()

        setContent {
            VisionAITheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = Color(0xFF0C0E12)
                ) {
                    val cameraState by viewModel.cameraState.collectAsState()

                    when (cameraState) {
                        is MainViewModel.CameraState.PermissionRequired,
                        is MainViewModel.CameraState.PermissionDenied -> {
                            CameraPermissionScreen(
                                isDenied = cameraState is MainViewModel.CameraState.PermissionDenied,
                                onEnableCameraClicked = {
                                    cameraPermissionLauncher.launch(Manifest.permission.CAMERA)
                                }
                            )
                        }
                        else -> {
                            MainVisionScreen(
                                viewModel = viewModel,
                                onStopCamera = { viewModel.stopCamera() },
                                onStartCamera = { viewModel.startCamera() }
                            )
                        }
                    }
                }
            }
        }
    }

    private fun checkInitialCameraPermission() {
        val permissionGranted = ContextCompat.checkSelfPermission(
            this, Manifest.permission.CAMERA
        ) == PackageManager.PERMISSION_GRANTED

        if (permissionGranted) {
            viewModel.onPermissionResult(true)
        }
    }

    override fun onResume() {
        super.onResume()
        viewModel.onAppForegrounded()
    }

    override fun onPause() {
        super.onPause()
        viewModel.onAppBackgrounded()
    }
}
