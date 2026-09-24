# VisionAI - Real-Time Facial Recognition & Telemetry Pipeline

![VisionAI](https://img.shields.io/badge/Platform-Android%20%7C%20Web-00F2FE?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-67F4B7?style=for-the-badge)
![Neural Network](https://img.shields.io/badge/Neural_Net-MediaPipe_Face_Mesh-white?style=for-the-badge)

VisionAI is a high-performance, real-time facial tracking and biometric telemetry application built for both Web and Android platforms. It utilizes advanced machine learning and computer vision to analyze facial micro-expressions, estimate 3D head poses, and classify complex emotional states instantaneously.

### 🌐 Live Demo: [vision-ai-blush-iota.vercel.app](https://vision-ai-blush-iota.vercel.app/)
*(Works instantly in your mobile or desktop browser—no installation required!)*

## 🚀 Key Features

* **High-Fidelity 3D Face Mesh**: Maps a 468-point 3D tessellation mesh onto the subject's face in real time.
* **Expression Analysis & FACS**: Uses the Facial Action Coding System (FACS) to track 52 individual facial blendshapes, instantly classifying complex emotional states like "Duchenne Smiles", "Astonishment", and "Distress".
* **Gaze & Pupil Tracking**: Real-time positional tracking of both pupils to determine gaze direction, eye openness, and blink rates.
* **Spatial Head Pose Gimbal**: Calculates real-time Pitch, Yaw, and Roll Euler angles using spatial telemetry.
* **Edge-Native Inference**: All neural network processing happens securely on-device (on your phone or browser) with zero cloud latency and total privacy.

## 🧠 Neural Networks & Architecture

VisionAI runs on the **MediaPipe Tasks Vision** framework. Under the hood, it leverages specialized deep learning models designed for mobile and edge devices:

* **Face Detection Model**: A lightweight, sub-millisecond object detection model specifically trained on facial bounding boxes.
* **Face Mesh Model**: A robust 3D coordinate predictor that outputs 468 highly accurate spatial vertices, alongside 52 blendshape coefficients representing distinct facial muscle contractions.

## 💻 Tech Stack & Languages

VisionAI is cross-platform by design, utilizing the most modern frameworks and programming languages:

### Web Telemetry Dashboard
* **Language**: TypeScript / TSX
* **Framework**: React + Vite
* **Styling**: TailwindCSS (Custom Obsidian/Cyan Theme)
* **Computer Vision**: `@mediapipe/tasks-vision` running via WebAssembly (WASM) for near-native speeds.

### Native Android Application
* **Language**: Kotlin
* **Framework**: Android Jetpack Compose (Declarative UI)
* **Architecture**: MVVM (Model-View-ViewModel)
* **Camera Pipeline**: CameraX API
* **Computer Vision**: Google ML Kit & MediaPipe Android Native Libraries

## 📱 Running the Android App (No Code Required)

This repository is equipped with an automated **GitHub Actions** CI/CD pipeline. 
Whenever code is pushed, GitHub's cloud servers automatically compile the Android `.apk` file for you.

**To install the app on your phone:**
1. Click the **Actions** tab at the top of this GitHub repository.
2. Click on the latest successful workflow run (e.g., "Build Android APK").
3. Scroll down to the **Artifacts** section at the bottom.
4. Click to download the **`VisionAI-App`** zip file.
5. Extract the `.apk` file, transfer it to your Android device, and install it! *(You may need to allow "Install from Unknown Sources" in your Android settings).*

## 🛠️ Local Web Development

To run the web telemetry dashboard on your local machine:

```bash
# 1. Install dependencies
npm install

# 2. Start the high-performance dev server
npm run dev
```
