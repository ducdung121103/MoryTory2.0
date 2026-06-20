import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Download, Sparkles, ArrowLeft, AlertCircle, Leaf } from 'lucide-react';
import { useToast } from '../store/ToastContext';

export default function OrderPreview() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const navigate = useNavigate();
  const toast = useToast();

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) {
      setError('Mã đơn hàng không hợp lệ hoặc thiếu.');
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/orders?id=${orderId}`);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Không tìm thấy đơn hàng này trên hệ thống.');
          }
          throw new Error('Đã có lỗi xảy ra khi tải dữ liệu đơn hàng.');
        }
        const data = await res.json();
        setOrderData(data);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleDownload = () => {
    if (!orderData || !orderData.targetImage) {
      toast.error('Không tìm thấy ảnh để tải xuống.');
      return;
    }

    try {
      const base64Data = orderData.targetImage;
      const link = document.createElement('a');
      link.href = base64Data;
      link.download = `morytory_${orderId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Đang tải ảnh xuống...');
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi tải ảnh xuống. Vui lòng thử lại!');
    }
  };

  const handleGoToAR = () => {
    navigate(`/ar?orderId=${orderId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
        <div className="bg-card rounded-2xl shadow-[var(--shadow-warm)] w-full max-w-md p-8 border border-line text-center animate-pulse">
          <div className="font-serif text-3xl font-bold text-walnut mb-2">MoryTory</div>
          <div className="text-ink-muted text-sm">Đang tải dữ liệu đơn hàng...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
        <div className="bg-card rounded-2xl shadow-[var(--shadow-warm)] w-full max-w-md p-8 border border-line text-center flex flex-col items-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="font-serif text-3xl font-bold text-walnut mb-2">MoryTory</div>
          <h2 className="text-xl font-serif font-bold text-ink mb-3">Lỗi tải đơn hàng</h2>
          <p className="text-ink-muted text-sm mb-6 leading-relaxed">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-walnut text-cream py-3 rounded-xl font-medium hover:bg-walnut-deep transition-all flex items-center justify-center gap-2 shadow-[var(--shadow-soft)]"
          >
            <ArrowLeft className="w-4 h-4" /> Quay về trang chủ
          </button>
        </div>
      </div>
    );
  }

  const effectLabels = {
    snow: 'Tuyết rơi',
    leaves: 'Lá rơi',
    petals: 'Cánh hoa đào rơi',
    sparkle: 'Lấp lánh phép thuật',
    fireworks: 'Pháo hoa rực rỡ'
  };

  return (
    <div className="min-h-screen bg-cream py-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-card rounded-3xl shadow-[var(--shadow-warm)] border border-line overflow-hidden p-6 md:p-8 flex flex-col">
        {/* Header logo */}
        <div className="flex flex-col items-center mb-6 text-center border-b border-line pb-6 shrink-0">
          <div className="font-serif text-4xl font-bold text-walnut flex items-center gap-2">
            <Leaf className="w-8 h-8" /> MoryTory
          </div>
          <p className="text-sm text-ink-muted font-sans mt-2">Xem lại khung ảnh & Trải nghiệm AR</p>
        </div>

        {/* Order Meta */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-cream-deep/40 p-4 rounded-2xl border border-line/50 text-sm">
          <div>
            <span className="text-ink-muted">Mã đơn hàng:</span>
            <span className="font-mono font-bold text-walnut ml-2">#{orderId}</span>
          </div>
          <div>
            <span className="text-ink-muted">Hiệu ứng AR đã chọn:</span>
            <span className="font-medium text-ink ml-2">{effectLabels[orderData.effect] || orderData.effect}</span>
          </div>
          {orderData.overlayText && (
            <div className="md:col-span-2">
              <span className="text-ink-muted">Thông điệp in kèm:</span>
              <span className="font-serif italic text-ink ml-2">"{orderData.overlayText}"</span>
            </div>
          )}
        </div>

        {/* Large target image preview */}
        <div className="flex-1 flex flex-col items-center mb-8">
          <p className="text-xs text-ink-muted mb-3 font-medium">Bản thiết kế khung ảnh của bạn</p>
          <div className="relative p-4 bg-white rounded-xl shadow-soft border-4 border-[#5c4013] max-w-full max-h-[450px] overflow-hidden flex items-center justify-center">
            <img
              src={orderData.targetImage}
              alt="MoryTory Design Target"
              className="max-w-full max-h-[380px] object-contain rounded-sm"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button
            onClick={handleDownload}
            className="flex-1 bg-cream-deep hover:bg-cream border border-line text-ink py-3.5 px-6 rounded-xl font-medium transition-all shadow-[var(--shadow-soft)] flex items-center justify-center gap-2 group"
          >
            <Download className="w-5 h-5 text-walnut group-hover:scale-110 transition-transform" />
            Tải ảnh gốc xuống
          </button>
          
          <button
            onClick={handleGoToAR}
            className="flex-1 bg-walnut hover:bg-walnut-deep text-cream py-3.5 px-6 rounded-xl font-medium transition-all shadow-[var(--shadow-soft)] flex items-center justify-center gap-2 group"
          >
            <Sparkles className="w-5 h-5 text-sun group-hover:animate-spin transition-transform" />
            Trải nghiệm AR ngay
          </button>
        </div>

        {/* Instruction Note */}
        <div className="bg-sage/10 border border-sage/20 rounded-2xl p-4 text-xs text-sage-deep leading-relaxed">
          <span className="font-bold text-ink block mb-1">💡 Hướng dẫn trải nghiệm AR tại nhà:</span>
          Mở ảnh này trên một màn hình hoặc thiết bị khác (ví dụ: máy tính, ipad). Sau đó, dùng điện thoại của bạn quét lại chính ảnh đó thông qua nút <strong className="text-walnut">"Trải nghiệm AR ngay"</strong> trên điện thoại.
        </div>
      </div>
    </div>
  );
}
