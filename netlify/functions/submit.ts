// Netlify Functions run on Node 18+ where fetch is available globally

export const handler = async (event: any) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "CORS preflight successful" }),
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const appsScriptUrl =
      process.env.APPS_SCRIPT_URL ||
      "https://script.google.com/macros/s/AKfycbw29TxNEwm0ATk9DxeXcbj9eyHEY58tHexqZm3r_Sp94gkaWe6sK7G5zjXS8RQ3qGaqCQ/exec";

    if (!appsScriptUrl) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "APPS_SCRIPT_URL not configured" }),
      };
    }

    const upstreamResponse = await fetch(appsScriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: event.body ?? "{}",
    });

    const text = await upstreamResponse.text();
    // Apps Script returns JSON string; try to pass-through as JSON
    return {
      statusCode: upstreamResponse.status,
      headers,
      body: text,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal Server Error", details: message }),
    };
  }
};
