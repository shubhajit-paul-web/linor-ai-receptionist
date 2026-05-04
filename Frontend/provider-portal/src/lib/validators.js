import { z } from 'zod';

// ─── Auth Schemas ────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters'),
});

export const registerStep1Schema = z.object({
  clinicName:  z.string().min(2, 'Clinic name must be at least 2 characters').max(80),
  address:     z.string().min(5, 'Enter a complete address').max(200),
  phone:       z.string().min(7, 'Enter a valid phone number').max(20),
  email:       z.string().email('Enter a valid email address'),
});

export const registerStep2Schema = z
  .object({
    password:        z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// ─── FAQ Schema ──────────────────────────────────────────────────────────────

export const faqSchema = z.object({
  question: z
    .string()
    .min(5, 'Question must be at least 5 characters')
    .max(200, 'Question cannot exceed 200 characters'),
  answer: z
    .string()
    .min(10, 'Answer must be at least 10 characters')
    .max(500, 'Answer cannot exceed 500 characters'),
});

// ─── Clinic Settings Schemas ─────────────────────────────────────────────────

export const clinicGeneralSchema = z.object({
  name:        z.string().min(2).max(80),
  description: z.string().max(500).optional(),
  website:     z.string().url('Enter a valid URL').or(z.literal('')).optional(),
});

export const clinicContactSchema = z.object({
  address:    z.string().min(5).max(200),
  city:       z.string().min(2).max(80),
  postalCode: z.string().min(3).max(12),
  phone:      z.string().min(7).max(20),
});

// ─── Widget Settings Schema ──────────────────────────────────────────────────

export const widgetSchema = z.object({
  botName:         z.string().min(1).max(40),
  welcomeMessage:  z.string().min(1).max(200),
  placeholderText: z.string().min(1).max(100),
  color:           z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, 'Enter a valid hex color'),
  position:        z.enum(['bottom-right', 'bottom-left']),
  autoOpen:        z.boolean(),
  autoOpenDelay:   z.number().min(0).max(60),
  showTyping:      z.boolean(),
  collectName:     z.boolean(),
  voiceInput:      z.boolean(),
  voiceOutput:     z.boolean(),
  showBranding:    z.boolean(),
  showAvailability: z.boolean(),
  offlineMessage:  z.string().max(200).optional(),
});

// ─── Security Schemas ─────────────────────────────────────────────────────────

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Enter your current password'),
    newPassword:     z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Confirm your new password'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const addDomainSchema = z.object({
  domain: z
    .string()
    .url('Enter a valid URL (e.g., https://yoursite.com)')
    .max(200),
});
