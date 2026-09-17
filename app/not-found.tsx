import Link from "next/link";
import { getAllCertificates } from "../lib/certificates/registry";

export default function NotFound() {
  const certificates = getAllCertificates();

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
            Portal Not Found
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            The requested certificate portal or page does not exist or has been relocated.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap justify-center gap-2">
          {certificates.map((cert) => (
            <Link
              key={cert.id}
              href={`/${cert.id}`}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
            >
              {cert.theme.icon} {cert.shortName}
            </Link>
          ))}
        </div>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl text-sm font-bold bg-white text-slate-950 hover:bg-slate-200 shadow-md shadow-white/5 transition duration-200"
          >
            Go to Master Hub
          </Link>
        </div>
      </div>
    </div>
  );
}
