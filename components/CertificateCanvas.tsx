"use client";

import React from "react";
import { CertificateConfig } from "../lib/certificates/types";
import { A4_WIDTH, A4_HEIGHT, formatDate } from "../lib/pdf/generator";

// Landscape swaps width / height
const A4_LANDSCAPE_W = A4_HEIGHT; // 1123
const A4_LANDSCAPE_H = A4_WIDTH;  // 794

interface CertificateCanvasProps {
  config: CertificateConfig;
  data: Record<string, string>;
  shadow?: boolean;
}

/**
 * Parses markdown bold tokens (**text**) into JSX <strong> tags
 */
function renderMarkdownText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-bold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

export function CertificateCanvas({
  config,
  data,
  shadow = true,
}: CertificateCanvasProps) {
  const isLandscape = config.template.landscape === true;
  const canvasW = config.template.canvasWidth ?? (isLandscape ? A4_LANDSCAPE_W : A4_WIDTH);
  const canvasH = config.template.canvasHeight ?? (isLandscape ? A4_LANDSCAPE_H : A4_HEIGHT);

  const paragraphs = config.template.renderParagraphs(data);

  // Landscape templates show the user-entered completion date; portrait shows today's date
  const dateStr = isLandscape
    ? data.completionDate
      ? new Date(data.completionDate).toLocaleDateString("en-US", {
          month: "long" ,
          day: "numeric",
          year: "numeric",
        }).toUpperCase()
      : ""
    : formatDate(new Date().toISOString());

  const datePrefix = config.template.datePosition.prefix ?? "Date: ";

  const regField = data.registrationNumber || data.certId || data.memberId || "";
  const regPrefix = config.template.certNumberPosition?.prefix ?? "ID: ";

  return (
    <div
      style={{
        width: canvasW,
        height: canvasH,
        backgroundImage: `url('${config.template.backgroundUrl}')`,
        backgroundSize: `${canvasW}px ${canvasH}px`,
        backgroundRepeat: "no-repeat",
        position: "relative",
        fontFamily: config.template.fontFamily,
        color: "#000",
        boxShadow: shadow ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)" : "none",
      }}
      className="select-text bg-white shrink-0 text-left"
    >
      {/* ── INKJET-STYLE: big centred student name ── */}
      {paragraphs.studentName && config.template.namePosition && (
        <div
          style={{
            position: "absolute",
            top: config.template.namePosition.top,
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: config.template.namePosition.fontSize,
            fontFamily: config.template.namePosition.fontFamily || "'Elgraine', serif",
            fontWeight: config.template.namePosition.fontWeight || "bold",
            color: config.template.namePosition.color || "#c0392b",
            letterSpacing: config.template.namePosition.letterSpacing || "0.04em",
            lineHeight: 1.1,
            padding: "0 40px",
          }}
        >
          {paragraphs.studentName}
        </div>
      )}

      {/* ── INKJET-STYLE: course + batch subtitle ── */}
      {paragraphs.courseSubtitle && config.template.coursePosition && (
        <div
          style={{
            position: "absolute",
            top: config.template.coursePosition.top,
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: config.template.coursePosition.fontSize,
            fontFamily: config.template.coursePosition.fontFamily || "inherit",
            color: config.template.coursePosition.color || "#2563eb",
            lineHeight: config.template.coursePosition.lineHeight || 1.4,
            fontWeight: config.template.coursePosition.fontWeight || 600,
            padding: "0 60px",
          }}
        >
          {paragraphs.courseSubtitle.split("\n").map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      )}

      {/* CERT NUMBER / ID IF PRESENT */}
      {config.template.certNumberPosition && regField && (
        <div
          style={{
            position: "absolute",
            top: config.template.certNumberPosition.top,
            left: config.template.certNumberPosition.left ?? 105,
            fontSize: config.template.certNumberPosition.fontSize,
            fontWeight: "bold",
            letterSpacing: "0.5px",
          }}
        >
          {regPrefix}
          {regField.toUpperCase()}
        </div>
      )}

      {/* ISSUE DATE (+ location for landscape templates) */}
      <div
        style={{
          position: "absolute",
          top: config.template.datePosition.top,
          ...(config.template.datePosition.left !== undefined
            ? { left: config.template.datePosition.left }
            : { right: config.template.datePosition.right ?? 105 }),
          ...(config.template.datePosition.width !== undefined
            ? { width: config.template.datePosition.width }
            : {}),
          ...(config.template.datePosition.textAlign
            ? { textAlign: config.template.datePosition.textAlign }
            : {}),
          fontSize: config.template.datePosition.fontSize,
          fontFamily: config.template.datePosition.fontFamily || "inherit",
          fontWeight: config.template.datePosition.fontWeight || "bold",
          textDecoration: config.template.datePosition.underline
            ? "underline"
            : "none",
          lineHeight: 1.4,
        }}
      >
        {datePrefix}
        {dateStr}
        {isLandscape && config.template.datePosition.showLocation !== false && data.location && (
          <div
            style={{
              fontSize: config.template.datePosition.fontSize - 2,
              fontWeight: "normal",
              marginTop: config.template.datePosition.locationMarginTop ?? 2,
            }}
          >
            {(data.location || "").toUpperCase()}
          </div>
        )}
      </div>


      {/* CONTENT PARAGRAPHS (portrait / paragraph-based templates) */}
      {(paragraphs.p1 || paragraphs.p2 || paragraphs.p3 || paragraphs.footerNote) && (
        <div
          style={{
            position: "absolute",
            top: config.template.contentPosition.top,
            left: config.template.contentPosition.left,
            right: config.template.contentPosition.right,
            fontSize: config.template.contentPosition.fontSize,
            lineHeight: `${config.template.contentPosition.lineHeight}px`,
            textAlign: config.template.contentPosition.textAlign || "justify",
            textIndent: config.template.contentPosition.textIndent || 0,
          }}
        >
          {paragraphs.p1 && <p>{renderMarkdownText(paragraphs.p1)}</p>}

          {paragraphs.p2 && (
            <p style={{ marginTop: 28, textIndent: 0 }}>
              {renderMarkdownText(paragraphs.p2)}
            </p>
          )}

          {paragraphs.p3 && (
            <p style={{ marginTop: 24, textIndent: 0 }}>
              {renderMarkdownText(paragraphs.p3)}
            </p>
          )}

          {paragraphs.footerNote && (
            <p
              style={{
                marginTop: 20,
                fontSize: config.template.contentPosition.fontSize - 3,
                fontStyle: "italic",
                textIndent: 0,
              }}
            >
              {paragraphs.footerNote}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
