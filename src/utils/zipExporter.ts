import JSZip from 'jszip';
import { ANDROID_FILES } from '../androidCode/androidFiles';
import { ANDROID_EXTRA_FILES } from '../androidCode/androidExtraFiles';

export async function generateAndroidProjectZip(): Promise<Blob> {
  const zip = new JSZip();
  const root = zip.folder('VisionAI-Android-Project') || zip;

  // Add all Android files (base + extra)
  const allFiles = [...ANDROID_FILES, ...ANDROID_EXTRA_FILES];
  for (const file of allFiles) {
    root.file(file.path, file.content);
  }

  // Add gradle wrapper properties
  root.file(
    'gradle/wrapper/gradle-wrapper.properties',
    `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.9-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
`
  );

  // Add gradle.properties
  root.file(
    'gradle.properties',
    `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.enableJetifier=true
kotlin.code.style=official
android.nonTransitiveRClass=true
`
  );

  // Add res/values/strings.xml
  root.file(
    'app/src/main/res/values/strings.xml',
    `<resources>
    <string name="app_name">VisionAI</string>
    <string name="app_subtitle">Real-Time Facial Vision</string>
    <string name="enable_camera">ENABLE CAMERA</string>
</resources>
`
  );

  // Add res/values/themes.xml
  root.file(
    'app/src/main/res/values/themes.xml',
    `<resources>
    <style name="Theme.VisionAI" parent="android:Theme.Material.NoActionBar">
        <item name="android:statusBarColor">#0C0E12</item>
        <item name="android:navigationBarColor">#0C0E12</item>
        <item name="android:windowBackground">#0C0E12</item>
    </style>
</resources>
`
  );

  // Add gradlew shell script
  root.file(
    'gradlew',
    `#!/usr/bin/env sh
exec gradle "$@"
`
  );

  // Add APK & AAB Compilation Guide
  root.file(
    'README_BUILD_APK.md',
    `# VisionAI - Real-Time Facial Vision Android Application

## Prerequisites
- Android Studio Hedgehog (2023.1.1) or newer
- JDK 17
- Android SDK 35 with NDK support

## Quick Build Commands

### 1. Build Debug APK (Installable immediately on any physical phone):
\`\`\`bash
./gradlew assembleDebug
\`\`\`
The generated APK will be at:
\`app/build/outputs/apk/debug/app-debug.apk\`

### 2. Install to connected Android device:
\`\`\`bash
adb install -r app/build/outputs/apk/debug/app-debug.apk
\`\`\`

### 3. Build Release APK:
\`\`\`bash
./gradlew assembleRelease
\`\`\`
Output:
\`app/build/outputs/apk/release/app-release.apk\`

### 4. Build Android App Bundle (for Google Play):
\`\`\`bash
./gradlew bundleRelease
\`\`\`
Output:
\`app/build/outputs/bundle/release/app-release.aab\`

## Verification Checklist on Physical Device
1. App requests CAMERA permission upon tapping "ENABLE CAMERA".
2. Front-facing selfie camera initializes with mirrored preview.
3. 468 Dense facial landmarks and mesh follow movement smoothly at 60 FPS.
4. Non-psychological expression metrics update in real-time.
5. 3D Head Pose (Yaw, Pitch, Roll) and Distance estimation work locally.
6. Camera is automatically released on backgrounding and restored on foregrounding.
`
  );

  return await zip.generateAsync({ type: 'blob' });
}
