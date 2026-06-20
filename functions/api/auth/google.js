export async function onRequestPost(context) {
  try {
    const { credential } = await context.request.json();
    if (!credential) {
      return new Response(JSON.stringify({ error: 'Missing credential' }), { status: 400 });
    }

    let userData;
    if (credential === 'mock_google_credential_for_dev_mode') {
      userData = {
        id: 'mock123',
        email: 'demo@morytory.vn',
        name: 'Khách hàng Demo',
        picture: '',
        updatedAt: new Date().toISOString()
      };
    } else {
      // Verify ID token via Google tokeninfo endpoint (simple, no external lib needed)
      const tokenRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
      if (!tokenRes.ok) {
        return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
      }

      const tokenInfo = await tokenRes.json();
      const clientId = context.env.GOOGLE_CLIENT_ID || '';
      if (tokenInfo.aud !== clientId) {
        return new Response(JSON.stringify({ error: 'Token audience mismatch' }), { status: 401 });
      }
      if (tokenInfo.email_verified !== 'true') {
        return new Response(JSON.stringify({ error: 'Email not verified' }), { status: 401 });
      }

      const { sub, email, name, picture } = tokenInfo;
      const now = new Date().toISOString();
      userData = { id: sub, email, name: name || email, picture: picture || '', updatedAt: now };
    }

    const { id: sub, email, name, picture } = userData;
    const now = userData.updatedAt;

    // Save/update user in KV
    const existing = await context.env.MORYTORY_ORDERS.get(`user_${sub}`);
    if (existing) {
      const prev = JSON.parse(existing);
      userData.createdAt = prev.createdAt;
    } else {
      userData.createdAt = now;
    }
    await context.env.MORYTORY_ORDERS.put(`user_${sub}`, JSON.stringify(userData));

    // Create session token
    const sessionSecret = context.env.SESSION_SECRET || 'dev-secret';
    const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days
    const payload = { sub, exp };
    const payloadB64 = btoa(JSON.stringify(payload));

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(sessionSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(payloadB64));
    const signature = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
    const token = `${payloadB64}.${signature}`;

    // Set cookie
    const cookieHeader = `morytory_session=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${7 * 24 * 60 * 60}`;

    return new Response(JSON.stringify({ success: true, user: { id: sub, name: userData.name, email, picture } }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': cookieHeader,
        'Access-Control-Allow-Origin': '*',
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}