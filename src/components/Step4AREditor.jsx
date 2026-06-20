import { useDesign, useDesignDispatch } from '../store/DesignContext';

export default function Step4AREditor() {
  const { selectedAREffect, overlay } = useDesign();
  const dispatch = useDesignDispatch();

  if (selectedAREffect === null) return null;

  return (
    <div className="space-y-6 animate-in slide-in-from-top-4 fade-in duration-300">
      <h3 className="text-xl font-semibold text-ink">4. Tùy chỉnh thông điệp</h3>
      
      <div className="space-y-4 bg-cream p-4 rounded-xl border border-line">
        <div>
          <label className="block text-sm font-medium text-ink mb-1">
            Lời chúc / Thông điệp khắc trên ảnh
          </label>
          <input 
            type="text" 
            value={overlay.text}
            onChange={(e) => dispatch({ type: 'SET_OVERLAY_TEXT', payload: e.target.value })}
            placeholder="Ví dụ: Kỷ niệm ngày cưới 2026..."
            className="w-full px-4 py-2 border border-line rounded-md focus:ring-2 focus:ring-sage-deep focus:border-sage-deep outline-none bg-card"
          />
          <p className="text-xs text-walnut mt-1.5 font-medium">
            💡 Mẹo: Bạn có thể nhấn giữ và kéo thả dòng chữ trực tiếp trên khung ảnh xem trước bên trái để điều chỉnh vị trí theo ý muốn.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Kiểu chữ</label>
            <select 
              value={overlay.fontStyle}
              onChange={(e) => dispatch({ type: 'SET_OVERLAY_FONT_STYLE', payload: e.target.value })}
              className="w-full px-3 py-2 border border-line rounded-md focus:ring-2 focus:ring-sage-deep outline-none bg-card"
            >
              <option value="sans">Hiện đại (Inter)</option>
              <option value="serif">Cổ điển (Playfair Display)</option>
              <option value="cursive">Viết tay (Dancing Script)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Cỡ chữ: {overlay.fontSize}px</label>
            <input 
              type="range" 
              min="12" 
              max="48" 
              value={overlay.fontSize}
              onChange={(e) => dispatch({ type: 'SET_OVERLAY_FONT_SIZE', payload: parseInt(e.target.value) })}
              className="w-full mt-2 accent-sage-deep"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Màu chữ</label>
            <div className="flex items-center gap-2">
              <input 
                type="color"
                value={overlay.color || '#ffffff'}
                onChange={(e) => dispatch({ type: 'SET_OVERLAY_COLOR', payload: e.target.value })}
                className="w-10 h-10 rounded-md border border-line cursor-pointer p-0.5"
              />
              <span className="text-xs text-ink-muted">{overlay.color || '#ffffff'}</span>
            </div>
          </div>
        </div>
        
        <p className="text-xs text-ink-muted italic mt-2">
          * Màu sắc và kiểu chữ hiển thị thực tế có thể thay đổi nhẹ sau khi gia công/in ấn.
        </p>
      </div>
    </div>
  );
}