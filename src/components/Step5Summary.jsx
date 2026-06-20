import { useDesign } from '../store/DesignContext';

export default function Step5Summary({ onOrder, buttonText = "Đặt hàng ngay" }) {
  const { pricing, selectedAREffect } = useDesign();

  return (
    <div className="fixed bottom-0 left-0 md:left-1/2 right-0 bg-card border-t border-line p-4 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] z-30">
      <div className="max-w-xl mx-auto flex items-center justify-between">
        <div>
          <div className="text-sm text-ink-muted mb-1">
            Khung gỗ ({pricing.base.toLocaleString()}đ) {selectedAREffect && '+ Hiệu ứng AR (5.000đ)'}
          </div>
          <div className="text-2xl font-bold text-ink font-serif">
            {pricing.total.toLocaleString()}đ
          </div>
        </div>
        
        <button 
          onClick={onOrder}
          className="px-8 py-3 bg-sage-deep text-white font-semibold rounded-full shadow-[var(--shadow-soft)] hover:brightness-110 transition-all"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}