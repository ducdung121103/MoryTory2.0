export async function onRequestPost(context) {
  try {
    // Verify session
    const cookieHeader = context.request.headers.get('Cookie') || '';
    const match = cookieHeader.match(/morytory_session=([^;]+)/);

    if (!match) {
      return new Response(JSON.stringify({ error: 'Not logged in' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const token = match[1];
    const [payloadB64, signature] = token.split('.');
    if (!payloadB64 || !signature) {
      return new Response(JSON.stringify({ error: 'Invalid session structure' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const payload = JSON.parse(atob(payloadB64));
    if (!payload.sub || payload.exp < Date.now() / 1000) {
      return new Response(JSON.stringify({ error: 'Session expired' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    // Verify signature
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
      return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const userId = payload.sub;
    const { name } = await context.request.json();

    if (!name || !name.trim()) {
      return new Response(JSON.stringify({ error: 'Name cannot be empty' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Fetch user from KV
    const userDataStr = await context.env.MORYTORY_ORDERS.get(`user_${userId}`);
    if (!userDataStr) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    const user = JSON.parse(userDataStr);
    user.name = name.trim();
    user.updatedAt = new Date().toISOString();

    // Save updated user to KV
    await context.env.MORYTORY_ORDERS.put(`user_${userId}`, JSON.stringify(user));

    return new Response(JSON.stringify({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, picture: user.picture }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

function hexToU8(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}
