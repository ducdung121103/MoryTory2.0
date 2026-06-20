import React, { useState, useRef, useEffect } from 'react';
import { useDesign, useDesignDispatch } from '../store/DesignContext';

export default function LeftColumnPreview() {
  const { photoPreviewUrl, overlay, frameSize, isPrintingPhoto, selectedAREffect } = useDesign();
  const dispatch = useDesignDispatch();
  const [isDragging, setIsDragging] = useState(false);
  const [containerHeight, setContainerHeight] = useState(420);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target === containerRef.current) {
          setContainerHeight(entry.contentRect.height);
        }
      }
    });

    observer.observe(containerRef.current);
    setContainerHeight(containerRef.current.clientHeight);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handlePointerDown = (e) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const container = document.getElementById('ar-target-preview');
    if (!container) return;

    const rect = container.getBoundingClientRect();
    let x = ((e.clientX - rect.left) / rect.width) * 100;
    let y = ((e.clientY - rect.top) / rect.height) * 100;

    // Clamp within [5, 95]
    x = Math.max(5, Math.min(95, x));
    y = Math.max(5, Math.min(95, y));

    dispatch({ type: 'SET_OVERLAY_POSITION', payload: { x, y } });
  };

  const handlePointerUp = (e) => {
    if (isDragging) {
      e.currentTarget.releasePointerCapture(e.pointerId);
      setIsDragging(false);
    }
  };
  
  const containerClasses = `relative border-[6px] border-walnut bg-card rounded-md shadow-[var(--shadow-warm)] p-1.5 transition-all duration-500 ease-in-out flex items-center justify-center overflow-hidden mx-auto
    ${frameSize === '10x15' ? 'w-[200px] h-[300px] md:w-[266px] md:h-[400px]' : ''}
    ${frameSize === '13x18' ? 'w-[230px] h-[318px] md:w-[325px] md:h-[450px]' : ''}
    ${frameSize === '15x21' ? 'w-[260px] h-[364px] md:w-[357px] md:h-[500px]' : ''}
  `;

  const renderAREffect = () => {
    if (!selectedAREffect) return null;

    if (selectedAREffect === 'snow') {
      return (
        <div 
          data-html2canvas-ignore="true" 
          className="absolute inset-0 pointer-events-none z-20 overflow-hidden bg-black/10 rounded"
          style={{ '--fall-distance': `${containerHeight + 40}px` }}
        >
          {Array.from({ length: 20 }).map((_, i) => {
            const left = `${Math.random() * 100}%`;
            const delay = `${Math.random() * 5}s`;
            const duration = `${3 + Math.random() * 4}s`;
            const size = `${3 + Math.random() * 5}px`;
            return (
              <div
                key={i}
                className="absolute bg-white rounded-full animate-snow"
                style={{
                  left,
                  animationDelay: delay,
                  animationDuration: duration,
                  width: size,
                  height: size,
                  top: '-10px',
                }}
              />
            );
          })}
        </div>
      );
    }

    if (selectedAREffect === 'sparkle') {
      return (
        <div data-html2canvas-ignore="true" className="absolute inset-0 pointer-events-none z-20 overflow-hidden bg-sun/5 rounded">
          {Array.from({ length: 20 }).map((_, i) => {
            const left = `${Math.random() * 100}%`;
            const top = `${Math.random() * 100}%`;
            const delay = `${Math.random() * 3}s`;
            const duration = `${1.5 + Math.random() * 2}s`;
            const size = `${6 + Math.random() * 8}px`;
            return (
              <svg
                key={i}
                className="absolute text-sun fill-current animate-sparkle"
                viewBox="0 0 24 24"
                style={{
                  left,
                  top,
                  animationDelay: delay,
                  animationDuration: duration,
                  width: size,
                  height: size,
                }}
              >
                <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
              </svg>
            );
          })}
        </div>
      );
    }

    if (selectedAREffect === 'petals') {
      return (
        <div 
          data-html2canvas-ignore="true" 
          className="absolute inset-0 pointer-events-none z-20 overflow-hidden bg-terracotta/5 rounded"
          style={{ '--fall-distance': `${containerHeight + 40}px` }}
        >
          {Array.from({ length: 15 }).map((_, i) => {
            const left = `${Math.random() * 100}%`;
            const delay = `${Math.random() * 6}s`;
            const duration = `${4 + Math.random() * 5}s`;
            const size = `${8 + Math.random() * 10}px`;
            return (
              <div
                key={i}
                className="absolute bg-pink-300 rounded-full opacity-60 animate-petals"
                style={{
                  left,
                  animationDelay: delay,
                  animationDuration: duration,
                  width: size,
                  height: size,
                  borderRadius: '100% 0% 100% 100%',
                  top: '-15px',
                }}
              />
            );
          })}
        </div>
      );
    }

    return null;
  };

  const pos = overlay.position || { x: 50, y: 85 };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      {selectedAREffect && (
        <div className="mb-4 bg-sage-deep text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm animate-pulse z-30">
          AR Trực Tuyến Đang Hoạt Động
        </div>
      )}
      
      <div className={containerClasses}>
        <div 
          ref={containerRef}
          id="ar-target-preview" 
          className="w-full h-full bg-cream-deep rounded overflow-hidden relative"
        >
          
          {renderAREffect()}

          {isPrintingPhoto ? (
            photoPreviewUrl ? (
              <img 
                src={photoPreviewUrl} 
                alt="Preview" 
                className="object-cover w-full h-full transition-opacity duration-300"
              />
            ) : (
              <div className="w-full h-full text-ink-muted bg-cream-deep flex flex-col items-center justify-center text-center p-4">
                <svg className="w-12 h-12 mb-2 opacity-50 text-walnut" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">Chưa có ảnh in kèm</span>
                <span className="text-xs opacity-60 mt-1">Vui lòng tải ảnh lên ở Bước 1</span>
              </div>
            )
          ) : (
            <div className="w-full h-full bg-cream-deep flex flex-col items-center justify-center text-center p-6 border border-line">
              <span className="text-sm font-serif font-semibold text-walnut/80">Khung Gỗ MoryTory</span>
              <span className="text-xs text-ink-muted mt-1">Không bao gồm in ảnh</span>
            </div>
          )}
          
          {overlay.text && (
            <div 
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="absolute z-30 select-none px-3 py-1.5 border border-dashed border-transparent hover:border-walnut/50 hover:bg-black/10 rounded-lg transition-colors cursor-grab active:cursor-grabbing"
              style={{ 
                fontFamily: overlay.fontStyle === 'serif' ? 'Playfair Display, serif' : 
                            overlay.fontStyle === 'cursive' ? 'Dancing Script, cursive' : 'Inter, sans-serif',
                fontSize: `${overlay.fontSize}px`,
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: 'translate(-50%, -50%)',
                textShadow: '0 2px 4px rgba(0,0,0,0.6)',
                color: overlay.color || '#ffffff',
                touchAction: 'none',
                whiteSpace: 'nowrap',
                maxWidth: '90%',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {overlay.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}