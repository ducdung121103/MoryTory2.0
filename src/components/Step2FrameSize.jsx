import { useDesign, useDesignDispatch } from '../store/DesignContext';

const SIZES = [
  { id: '10x15', label: '10x15 cm', desc: 'Để bàn / Kệ sách', price: 35000 },
  { id: '13x18', label: '13x18 cm', desc: 'Làm quà tặng', price: 40000 },
  { id: '15x21', label: '15x21 cm', desc: 'Treo tường', price: 45000 },
];

export default function Step2FrameSize() {
  const { frameSize } = useDesign();
  const dispatch = useDesignDispatch();

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-ink">2. Chọn kích thước</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SIZES.map((size) => {
          const isSelected = frameSize === size.id;
          return (
            <button
              key={size.id}
              onClick={() => dispatch({ type: 'SET_FRAME_SIZE', payload: size.id })}
              className={`p-4 rounded-xl text-left transition-all duration-300 ease-in-out ${
                isSelected 
                  ? 'bg-walnut text-cream scale-[1.02] shadow-[var(--shadow-soft)] border-transparent' 
                  : 'bg-card border border-line text-ink hover:border-walnut/50 hover:shadow-sm'
              }`}
            >
              <div className="font-semibold flex justify-between items-center">
                <span>{size.label}</span>
                <span className={`text-sm ${isSelected ? 'text-cream/80' : 'text-walnut'}`}>
                  {size.price.toLocaleString('vi-VN')}đ
                </span>
              </div>
              <div className={`text-sm mt-1 ${isSelected ? 'text-cream/60' : 'text-ink-muted'}`}>
                {size.desc}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}