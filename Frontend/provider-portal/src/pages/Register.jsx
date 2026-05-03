import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Eye, EyeOff, CheckCircle, Check, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../store/useAuthStore';
import useClinicStore from '../store/useClinicStore';
import { registerStep1Schema, registerStep2Schema } from '../lib/validators';
import { maskApiKey, copyToClipboard, cn } from '../lib/utils';
import heroLogo from '../assets/hero.png';

function FormInput({ label, error, type = 'text', registration, ...props }) {
  const [showPw, setShowPw] = useState(false);
  const isPassword = type === 'password';
  return (
    <div>
      <label className="block text-xs font-medium text-text-secondary mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={isPassword ? (showPw ? 'text' : 'password') : type}
          {...registration}
          {...props}
          className={cn(
            'w-full h-10 px-3 text-sm rounded-md border',
            'bg-surface text-text-primary placeholder:text-text-muted',
            'focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors duration-150',
            error ? 'border-danger' : 'border-border focus:border-primary'
          )}
        />
        {isPassword && (
          <button type="button" onClick={() => setShowPw((v) => !v)} tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
            {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}

/** Step indicator */
function StepDots({ step }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {[1, 2, 3].map((n) => (
        <div key={n} className="flex items-center gap-2">
          <div className={cn(
            'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all duration-200',
            step > n ? 'bg-primary border-primary text-primary-on'
              : step === n ? 'border-primary text-primary'
                : 'border-border text-text-muted'
          )}>
            {step > n ? <Check size={12} /> : n}
          </div>
          {n < 3 && (
            <div className={cn('w-8 h-0.5 transition-colors duration-300', step > n ? 'bg-primary' : 'bg-border')} />
          )}
        </div>
      ))}
      <span className="text-xs text-text-muted ml-1">Step {step} of 3</span>
    </div>
  );
}

const FEATURES = [
  '24/7 appointment booking via chatbot',
  'Full control over FAQs and AI responses',
  'Real-time analytics and chat logs',
];

export default function Register() {
  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);
  const updateClinic = useClinicStore((s) => s.updateClinic);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [copied, setCopied] = useState(false);
  const [step1Data, setStep1Data] = useState(null);
  const [error, setError] = useState('');

  const step1Form = useForm({ resolver: zodResolver(registerStep1Schema) });
  const step2Form = useForm({ resolver: zodResolver(registerStep2Schema) });

  const handleStep1 = async (data) => {
    setLoading(true);
    setError('');
    try {
      setStep1Data(data);
      setStep(2);
    } catch (err) {
      setError(err.message || 'Failed to proceed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStep2 = async (step2FormData) => {
    setLoading(true);
    setError('');
    try {
      const registrationData = {
        ...step1Data,
        password: step2FormData.password,
      };
      const key = await register(registrationData);
      updateClinic({ 
        name: step1Data.clinicName, 
        email: step1Data.email, 
        phone: step1Data.phone, 
        address: step1Data.address 
      });
      setApiKey(key);
      setStep(3);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await copyToClipboard(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-surface">
        <div className="w-full max-w-[420px]">
          <div className="flex items-center gap-2.5 mb-10">
            <img src={heroLogo} alt="Linor Logo" className="w-8 h-8 object-contain rounded-md" />
            <span className="text-lg font-bold text-text-primary">Linor</span>
          </div>

          <h1 className="text-h2 text-text-primary mb-1">Create your clinic</h1>
          <p className="text-sm text-text-secondary mb-6">Set up your AI receptionist in minutes</p>

          <StepDots step={step} />

          {error && (
            <div className="mb-4 p-3 bg-danger/10 border border-danger/20 rounded-md">
              <p className="text-sm text-danger">{error}</p>
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* ── Step 1: Clinic Info ──────────────────────────── */}
            {step === 1 && (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                onSubmit={step1Form.handleSubmit(handleStep1)}
                noValidate
                className="space-y-4"
              >
                <FormInput label="Clinic name" placeholder="HealthFirst Clinic"
                  registration={step1Form.register('clinicName')}
                  error={step1Form.formState.errors.clinicName?.message} />
                <FormInput label="Address" placeholder="123 Medical Drive, San Francisco"
                  registration={step1Form.register('address')}
                  error={step1Form.formState.errors.address?.message} />
                <FormInput label="Phone number" type="tel" placeholder="+1 (555) 000-0000"
                  registration={step1Form.register('phone')}
                  error={step1Form.formState.errors.phone?.message} />
                <FormInput label="Clinic email" type="email" placeholder="hello@yourclinic.com"
                  registration={step1Form.register('email')}
                  error={step1Form.formState.errors.email?.message} />
                <button type="submit" disabled={loading}
                  className="w-full h-10 rounded-md text-sm font-semibold text-primary-on bg-primary hover:bg-primary-hover transition-colors flex items-center justify-center gap-2 disabled:opacity-70">
                  {loading ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : 'Continue →'}
                </button>
              </motion.form>
            )}

            {/* ── Step 2: Account Setup ──────────────────────── */}
            {step === 2 && (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                onSubmit={step2Form.handleSubmit(handleStep2)}
                noValidate
                className="space-y-4"
              >
                <FormInput label="Password" type="password" placeholder="At least 8 characters"
                  registration={step2Form.register('password')}
                  error={step2Form.formState.errors.password?.message} />
                <FormInput label="Confirm password" type="password" placeholder="Repeat your password"
                  registration={step2Form.register('confirmPassword')}
                  error={step2Form.formState.errors.confirmPassword?.message} />
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)}
                    className="flex-1 h-10 rounded-md text-sm font-medium border border-border hover:bg-surface-secondary text-text-secondary transition-colors">
                    Back
                  </button>
                  <button type="submit" disabled={loading}
                    className="flex-1 h-10 rounded-md text-sm font-semibold text-primary-on bg-primary hover:bg-primary-hover transition-colors flex items-center justify-center gap-2 disabled:opacity-70">
                    {loading ? <><Loader2 size={16} className="animate-spin" /> Creating...</> : 'Create Account'}
                  </button>
                </div>
              </motion.form>
            )}

            {/* ── Step 3: Done + API Key ─────────────────────── */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-full bg-success-light flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={28} className="text-success" />
                </div>
                <h2 className="text-h3 text-text-primary mb-1">You're all set!</h2>
                <p className="text-sm text-text-muted mb-6">Here's your API key — keep it safe.</p>

                <div className="bg-surface-secondary border border-border rounded-md p-4 mb-3 text-left">
                  <p className="text-label uppercase text-text-muted mb-2">Your API Key</p>
                  <div className="flex items-center gap-2">
                    <code className="mono flex-1 text-text-primary truncate">{maskApiKey(apiKey)}</code>
                    <button onClick={handleCopy}
                      className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                        copied ? 'bg-success-light text-success' : 'bg-primary-light text-primary hover:bg-primary/20')}>
                      {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
                    </button>
                  </div>
                </div>
                <p className="text-xs text-text-muted mb-6">You can always find this in API & Security settings.</p>

                <button onClick={() => navigate('/dashboard')}
                  className="w-full h-10 rounded-md text-sm font-semibold text-primary-on bg-primary hover:bg-primary-hover transition-colors">
                  Go to Dashboard →
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {step < 3 && (
            <p className="mt-6 text-center text-sm text-text-secondary">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
            </p>
          )}
        </div>
      </div>

      {/* Right panel */}
      <div className="hidden lg:flex w-[40%] login-gradient flex-col items-center justify-center p-12 text-white">
        <div className="max-w-xs">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-8">
            <img src={heroLogo} alt="Linor Logo" className="w-10 h-10 object-contain rounded-lg" />
          </div>
          <h2 className="text-3xl font-bold mb-3 leading-tight">
            Your clinic's AI receptionist, always on.
          </h2>
          <p className="text-white/70 text-sm mb-8 leading-relaxed">
            Let AI handle appointment booking and FAQs while your team focuses on patient care.
          </p>
          <div className="space-y-3">
            {FEATURES.map((f) => (
              <div key={f} className="flex items-start gap-3">
                <CheckCircle size={18} className="text-white/80 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-white/90">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
