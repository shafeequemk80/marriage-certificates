"use client";

import { use, useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCertificateConfig } from "../../../lib/certificates/registry";
import { CertificateCanvas } from "../../../components/CertificateCanvas";
import { CertificateForm } from "../../../components/CertificateForm";
import { LoadingOverlay } from "../../../components/LoadingOverlay";
import { generateCertificatePDF, A4_WIDTH, A4_HEIGHT } from "../../../lib/pdf/generator";

interface CertificatePageProps {
  params: Promise<{ subdomain: string }>;
}

export default function SubdomainCertificateWorkspace({
  params,
}: CertificatePageProps) {
  const { subdomain } = use(params);
  const router = useRouter();

  const config = getCertificateConfig(subdomain);

  // Subdomain-specific authentication check (1-day localStorage expiration)
  useEffect(() => {
    try {
      const authRaw = localStorage.getItem(`auth_${config.id}`);
      if (!authRaw) {
        document.cookie = `auth_${config.id}=; path=/; max-age=0; SameSite=Lax`;
        router.replace(`/${config.id}/login`);
        return;
      }

      const authData = JSON.parse(authRaw);
      if (!authData.loggedIn || !authData.expiresAt || Date.now() > authData.expiresAt) {
        // Session expired (older than 1 day) or invalid
        localStorage.removeItem(`auth_${config.id}`);
        document.cookie = `auth_${config.id}=; path=/; max-age=0; SameSite=Lax`;
        router.replace(`/${config.id}/login`);
      }
    } catch {
      localStorage.removeItem(`auth_${config.id}`);
      document.cookie = `auth_${config.id}=; path=/; max-age=0; SameSite=Lax`;
      router.replace(`/${config.id}/login`);
    }
  }, [router, config.id]);

  // Form data starts empty initially - only populated when user enters values or clicks "⚡ Load Sample Data"
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const isLandscape = config.template.landscape === true;
  const canvasW = config.template.canvasWidth ?? (isLandscape ? A4_HEIGHT : A4_WIDTH);
  const canvasH = config.template.canvasHeight ?? (isLandscape ? A4_WIDTH : A4_HEIGHT);

  /* Responsive preview scale – precisely fits preview container without cropping */
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const availableW = containerRef.current.clientWidth;
        if (availableW > 0) {
          const fitScale = Math.min((availableW - 32) / canvasW, 1);
          setScale(Math.max(fitScale, 0.2));
          return;
        }
      }
      const w = window.innerWidth - 64;
      setScale(Math.min(w / canvasW, 0.95));
    };

    handleResize();
    const ro = new ResizeObserver(handleResize);
    if (containerRef.current) {
      ro.observe(containerRef.current);
    }
    window.addEventListener("resize", handleResize);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [canvasW, previewOpen]);

  /* Form submission -> open live preview */
  const handleFormSubmit = useCallback(async (data: Record<string, string>) => {
    setFormData(data);
    setIsPreviewLoading(true);

    try {
      // Preload template background
      await new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = config.template.backgroundUrl;
      });

      await new Promise((resolve) => setTimeout(resolve, 400));
      setPreviewOpen(true);
    } finally {
      setIsPreviewLoading(false);
    }
  }, [config.template.backgroundUrl]);

  /* Download PDF */
  const handleDownloadPDF = useCallback(async () => {
    setIsPdfLoading(true);
    try {
      await generateCertificatePDF(config, formData, (msg) => {
        setStatusMessage(msg);
      });
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setIsPdfLoading(false);
      setStatusMessage("");
    }
  }, [config, formData]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem(`auth_${config.id}`);
    document.cookie = `auth_${config.id}=; path=/; max-age=0; SameSite=Lax`;
    router.push(`/${config.id}/login`);
    router.refresh();
  }, [config.id, router]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <LoadingOverlay
        isOpen={isPreviewLoading || isPdfLoading}
        title={isPreviewLoading ? "Preparing Preview" : "Generating Official Document"}
        subtitle={isPreviewLoading ? "Rasterizing vector layers..." : statusMessage}
      />

      <div className="flex-1 max-w-5xl w-full mx-auto py-6 px-4 md:px-6">
        {/* COMPACT TOP BAR / NAV */}
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${config.theme.primary} flex items-center justify-center text-white text-base shadow-sm`}
            >
              {config.theme.icon}
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-tight">
                {config.shortName} Certificate
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                Official Register Workspace
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/${config.id}`}
              className="px-3 py-1 rounded-lg border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-white hover:text-slate-900 transition"
            >
              Home
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded-lg bg-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-300 hover:text-slate-900 transition cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>

        {/* WORKSPACE CARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 md:p-8">
          {!previewOpen ? (
            <div>
              <CertificateForm
                config={config}
                initialData={formData}
                onSubmit={handleFormSubmit}
                isLoading={isPreviewLoading}
              />
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Live Document Verification
                  </h2>
                  <p className="text-xs text-slate-500">
                    Review typography, layout, and text alignment before downloading.
                  </p>
                </div>
                <button
                  onClick={() => setPreviewOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 hover:bg-slate-50 transition cursor-pointer"
                >
                  ← Edit Form
                </button>
              </div>

              {/* CANVAS CONTAINER */}
              <div
                ref={containerRef}
                className="w-full flex justify-center items-center bg-slate-50 rounded-xl p-3 md:p-6 mb-6 border border-slate-200/80 overflow-hidden"
              >
                <div
                  style={{
                    width: canvasW * scale,
                    height: canvasH * scale,
                    position: "relative",
                  }}
                  className="shrink-0 transition-all duration-150"
                >
                  <div
                    style={{
                      transform: `scale(${scale})`,
                      transformOrigin: "top left",
                      position: "absolute",
                      top: 0,
                      left: 0,
                    }}
                  >
                    <CertificateCanvas config={config} data={formData} shadow />
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                <button
                  onClick={handleDownloadPDF}
                  disabled={isPdfLoading}
                  className={`w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r ${config.theme.buttonGradient} shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer text-sm`}
                >
                  <span>📥</span>
                  <span>{isPdfLoading ? "Exporting..." : "Download Vector PDF"}</span>
                </button>
                <button
                  onClick={() => setPreviewOpen(false)}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl font-semibold border border-slate-300 hover:bg-slate-50 transition text-xs text-slate-700 cursor-pointer"
                >
                  Edit Information
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
