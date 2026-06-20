import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, CheckCircle, Leaf } from 'lucide-react';
import { resizeImageForAR } from '../utils/imageUtils';
import { useCartDispatch } from '../store/CartContext';
import { useAuth } from '../store/AuthContext';
import { useToast } from '../store/ToastContext';
import GoogleLoginButton from './GoogleLoginButton';

export default function CheckoutModal({ isOpen, onClose, cartItems }) {
  const [step, setStep] = useState(1);
  const [orderIds, setOrderIds] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const dispatch = useCartDispatch();
  const { user } = useAuth();
  const toast = useToast();

  // Auto-fill customerName from Google login if available
  useEffect(() => {
    if (user?.name && !customerName) {
      setCustomerName(user.name);
    }
  }, [user]);

  if (!isOpen) return null;

  if (!user) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl shadow-[var(--shadow-warm)] w-full max-w-md overflow-hidden relative p-8 flex flex-col items-center border border-line animate-in fade-in zoom-in-95 duration-200">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 text-ink-muted hover:text-ink rounded-full hover:bg-cream-deep transition-colors">
            <X className="w-5 h-5" />
          </button>
          <div className="w-16 h-16 bg-walnut/10 rounded-full flex items-center justify-center mb-4 text-walnut">
            <Leaf className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-ink mb-2 text-center">Đăng ký tài khoản</h2>
          <p className="text-ink-muted mb-6 text-center text-sm leading-relaxed">
            Vui lòng đăng ký hoặc đăng nhập tài khoản bằng Google để tiếp tục thanh toán và lưu trữ lịch sử đơn hàng của bạn.
          </p>
          <div className="w-full flex justify-center">
            <GoogleLoginButton />
          </div>
        </div>
      </div>
    );
  }

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      toast.warning('Vui lòng điền đầy đủ thông tin giao hàng.');
      return;
    }
    setIsProcessing(true);
    
    try {
      const results = await Promise.all(cartItems.map(async (item) => {
        const newOrderId = Math.random().toString(36).substr(2, 9).toUpperCase();
        const compressedImage = await resizeImageForAR(item.photoPreviewUrl);

        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            orderId: newOrderId,
            targetImage: compressedImage,
            effect: item.selectedAREffect || 'snow',
            overlayText: item.overlay?.text || '',
            overlayFont: item.overlay?.fontStyle || 'serif',
            overlayFontSize: item.overlay?.fontSize || 16,
            overlayColor: item.overlay?.color || '#ffffff',
            overlayPosX: item.overlay?.position?.x ?? 50,
            overlayPosY: item.overlay?.position?.y ?? 85,
            customerName: customerName.trim(),
            customerPhone: customerPhone.trim(),
            customerAddress: customerAddress.trim(),
            createdAt: new Date().toISOString()
          })
        });

        if (!response.ok) {
          throw new Error('Không thể lưu đơn hàng vào Server');
        }

        return {
          id: newOrderId,
          frameSize: item.frameSize,
          previewUrl: item.photoPreviewUrl
        };
      }));

      setOrderIds(results);
      dispatch({ type: 'CLEAR_CART' });
      setStep(2);
      toast.success('Đặt hàng thành công!');
    } catch (err) {
      toast.error("Lỗi khi xử lý đơn hàng. Có thể mạng yếu hoặc ảnh quá nặng. Hãy thử lại!");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-[var(--shadow-warm)] w-full max-w-xl overflow-hidden relative max-h-[90vh] flex flex-col">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-ink-muted hover:text-ink rounded-full hover:bg-cream-deep transition-colors z-10">
          <X className="w-5 h-5" />
        </button>

        {step === 1 ? (
          <div className="p-6 overflow-y-auto">
            <h2 className="text-2xl font-serif font-bold text-ink mb-6 flex items-center gap-2">
              <Leaf className="h-6 w-6 text-walnut" />
              Thông tin giao hàng
            </h2>
            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Họ và Tên</label>
                <input
                  required
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-2 border border-line rounded-xl focus:ring-2 focus:ring-walnut focus:border-transparent outline-none bg-card"
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Số điện thoại</label>
                <input
                  required
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-line rounded-xl focus:ring-2 focus:ring-walnut focus:border-transparent outline-none bg-card"
                  placeholder="090..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Địa chỉ nhận khung tranh</label>
                <textarea
                  required
                  rows="3"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full px-4 py-2 border border-line rounded-xl focus:ring-2 focus:ring-walnut focus:border-transparent outline-none bg-card"
                  placeholder="Số nhà, tên đường..."
                ></textarea>
              </div>
              <button disabled={isProcessing} type="submit" className="w-full bg-walnut text-cream py-3 rounded-xl font-medium hover:bg-walnut-deep transition-all shadow-[var(--shadow-soft)] mt-6 disabled:opacity-50">
                {isProcessing ? "Đang xử lý..." : `Xác nhận thanh toán (${cartItems.length} sản phẩm)`}
              </button>
            </form>
          </div>
        ) : (
          <div className="p-8 flex flex-col items-center overflow-y-auto">
            <div className="w-16 h-16 bg-sage/20 rounded-full flex items-center justify-center mb-4 text-sage-deep shrink-0">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-ink mb-2 text-center">Đặt hàng thành công!</h2>
            <p className="text-ink-muted mb-6 text-center">Dưới đây là các mã QR tương ứng với từng khung ảnh của bạn</p>
            
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {orderIds.map((order) => (
                <div key={order.id} className="bg-cream p-4 rounded-2xl border border-line flex flex-col items-center">
                  <div className="flex items-center gap-3 w-full mb-3">
                     <img src={order.previewUrl} alt="Preview" className="w-10 h-10 object-cover rounded-md" />
                     <div>
                       <p className="text-xs font-semibold text-ink">Mã: #{order.id}</p>
                       <p className="text-xs text-ink-muted">Khung {order.frameSize} cm</p>
                     </div>
                  </div>
                  <div className="bg-card p-3 rounded-xl shadow-sm border border-line inline-block">
                    <QRCodeSVG 
                      value={`${window.location.origin}/ar?orderId=${order.id}&t=${Date.now()}`} 
                      size={120} 
                      level="H" 
                      includeMargin={true}
                    />
                  </div>
                  <p className="text-[10px] text-ink-muted mt-2 text-center">
                    QR này sẽ được in sau khung
                  </p>
                </div>
              ))}
            </div>

            <button onClick={onClose} className="w-full bg-cream text-ink py-3 rounded-xl font-medium hover:bg-cream-deep transition-all shrink-0 border border-line">
              Đóng
            </button>
          </div>
        )}
      </div>
    </div>
  );
}