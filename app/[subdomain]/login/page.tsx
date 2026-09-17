"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCertificateConfig } from "../../../lib/certificates/registry";

interface LoginPageProps {
  params: Promise<{ subdomain: string }>;
}

export default function SubdomainLoginPage({ params }: LoginPageProps) {
  const { subdomain } = use(params);
  const router = useRouter();

  const config = getCertificateConfig(subdomain);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const expectedUsername = config.auth?.username || config.id;
  const expectedPassword = config.auth?.password || `${config.id}password`;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Strict validation solely by this subdomain's configured credentials
    const isMatch =
      username.trim() === expectedUsername.trim() &&
      password === expectedPassword;

    if (isMatch) {
      const ONE_DAY_MS = 24 * 60 * 60 * 1000;
      const ONE_DAY_SECONDS = 24 * 60 * 60;

      // 1. Set Auth Cookie for Server & Middleware Route Protection (1-day expiration)
      document.cookie = `auth_${config.id}=true; path=/; max-age=${ONE_DAY_SECONDS}; SameSite=Lax`;

      // 2. Set LocalStorage for client persistence
      const authSession = {
        loggedIn: true,
        expiresAt: Date.now() + ONE_DAY_MS,
      };

      try {
        localStorage.setItem(`auth_${config.id}`, JSON.stringify(authSession));
      } catch (err) {
        console.error("LocalStorage write error:", err);
      }

      router.push(`/${config.id}/certificate`);
      router.refresh();
    } else {
      setError(`Invalid credentials for ${config.shortName}.`);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <div className="flex-1 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* BACKGROUND GLOW */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none ${config.theme.cardGlow}`}
        />

        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 backdrop-blur-xl rounded-2xl shadow-2xl p-8 relative z-10">
          {/* HEADER */}
          <div className="text-center mb-8 space-y-2">
            <div
              className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr ${config.theme.primary} flex items-center justify-center text-3xl shadow-lg mb-4`}
            >
              {config.theme.icon}
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {config.name}
            </h1>
            <p className="text-slate-400 text-sm">
              Sign in with your {config.shortName} credentials
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full rounded-xl bg-slate-950/60 border border-slate-700 px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl bg-slate-950/60 border border-slate-700 px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition"
              />
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl px-4 py-2.5 font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r ${config.theme.buttonGradient} shadow-lg transition duration-200 active:translate-y-0.5 cursor-pointer`}
            >
              Sign In to {config.shortName}
            </button>
          </form>

          {/* FOOTER */}
          <div className="mt-8 pt-6 border-t border-slate-800 text-center flex items-center justify-center text-xs text-slate-500 font-medium">
            <Link
              href={`/${config.id}`}
              className="hover:text-slate-300 transition"
            >
              ← Back to {config.shortName} Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
