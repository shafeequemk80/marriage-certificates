"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRouter } from "next/navigation";

/* ================= TYPES ================= */
type FormData = {
  groomName: string;
  groomFatherName: string;
  bridalName: string;
  bridalFatherName: string;
  weddingDate: string;
  weddingPlace: string;
  address: string;
};

/* ================= CONSTANTS ================= */
const PDF_FONT = '  '
const A4_WIDTH = 794;
const A4_HEIGHT = 1123;

const FORM_FIELDS = [
  ["groomName", "Groom Name"],
  ["groomFatherName", "Groom Father Name"],
  ["bridalName", "Bride Name"],
  ["bridalFatherName", "Bride Father Name"],
  ["weddingPlace", "Wedding Place"],
] as const;

/* ================= HELPERS ================= */
const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

/* ================= CERTIFICATE ================= */
type CertificateProps = {
  data: FormData;
  shadow?: boolean;
  forPdf?: boolean;
};

const Certificate = ({ data, shadow, forPdf }: CertificateProps) => (
  <div
    style={{
      width: A4_WIDTH,
      height: A4_HEIGHT,
      backgroundImage: "url('/template.png')",
      backgroundSize: `${A4_WIDTH}px ${A4_HEIGHT}px`,
      backgroundRepeat: "no-repeat",
      position: "relative",
    fontFamily: PDF_FONT,
      color: "#000",
      boxShadow: shadow ? "0 20px 40px rgba(0,0,0,0.25)" : "none",
    }}
  >
    {/* DATE */}
    <div
      style={{
        position: "absolute",
        top: 400,
        right: 100,
        fontSize: 18,
        textDecoration: "underline",
      }}
    >
      Date: {formatDate(new Date().toISOString())}
    </div>

    {/* CONTENT */}
    <div
      style={{
        position: "absolute",
        top: 440,
        left: 100,
        right: 100,
        fontSize: 18,
        lineHeight: "36px",
        textAlign: "justify",
        textIndent: 20,
      }}
    >
      <p>
        This is to certify that the marriage (Nikah) between{" "}
        <strong>MR. {data.groomName.toUpperCase()}</strong>, S/O{" "}
        <strong>{data.groomFatherName.toUpperCase()}</strong>, residing at{" "}
        <strong>{data.address.toUpperCase()}</strong>, and{" "}
        <strong>MISS {data.bridalName.toUpperCase()}</strong>, D/O{" "}
        <strong>{data.bridalFatherName.toUpperCase()}</strong>, was solemnized on{" "}
        <strong>{formatDate(data.weddingDate)}</strong> at{" "}
        <strong>{data.weddingPlace.toUpperCase()}</strong> in accordance with
        Islamic Shariath and customs.
      </p>

      <p style={{ marginTop: 32 }}>
        This marriage (Nikah) has been duly registered in the official Marriage
        Register maintained by the Committee.
      </p>
    </div>
  </div>
);

/* ================= MAIN PAGE ================= */
export default function MarriageCertificatePage() {
  const router = useRouter();
useEffect(() => {
  const isLoggedIn = sessionStorage.getItem("loggedIn");
  if (isLoggedIn !== "true") {
    router.replace("/login");
  }
}, [router]);

  const downloadRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<FormData>({
    groomName: "",
    groomFatherName: "",
    bridalName: "",
    bridalFatherName: "",
    weddingDate: "",
    weddingPlace: "",
    address: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [loading, setLoading] = useState(false);

  /* ---------- PREVIEW SCALE ---------- */
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth - 64;
      setScale(Math.min(w / A4_WIDTH, 1));
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ---------- HANDLERS ---------- */
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
      if (errors[name as keyof FormData]) {
        setErrors(prev => ({ ...prev, [name]: undefined }));
      }
    },
    [errors],
  );

  const validate = useCallback(() => {
    const newErrors: Partial<FormData> = {};
    Object.entries(formData).forEach(([k, v]) => {
      if (!v.trim()) newErrors[k as keyof FormData] = "Required";
    });
    setErrors(newErrors);
    return !Object.keys(newErrors).length;
  }, [formData]);

  /* ---------- PDF ---------- */
  const downloadPDF = useCallback(async () => {
    if (!downloadRef.current) return;
    setLoading(true);

    try {
      const canvas = await html2canvas(downloadRef.current, {
        scale: 3,
        width: A4_WIDTH,
        height: A4_HEIGHT,
        windowWidth: A4_WIDTH,
        windowHeight: A4_HEIGHT,
        backgroundColor: "#fff",
        useCORS: true,
        logging: false,
      });

      const pdf = new jsPDF("portrait", "mm", "a4");
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 210, 297);
      pdf.save("Nikah-Marriage-Certificate.pdf");
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl p-10">
        <h1 className="text-3xl font-bold text-center mb-10">
          Nikah Marriage Certificate
        </h1>

        {/* ================= FORM ================= */}
        {!previewOpen && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FORM_FIELDS.map(([name, label]) => (
              <div key={name}>
                <label className="block text-sm font-semibold mb-1">
                  {label}
                </label>
                <input
                  name={name}
                  value={formData[name as keyof FormData]}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-black"
                />
                {errors[name as keyof FormData] && (
                  <p className="text-xs text-red-500 mt-1">Required</p>
                )}
              </div>
            ))}

            <div>
              <label className="block text-sm font-semibold mb-1">
                Wedding Date
              </label>
              <input
                type="date"
                name="weddingDate"
                value={formData.weddingDate}
                onChange={handleChange}
                className="w-full rounded-lg border px-4 py-2"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1">
                Address
              </label>
              <textarea
                name="address"
                rows={3}
                value={formData.address}
                onChange={handleChange}
                className="w-full rounded-lg border px-4 py-2"
              />
            </div>

            <button
              onClick={() => validate() && setPreviewOpen(true)}
              className="md:col-span-2 bg-black text-white py-4 rounded-xl text-lg font-semibold hover:bg-gray-800 transition"
            >
              Preview Certificate
            </button>
          </div>
        )}

        {/* ================= PREVIEW ================= */}
        {previewOpen && (
          <>
            <div className="flex justify-center bg-gray-50 rounded-xl md:p-6 mb-6 md:mb-8 max-h-[60vh] md:max-h-none ">
              <div
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: "top center",
                }}
              >
                <Certificate data={formData} shadow />
              </div>
            </div>

            <div className="flex flex-col gap-3 max-w-md mx-auto sticky bottom-0 bg-white pt-2 md:pt-0">
              <button
                onClick={downloadPDF}
                disabled={loading}
                className="bg-black text-white py-3 rounded-xl font-semibold disabled:bg-gray-500 hover:bg-gray-800 transition"
              >
                {loading ? "Generating PDF..." : "Download PDF"}
              </button>
              <button
                onClick={() => setPreviewOpen(false)}
                className="border py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
              >
                Edit Details
              </button>
            </div>
          </>
        )}

        {/* HIDDEN DOWNLOAD */}
        <div
          ref={downloadRef}
          style={{ position: "absolute", top: "-9999px", left: "-9999px" }}
        >
          <Certificate data={formData} forPdf />
        </div>
      </div>
    </div>
  );
}
