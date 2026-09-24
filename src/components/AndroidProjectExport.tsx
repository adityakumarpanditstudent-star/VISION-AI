import React, { useState } from 'react';
import { ANDROID_FILES, AndroidProjectFile } from '../androidCode/androidFiles';
import { ANDROID_EXTRA_FILES } from '../androidCode/androidExtraFiles';
import { generateAndroidProjectZip } from '../utils/zipExporter';

const ALL_FILES: AndroidProjectFile[] = [...ANDROID_FILES, ...ANDROID_EXTRA_FILES];

export const AndroidProjectExport: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<AndroidProjectFile>(ALL_FILES[0]);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleDownloadZip = async () => {
    try {
      setIsExporting(true);
      const zipBlob = await generateAndroidProjectZip();
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'VisionAI-Android-Studio-Project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to export zip:', e);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6 bg-[#0c0e12] min-h-[calc(100vh-6rem)]">
      {/* Top Banner with Download Button */}
      <div className="bg-[#191c1f] p-5 rounded-xl border border-[#3a494b]/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#67f4b7]/15 border border-[#67f4b7]/40 flex items-center justify-center text-[#67f4b7]">
            <span className="material-symbols-outlined text-[28px]">android</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-headline text-[20px] font-bold text-[#e0fdff] tracking-wide">
                Production-Ready Android Studio Project
              </h2>
              <span className="px-2 py-0.5 rounded bg-[#00f2fe]/20 text-[#00f2fe] font-mono-tech text-[10px] font-bold border border-[#00f2fe]/30">
                APK / AAB READY
              </span>
            </div>
            <p className="text-[12px] text-[#849495] font-mono-tech mt-0.5">
              Complete native Kotlin + Jetpack Compose + CameraX + MediaPipe Face Landmarker codebase.
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadZip}
          disabled={isExporting}
          className="flex items-center gap-2 px-5 py-3 rounded-lg bg-[#00f2fe] hover:bg-white text-[#00373a] font-mono-tech text-[12px] font-bold transition-all shadow-[0_0_16px_rgba(0,242,254,0.35)] cursor-pointer disabled:opacity-50 shrink-0"
        >
          {isExporting ? (
            <>
              <span className="material-symbols-outlined text-[18px] animate-spin">
                progress_activity
              </span>
              <span>PACKAGING ZIP...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]">download</span>
              <span>DOWNLOAD ANDROID PROJECT (.ZIP)</span>
            </>
          )}
        </button>
      </div>

      {/* APK & AAB Compilation Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-[#191c1f] p-3.5 rounded-lg border border-[#3a494b]/30">
          <div className="flex items-center gap-2 text-[#00f2fe] font-mono-tech text-[11px] font-semibold mb-1">
            <span className="material-symbols-outlined text-[16px]">terminal</span>
            <span>BUILD DEBUG APK</span>
          </div>
          <code className="block bg-[#0c0e12] p-2 rounded text-[10px] font-mono-tech text-[#67f4b7] overflow-x-auto">
            ./gradlew assembleDebug
          </code>
          <span className="text-[9px] text-[#849495] font-mono-tech mt-1 block">
            Outputs: app/build/outputs/apk/debug/app-debug.apk
          </span>
        </div>

        <div className="bg-[#191c1f] p-3.5 rounded-lg border border-[#3a494b]/30">
          <div className="flex items-center gap-2 text-[#adc6ff] font-mono-tech text-[11px] font-semibold mb-1">
            <span className="material-symbols-outlined text-[16px]">install_mobile</span>
            <span>INSTALL VIA ADB</span>
          </div>
          <code className="block bg-[#0c0e12] p-2 rounded text-[10px] font-mono-tech text-[#adc6ff] overflow-x-auto">
            adb install -r app-debug.apk
          </code>
          <span className="text-[9px] text-[#849495] font-mono-tech mt-1 block">
            Immediately install & run on physical phone via USB/Wi-Fi
          </span>
        </div>

        <div className="bg-[#191c1f] p-3.5 rounded-lg border border-[#3a494b]/30">
          <div className="flex items-center gap-2 text-[#67f4b7] font-mono-tech text-[11px] font-semibold mb-1">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>BUILD PLAY STORE BUNDLE</span>
          </div>
          <code className="block bg-[#0c0e12] p-2 rounded text-[10px] font-mono-tech text-[#67f4b7] overflow-x-auto">
            ./gradlew bundleRelease
          </code>
          <span className="text-[9px] text-[#849495] font-mono-tech mt-1 block">
            Outputs: app-release.aab ready for Google Play Console
          </span>
        </div>
      </div>

      {/* Code Inspector: File Tree + Code Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
        {/* Left: File Tree List */}
        <div className="lg:col-span-4 bg-[#191c1f] rounded-xl border border-[#3a494b]/30 p-3 flex flex-col gap-2">
          <div className="font-mono-tech text-[10px] text-[#849495] uppercase px-2 py-1 flex items-center justify-between">
            <span>Project Explorer ({ALL_FILES.length} Files)</span>
            <span className="text-[#00f2fe]">Kotlin 1.9 / SDK 35</span>
          </div>

          <div className="flex-1 space-y-1 overflow-y-auto max-h-[500px]">
            {ALL_FILES.map((file) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-3 py-2 rounded font-mono-tech text-[11px] flex flex-col transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#00f2fe]/15 text-[#00f2fe] border border-[#00f2fe]/40'
                      : 'text-[#b9cacb] hover:bg-[#1d2023] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px]">
                      {file.category === 'Kotlin'
                        ? 'code'
                        : file.category === 'Gradle'
                        ? 'build'
                        : 'description'}
                    </span>
                    <span className="font-semibold truncate">{file.path.split('/').pop()}</span>
                  </div>
                  <span className="text-[9px] text-[#849495] truncate pl-6">
                    {file.path}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Code Viewer */}
        <div className="lg:col-span-8 bg-[#0c0e12] rounded-xl border border-[#3a494b]/30 flex flex-col overflow-hidden">
          {/* Top Bar of Viewer */}
          <div className="bg-[#191c1f] px-4 py-2.5 border-b border-[#3a494b]/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono-tech text-[11px] text-[#00f2fe] font-semibold">
                {selectedFile.path}
              </span>
              <span className="text-[#849495] text-[10px] font-mono-tech">
                — {selectedFile.description}
              </span>
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#1d2023] hover:bg-[#282a2e] text-[#b9cacb] hover:text-[#00f2fe] border border-[#3a494b]/30 font-mono-tech text-[10px] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'COPIED' : 'COPY CODE'}</span>
            </button>
          </div>

          {/* Syntax Highlighted Code Box */}
          <pre className="flex-1 p-4 font-mono-tech text-[11px] text-[#e1e2e7] overflow-auto leading-relaxed max-h-[500px]">
            <code>{selectedFile.content}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
