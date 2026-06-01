import { NextResponse } from 'next/server';

// ---------------------------------------------------------------------------
// Lightweight Google Sheets append — no googleapis SDK required.
// Uses the Web Crypto API (Node 18+ built-in) to sign a service-account JWT,
// exchanges it for an OAuth2 bearer token, then calls the Sheets REST API.
// ---------------------------------------------------------------------------

/** Base64-URL encode a Buffer or ArrayBuffer (no padding). */
function b64url(buf: Buffer | ArrayBuffer): string {
  const bytes = buf instanceof Buffer ? buf : Buffer.from(new Uint8Array(buf));
  return bytes
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/** Sign a JWT with the service-account RSA private key (PKCS#8 PEM). */
async function signJwt(payload: object, pemKey: string): Promise<string> {
  const header = { alg: 'RS256', typ: 'JWT' };

  const encHeader  = b64url(Buffer.from(JSON.stringify(header)));
  const encPayload = b64url(Buffer.from(JSON.stringify(payload)));
  const signingInput = `${encHeader}.${encPayload}`;

  // Strip PEM armor and decode
  const pemBody = pemKey
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s+/g, '');
  const keyBuffer = Buffer.from(pemBody, 'base64');

  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    keyBuffer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    Buffer.from(signingInput),
  );

  return `${signingInput}.${b64url(signature)}`;
}

/** Exchange a signed JWT for a Google OAuth2 access token. */
async function getAccessToken(clientEmail: string, privateKey: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const jwt = await signJwt(
    {
      iss: clientEmail,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    },
    privateKey,
  );

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to get access token: ${err}`);
  }

  const { access_token } = await res.json();
  return access_token as string;
}

/** Append a row to a Google Sheet via the REST API. */
async function appendRow(
  spreadsheetId: string,
  range: string,
  values: unknown[],
  accessToken: string,
): Promise<void> {
  const url = new URL(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append`,
  );
  url.searchParams.set('valueInputOption', 'USER_ENTERED');

  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values: [values] }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Sheets append failed: ${err}`);
  }
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, city, careType, childDetails } = body;

    // Basic backend validation
    if (!name || !email || !phone || !city) {
      return NextResponse.json(
        { error: 'Name, email, phone, and city are required' },
        { status: 400 },
      );
    }

    if (name.length > 50 || city.length > 50) {
      return NextResponse.json({ error: 'Invalid input length' }, { status: 400 });
    }

    // Validate phone is exactly +91 followed by 10 digits
    if (!phone || !/^\+91\d{10}$/.test(phone)) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
    }

    const clientEmail    = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey     = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const spreadsheetId  = process.env.GOOGLE_SPREADSHEET_ID;

    if (!clientEmail || !privateKey || !spreadsheetId) {
      console.error('Missing Google Sheets API credentials');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const accessToken = await getAccessToken(clientEmail, privateKey);

    await appendRow(
      spreadsheetId,
      'Sheet1!A:G',
      [new Date().toISOString(), name, email, phone, city, careType || '', childDetails || ''],
      accessToken,
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Waitlist API Error:', error);
    return NextResponse.json({ error: 'Failed to join waitlist' }, { status: 500 });
  }
}

