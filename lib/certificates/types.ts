export type FieldType = "text" | "textarea" | "date" | "select" | "number";

export interface CertificateFieldOption {
  label: string;
  value: string;
}

export interface CertificateField {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  defaultValue?: string;
  options?: CertificateFieldOption[];
  required?: boolean;
  gridSpan?: 1 | 2;
  helpText?: string;
}

export interface CertificateTheme {
  primary: string; // e.g. "from-emerald-600 to-teal-700"
  primaryColor: string; // e.g. "#059669"
  accentColor: string; // e.g. "#10b981"
  badgeBg: string;
  badgeText: string;
  buttonGradient: string;
  cardGlow: string;
  icon: string;
  category: string;
}

export interface CertificateTemplateConfig {
  backgroundUrl: string;
  fallbackBackgroundUrl?: string;
  fontFamily: string;
  pdfFontName: string;

  /** When true the canvas renders at 1123×794 (landscape A4) instead of 794×1123 */
  landscape?: boolean;

  /** Explicit canvas width in pixels (e.g. 1123). Overrides landscape default. */
  canvasWidth?: number;

  /** Explicit canvas height in pixels (e.g. 811 for 3693:2666 webp). Overrides landscape default. */
  canvasHeight?: number;

  // Layout coordinates (in px for A4 canvas)
  headerTitle?: string;
  headerSubtitle?: string;

  datePosition: {
    top: number;
    right?: number;
    left?: number;
    width?: number;
    textAlign?: "left" | "center" | "right";
    fontSize: number;
    fontFamily?: string;
    fontWeight?: string;
    prefix?: string;
    underline?: boolean;
    locationMarginTop?: number;
    showLocation?: boolean;
  };

  certNumberPosition?: {
    top: number;
    left?: number;
    right?: number;
    fontSize: number;
    prefix?: string;
  };

  contentPosition: {
    top: number;
    left: number;
    right: number;
    fontSize: number;
    lineHeight: number;
    textAlign?: "justify" | "left" | "center";
    textIndent?: number;
  };

  /**
   * Optional large-name slot used by inkjet-style landscape templates.
   * Rendered as a big centred heading above the course line.
   */
  namePosition?: {
    top: number;
    fontSize: number;
    color?: string;
    fontWeight?: string;
    fontFamily?: string;
    pdfFontName?: string;
    letterSpacing?: string;
  };

  /**
   * Optional course+batch line slot (inkjet-style).
   */
  coursePosition?: {
    top: number;
    fontSize: number;
    fontFamily?: string;
    fontWeight?: string;
    color?: string;
    lineHeight?: number;
  };

  // Signatures or footer slots
  signatures?: Array<{
    title: string;
    fieldKey: string;
    bottom: number;
    position: "left" | "center" | "right";
  }>;

  // Dynamic paragraph content generator (supports **bold** tokens)
  renderParagraphs: (data: Record<string, string>) => {
    p1: string;
    p2?: string;
    p3?: string;
    footerNote?: string;
    /** Used by inkjet-style templates: rendered as the big centred name */
    studentName?: string;
    /** Used by inkjet-style templates: rendered as the course+batch subtitle */
    courseSubtitle?: string;
  };
}

export interface PdfExportConfig {
  orientation: "portrait" | "landscape";
  format: "a4";
  pdfWidthPt: number;
  pdfHeightPt: number;
  startX: number;
  startY: number;
  maxWidth: number;
  lineHeight: number;
  fontSize: number;
  dateX?: number;
  dateY?: number;
  dateFontSize?: number;
  filenamePrefix: string;
}

export interface CertificateAuthConfig {
  username?: string;
  password?: string;
  allowAdminBypass?: boolean;
}

export interface CertificateConfig {
  id: string; // Subdomain slug, e.g. "mubarackmasjid", "amjadnoorani"
  name: string; // e.g. "Nikah Marriage Certificate"
  shortName: string; // e.g. "Nikah / Marriage"
  tagline: string;
  description: string;
  badge: string;
  theme: CertificateTheme;
  fields: CertificateField[];
  sampleData: Record<string, string>;
  template: CertificateTemplateConfig;
  pdfConfig: PdfExportConfig;
  features: string[];
  auth?: CertificateAuthConfig;
}
