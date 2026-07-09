"use client";

import { useEffect, useState, useCallback } from "react";
import jsPDF from "jspdf";
import { useRouter } from "next/navigation";

/* ================= TYPES ================= */
type FormData = {
  groomName: string;
  groomFatherName: string;
  groomAddress: string;
  bridalName: string;
  bridalFatherName: string;
  bridalAddress: string;
  weddingDate: string;
  weddingPlace: string;
  solemnizerName: string;
};

/* ================= CONSTANTS ================= */
const PDF_FONT = 'CustomTimesRoman'
const A4_WIDTH = 794;
const A4_HEIGHT = 1123;

const FORM_FIELDS = [
  ["groomName", "Groom Name"],
  ["groomFatherName", "Groom Father Name"],
  ["bridalName", "Bride Name"],
  ["bridalFatherName", "Bride Father Name"],
  ["weddingPlace", "Wedding Place"],
  ["solemnizerName", "Solemnizer Name (Who Nikkahed)"],
] as const;

/* ================= HELPERS ================= */
const formatDate = (date: string) => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

/* Helper to draw text with mixed bold/normal formatting, word wrapping, and justification */
const drawParagraph = (
  doc: any,
  text: string,
  startX: number,
  startY: number,
  maxWidth: number,
  lineHeight: number,
  fontSize: number,
  fontName: string,
  align: "left" | "justify" = "left",
  indent: number = 0
) => {
  doc.setFontSize(fontSize);

  // We keep a running bold state across words
  let isBold = false;

  interface StyledSegment {
    text: string;
    bold: boolean;
    width: number;
  }

  interface Word {
    segments: StyledSegment[];
    width: number; // total width of this word's segments
  }

  const wordsRaw = text.split(" ");
  const allWords: Word[] = [];

  for (const wordRaw of wordsRaw) {
    if (wordRaw === "") {
      continue;
    }

    const segments: StyledSegment[] = [];
    const parts = wordRaw.split(/(\*\*)/g);
    let wordWidth = 0;

    for (const part of parts) {
      if (part === "**") {
        isBold = !isBold;
        continue;
      }
      if (!part) continue;

      doc.setFont(fontName, isBold ? "bold" : "normal");
      const w = doc.getTextWidth(part);
      segments.push({
        text: part,
        bold: isBold,
        width: w,
      });
      wordWidth += w;
    }

    allWords.push({
      segments,
      width: wordWidth,
    });
  }

  interface Line {
    words: Word[];
    width: number; // total width including normal space width between words
  }

  const lines: Line[] = [];
  let currentLineWords: Word[] = [];
  let currentLineWidth = 0;
  let isFirstLine = true;

  // Measure space width in normal style
  doc.setFont(fontName, "normal");
  const spaceWidth = doc.getTextWidth(" ");

  for (const word of allWords) {
    const spaceOffset = isFirstLine ? indent : 0;
    const wordWidthOnLine = currentLineWords.length === 0 ? word.width : spaceWidth + word.width;

    if (currentLineWidth + wordWidthOnLine > maxWidth - spaceOffset) {
      lines.push({ words: currentLineWords, width: currentLineWidth });
      currentLineWords = [word];
      currentLineWidth = word.width;
      isFirstLine = false;
    } else {
      currentLineWords.push(word);
      currentLineWidth += wordWidthOnLine;
    }
  }
  if (currentLineWords.length > 0) {
    lines.push({ words: currentLineWords, width: currentLineWidth });
  }

  let currentY = startY;
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];
    const isLastLine = lineIndex === lines.length - 1;
    const lineIndent = lineIndex === 0 ? indent : 0;
    let currentX = startX + lineIndent;

    if (align === "justify" && !isLastLine && line.words.length > 1) {
      // Calculate precise spacing to fill maxWidth
      const totalWordsWidth = line.words.reduce((sum, w) => sum + w.width, 0);
      const totalSpaceWidth = maxWidth - lineIndent - totalWordsWidth;
      const justifySpaceWidth = totalSpaceWidth / (line.words.length - 1);

      for (let i = 0; i < line.words.length; i++) {
        const word = line.words[i];
        for (const seg of word.segments) {
          doc.setFont(fontName, seg.bold ? "bold" : "normal");
          doc.text(seg.text, currentX, currentY);
          currentX += seg.width;
        }
        if (i < line.words.length - 1) {
          currentX += justifySpaceWidth;
        }
      }
    } else {
      // Left aligned
      for (let i = 0; i < line.words.length; i++) {
        const word = line.words[i];
        for (const seg of word.segments) {
          doc.setFont(fontName, seg.bold ? "bold" : "normal");
          doc.text(seg.text, currentX, currentY);
          currentX += seg.width;
        }
        if (i < line.words.length - 1) {
          currentX += spaceWidth;
        }
      }
    }
    currentY += lineHeight;
  }

  return currentY;
};

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
      backgroundImage: "url('/template.webp')",
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
        top: 410,
        right: 105,
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
        top: 480,
        left: 105,
        right: 105,
        fontSize: 17,
        lineHeight: "30px",
        textAlign: "justify",
        textIndent: 20,
      }}
    >
      <p>
        This is to certify that the marriage (Nikah) between{" "}
        <strong>MR. {data.groomName.toUpperCase()}</strong>, S/O{" "}
        <strong>{data.groomFatherName.toUpperCase()}</strong>, residing at{" "}
        <strong>{data.groomAddress.toUpperCase()}</strong>, and{" "}
        <strong>MISS {data.bridalName.toUpperCase()}</strong>, D/O{" "}
        <strong>{data.bridalFatherName.toUpperCase()}</strong>, residing at{" "}
        <strong>{data.bridalAddress.toUpperCase()}</strong>, was solemnized by{" "}
        <strong>{data.solemnizerName.toUpperCase()}</strong> on{" "}
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

/* ================= LOADER OVERLAY ================= */
type LoadingOverlayProps = {
  isOpen: boolean;
  title: string;
  subtitle: string;
};

const LoadingOverlay = ({ isOpen, title, subtitle }: LoadingOverlayProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md transition-all duration-300">
      <div className="bg-white/95 border border-gray-100 p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-sm w-full mx-4 text-center">
        {/* Animated outer ring and inner spinner */}
        <div className="relative w-20 h-20 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-black border-t-transparent animate-spin"></div>
          <div className="absolute -inset-2 rounded-full bg-black/5 animate-ping"></div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 tracking-tight">
          {title}
        </h3>
        <p className="text-sm text-gray-500 mt-2 font-medium">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

/* ================= MAIN PAGE ================= */
export default function MarriageCertificatePage() {
  const router = useRouter();
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("loggedIn");
    if (isLoggedIn !== "true") {
      router.replace("/login");
    }
  }, [router]);

  const [formData, setFormData] = useState<FormData>({
    groomName: "",
    groomFatherName: "",
    groomAddress: "",
    bridalName: "",
    bridalFatherName: "",
    bridalAddress: "",
    weddingDate: "",
    weddingPlace: "",
    solemnizerName: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState("");

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

  const handlePreview = useCallback(async () => {
    if (!validate()) return;
    setIsPreviewLoading(true);

    try {
      // Preload template image
      await new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => {
          const fallbackImg = new Image();
          fallbackImg.onload = () => resolve();
          fallbackImg.onerror = () => resolve();
          fallbackImg.src = "/template.webp";
        };
        img.src = "/template.svg";
      });

      // Artificial delay for premium look & feel
      await new Promise((resolve) => setTimeout(resolve, 800));
      setPreviewOpen(true);
    } catch (err) {
      console.error("Preview load error:", err);
      setPreviewOpen(true);
    } finally {
      setIsPreviewLoading(false);
    }
  }, [validate]);

  /* ---------- PDF ---------- */
  const downloadPDF = useCallback(async () => {
    setLoading(true);
    setDownloadStatus("Initializing PDF engine...");
    await new Promise((r) => setTimeout(r, 450));

    try {
      setDownloadStatus("Loading custom fonts...");
      // 1. Fetch fonts
      let timesNormalBase64 = "";
      let timesBoldBase64 = "";
      try {
        const [normalRes, boldRes] = await Promise.all([
          fetch("/fonts/times.ttf").then((r) => r.arrayBuffer()),
          fetch("/fonts/timesbd.ttf").then((r) => r.arrayBuffer()),
        ]);

        const getBase64 = (arrayBuffer: ArrayBuffer): Promise<string> => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const result = reader.result as string;
              const base64Data = result.split(",")[1];
              resolve(base64Data);
            };
            reader.readAsDataURL(new Blob([arrayBuffer]));
          });
        };

        timesNormalBase64 = await getBase64(normalRes);
        timesBoldBase64 = await getBase64(boldRes);
      } catch (err) {
        console.error("Failed to load custom fonts, falling back to standard fonts:", err);
      }

      setDownloadStatus("Importing background template...");
      await new Promise((r) => setTimeout(r, 450));

      // 2. Load background image (webp) and convert to PNG data URL for high-quality embedding
      let bgDataUrl = "";
      try {
        bgDataUrl = await new Promise<string>((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            const canvas = document.createElement("canvas");
            // Standard A4 aspect ratio high DPI background
            canvas.width = A4_WIDTH * 2;
            canvas.height = A4_HEIGHT * 2;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              resolve(canvas.toDataURL("image/png"));
            } else {
              reject(new Error("Could not get 2d context"));
            }
          };
          img.onerror = (err) => reject(err);
          img.src = "/template.webp";
        });
      } catch (err) {
        console.error("Failed to load background template.webp, falling back to template.png:", err);
        try {
          bgDataUrl = await new Promise<string>((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
              const canvas = document.createElement("canvas");
              canvas.width = A4_WIDTH * 2;
              canvas.height = A4_HEIGHT * 2;
              const ctx = canvas.getContext("2d");
              if (ctx) {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL("image/png"));
              } else {
                reject(new Error("Could not get 2d context"));
              }
            };
            img.onerror = (err) => reject(err);
            img.src = "/template.png";
          });
        } catch (fallbackErr) {
          console.error("Failed to load fallback template.png:", fallbackErr);
        }
      }

      setDownloadStatus("Rendering vector content...");
      await new Promise((r) => setTimeout(r, 450));

      // 3. Initialize jsPDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      // 4. Register custom fonts if available
      const fontName = timesNormalBase64 && timesBoldBase64 ? "CustomTimesRoman" : "times";
      if (timesNormalBase64 && timesBoldBase64) {
        pdf.addFileToVFS("times.ttf", timesNormalBase64);
        pdf.addFont("times.ttf", fontName, "normal");
        pdf.addFileToVFS("timesbd.ttf", timesBoldBase64);
        pdf.addFont("timesbd.ttf", fontName, "bold");
      }

      // 5. Add background image
      if (bgDataUrl) {
        pdf.addImage(bgDataUrl, "PNG", 0, 0, 595.28, 841.89);
      }

      // 6. Draw Date
      // 1px = 0.75pt (794px width -> 595.28pt, 1123px height -> 841.89pt)
      const dateText = `Date: ${formatDate(new Date().toISOString())}`;
      pdf.setFont(fontName, "normal");
      pdf.setFontSize(13.5); // 18px * 0.75 = 13.5pt
      const rightMargin = 520.5; // (794px - 100px) * 0.75 = 520.5pt
      const dateTextWidth = pdf.getTextWidth(dateText);
      const dateX = rightMargin - dateTextWidth;
      const dateY = 330; // (400px + 18px) * 0.75 = 313.5pt
      pdf.text(dateText, dateX, dateY);
      pdf.line(dateX, dateY + 2, rightMargin, dateY + 2); // Underline

      // 7. Draw Content paragraphs
      const p1Text = `This is to certify that the marriage (Nikah) between **MR. ${formData.groomName.toUpperCase()}**, S/O **${formData.groomFatherName.toUpperCase()}**, residing at **${formData.groomAddress.toUpperCase()}**, and **MISS ${formData.bridalName.toUpperCase()}**, D/O **${formData.bridalFatherName.toUpperCase()}**, residing at **${formData.bridalAddress.toUpperCase()}**, was solemnized by **${formData.solemnizerName.toUpperCase()}** on **${formatDate(formData.weddingDate)}** at **${formData.weddingPlace.toUpperCase()}** in accordance with Islamic Shariath and customs.`;

      const p2Text = `This marriage (Nikah) has been duly registered in the official Marriage Register maintained by the Committee.`;

      const startX = 75; // 100px * 0.75 = 75pt
      const startY = 380; // 465px * 0.75 = 348.75pt
      const maxWidth = 445.5; // 594px * 0.75 = 445.5pt
      const lineHeight = 22; // 36px * 0.75 = 27pt
      const fontSize = 13; // 18px * 0.75 = 13.5pt
      const indent = 20; // 20px * 0.75 = 15pt
      const paragraphGap = 24; // 32px * 0.75 = 24pt

      const nextY = drawParagraph(
        pdf,
        p1Text,
        startX,
        startY,
        maxWidth,
        lineHeight,
        fontSize,
        fontName,
        "justify",
        indent
      );

      drawParagraph(
        pdf,
        p2Text,
        startX,
        nextY + paragraphGap,
        maxWidth,
        lineHeight,
        fontSize,
        fontName,
        "justify",
        0
      );

      setDownloadStatus("Saving PDF file...");
      await new Promise((r) => setTimeout(r, 300));

      pdf.save("Nikah-Marriage-Certificate.pdf");
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setLoading(false);
      setDownloadStatus("");
    }
  }, [formData]);

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4">
      <LoadingOverlay
        isOpen={isPreviewLoading || loading}
        title={isPreviewLoading ? "Generating Preview" : "Downloading Certificate"}
        subtitle={isPreviewLoading ? "Preloading template assets..." : downloadStatus}
      />
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





            <div className="md:col-span-1">
              <label className="block text-sm font-semibold mb-1">
                Groom Address
              </label>
              <textarea
                name="groomAddress"
                rows={3}
                value={formData.groomAddress}
                onChange={handleChange}
                className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-black"
              />
              {errors["groomAddress"] && (
                <p className="text-xs text-red-500 mt-1">Required</p>
              )}
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-semibold mb-1">
                Bride Address
              </label>
              <textarea
                name="bridalAddress"
                rows={3}
                value={formData.bridalAddress}
                onChange={handleChange}
                className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-black"
              />
              {errors["bridalAddress"] && (
                <p className="text-xs text-red-500 mt-1">Required</p>
              )}
            </div>
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
              {errors['weddingDate'] && (
                <p className="text-xs text-red-500 mt-1">Required</p>
              )}
            </div>

            <button
              onClick={handlePreview}
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

      </div>
    </div>
  );
}
