import { CertificateConfig } from "./types";
import { mubarackMasjidCertificateConfig } from "./configs/mubarackmasjid";
import { amjadNooraniCertificateConfig } from "./configs/amjadnoorani";

/**
 * =========================================================================
 * CERTIFICATES REGISTRY
 * =========================================================================
 * To add a new certificate / masjid subdomain manually:
 * 1. Create a config in lib/certificates/configs/yourmasjid.ts
 * 2. Import it and add it to the CERTIFICATES array below.
 * =========================================================================
 */
export const CERTIFICATES: CertificateConfig[] = [
  mubarackMasjidCertificateConfig,
  amjadNooraniCertificateConfig,
];

// Map of canonical ID to CertificateConfig
export const CERTIFICATE_MAP: Record<string, CertificateConfig> = {
  mubarackmasjid: mubarackMasjidCertificateConfig,
  amjadnoorani: amjadNooraniCertificateConfig,
};

// Subdomain aliases (routing aliases to their canonical config)
export const SUBDOMAIN_ALIASES: Record<string, string> = {
  mubarackmasjid: "mubarackmasjid",
  mubarack: "mubarackmasjid",
  masjid: "mubarackmasjid",
  amjadnoorani: "amjadnoorani",
  amjad: "amjadnoorani",
  noorani: "amjadnoorani",
};

export const DEFAULT_CERTIFICATE_ID = "mubarackmasjid";

/**
 * Returns the resolved certificate configuration for a given subdomain or slug.
 */
export function getCertificateConfig(subdomain?: string | null): CertificateConfig {
  if (!subdomain) {
    return CERTIFICATE_MAP[DEFAULT_CERTIFICATE_ID];
  }

  const normalized = subdomain.toLowerCase().trim();
  const canonicalId = SUBDOMAIN_ALIASES[normalized] || normalized;

  return CERTIFICATE_MAP[canonicalId] || CERTIFICATE_MAP[DEFAULT_CERTIFICATE_ID];
}

/**
 * Checks if a given subdomain is registered or aliased.
 */
export function isValidSubdomain(subdomain?: string | null): boolean {
  if (!subdomain) return false;
  const normalized = subdomain.toLowerCase().trim();
  return Boolean(SUBDOMAIN_ALIASES[normalized] || CERTIFICATE_MAP[normalized]);
}

/**
 * Returns all registered certificate configurations.
 */
export function getAllCertificates(): CertificateConfig[] {
  return CERTIFICATES;
}
