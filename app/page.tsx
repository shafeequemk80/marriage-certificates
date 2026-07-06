import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* BACKGROUND DECORATIONS */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b border-slate-900 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
              N
            </div>
            <span className="font-extrabold text-xl bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent tracking-tight">
              Nikah Portal
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#about" className="hover:text-white transition">About</a>
            <a href="#contact" className="hover:text-white transition">Contact</a>
          </nav>

          <div>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-semibold bg-white text-slate-950 hover:bg-slate-200 shadow-md shadow-white/5 transition"
            >
              Login to Portal
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1 flex flex-col justify-center">
        <section className="max-w-7xl mx-auto px-6 py-20 md:py-32 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-xs font-semibold text-indigo-400 tracking-wide">
              ✨ Official Certificate Generation System
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Generate & Manage <br />
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                Marriage Certificates
              </span>
            </h1>

            <p className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Create, preview, and export high-fidelity vector Nikah certificates instantly. Designed with native Times New Roman typography and vector layout scaling for professional printing.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-bold bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/35 hover:shadow-indigo-600/50 hover:-translate-y-0.5 active:translate-y-0 transition duration-200"
              >
                Create Certificate
              </Link>
              <a
                href="#features"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-bold border border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-slate-700 text-slate-300 transition"
              >
                Explore Features
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            {/* HERO GRAPHIC CARD */}
            <div className="relative group w-full max-w-sm rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-950 p-6 border border-slate-800 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-indigo-500/5 group-hover:bg-indigo-500/10 transition" />
              <div className="relative space-y-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-400 font-bold text-lg">
                  📜
                </div>
                <h3 className="font-extrabold text-xl text-white">Selectable Vector Text</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Unlike traditional platforms that export certificates as static screenshots, our portal prints native PDF text characters. This ensures the output remains searchable, sharp at 4K zoom levels, and easy to print.
                </p>
                <div className="h-px bg-slate-900" />
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span>Custom Fonts</span>
                  <span>Auto Justify</span>
                  <span>A4 Format</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="border-t border-slate-900 bg-slate-950/50 py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-2xl mx-auto text-center mb-16 space-y-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Designed for Reliability and Parity
              </h2>
              <p className="text-slate-400 text-sm sm:text-base">
                Everything you need to output professional certificates for official registers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* CARD 1 */}
              <div className="p-8 rounded-2xl border border-slate-900 bg-slate-900/20 hover:border-slate-800 transition">
                <div className="text-3xl mb-4">🔤</div>
                <h4 className="text-lg font-bold text-white mb-2">Times New Roman Typography</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Uses true TrueType Times New Roman regular and bold fonts embedded directly within the document virtual file system.
                </p>
              </div>

              {/* CARD 2 */}
              <div className="p-8 rounded-2xl border border-slate-900 bg-slate-900/20 hover:border-slate-800 transition">
                <div className="text-3xl mb-4">⚖️</div>
                <h4 className="text-lg font-bold text-white mb-2">Justified Line Alignment</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Advanced text typesetting algorithm spaces lines evenly without separating punctuation marks from their preceding words.
                </p>
              </div>

              {/* CARD 3 */}
              <div className="p-8 rounded-2xl border border-slate-900 bg-slate-900/20 hover:border-slate-800 transition">
                <div className="text-3xl mb-4">⚡</div>
                <h4 className="text-lg font-bold text-white mb-2">High Resolution Preview</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Compare the live browser-rendered CSS layout directly with the generated file prior to printing.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer id="contact" className="border-t border-slate-900 bg-slate-950 py-10 text-center text-slate-500 text-xs font-semibold">
        <p>© {new Date().getFullYear()} Nikah Marriage Certificate Management System. All rights reserved.</p>
      </footer>
    </div>
  );
}
