import { lazy, Suspense, useEffect } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import useAuthStore from './store/useAuthStore';
import useUIStore from './store/useUIStore';

// ─── Lazy-loaded pages for optimal bundle splitting ───────────────────────────

const Login        = lazy(() => import('./pages/Login'));
const Register     = lazy(() => import('./pages/Register'));
const Dashboard    = lazy(() => import('./pages/Dashboard'));
const Appointments = lazy(() => import('./pages/Appointments'));
const ChatLogs     = lazy(() => import('./pages/ChatLogs'));
const FAQs         = lazy(() => import('./pages/FAQs'));
const WidgetSettings = lazy(() => import('./pages/WidgetSettings'));
const EmbedCode    = lazy(() => import('./pages/EmbedCode'));
const ClinicSettings = lazy(() => import('./pages/ClinicSettings'));
const ApiSecurity  = lazy(() => import('./pages/ApiSecurity'));
const WorkingHours = lazy(() => import('./pages/WorkingHours'));
const Billing      = lazy(() => import('./pages/Billing'));

// ─── Route Guards ─────────────────────────────────────────────────────────────

/** Redirect to /dashboard if already authenticated */
function PublicRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

/** Redirect to /login if not authenticated */
function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <AppShell />;
}

/** Minimal fallback while lazy chunks load */
function PageLoader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// ─── Router Config ────────────────────────────────────────────────────────────

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    element: <PublicRoute />,
    children: [
      { path: '/login',    element: <Suspense fallback={<PageLoader />}><Login /></Suspense> },
      { path: '/register', element: <Suspense fallback={<PageLoader />}><Register /></Suspense> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/dashboard',      element: <Suspense fallback={<PageLoader />}><Dashboard /></Suspense> },
      { path: '/appointments',   element: <Suspense fallback={<PageLoader />}><Appointments /></Suspense> },
      { path: '/logs',           element: <Suspense fallback={<PageLoader />}><ChatLogs /></Suspense> },
      { path: '/faqs',           element: <Suspense fallback={<PageLoader />}><FAQs /></Suspense> },
      { path: '/widget-settings', element: <Suspense fallback={<PageLoader />}><WidgetSettings /></Suspense> },
      { path: '/embed',          element: <Suspense fallback={<PageLoader />}><EmbedCode /></Suspense> },
      { path: '/settings',       element: <Suspense fallback={<PageLoader />}><ClinicSettings /></Suspense> },
      { path: '/working-hours',  element: <Suspense fallback={<PageLoader />}><WorkingHours /></Suspense> },
      { path: '/api-security',   element: <Suspense fallback={<PageLoader />}><ApiSecurity /></Suspense> },
      { path: '/billing',        element: <Suspense fallback={<PageLoader />}><Billing /></Suspense> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);

// ─── App Root ─────────────────────────────────────────────────────────────────

export default function App() {
  const initTheme = useUIStore((s) => s.initTheme);

  // Apply saved theme class before first render to prevent flash
  useEffect(() => {
    initTheme();
  }, []);

  return <RouterProvider router={router} />;
}
