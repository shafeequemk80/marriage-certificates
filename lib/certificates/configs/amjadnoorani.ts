import { CertificateConfig } from "../types";

export const amjadNooraniCertificateConfig: CertificateConfig = {
  id: "amjadnoorani",
  name: "Inkjet Online Academy – Course Completion Certificate Portal",
  shortName: "Inkjet Academy",
  tagline: "Official Course Completion & Skill Certification Portal",
  description:
    "Official portal for Inkjet Online Academy to generate, preview, and export high-fidelity Course Completion Certificates with verified student names, batch dates, and instructor credentials.",
  badge: "🎓 Official Inkjet Academy Certificate Register",
  theme: {
    primary: "from-rose-600 to-pink-700",
    primaryColor: "#e11d48",
    accentColor: "#fb7185",
    badgeBg: "bg-rose-500/10 border-rose-500/30",
    badgeText: "text-rose-400",
    buttonGradient: "from-rose-600 to-pink-600 shadow-rose-600/35 hover:shadow-rose-600/50",
    cardGlow: "bg-rose-500/10",
    icon: "🎓",
    category: "Course & Education",
  },
  auth: {
    username: "amjadnoorani",
    password: "amjadpassword",
  },
  fields: [
    {
      id: "studentName",
      label: "Student Full Name",
      type: "text",
      placeholder: "e.g. Muhammed Shafeeque",
      required: true,
      gridSpan: 2,
    },
    {
      id: "batchName",
      label: "Batch Name / Number",
      type: "text",
      placeholder: "e.g. BATCH-01",
      required: true,
      gridSpan: 1,
    },
    {
      id: "completionDate",
      label: "Completion / Batch Date",
      type: "date",
      required: true,
      gridSpan: 1,
    },
  ],
  sampleData: {
    studentName: "MUHAMMED SHAFEEQUE",
    batchName: "BATCH-01",
    completionDate: "2025-01-02",
  },
  template: {
    backgroundUrl: "/inkject.webp",
    fontFamily: "poppins",
    pdfFontName: "poppins",
    landscape: true,

    // Matches inkject.webp A4 aspect ratio (29.7cm × 21cm -> 1123 × 794 px)
    canvasWidth: 1123,
    canvasHeight: 794,

    // Date – bottom-left centered over the printed signature/date line
    datePosition: {
      top: 674,
      left: 150,
      width: 180,
      textAlign: "center",
      fontSize: 18,
      fontFamily: "'Poppins', sans-serif",
      fontWeight: "bold",
      underline: false,
      prefix: "",
      showLocation: false,
    },

    // No cert-number slot on inkjet template
    certNumberPosition: undefined,

    // Body-paragraph is already part of the background vector template
    contentPosition: {
      top: 550,
      left: 120,
      right: 120,
      fontSize: 14,
      lineHeight: 24,
      textAlign: "center",
      textIndent: 0,
    },

    // Student Name – centered, sits cleanly below "THIS CERTIFICATE IS PRESENTED TO"
    namePosition: {
      top: 410,
      fontSize: 38,
      fontFamily: "'Elgraine', serif",
      pdfFontName: "Elgraine",
      color: "#d6204c",
      fontWeight: "bold",
    },

    // Permanent course text in Poppins medium 17
    coursePosition: {
      top: 478,
      fontSize: 22,
      fontFamily: "'Poppins', sans-serif",
      fontWeight: "500",
      color: "#37208c",
      lineHeight: 1.2,
    },

    renderParagraphs: (data) => {
      const student = (data.studentName || "").toUpperCase();
      const rawBatch = (data.batchName || "BATCH-01").toUpperCase().trim();
      const batchFormatted = rawBatch ? (rawBatch.startsWith("(") ? rawBatch : `(${rawBatch})`) : "";

      return {
        p1: "",
        p2: undefined,
        p3: undefined,
        studentName: student,
        courseSubtitle: `For successfully completing\n10 Day’s Online Basic Creative Writng course ${batchFormatted}`,
      };
    },
  },
  pdfConfig: {
    orientation: "landscape",
    format: "a4",
    // Landscape A4 in pts: 841.89 × 595.28
    pdfWidthPt: 841.89,
    pdfHeightPt: 595.28,
    startX: 85,
    startY: 370,
    maxWidth: 672,
    lineHeight: 20,
    fontSize: 11,
    // Date bottom-left on PDF canvas (~y = 468pt on 595pt-tall landscape page)
    dateX: 240,
    dateY: 468,
    dateFontSize: 13,
    filenamePrefix: "Inkjet-Academy-Certificate",
  },
  features: [
    "Inkjet Online Academy official template",
    "Student full name in large display typography",
    "Course title & batch number support",
    "Landscape A4 certificate layout",
  ],
};
