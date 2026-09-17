import Link from "next/link";
import { getAllCertificates } from "../../lib/certificates/registry";

export const metadata = {
  title: "Subdomain Portals Directory - CertHub",
  description: "Directory of all registered organization certificate subdomains.",
};

export default function PortalsDirectoryPage() {
  const certificates = getAllCertificates();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* BACKGROUND GLOWS */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER */}
      <header className="sticky top-0 z-40 backdrop-blur-md border-b border-slate-900 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center font-bold text-white shadow-lg">
              ✨
            </div>
            <div>
              <span className="font-extrabold text-xl bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent tracking-tight">
                Certificate Portals Directory
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-500">
                Active Subdomains Registry
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-400 font-semibold px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
            {certificates.length} Active {certificates.length === 1 ? "Subdomain" : "Subdomains"}
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 md:py-16">
        <div className="max-w-2xl mb-12 space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Registered Subdomains
          </h1>
          <p className="text-slate-400 text-sm">
            Select a certificate portal below to access its dedicated management workspace.
          </p>
        </div>

        {/* SUBDOMAINS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="group relative rounded-3xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 p-8 transition duration-300 flex flex-col justify-between hover:border-slate-700 hover:shadow-2xl hover:shadow-indigo-500/5"
            >
              <div className="space-y-5">
                {/* CARD HEADER */}
                <div className="flex items-center justify-between">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${cert.theme.primary} flex items-center justify-center text-3xl shadow-lg`}
                  >
                    {cert.theme.icon}
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-[11px] font-bold border ${cert.theme.badgeBg} ${cert.theme.badgeText}`}
                  >
                    {cert.theme.category}
                  </div>
                </div>

                {/* TITLE & DESCRIPTION */}
                <div>
                  <h2 className="text-xl font-bold text-white group-hover:text-indigo-300 transition">
                    {cert.name}
                  </h2>
                  <div className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-mono text-slate-400">
                    <span className="text-emerald-400 font-bold">●</span>
                    <span>Subdomain:</span>
                    <code className="px-2 py-0.5 rounded bg-slate-800 text-white font-bold">
                      {cert.id}
                    </code>
                  </div>
                  <p className="text-sm text-slate-400 mt-3 line-clamp-3 leading-relaxed">
                    {cert.description}
                  </p>
                </div>

                {/* REGISTERED FIELDS PREVIEW */}
                <div className="pt-2">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Fields:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {cert.fields.slice(0, 4).map((f) => (
                      <span
                        key={f.id}
                        className="px-2.5 py-0.5 rounded-md text-[11px] bg-slate-800/80 text-slate-300 border border-slate-700/50"
                      >
                        {f.label}
                      </span>
                    ))}
                    {cert.fields.length > 4 && (
                      <span className="px-2 py-0.5 rounded-md text-[11px] bg-slate-800/40 text-slate-500">
                        +{cert.fields.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* CARD ACTIONS */}
              <div className="pt-8 mt-6 border-t border-slate-800/60 flex items-center gap-3">
                <Link
                  href={`/${cert.id}`}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold text-center text-white bg-gradient-to-r ${cert.theme.buttonGradient} shadow-md transition hover:scale-[1.02] active:scale-[0.98]`}
                >
                  Open Portal →
                </Link>
                <Link
                  href={`/${cert.id}/certificate`}
                  className="py-3 px-4 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
                >
                  Create
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-slate-500 text-xs font-semibold">
        <p>© {new Date().getFullYear()} Certificate Management System. All rights reserved.</p>
      </footer>
    </div>
  );
}
