import { NextResponse } from 'next/server';
import { GoogleAuth } from 'google-auth-library';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, city, childDetails } = body;

    if (!name || !email || !phone || !city) {
      return NextResponse.json({ error: 'Name, email, phone, and city are required' }, { status: 400 });
    }

    const credentials = {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // handle newlines in env vars
    };

    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    if (!credentials.client_email || !credentials.private_key || !spreadsheetId) {
      console.error('Missing Google Sheets API credentials');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const auth = new GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const client = await auth.getClient();
    const token = await client.getAccessToken();

    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A:F:append?valueInputOption=USER_ENTERED`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [
          [new Date().toISOString(), name, email, phone, city, childDetails || '']
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.statusText}`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Waitlist API Error:', error);
    return NextResponse.json({ error: 'Failed to join waitlist' }, { status: 500 });
  }
}
