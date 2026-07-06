import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center font-sans px-6 relative overflow-hidden">
      {/* GLOW DECORATIONS */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="text-center space-y-8 max-w-md relative z-10">
        {/* ICON OR GRAPHIC */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-5xl shadow-xl shadow-indigo-500/5 animate-pulse">
            🔍
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-8xl font-black tracking-tighter bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Page Not Found
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
          </p>
        </div>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl text-sm font-bold bg-white text-slate-950 hover:bg-slate-200 shadow-md shadow-white/5 transition duration-200"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
