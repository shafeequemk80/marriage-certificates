import jsPDF from "jspdf";
import { CertificateConfig } from "../certificates/types";

export const A4_WIDTH = 794;
export const A4_HEIGHT = 1123;

export const formatDate = (date: string) => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

interface StyledSegment {
  text: string;
  bold: boolean;
  width: number;
}

interface Word {
  segments: StyledSegment[];
  width: number;
}

interface Line {
  words: Word[];
  width: number;
}

/**
 * Draws text with mixed bold/normal markdown tags (**bold**), word wrapping, and justification
 */
export const drawParagraph = (
  doc: jsPDF,
  text: string,
  startX: number,
  startY: number,
  maxWidth: number,
  lineHeight: number,
  fontSize: number,
  fontName: string,
  align: "left" | "justify" | "center" = "left",
  indent: number = 0
): number => {
  doc.setFontSize(fontSize);

  let isBold = false;
  const wordsRaw = text.split(" ");
  const allWords: Word[] = [];

  for (const wordRaw of wordsRaw) {
    if (wordRaw === "") continue;

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

  const lines: Line[] = [];
  let currentLineWords: Word[] = [];
  let currentLineWidth = 0;
  let isFirstLine = true;

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
    } else if (align === "center") {
      const totalLineW = line.words.reduce((s, w) => s + w.width, 0) + (line.words.length - 1) * spaceWidth;
      currentX = startX + (maxWidth - totalLineW) / 2;
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
    } else {
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

/**
 * Loads image as high-res PNG data URL for jsPDF
 */
export async function loadImageDataUrl(
  url: string,
  fallbackUrl?: string,
  isLandscape?: boolean
): Promise<string> {
  const tryLoad = (src: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const w = img.naturalWidth || (isLandscape ? A4_HEIGHT * 2 : A4_WIDTH * 2);
        const h = img.naturalHeight || (isLandscape ? A4_WIDTH * 2 : A4_HEIGHT * 2);
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/png"));
        } else {
          reject(new Error("Could not get 2d context"));
        }
      };
      img.onerror = (err) => reject(err);
      img.src = src;
    });
  };

  try {
    return await tryLoad(url);
  } catch (err) {
    if (fallbackUrl) {
      return await tryLoad(fallbackUrl);
    }
    throw err;
  }
}

/**
 * Universal PDF export generator for any CertificateConfig
 */
export async function generateCertificatePDF(
  config: CertificateConfig,
  data: Record<string, string>,
  onStatusUpdate?: (status: string) => void
): Promise<void> {
  onStatusUpdate?.("Initializing PDF engine...");
  await new Promise((r) => setTimeout(r, 200));

  onStatusUpdate?.("Loading typography fonts...");
  const targetFont = (config.template.pdfFontName || "").toLowerCase();
  const isPoppins = targetFont.includes("poppins");

  const fetchFontBase64 = async (url: string): Promise<string | null> => {
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      const buffer = await res.arrayBuffer();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          resolve(result.split(",")[1] || null);
        };
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(new Blob([buffer]));
      });
    } catch (err) {
      console.warn(`Failed to fetch font at ${url}:`, err);
      return null;
    }
  };

  let popReg: string | null = null;
  let popMed: string | null = null;
  let popBold: string | null = null;
  let elgReg: string | null = null;
  let elgMed: string | null = null;
  let elgSemi: string | null = null;
  let elgBold: string | null = null;
  let timesReg: string | null = null;
  let timesBold: string | null = null;

  try {
    [
      popReg,
      popMed,
      popBold,
      elgReg,
      elgMed,
      elgSemi,
      elgBold,
      timesReg,
      timesBold,
    ] = await Promise.all([
      fetchFontBase64("/fonts/Poppins-Regular.ttf"),
      fetchFontBase64("/fonts/Poppins-Medium.ttf"),
      fetchFontBase64("/fonts/Poppins-Bold.ttf"),
      fetchFontBase64("/fonts/Elgraine-Regular.ttf"),
      fetchFontBase64("/fonts/Elgraine-Medium.ttf"),
      fetchFontBase64("/fonts/Elgraine-SemiBold.ttf"),
      fetchFontBase64("/fonts/Elgraine-Bold.ttf"),
      fetchFontBase64("/fonts/times.ttf"),
      fetchFontBase64("/fonts/timesbd.ttf"),
    ]);
  } catch (err) {
    console.warn("Custom fonts loading warning:", err);
  }

  onStatusUpdate?.("Importing high-res vector background...");
  let bgDataUrl = "";
  try {
    bgDataUrl = await loadImageDataUrl(
      config.template.backgroundUrl,
      config.template.fallbackBackgroundUrl,
      config.template.landscape
    );
  } catch (err) {
    console.error("Failed to load background template", err);
  }

  onStatusUpdate?.("Typesetting vector text...");
  await new Promise((r) => setTimeout(r, 200));

  const pdf = new jsPDF({
    orientation: config.pdfConfig.orientation,
    unit: "pt",
    format: "a4",
  });

  // Register fonts in jsPDF
  if (popReg) {
    pdf.addFileToVFS("Poppins-Regular.ttf", popReg);
    pdf.addFont("Poppins-Regular.ttf", "Poppins", "normal");
  }
  if (popMed) {
    pdf.addFileToVFS("Poppins-Medium.ttf", popMed);
    pdf.addFont("Poppins-Medium.ttf", "Poppins", "medium");
  }
  if (popBold) {
    pdf.addFileToVFS("Poppins-Bold.ttf", popBold);
    pdf.addFont("Poppins-Bold.ttf", "Poppins", "bold");
  }

  if (elgReg) {
    pdf.addFileToVFS("Elgraine-Regular.ttf", elgReg);
    pdf.addFont("Elgraine-Regular.ttf", "Elgraine", "normal");
  }
  if (elgMed) {
    pdf.addFileToVFS("Elgraine-Medium.ttf", elgMed);
    pdf.addFont("Elgraine-Medium.ttf", "Elgraine", "medium");
  }
  if (elgSemi) {
    pdf.addFileToVFS("Elgraine-SemiBold.ttf", elgSemi);
    pdf.addFont("Elgraine-SemiBold.ttf", "Elgraine", "semibold");
  }
  if (elgBold) {
    pdf.addFileToVFS("Elgraine-Bold.ttf", elgBold);
    pdf.addFont("Elgraine-Bold.ttf", "Elgraine", "bold");
  }

  if (timesReg && timesBold) {
    pdf.addFileToVFS("times.ttf", timesReg);
    pdf.addFont("times.ttf", "CustomTimesRoman", "normal");
    pdf.addFileToVFS("timesbd.ttf", timesBold);
    pdf.addFont("timesbd.ttf", "CustomTimesRoman", "bold");
  }

  let mainFontName = "times";
  if (isPoppins && popReg) {
    mainFontName = "Poppins";
  } else if (timesReg) {
    mainFontName = "CustomTimesRoman";
  }
  const fontName = mainFontName;

  // Draw background
  if (bgDataUrl) {
    pdf.addImage(bgDataUrl, "PNG", 0, 0, config.pdfConfig.pdfWidthPt, config.pdfConfig.pdfHeightPt);
  }

  const isLandscape = config.template.landscape === true;

  // Render landscape inkjet-style student name & course subtitle if present
  const paragraphs = config.template.renderParagraphs(data);

  if (paragraphs.studentName && config.template.namePosition) {
    const preferredFont = config.template.namePosition.pdfFontName || (elgBold ? "Elgraine" : mainFontName);
    const weightProp = config.template.namePosition.fontWeight || "bold";
    const nameWeight = (weightProp === "bold" || weightProp === "700") ? "bold" : (weightProp === "500" ? "medium" : "normal");

    pdf.setFont(preferredFont, nameWeight);
    const nameFontSize = (config.template.namePosition.fontSize || 38) * 0.75;
    pdf.setFontSize(nameFontSize);

    const hexColor = config.template.namePosition.color || "#d6204c";
    let r = 214, g = 32, b = 76;
    if (hexColor.startsWith("#") && hexColor.length === 7) {
      r = parseInt(hexColor.slice(1, 3), 16);
      g = parseInt(hexColor.slice(3, 5), 16);
      b = parseInt(hexColor.slice(5, 7), 16);
    }
    pdf.setTextColor(r, g, b);

    const ptY = config.template.namePosition.top * 0.75;
    pdf.text(paragraphs.studentName, config.pdfConfig.pdfWidthPt / 2, ptY, {
      align: "center",
      baseline: "top",
    });
  }

  if (paragraphs.courseSubtitle && config.template.coursePosition) {
    const courseFont = isPoppins && popMed ? "Poppins" : mainFontName;
    const courseWeight = config.template.coursePosition.fontWeight === "bold" ? "bold" : (popMed ? "medium" : "normal");
    pdf.setFont(courseFont, courseWeight);

    const courseFontSize = (config.template.coursePosition.fontSize || 22) * 0.75;
    pdf.setFontSize(courseFontSize);

    const hexColor = config.template.coursePosition.color || "#37208c";
    let r = 55, g = 32, b = 140;
    if (hexColor.startsWith("#") && hexColor.length === 7) {
      r = parseInt(hexColor.slice(1, 3), 16);
      g = parseInt(hexColor.slice(3, 5), 16);
      b = parseInt(hexColor.slice(5, 7), 16);
    }
    pdf.setTextColor(r, g, b);

    const ptY = config.template.coursePosition.top * 0.75;
    const lines = paragraphs.courseSubtitle.split("\n");
    const lineSpacing = courseFontSize * (config.template.coursePosition.lineHeight || 1.35);
    lines.forEach((line, i) => {
      pdf.text(line, config.pdfConfig.pdfWidthPt / 2, ptY + i * lineSpacing, {
        align: "center",
        baseline: "top",
      });
    });
  }

  const certDateY = config.pdfConfig.dateY || 330;

  // Draw Date
  if (isLandscape) {
    const formattedDate = data.completionDate
      ? new Date(data.completionDate).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }).toUpperCase()
      : "";
    if (formattedDate) {
      const dateWeightProp = (config.template.datePosition.fontWeight || "bold").toLowerCase();
      const isBoldDate =
        dateWeightProp === "bold" ||
        dateWeightProp === "700" ||
        dateWeightProp === "800" ||
        dateWeightProp === "900" ||
        dateWeightProp === "600";
      const dateWeight = isBoldDate ? "bold" : (dateWeightProp === "500" || dateWeightProp === "medium" ? "medium" : "normal");
      const dateFont = isPoppins ? "Poppins" : mainFontName;
      pdf.setFont(dateFont, dateWeight);

      const dateFontSize = (config.template.datePosition.fontSize || 18) * 0.75;
      pdf.setFontSize(dateFontSize);
      pdf.setTextColor(34, 34, 34);

      const dateCenterX = ((config.template.datePosition.left || 150) + ((config.template.datePosition.width || 180) / 2)) * 0.75;
      const datePtY = config.template.datePosition.top * 0.75;
      pdf.text(formattedDate, dateCenterX, datePtY, {
        align: "center",
        baseline: "top",
      });

      if (data.location && config.template.datePosition.showLocation !== false) {
        pdf.setFont(dateFont, "normal");
        pdf.setFontSize(dateFontSize - 2);
        pdf.text((data.location || "").toUpperCase(), dateCenterX, datePtY + 16, {
          align: "center",
          baseline: "top",
        });
      }
    }
  } else {
    const dateStr = formatDate(new Date().toISOString());
    const datePrefix = config.template.datePosition.prefix ?? "Date: ";
    const fullDateText = `${datePrefix}${dateStr}`;
    pdf.setFont(fontName, "normal");
    pdf.setFontSize(config.pdfConfig.dateFontSize || 13.5);

    const rightMargin = config.pdfConfig.dateX || 520.5;
    const dateTextWidth = pdf.getTextWidth(fullDateText);
    const dateX = rightMargin - dateTextWidth;
    pdf.text(fullDateText, dateX, certDateY);
    if (config.template.datePosition.underline) {
      pdf.line(dateX, certDateY + 2, rightMargin, certDateY + 2);
    }
  }

  // Draw Reg / Cert ID if present in template
  if (config.template.certNumberPosition) {
    const regField = data.registrationNumber || data.certId || data.memberId || "";
    if (regField) {
      const regPrefix = config.template.certNumberPosition.prefix || "ID: ";
      const regText = `${regPrefix}${regField.toUpperCase()}`;
      pdf.setFont(fontName, "bold");
      pdf.setFontSize(config.pdfConfig.dateFontSize || 13);
      pdf.text(regText, config.pdfConfig.startX, certDateY);
    }
  }

  // Render paragraphs
  let currentY = config.pdfConfig.startY;
  const paragraphGap = 20;

  if (paragraphs.p1) {
    currentY = drawParagraph(
      pdf,
      paragraphs.p1,
      config.pdfConfig.startX,
      currentY,
      config.pdfConfig.maxWidth,
      config.pdfConfig.lineHeight,
      config.pdfConfig.fontSize,
      fontName,
      config.template.contentPosition.textAlign || "justify",
      config.template.contentPosition.textIndent ? 15 : 0
    );
  }

  if (paragraphs.p2) {
    currentY = drawParagraph(
      pdf,
      paragraphs.p2,
      config.pdfConfig.startX,
      currentY + paragraphGap,
      config.pdfConfig.maxWidth,
      config.pdfConfig.lineHeight,
      config.pdfConfig.fontSize,
      fontName,
      config.template.contentPosition.textAlign || "justify",
      0
    );
  }

  if (paragraphs.p3) {
    drawParagraph(
      pdf,
      paragraphs.p3,
      config.pdfConfig.startX,
      currentY + paragraphGap,
      config.pdfConfig.maxWidth,
      config.pdfConfig.lineHeight,
      config.pdfConfig.fontSize,
      fontName,
      config.template.contentPosition.textAlign || "justify",
      0
    );
  }

  onStatusUpdate?.("Saving official PDF document...");
  await new Promise((r) => setTimeout(r, 200));

  const safeFilename = `${config.pdfConfig.filenamePrefix}-${new Date().toISOString().slice(0, 10)}.pdf`;
  pdf.save(safeFilename);
}
