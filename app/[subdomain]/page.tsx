"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCertificateConfig, isValidSubdomain } from "../../lib/certificates/registry";

interface PageProps {
  params: Promise<{ subdomain: string }>;
}

export default function SubdomainLandingPage({ params }: PageProps) {
  const { subdomain } = use(params);

  if (!isValidSubdomain(subdomain)) {
    notFound();
  }

  const config = getCertificateConfig(subdomain);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-indigo-500 selection:text-white">
      {/* BACKGROUND GLOWS */}
      <div
        className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20 ${config.theme.cardGlow}`}
      />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* NAVBAR */}
      <header className="sticky top-0 z-40 backdrop-blur-md border-b border-slate-900 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${config.theme.primary} flex items-center justify-center font-bold text-white shadow-lg`}
            >
              {config.theme.icon}
            </div>
            <div>
              <span className="font-extrabold text-xl bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent tracking-tight">
                {config.shortName}
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-500">
                {config.theme.category}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/${config.id}/login`}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-semibold bg-white text-slate-950 hover:bg-slate-200 shadow-md shadow-white/5 transition"
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1 flex flex-col justify-center py-12 md:py-20">
        <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold tracking-wide ${config.theme.badgeBg} ${config.theme.badgeText}`}
            >
              {config.badge}
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Generate &amp; Manage <br />
              <span
                className={`bg-gradient-to-r ${config.theme.primary} bg-clip-text text-transparent`}
              >
                {config.name}
              </span>
            </h1>

            <p className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {config.description}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href={`/${config.id}/certificate`}
                className={`w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-bold bg-gradient-to-r ${config.theme.buttonGradient} text-white shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition duration-200`}
              >
                Create Certificate →
              </Link>
              <Link
                href={`/${config.id}/login`}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-bold border border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-slate-700 text-slate-300 transition"
              >
                Sign In to Portal
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            {/* HERO GRAPHIC CARD */}
            <div className="relative group w-full max-w-sm rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-950 p-6 border border-slate-800 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-indigo-500/5 group-hover:bg-indigo-500/10 transition" />
              <div className="relative space-y-4">
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-2xl shadow-inner">
                  {config.theme.icon}
                </div>
                <h3 className="font-extrabold text-xl text-white">
                  Ultra-Sharp Vector Typography
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Generates authentic vector PDF paths with custom TrueType fonts, dynamic line justification, and 4K print fidelity.
                </p>
                <div className="h-px bg-slate-800" />
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span>TrueType Fonts</span>
                  <span>Auto-Justified</span>
                  <span>A4 Vector Print</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-slate-500 text-xs font-semibold">
        <p>
          © {new Date().getFullYear()} {config.name}. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
