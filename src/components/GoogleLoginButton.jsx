import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useAuthDispatch } from '../store/AuthContext';
import { useToast } from '../store/ToastContext';
import { LogOut } from 'lucide-react';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export default function GoogleLoginButton() {
  const { user, isLoading } = useAuth();
  const dispatch = useAuthDispatch();
  const toast = useToast();
  const btnRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' });
      dispatch({ type: 'LOGOUT' });
      toast.success('Đã đăng xuất.');
    } catch (e) {
      toast.error('Lỗi đăng xuất');
    }
  };

  const handleMockLogin = async () => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: 'mock_google_credential_for_dev_mode' }),
        credentials: 'same-origin',
      });
      if (!res.ok) throw new Error('Mock login failed');
      const data = await res.json();
      dispatch({ type: 'LOGIN', payload: data.user });
      toast.success(`Xin chào, ${data.user.name}!`);
    } catch (e) {
      dispatch({ type: 'LOGIN', payload: { id: 'mock123', name: 'Khách hàng Demo', email: 'demo@morytory.vn', picture: '' } });
      toast.success(`Đăng nhập giả lập thành công!`);
    }
  };

  useEffect(() => {
    if (user || isLoading || !GOOGLE_CLIENT_ID) return;
    if (!window.google) return;

    const initGoogle = () => {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response) => {
          try {
            const res = await fetch('/api/auth/google', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ credential: response.credential }),
              credentials: 'same-origin',
            });
            if (!res.ok) throw new Error('Login failed');
            const data = await res.json();
            dispatch({ type: 'LOGIN', payload: data.user });
            toast.success(`Xin chào, ${data.user.name}!`);
          } catch (e) {
            toast.error('Đăng nhập thất bại. Vui lòng thử lại.');
          }
        },
        auto_select: false,
      });

      if (btnRef.current) {
        window.google.accounts.id.renderButton(btnRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'pill',
          width: 240,
        });
      }
    };

    if (window.google?.accounts) {
      initGoogle();
    } else {
      // Poll for google script load
      const interval = setInterval(() => {
        if (window.google?.accounts) {
          clearInterval(interval);
          initGoogle();
        }
      }, 200);
      return () => clearInterval(interval);
    }
  }, [user, isLoading]);

  if (isLoading) return (
    <div className="h-10 w-10 rounded-full bg-line animate-pulse" />
  );

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity bg-transparent border-0 cursor-pointer p-0 text-left outline-none"
          title="Chỉnh sửa thông tin cá nhân"
        >
          {user.picture ? (
            <img src={user.picture} alt={user.name} className="h-9 w-9 rounded-full border-2 border-walnut object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="h-9 w-9 rounded-full bg-walnut text-cream flex items-center justify-center text-sm font-bold border-2 border-walnut">
              {user.name?.charAt(0) || '?'}
            </div>
          )}
          <span className="hidden sm:inline text-sm font-medium text-ink max-w-[120px] truncate">{user.name}</span>
        </button>
        <button
          onClick={handleLogout}
          className="p-2 rounded-full hover:bg-cream-deep transition-colors text-ink-muted hover:text-ink"
          title="Đăng xuất"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (!GOOGLE_CLIENT_ID) {
    return (
      <button
        onClick={handleMockLogin}
        className="px-4 py-2 bg-walnut text-cream rounded-full hover:bg-walnut-deep transition-all text-xs font-semibold shadow-[var(--shadow-soft)] flex items-center gap-1.5 border border-walnut/20"
      >
        Đăng ký / Đăng nhập
      </button>
    );
  }

  return (
    <div ref={btnRef} className="flex items-center" />
  );
}