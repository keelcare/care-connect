import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, city, careType, childDetails } = body;

    // Basic Backend Validation
    if (!name || !email || !phone || !city) {
      return NextResponse.json({ error: 'Name, email, phone, and city are required' }, { status: 400 });
    }

    if (name.length > 50 || phone.length > 20 || city.length > 50) {
      return NextResponse.json({ error: 'Invalid input length' }, { status: 400 });
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

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Append to the first sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:G', // Update range for 7 columns
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [new Date().toISOString(), name, email, phone, city, careType || '', childDetails || '']
        ],
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Waitlist API Error:', error);
    return NextResponse.json({ error: 'Failed to join waitlist' }, { status: 500 });
  }
}
