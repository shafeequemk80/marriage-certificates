"use client";

interface LoadingOverlayProps {
  isOpen: boolean;
  title: string;
  subtitle: string;
}

export function LoadingOverlay({ isOpen, title, subtitle }: LoadingOverlayProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md transition-all duration-300">
      <div className="bg-white/95 border border-slate-200 p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-sm w-full mx-4 text-center">
        {/* Animated outer ring and inner spinner */}
        <div className="relative w-20 h-20 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-slate-900 border-t-transparent animate-spin"></div>
          <div className="absolute -inset-2 rounded-full bg-slate-900/5 animate-ping"></div>
        </div>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">
          {title}
        </h3>
        <p className="text-sm text-slate-500 mt-2 font-medium">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
