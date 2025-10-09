export const handler = async (event: any) => {
  const allowOrigin = event.headers?.origin || '*';

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': allowOrigin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': allowOrigin,
      },
      body: JSON.stringify({ success: false, error: 'Method not allowed' }),
    };
  }

  try {
    const appsScriptUrl = process.env.APPS_SCRIPT_URL as string;
    if (!appsScriptUrl) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': allowOrigin,
        },
        body: JSON.stringify({ success: false, error: 'APPS_SCRIPT_URL not configured' }),
      };
    }

    const response = await fetch(appsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: event.body,
    });

    const text = await response.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      json = { success: false, error: 'Invalid JSON from Apps Script', raw: text };
    }

    return {
      statusCode: response.ok ? 200 : response.status,
      headers: {
        'Access-Control-Allow-Origin': allowOrigin,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(json),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ success: false, error: err?.message || 'Unknown error' }),
    };
  }
};


