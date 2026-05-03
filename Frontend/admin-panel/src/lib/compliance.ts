/**
 * Healthcare legal compliance constants and helpers.
 *
 * Centralises every regulation-driven value so changes (new jurisdiction,
 * updated retention period, etc.) require only a single-file update.
 */

// ---------------------------------------------------------------------------
// Regulatory frameworks the platform must comply with
// ---------------------------------------------------------------------------

export const COMPLIANCE_FRAMEWORKS = ['HIPAA', 'SOC2', 'GDPR', 'ISO27001', 'HITECH'] as const;
export type ComplianceFramework = (typeof COMPLIANCE_FRAMEWORKS)[number];

// ---------------------------------------------------------------------------
// Data retention — HIPAA recommends 6 years; some states require 7-10.
// We default to 7 years and let ops override per-tenant.
// ---------------------------------------------------------------------------

export const DATA_RETENTION = {
  /** Default data retention period in years. */
  defaultYears: 7,
  /** Audit log retention — HIPAA requires minimum 6 years. */
  auditLogYears: 7,
  /** Session log retention in days. */
  sessionLogDays: 90,
  /** PHI access log retention in years. */
  phiAccessLogYears: 7,
} as const;

// ---------------------------------------------------------------------------
// Session security — HIPAA §164.312(a)(2)(iii) Automatic Logoff
// ---------------------------------------------------------------------------

export const SESSION_POLICY = {
  /** Minutes of inactivity before a warning is shown. */
  warnAfterMinutes: 13,
  /** Minutes of inactivity before automatic sign-out. */
  logoutAfterMinutes: 15,
  /** Maximum absolute session length in hours before forced re-auth. */
  maxSessionHours: 12,
} as const;

// ---------------------------------------------------------------------------
// Password policy — NIST SP 800-63B aligned
// ---------------------------------------------------------------------------

export const PASSWORD_POLICY = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireDigit: true,
  requireSpecialChar: false,
  /** Days before password change is recommended (0 = no forced rotation). */
  rotationDays: 0,
} as const;

// ---------------------------------------------------------------------------
// PHI categories tracked for access logging
// ---------------------------------------------------------------------------

export const PHI_CATEGORIES = [
  'patient-name',
  'phone-number',
  'email',
  'medical-record-number',
  'date-of-birth',
  'address',
  'insurance-id',
  'conversation-transcript',
  'call-recording',
] as const;
export type PhiCategory = (typeof PHI_CATEGORIES)[number];

// ---------------------------------------------------------------------------
// Legal document types for tenant onboarding
// ---------------------------------------------------------------------------

export const LEGAL_DOCUMENTS = [
  'baa',
  'dpa',
  'terms-of-service',
  'privacy-policy',
  'acceptable-use-policy',
  'data-residency-acknowledgment',
] as const;
export type LegalDocument = (typeof LEGAL_DOCUMENTS)[number];

export const LEGAL_DOCUMENT_LABELS: Record<LegalDocument, string> = {
  baa: 'Business Associate Agreement (BAA)',
  dpa: 'Data Processing Agreement (DPA)',
  'terms-of-service': 'Terms of Service',
  'privacy-policy': 'Privacy Policy',
  'acceptable-use-policy': 'Acceptable Use Policy',
  'data-residency-acknowledgment': 'Data Residency Acknowledgment',
};

// ---------------------------------------------------------------------------
// Consent categories (GDPR Art. 6/9 basis)
// ---------------------------------------------------------------------------

export const CONSENT_PURPOSES = [
  'data-processing',
  'analytics',
  'ai-training',
  'cross-border-transfer',
  'third-party-sharing',
] as const;
export type ConsentPurpose = (typeof CONSENT_PURPOSES)[number];
