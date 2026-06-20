import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Leaf, ArrowLeft, Package, ScanLine } from 'lucide-react';
import { useAuth } from '../store/AuthContext';

export default function OrderStatusPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isLoading: authLoading } = useAuth();

  // Manual lookup state (for guests)
  const [manualId, setManualId] = useState(searchParams.get('orderId') || '');
  const [lookupResult, setLookupResult] = useState(null);
  const [lookupError, setLookupError] = useState('');
  const [isLookingUp, setIsLookingUp] = useState(false);

  // Logged-in user's orders
  const [myOrders, setMyOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  useEffect(() => {
    if (user?.id) {
      setIsLoadingOrders(true);
      fetch('/api/orders/mine', { credentials: 'same-origin' })
        .then(res => res.json())
        .then(data => setMyOrders(data.orders || []))
        .catch(() => {})
        .finally(() => setIsLoadingOrders(false));
    }
  }, [user]);

  const handleManualLookup = async (e) => {
    e.preventDefault();
    if (!manualId.trim()) return;
    setIsLookingUp(true);
    setLookupError('');
    setLookupResult(null);
    try {
      const res = await fetch(`/api/orders?id=${encodeURIComponent(manualId.trim())}`);
      if (!res.ok) throw new Error((await res.json()).error || 'Not found');
      const data = await res.json();
      setLookupResult(data);
    } catch (err) {
      setLookupError(err.message || 'Không tìm thấy đơn hàng');
    } finally {
      setIsLookingUp(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream text-ink font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-line/60 bg-cream/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-ink-muted hover:text-walnut transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-serif text-xl font-semibold text-walnut-deep">MoryTory</span>
          </button>
          <span className="text-sm text-ink-muted">
            <Package className="h-4 w-4 inline mr-1" />
            Tra cứu đơn hàng
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-12 space-y-10">
        {/* Logged-in user: My Orders */}
        {user && (
          <section>
            <h2 className="text-2xl font-serif font-bold text-ink mb-6 flex items-center gap-2">
              <Leaf className="h-6 w-6 text-walnut" />
              Đơn hàng của tôi
            </h2>
            {isLoadingOrders || authLoading ? (
              <div className="text-center text-ink-muted py-8">Đang tải...</div>
            ) : myOrders.length === 0 ? (
              <div className="text-center text-ink-muted py-8 bg-cream-deep rounded-2xl border border-line">
                <Package className="h-10 w-10 mx-auto mb-2 opacity-40" />
                <p>Bạn chưa có đơn hàng nào.</p>
                <button
                  onClick={() => navigate('/design')}
                  className="mt-4 inline-flex items-center gap-2 px-6 py-2 bg-walnut text-cream rounded-full text-sm font-medium hover:bg-walnut-deep transition-colors"
                >
                  Thiết kế khung ảnh ngay
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {myOrders.map(order => (
                  <div key={order.orderId} className="bg-card border border-line rounded-2xl p-4 flex items-center gap-4 hover:shadow-[var(--shadow-soft)] transition-shadow">
                    <div className="w-16 h-16 bg-cream-deep rounded-lg flex items-center justify-center shrink-0">
                      <ScanLine className="h-6 w-6 text-walnut" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-ink">Mã: #{order.orderId}</p>
                      <p className="text-xs text-ink-muted">
                        Hiệu ứng: {order.effect || 'Không'} · {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/ar?orderId=${order.orderId}`)}
                      className="px-4 py-2 bg-sage-deep text-white text-sm font-medium rounded-full hover:brightness-110 transition-all shrink-0"
                    >
                      Xem AR
                    </button>
                  </div>
                ))}
              </div>
            )}
            <hr className="my-8 border-line" />
          </section>
        )}

        {/* Guest Manual Lookup */}
        <section>
          <h2 className="text-xl font-serif font-bold text-ink mb-4">
            {user ? 'Tra cứu đơn hàng khác' : 'Tra cứu đơn hàng'}
          </h2>
          <p className="text-sm text-ink-muted mb-4">
            Nhập mã đơn hàng được in trên khung ảnh để xem trải nghiệm AR.
          </p>
          <form onSubmit={handleManualLookup} className="flex gap-3">
            <input
              type="text"
              value={manualId}
              onChange={(e) => setManualId(e.target.value)}
              placeholder="Nhập mã đơn hàng..."
              className="flex-1 px-4 py-3 border border-line rounded-xl focus:ring-2 focus:ring-walnut focus:border-transparent outline-none bg-card text-ink"
            />
            <button
              type="submit"
              disabled={isLookingUp || !manualId.trim()}
              className="px-6 py-3 bg-walnut text-cream font-medium rounded-xl hover:bg-walnut-deep transition-colors disabled:opacity-50"
            >
              {isLookingUp ? 'Đang tìm...' : 'Tra cứu'}
            </button>
          </form>

          {lookupError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {lookupError}
            </div>
          )}

          {lookupResult && (
            <div className="mt-4 bg-card border border-line rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 bg-sage/20 rounded-full flex items-center justify-center text-sage-deep">
                  <Package className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-serif text-xl font-bold text-ink">Đơn hàng #{lookupResult.orderId}</p>
                  <p className="text-xs text-ink-muted">
                    Hiệu ứng: {lookupResult.effect || 'Không'} · {lookupResult.createdAt ? new Date(lookupResult.createdAt).toLocaleDateString('vi-VN') : ''}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate(`/ar?orderId=${lookupResult.orderId}`)}
                className="w-full mt-2 px-6 py-3 bg-walnut text-cream font-medium rounded-xl hover:bg-walnut-deep transition-colors flex items-center justify-center gap-2"
              >
                <ScanLine className="h-5 w-5" />
                Xem trải nghiệm AR
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}