import React from 'react';

export type PipelineId =
  | 'real-time-mesh-telemetry'
  | 'action-units-monitor'
  | 'subject-registry'
  | 'neural-model-calibration'
  | 'session-recordings'
  | 'optical-sensor-logs'
  | 'android-export';

interface NavigationSidebarProps {
  activePipeline: PipelineId;
  onSelectPipeline: (id: PipelineId) => void;
  isOpenMobile: boolean;
  onToggleMobile: () => void;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  activePipeline,
  onSelectPipeline,
  isOpenMobile,
  onToggleMobile
}) => {
  const pipelines: { id: PipelineId; label: string; icon: string; badge?: string }[] = [
    { id: 'real-time-mesh-telemetry', label: 'Real-Time Mesh Telemetry', icon: 'grid_view' },
    { id: 'action-units-monitor', label: 'Action Units Monitor', icon: 'sentiment_satisfied' },
    { id: 'subject-registry', label: 'Subject Registry', icon: 'badge' },
    { id: 'neural-model-calibration', label: 'Neural Model Calibration', icon: 'model_training' },
    { id: 'session-recordings', label: 'Session Recordings', icon: 'videocam' },
    { id: 'optical-sensor-logs', label: 'Optical Sensor Logs', icon: 'sensors' },
    { id: 'android-export', label: 'Android Project & APK Export', icon: 'android', badge: 'APK/AAB' },
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onToggleMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-16 bottom-10 w-64 bg-[#0c0e12] border-r border-[#3a494b]/40 z-40 flex flex-col py-3 transition-transform duration-200 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="px-4 mb-2 font-mono-tech text-[10px] uppercase tracking-widest text-[#849495] flex items-center justify-between">
          <span>Analysis Pipelines</span>
          <button
            onClick={onToggleMobile}
            className="lg:hidden text-[#849495] hover:text-white"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
          {pipelines.map((pipe) => {
            const isActive = activePipeline === pipe.id;
            return (
              <button
                key={pipe.id}
                onClick={() => {
                  onSelectPipeline(pipe.id);
                  if (isOpenMobile) onToggleMobile();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded transition-all text-left font-mono-tech text-[11px] cursor-pointer ${
                  isActive
                    ? 'bg-[#00f2fe] text-[#00373a] font-bold shadow-[0_0_12px_rgba(0,242,254,0.3)]'
                    : 'text-[#b9cacb] hover:bg-[#1d2023] hover:text-[#e1e2e7]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {pipe.icon}
                </span>
                <span className="truncate flex-1">{pipe.label}</span>
                {pipe.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      isActive
                        ? 'bg-[#00373a] text-[#00f2fe]'
                        : 'bg-[#0566d9]/40 text-[#adc6ff] border border-[#adc6ff]/30'
                    }`}
                  >
                    {pipe.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Buffer Meter */}
        <div className="px-4 pt-3 border-t border-[#3a494b]/30 flex flex-col gap-1.5 font-mono-tech text-[10px]">
          <div className="flex justify-between items-center text-[#849495]">
            <span>TARGET BUFFER</span>
            <span className="text-[#00f2fe] font-semibold">100% RAW</span>
          </div>
          <div className="w-full h-1 bg-[#282a2e] rounded overflow-hidden">
            <div className="h-full bg-[#00f2fe] w-full"></div>
          </div>
          <div className="flex justify-between items-center text-[#849495] text-[9px] mt-0.5">
            <span>ZERO CLOUD TRANSMIT</span>
            <span className="text-[#67f4b7]">ON-DEVICE EDGE</span>
          </div>
        </div>
      </aside>
    </>
  );
};
