VisionAI - MediaPipe Model Asset
================================

Place the MediaPipe Face Landmarker model in this directory:

    face_landmarker.task

Download from:
  https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task

File size: ~1.4 MB (float16 recommended for speed)
Format: TFLite Task Bundle (.task)

Final path: app/src/main/assets/face_landmarker.task

Loaded by FaceLandmarkEngine.kt:
  BaseOptions.builder().setModelAssetPath("face_landmarker.task")

Without this file the app will display a model init error on startup.
