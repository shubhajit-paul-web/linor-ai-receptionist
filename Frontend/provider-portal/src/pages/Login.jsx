import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import useAuthStore from '../store/useAuthStore';
import { loginSchema } from '../lib/validators';
import { cn } from '../lib/utils';
import heroLogo from '../assets/hero.png';

/** Reusable form input with error state */
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
            error
              ? 'border-danger focus:border-danger'
              : 'border-border focus:border-primary'
          )}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
          >
            {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}

/** Features shown on the right panel */
const FEATURES = [
  '24/7 appointment booking via chatbot',
  'Full control over FAQs and AI responses',
  'Real-time analytics and chat logs',
];

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ─── Left: Form Panel ────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-surface">
        <div className="w-full max-w-[400px]">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-10">
            <img src={heroLogo} alt="Linor Logo" className="w-8 h-8 object-contain rounded-md" />
            <span className="text-lg font-bold text-text-primary">Linor</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h1 className="text-h2 text-text-primary mb-1">Welcome back</h1>
            <p className="text-sm text-text-secondary mb-8">
              Sign in to your clinic dashboard
            </p>

            {error && (
              <div className="mb-4 p-3 bg-danger/10 border border-danger/20 rounded-md">
                <p className="text-sm text-danger">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
              <FormInput
                label="Email address"
                type="email"
                placeholder="doctor@yourclinic.com"
                registration={register('email')}
                error={errors.email?.message}
              />
              <FormInput
                label="Password"
                type="password"
                placeholder="••••••••"
                registration={register('password')}
                error={errors.password?.message}
              />

              <div className="flex justify-end">
                <a href="#" className="text-xs text-primary hover:underline">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={cn(
                  'w-full h-10 rounded-md text-sm font-semibold text-white',
                  'bg-primary hover:bg-primary-hover transition-colors duration-150',
                  'flex items-center justify-center gap-2',
                  'disabled:opacity-70 disabled:cursor-not-allowed'
                )}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-text-secondary">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary font-medium hover:underline">
                Create one free
              </Link>
            </p>
          </motion.div>
        </div>
      </div>

      {/* ─── Right: Value Prop Panel ─────────────────────────── */}
      <div className="hidden lg:flex w-[40%] login-gradient flex-col items-center justify-center p-12 text-white">
        <div className="max-w-xs">
          {/* Decorative icon */}
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

          {/* Abstract decoration */}
          <div className="mt-10 flex gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex-1 h-1.5 rounded-full bg-white/20"
                style={{ opacity: 0.3 + i * 0.2 }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
