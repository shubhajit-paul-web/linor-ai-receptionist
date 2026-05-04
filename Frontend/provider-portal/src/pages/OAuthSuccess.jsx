import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

export default function OAuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setOAuthData = useAuthStore((s) => s.setOAuthData);

  useEffect(() => {
    const token = searchParams.get('token');
    const userStr = searchParams.get('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        
        // Save to Zustand (which auto-saves to localStorage via persist)
        setOAuthData(user, token, null); 
        
        // Redirect to dashboard
        navigate('/dashboard', { replace: true });
      } catch (error) {
        console.error('Failed to parse OAuth data', error);
        navigate('/login', { replace: true });
      }
    } else {
      // If no token is found, send them back to login
      navigate('/login', { replace: true });
    }
  }, [searchParams, navigate, setOAuthData]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-surface text-text-primary">
      <Loader2 size={40} className="animate-spin text-primary mb-4" />
      <p className="text-sm font-medium">Authenticating with Google...</p>
    </div>
  );
}