/**
 * PHI (Protected Health Information) masking utilities.
 *
 * HIPAA requires that PHI shown in administrative UIs is handled with care.
 * This module provides deterministic masking functions that can be toggled
 * globally via the UI store so operators in shared-screen or demo scenarios
 * don't inadvertently expose patient data.
 */

/** Mask a patient/person name: "Jane Doe" → "J*** D**" */
export function maskName(name: string): string {
  if (!name) return name;
  return name
    .split(/\s+/)
    .map((part) => (part.length <= 1 ? part : `${part[0]}${'*'.repeat(part.length - 1)}`))
    .join(' ');
}

/** Mask a phone number: "+1 (555) 123-4567" → "+1 (***) ***-4567" */
export function maskPhone(phone: string): string {
  if (!phone) return phone;
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return '****';
  const lastFour = digits.slice(-4);
  return phone.replace(/\d(?=\d{4})/g, '*').replace(/\*{4}$/, lastFour);
}

/** Mask an email: "patient@example.com" → "p******@example.com" */
export function maskEmail(email: string): string {
  if (!email) return email;
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;
  const masked = local.length <= 1 ? local : `${local[0]}${'*'.repeat(local.length - 1)}`;
  return `${masked}@${domain}`;
}

/** Mask a generic identifier/MRN: "MRN-123456" → "MRN-***456" */
export function maskId(id: string, visibleSuffix = 3): string {
  if (!id || id.length <= visibleSuffix) return id;
  return '*'.repeat(id.length - visibleSuffix) + id.slice(-visibleSuffix);
}

export type MaskFn = typeof maskName;

/** Apply mask only when `masked` is true — identity pass-through otherwise. */
export function conditionalMask(value: string, masked: boolean, maskFn: MaskFn): string {
  return masked ? maskFn(value) : value;
}
