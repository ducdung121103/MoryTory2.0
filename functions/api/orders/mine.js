export async function onRequestGet(context) {
  try {
    // Verify session
    const cookieHeader = context.request.headers.get('Cookie') || '';
    const match = cookieHeader.match(/morytory_session=([^;]+)/);

    if (!match) {
      return new Response(JSON.stringify({ error: 'Not logged in' }), { status: 401 });
    }

    const token = match[1];
    const [payloadB64, signature] = token.split('.');
    if (!payloadB64 || !signature) {
      return new Response(JSON.stringify({ error: 'Invalid session' }), { status: 401 });
    }

    const payload = JSON.parse(atob(payloadB64));
    if (!payload.sub || payload.exp < Date.now() / 1000) {
      return new Response(JSON.stringify({ error: 'Session expired' }), { status: 401 });
    }

    const sessionSecret = context.env.SESSION_SECRET || 'dev-secret';
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(sessionSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    const sigBytes = hexToU8(signature);
    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, encoder.encode(payloadB64));
    if (!valid) {
      return new Response(JSON.stringify({ error: 'Invalid session' }), { status: 401 });
    }

    const userId = payload.sub;

    // Get user's order index
    const indexKey = `user_orders_${userId}`;
    const indexData = await context.env.MORYTORY_ORDERS.get(indexKey);
    const orderIds = indexData ? JSON.parse(indexData) : [];

    // Fetch each order (only safe fields)
    const orders = [];
    for (const id of orderIds) {
      const data = await context.env.MORYTORY_ORDERS.get(`order_${id}`);
      if (data) {
        const full = JSON.parse(data);
        orders.push({
          orderId: full.orderId,
          effect: full.effect,
          overlayText: full.overlayText,
          createdAt: full.createdAt,
        });
      }
    }

    return new Response(JSON.stringify({ orders }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

function hexToU8(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}