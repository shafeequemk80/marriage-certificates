import { CertificateConfig } from "../types";

export const mubarackMasjidCertificateConfig: CertificateConfig = {
  id: "mubarackmasjid",
  name: "Mubarack Masjid Nikah Certificate Portal",
  shortName: "Mubarack Masjid",
  tagline: "Official Nikah Marriage Certificate Generation & Register System",
  description:
    "Official portal for Mubarack Masjid to generate, preview, and export high-fidelity vector Nikah marriage certificates. Designed with authentic Times New Roman typography and official Shariath register compliance.",
  badge: "✨ Official Mubarack Masjid Register",
  theme: {
    primary: "from-indigo-600 to-violet-600",
    primaryColor: "#4f46e5",
    accentColor: "#8b5cf6",
    badgeBg: "bg-indigo-500/10 border-indigo-500/30",
    badgeText: "text-indigo-400",
    buttonGradient: "from-indigo-600 to-violet-600 shadow-indigo-600/35 hover:shadow-indigo-600/50",
    cardGlow: "bg-indigo-500/10",
    icon: "🕌",
    category: "Mubarack Masjid",
  },
  auth: {
    username: "mubarackmasjid",
    password: "mubarackpassword",
  },
  fields: [
    {
      id: "groomName",
      label: "Groom Name",
      type: "text",
      placeholder: "Enter groom full name",
      required: true,
      gridSpan: 1,
    },
    {
      id: "groomFatherName",
      label: "Groom Father Name",
      type: "text",
      placeholder: "Enter groom father name",
      required: true,
      gridSpan: 1,
    },
    {
      id: "bridalName",
      label: "Bride Name",
      type: "text",
      placeholder: "Enter bride full name",
      required: true,
      gridSpan: 1,
    },
    {
      id: "bridalFatherName",
      label: "Bride Father Name",
      type: "text",
      placeholder: "Enter bride father name",
      required: true,
      gridSpan: 1,
    },
    {
      id: "weddingPlace",
      label: "Wedding Place",
      type: "text",
      placeholder: "e.g. Mubarack Masjid, Calicut",
      defaultValue: "Mubarack Masjid",
      required: true,
      gridSpan: 1,
    },
    {
      id: "solemnizerName",
      label: "Solemnizer Name (Who Nikkahed)",
      type: "text",
      placeholder: "Enter solemnizer name",
      required: true,
      gridSpan: 1,
    },
    {
      id: "groomAddress",
      label: "Groom Address",
      type: "textarea",
      placeholder: "Enter complete address of the groom",
      required: true,
      gridSpan: 1,
    },
    {
      id: "bridalAddress",
      label: "Bride Address",
      type: "textarea",
      placeholder: "Enter complete address of the bride",
      required: true,
      gridSpan: 1,
    },
    {
      id: "weddingDate",
      label: "Wedding Date",
      type: "date",
      required: true,
      gridSpan: 2,
    },
  ],
  sampleData: {
    groomName: "Muhammed Rashid",
    groomFatherName: "Abdul Rahman",
    groomAddress: "Rahmath Villa, Beach Road, Calicut, Kerala - 673001",
    bridalName: "Fathima Zahra",
    bridalFatherName: "Ibrahim Kutty",
    bridalAddress: "Darul Falah, Manjeri, Malappuram, Kerala - 676505",
    weddingDate: "2026-08-15",
    weddingPlace: "Mubarack Masjid Hall",
    solemnizerName: "Qazi K.M. Alavi Moulavi",
  },
  template: {
    backgroundUrl: "/template.webp",
    fallbackBackgroundUrl: "/template.svg",
    fontFamily: "CustomTimesRoman",
    pdfFontName: "CustomTimesRoman",
    datePosition: {
      top: 410,
      right: 105,
      fontSize: 18,
      prefix: "Date: ",
      underline: true,
    },
    contentPosition: {
      top: 480,
      left: 105,
      right: 105,
      fontSize: 17,
      lineHeight: 30,
      textAlign: "justify",
      textIndent: 20,
    },
    renderParagraphs: (data) => {
      const groom = (data.groomName || "").toUpperCase();
      const groomFather = (data.groomFatherName || "").toUpperCase();
      const groomAddr = (data.groomAddress || "").toUpperCase();
      const bride = (data.bridalName || "").toUpperCase();
      const brideFather = (data.bridalFatherName || "").toUpperCase();
      const brideAddr = (data.bridalAddress || "").toUpperCase();
      const solemnizer = (data.solemnizerName || "").toUpperCase();
      const place = (data.weddingPlace || "").toUpperCase();

      const formattedDate = data.weddingDate
        ? new Date(data.weddingDate).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })
        : "";

      return {
        p1: `This is to certify that the marriage (Nikah) between **MR. ${groom}**, S/O **${groomFather}**, residing at **${groomAddr}**, and **MISS ${bride}**, D/O **${brideFather}**, residing at **${brideAddr}**, was solemnized by **${solemnizer}** on **${formattedDate}** at **${place}** in accordance with Islamic Shariath and customs.`,
        p2: `This marriage (Nikah) has been duly registered in the official Marriage Register maintained by the Committee.`,
      };
    },
  },
  pdfConfig: {
    orientation: "portrait",
    format: "a4",
    pdfWidthPt: 595.28,
    pdfHeightPt: 841.89,
    startX: 75,
    startY: 380,
    maxWidth: 445.5,
    lineHeight: 22,
    fontSize: 13,
    dateX: 520.5,
    dateY: 330,
    dateFontSize: 13.5,
    filenamePrefix: "Mubarack-Masjid-Nikah-Certificate",
  },
  features: [
    "TrueType Times New Roman embedded typography",
    "Precise justified typesetting with bold dynamic variable interpolation",
    "High-resolution vector PDF export (4K print ready)",
    "Official Mubarack Masjid Marriage Register standard compliance",
  ],
};
