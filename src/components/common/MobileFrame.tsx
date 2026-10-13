import React from 'react';
import { Wifi, Battery, Smartphone, Monitor } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
  isFramed: boolean;
  onToggleFrame: () => void;
  activeScreenTitle: string;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  isFramed,
  onToggleFrame,
  activeScreenTitle,
}) => {
  if (!isFramed) {
    return (
      <div className="w-full h-full flex flex-col bg-white overflow-hidden shadow-sm">
        {children}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-2 md:p-6 w-full h-full">
      {/* Phone Outer Shell */}
      <div className="relative w-full max-w-[390px] h-[780px] bg-slate-900 rounded-[50px] p-3 shadow-2xl border-4 border-slate-700/80 ring-1 ring-slate-800 flex flex-col overflow-hidden">
        {/* Dynamic Island / Speaker Pill */}
        <div className="absolute top-4 inset-x-0 mx-auto w-24 h-5 bg-black rounded-full z-40 flex items-center justify-between px-2">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800"></div>
          <div className="w-2 h-2 rounded-full bg-teal-950/80"></div>
        </div>

        {/* Screen Container */}
        <div className="relative w-full h-full bg-slate-50 rounded-[40px] overflow-hidden flex flex-col pt-6">
          {/* Status Bar */}
          <div className="shrink-0 h-6 px-6 flex items-center justify-between text-[11px] font-bold text-slate-800 z-30 select-none">
            <span>09:41</span>
            <div className="flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* Screen Content Scrollable Area */}
          <div className="flex-1 overflow-y-auto relative no-scrollbar">
            {children}
          </div>

          {/* Home Indicator Bar */}
          <div className="shrink-0 h-4 flex items-center justify-center bg-white/40 backdrop-blur-xs z-30">
            <div className="w-32 h-1 bg-slate-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
