import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Save, Leaf, Shield } from 'lucide-react';
import { useAuth, useAuthDispatch } from '../store/AuthContext';
import { useToast } from '../store/ToastContext';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const dispatch = useAuthDispatch();
  const toast = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    } else {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.warning('Tên không được để trống.');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: name.trim() })
      });

      if (!response.ok) {
        throw new Error('Lỗi cập nhật thông tin');
      }

      const data = await response.json();
      if (data.success) {
        dispatch({ type: 'LOGIN', payload: data.user });
        toast.success('Cập nhật thông tin thành công!');
      } else {
        throw new Error(data.error || 'Lỗi không xác định');
      }
    } catch (err) {
      toast.error(err.message || 'Lỗi khi kết nối với server.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream text-ink font-sans flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-line/60 bg-cream/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-ink-muted hover:text-walnut transition-colors bg-transparent border-0 cursor-pointer outline-none">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-serif text-xl font-semibold text-walnut-deep">MoryTory</span>
          </button>
          <span className="text-sm text-ink-muted font-medium flex items-center gap-1">
            <Shield className="h-4 w-4 text-walnut" />
            Thông tin cá nhân
          </span>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="bg-card border border-line rounded-3xl p-8 shadow-[var(--shadow-warm)] relative overflow-hidden w-full max-w-xl animate-in fade-in zoom-in-95 duration-300">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-walnut/5 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              {user.picture ? (
                <img src={user.picture} alt={user.name} className="w-24 h-24 rounded-full border-4 border-walnut object-cover shadow-[var(--shadow-soft)]" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-walnut text-cream flex items-center justify-center text-3xl font-serif font-bold border-4 border-walnut shadow-[var(--shadow-soft)]">
                  {user.name?.charAt(0) || '?'}
                </div>
              )}
              <span className="absolute bottom-0 right-0 bg-walnut text-cream p-1.5 rounded-full shadow-md">
                <Leaf className="w-4 h-4" />
              </span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-ink">{user.name}</h2>
            <p className="text-xs text-ink-muted mt-1">Thành viên MoryTory</p>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5 flex items-center gap-1.5">
                <User className="w-4 h-4 text-walnut" />
                Họ và Tên
              </label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 border border-line rounded-xl focus:ring-2 focus:ring-walnut focus:border-transparent outline-none bg-card text-ink"
                placeholder="Nhập họ và tên..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-1.5 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-walnut" />
                Email (Tài khoản Google)
              </label>
              <input
                disabled
                type="email"
                value={email}
                className="w-full px-4 py-2.5 border border-line rounded-xl bg-cream-deep text-ink-muted cursor-not-allowed outline-none"
              />
              <p className="text-[11px] text-ink-muted mt-1.5 italic">
                * Email này được liên kết với tài khoản Google của bạn và không thể thay đổi.
              </p>
            </div>

            <button
              disabled={isSaving}
              type="submit"
              className="w-full bg-walnut text-cream py-3 rounded-xl font-medium hover:bg-walnut-deep transition-all shadow-[var(--shadow-soft)] flex items-center justify-center gap-2 mt-8 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
