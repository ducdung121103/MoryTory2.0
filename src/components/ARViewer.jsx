import React, { useEffect, useState, useRef } from 'react';

const createTextSvg = (text, font, color = '#ffffff', fontSize = 16) => {
  const isSerif = font === 'serif';
  const dynamicFontSize = fontSize * 3;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="200">
    <style>
      .text {
        font-family: ${isSerif ? '"Playfair Display", serif' : 'system-ui, sans-serif'};
        font-size: ${dynamicFontSize}px;
        fill: ${color};
        text-anchor: middle;
        dominant-baseline: middle;
        font-weight: bold;
        filter: drop-shadow(0px 4px 10px rgba(0,0,0,0.8));
      }
    </style>
    <text x="400" y="100" class="text">${text}</text>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
};

export const ARViewer = ({ 
  composedImage, 
  effect, 
  overlayText, 
  overlayFont, 
  overlayColor, 
  overlayFontSize, 
  overlayPosX, 
  overlayPosY, 
  onBack 
}) => {
  const [mindFileUrl, setMindFileUrl] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isCompiling, setIsCompiling] = useState(true);
  const [planeAspect, setPlaneAspect] = useState(1);
  const [cameraError, setCameraError] = useState(null);

  // Check for secure context and media device support immediately on mount
  useEffect(() => {
    if (!window.isSecureContext) {
      setCameraError("Trang này chưa chạy trên HTTPS nên trình duyệt chặn Camera. Vui lòng mở liên kết AR qua bản đã deploy chính thức (https://...).");
    } else if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError("Trình duyệt này không hỗ trợ truy cập Camera. Hãy thử Chrome hoặc Safari.");
    }
  }, []);

  useEffect(() => {
    if (cameraError) {
      setIsCompiling(false);
      return;
    }

    let url = null;
    const compileTarget = async () => {
      try {
        const image = new Image();
        image.src = composedImage;
        await new Promise((resolve) => { image.onload = resolve; });

        const aspect = image.naturalWidth / image.naturalHeight;
        setPlaneAspect(aspect);

        // @ts-ignore
        const compiler = new window.MINDAR.IMAGE.Compiler();
        await compiler.compileImageTargets([image], (p) => {
          setProgress(Math.round(p));
        });

        const exportedBuffer = await compiler.exportData();
        const blob = new Blob([exportedBuffer], { type: 'application/octet-stream' });
        url = URL.createObjectURL(blob);
        setMindFileUrl(url);
        setIsCompiling(false);
      } catch (err) {
        console.error('Compiler error:', err);
        alert('Lỗi compile: ' + err.message);
      }
    };

    compileTarget();

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [composedImage, cameraError]);

  const posX = overlayPosX ?? 50;
  const posY = overlayPosY ?? 85;
  const fontSizeVal = overlayFontSize ?? 16;

  // Convert overlay percent to 3D coords based on plane aspect ratio
  const arX = (posX / 100 - 0.5) * 1;
  const arY = (0.5 - posY / 100) * (1 / planeAspect);
  const animToY = arY + 0.05;

  return (
    <div id="ar-container" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1000, background: '#000' }}>
      
      {/* Camera Error Message */}
      {cameraError && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          color: 'white', textAlign: 'center', zIndex: 1002, background: 'rgba(45, 42, 38, 0.95)',
          padding: '2.5rem', borderRadius: '1.5rem', border: '1px solid rgba(245, 197, 66, 0.3)',
          backdropFilter: 'blur(12px)', maxWidth: '90%', width: '400px'
        }}>
          <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '2rem', marginBottom: '0.5rem', color: '#F5C542' }}>
            MoryTory
          </div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#FDFBF7' }}>Không thể mở Camera</h2>
          <p style={{ color: '#FDFBF7', fontSize: '0.9rem', lineHeight: '1.5', margin: '0 0 1.5rem 0' }}>{cameraError}</p>
        </div>
      )}

      {/* MoryTory Branded Loading */}
      {isCompiling && !cameraError && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          color: 'white', textAlign: 'center', zIndex: 1002, background: 'rgba(45, 42, 38, 0.95)',
          padding: '2.5rem', borderRadius: '1.5rem', border: '1px solid rgba(245, 197, 66, 0.3)',
          backdropFilter: 'blur(12px)'
        }}>
          <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '2rem', marginBottom: '0.5rem', color: '#F5C542' }}>
            MoryTory
          </div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#FDFBF7' }}>Đang xử lý ảnh AR... {progress}%</h2>
          <p style={{ color: '#9CAF88', fontSize: '0.9rem' }}>Vui lòng chờ trong giây lát</p>
        </div>
      )}

      {!isCompiling && !cameraError && mindFileUrl && (
        <a-scene 
          mindar-image={`imageTargetSrc: ${mindFileUrl}; autoStart: true; uiLoading: no; uiError: no; uiScanning: no`}
          color-space="sRGB" 
          renderer="colorManagement: true" 
          vr-mode-ui="enabled: false" 
          device-orientation-permission-ui="enabled: false"
        >
          <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>
          <a-entity mindar-image-target="targetIndex: 0">
            {overlayText && (
              <a-image
                src={createTextSvg(overlayText, overlayFont, overlayColor || '#ffffff', fontSizeVal)}
                position={`${arX} ${arY} 0.1`}
                width="1.2"
                height="0.3"
                material="transparent: true"
                animation={`property: position; to: ${arX} ${animToY} 0.1; dir: alternate; dur: 2000; loop: true; easing: easeInOutSine`}
              ></a-image>
            )}

            {/* Custom light-weight particle system */}
            {effect === 'snow' && (
              <a-entity custom-particles="type: snow; count: 150; size: 0.05"></a-entity>
            )}
            {(effect === 'leaves' || effect === 'petals') && (
              <a-entity custom-particles={`type: ${effect}; count: 80; size: 0.1`}></a-entity>
            )}
            {(effect === 'sparkle' || effect === 'fireworks') && (
              <a-entity custom-particles={`type: ${effect}; count: 120; size: 0.05`}></a-entity>
            )}
          </a-entity>
        </a-scene>
      )}

      {/* AR Overlay UI */}
      <div className="ar-overlay-ui" style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 1001 }}>
        <button 
          onClick={onBack} 
          style={{ 
            background: 'rgba(45, 42, 38, 0.85)', 
            backdropFilter: 'blur(16px)',
            padding: '0.75rem 2rem',
            color: '#FDFBF7',
            borderRadius: '9999px',
            border: '1px solid rgba(245, 197, 66, 0.4)',
            cursor: 'pointer',
            fontFamily: '"Inter", sans-serif',
            fontWeight: 500,
            fontSize: '0.95rem',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(45, 42, 38, 0.95)'; e.currentTarget.style.borderColor = 'rgba(245, 197, 66, 0.8)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(45, 42, 38, 0.85)'; e.currentTarget.style.borderColor = 'rgba(245, 197, 66, 0.4)'; }}
        >
          ← Thoát AR
        </button>
      </div>
    </div>
  );
};