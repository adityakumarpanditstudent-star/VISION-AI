import fs from 'fs';
import path from 'path';
import { ANDROID_FILES } from './src/androidCode/androidFiles.ts';
import { ANDROID_EXTRA_FILES } from './src/androidCode/androidExtraFiles.ts';

const outDir = path.join(process.cwd(), 'AndroidProject');

console.log('Extracting Android project to:', outDir);

const allFiles = [...ANDROID_FILES, ...ANDROID_EXTRA_FILES];

for (const file of allFiles) {
  const fullPath = path.join(outDir, file.path);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, file.content, 'utf8');
}

// Add gradle wrapper properties
const wrapperPropsPath = path.join(outDir, 'gradle/wrapper/gradle-wrapper.properties');
fs.mkdirSync(path.dirname(wrapperPropsPath), { recursive: true });
fs.writeFileSync(wrapperPropsPath, `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.9-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
`, 'utf8');

// Add gradle.properties
fs.writeFileSync(path.join(outDir, 'gradle.properties'), `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.enableJetifier=true
kotlin.code.style=official
android.nonTransitiveRClass=true
`, 'utf8');

// Add res/values/strings.xml
const stringsXmlPath = path.join(outDir, 'app/src/main/res/values/strings.xml');
fs.mkdirSync(path.dirname(stringsXmlPath), { recursive: true });
fs.writeFileSync(stringsXmlPath, `<resources>
    <string name="app_name">VisionAI</string>
    <string name="app_subtitle">Real-Time Facial Vision</string>
    <string name="enable_camera">ENABLE CAMERA</string>
</resources>
`, 'utf8');

// Add res/values/themes.xml
const themesXmlPath = path.join(outDir, 'app/src/main/res/values/themes.xml');
fs.mkdirSync(path.dirname(themesXmlPath), { recursive: true });
fs.writeFileSync(themesXmlPath, `<resources>
    <style name="Theme.VisionAI" parent="android:Theme.Material.NoActionBar">
        <item name="android:statusBarColor">#0C0E12</item>
        <item name="android:navigationBarColor">#0C0E12</item>
        <item name="android:windowBackground">#0C0E12</item>
    </style>
</resources>
`, 'utf8');

// Add gradlew shell script
fs.writeFileSync(path.join(outDir, 'gradlew'), `#!/usr/bin/env sh
exec gradle "$@"
`, { encoding: 'utf8', mode: 0o755 });

console.log('Extraction complete!');
