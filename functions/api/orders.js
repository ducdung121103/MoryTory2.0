export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing order ID' }), { status: 400 });
  }

  try {
    const data = await context.env.MORYTORY_ORDERS.get(`order_${id}`);
    if (!data) {
      return new Response(JSON.stringify({ error: 'Order not found' }), { status: 404 });
    }
    
    // Only return AR-related fields (public via QR) — exclude customer info
    const full = JSON.parse(data);
    const safe = {
      orderId: full.orderId,
      targetImage: full.targetImage,
      effect: full.effect,
      overlayText: full.overlayText,
      overlayFont: full.overlayFont,
      overlayFontSize: full.overlayFontSize,
      overlayColor: full.overlayColor,
      overlayPosX: full.overlayPosX ?? 50,
      overlayPosY: full.overlayPosY ?? 85,
      createdAt: full.createdAt,
    };

    return new Response(JSON.stringify(safe), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function onRequestPost(context) {
  try {
    const data = await context.request.json();
    const { orderId, targetImage, effect, overlayText, overlayFont, overlayFontSize, overlayColor,
            overlayPosX, overlayPosY,
            customerName, customerPhone, customerAddress, createdAt } = data;

    if (!orderId || !targetImage) {
      return new Response(JSON.stringify({ error: 'Missing orderId or targetImage' }), { status: 400 });
    }

    const orderData = JSON.stringify({
      orderId,
      targetImage,
      effect: effect || 'snow',
      overlayText: overlayText || '',
      overlayFont: overlayFont || 'serif',
      overlayFontSize: overlayFontSize || 16,
      overlayColor: overlayColor || '#ffffff',
      overlayPosX: overlayPosX ?? 50,
      overlayPosY: overlayPosY ?? 85,
      customerName: customerName || '',
      customerPhone: customerPhone || '',
      customerAddress: customerAddress || '',
      createdAt: createdAt || new Date().toISOString()
    });

    // Check for logged-in user via session cookie
    let userId = null;
    try {
      const cookieHeader = context.request.headers.get('Cookie') || '';
      const match = cookieHeader.match(/morytory_session=([^;]+)/);
      if (match) {
        const token = match[1];
        const [payloadB64, signature] = token.split('.');
        if (payloadB64 && signature) {
          const payload = JSON.parse(atob(payloadB64));
          if (payload.sub && payload.exp > Date.now() / 1000) {
            // Verify signature
            const encoder = new TextEncoder();
            const key = await crypto.subtle.importKey(
              'raw',
              encoder.encode(context.env.SESSION_SECRET || 'dev-secret'),
              { name: 'HMAC', hash: 'SHA-256' },
              false,
              ['verify']
            );
            const valid = await crypto.subtle.verify(
              'HMAC',
              key,
              hexToU8(signature),
              encoder.encode(payloadB64)
            );
            if (valid) {
              userId = payload.sub;
            }
          }
        }
      }
    } catch (e) {
      // Not logged in — fine, guest order
    }

    if (userId) {
      const orderDataObj = JSON.parse(orderData);
      orderDataObj.userId = userId;
      const updated = JSON.stringify(orderDataObj);
      await context.env.MORYTORY_ORDERS.put(`order_${orderId}`, updated, { expirationTtl: 604800 });
      
      // Update user's order index
      const indexKey = `user_orders_${userId}`;
      const existing = await context.env.MORYTORY_ORDERS.get(indexKey);
      const orderIds = existing ? JSON.parse(existing) : [];
      orderIds.push(orderId);
      await context.env.MORYTORY_ORDERS.put(indexKey, JSON.stringify(orderIds), { expirationTtl: 604800 });
    } else {
      await context.env.MORYTORY_ORDERS.put(`order_${orderId}`, orderData, { expirationTtl: 604800 });
    }

    return new Response(JSON.stringify({ success: true, orderId }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}

// Helper: hex string to Uint8Array
function hexToU8(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}