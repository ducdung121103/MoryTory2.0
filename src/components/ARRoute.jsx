import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ARViewer } from './ARViewer';
import { useToast } from '../store/ToastContext';

export default function ARRoute() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const toast = useToast();

  useEffect(() => {
    // Zalo browser warning — use native confirm for critical pre-interaction notice
    if (navigator.userAgent.includes('Zalo')) {
      toast.warning("Trình duyệt Zalo thường chặn Camera AR. Hãy nhấn dấu 3 chấm → 'Mở bằng trình duyệt' (Chrome/Safari).");
    }

    const fetchOrder = async () => {
      const orderId = searchParams.get('orderId');
      if (!orderId) {
        navigate('/');
        return;
      }

      try {
        const response = await fetch(`/api/orders?id=${orderId}`);
        if (!response.ok) {
          throw new Error('Order not found');
        }
        
        const data = await response.json();
        setOrderData(data);
      } catch (err) {
        console.error(err);
        toast.error("Không tìm thấy đơn hàng này!");
        navigate('/');
      }
    };

    fetchOrder();
  }, [searchParams, navigate]);

  if (!orderData) return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center">
        <div className="animate-pulse text-walnut font-serif text-2xl mb-2">MoryTory</div>
        <p className="text-ink-muted">Đang tải trải nghiệm AR...</p>
      </div>
    </div>
  );

  return (
    <ARViewer 
      composedImage={orderData.targetImage} 
      effect={orderData.effect} 
      overlayText={orderData.overlayText}
      overlayFont={orderData.overlayFont}
      overlayColor={orderData.overlayColor}
      overlayFontSize={orderData.overlayFontSize}
      overlayPosX={orderData.overlayPosX}
      overlayPosY={orderData.overlayPosY}
      onBack={() => navigate('/')} 
    />
  );
}