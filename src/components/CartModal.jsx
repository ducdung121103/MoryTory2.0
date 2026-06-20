import React, { useState } from 'react';
import { X, Trash2, Leaf } from 'lucide-react';
import { useCart, useCartDispatch } from '../store/CartContext';
import CheckoutModal from './CheckoutModal';

export default function CartModal() {
  const { isOpen, items } = useCart();
  const dispatch = useCartDispatch();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isOpen) return null;

  const totalAmount = items.reduce((sum, item) => sum + item.pricing.total, 0);

  const handleCheckout = () => {
    setIsCheckoutOpen(true);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-end md:items-center justify-center p-0 md:p-4 transition-opacity">
        <div className="bg-card rounded-t-3xl md:rounded-2xl shadow-[var(--shadow-warm)] w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
          <div className="flex items-center justify-between p-4 border-b border-line">
            <h2 className="text-xl font-serif font-bold text-ink flex items-center gap-2">
              <Leaf className="h-5 w-5 text-walnut" />
              Giỏ hàng của bạn ({items.length})
            </h2>
            <button 
              onClick={() => dispatch({ type: 'SET_CART_OPEN', payload: false })}
              className="p-2 text-ink-muted hover:text-ink rounded-full hover:bg-cream-deep transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto p-4 flex-1">
            {items.length === 0 ? (
              <div className="text-center py-10 text-ink-muted">
                <p>Giỏ hàng đang trống.</p>
                <button 
                  onClick={() => dispatch({ type: 'SET_CART_OPEN', payload: false })}
                  className="mt-4 text-walnut font-medium hover:text-walnut-deep transition-colors"
                >
                  Tiếp tục thiết kế
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-3 bg-cream rounded-xl border border-line">
                    <div className="w-20 h-20 bg-cream-deep rounded-lg overflow-hidden shrink-0">
                      <img src={item.photoPreviewUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-ink text-sm truncate">Khung {item.frameSize} cm</h3>
                        <button 
                          onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}
                          className="text-ink-muted hover:text-red-500 p-1 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-ink-muted mt-1">
                        Hiệu ứng: {item.selectedAREffect || 'Không'}
                      </p>
                      {item.overlay?.text && (
                        <p className="text-xs text-ink-muted mt-1 truncate">
                          Chữ: "{item.overlay.text}"
                        </p>
                      )}
                      <p className="text-walnut font-medium mt-2">
                        {item.pricing.total.toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-line p-4 bg-card">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium text-ink-muted">Tổng cộng:</span>
                <span className="text-2xl font-bold text-ink font-serif">
                  {totalAmount.toLocaleString('vi-VN')}đ
                </span>
              </div>
              <button 
                onClick={handleCheckout}
                className="w-full py-3 bg-walnut text-cream font-semibold rounded-xl shadow-[var(--shadow-soft)] hover:bg-walnut-deep transition-colors"
              >
                Thanh toán ngay
              </button>
            </div>
          )}
        </div>
      </div>

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        cartItems={items}
      />
    </>
  );
}