// Netlify Serverless Function: netlify/functions/evolink-proxy.js
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Support CORS preflight OPTIONS request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
      },
      body: ""
    };
  }

  // Load API key securely from Netlify environment variables
  // Fallback to the current key for testing if the env var isn't configured in Netlify yet
  const apiKey = process.env.EVOLINK_API_KEY || "sk-kSt99HfX3dgjEPzvxaWUpTKOOiwiheS2EBtL2OsYnJoF6YBk";
  const baseTarget = "https://api.evolink.ai";

  // The request is proxied from /api/* to this function.
  // The path inside event.path will be "/api/v1/audios/generations" or "/.netlify/functions/evolink-proxy/v1/..."
  let targetPath = event.path;
  
  // Clean up path prefix
  const apiPrefix = "/api";
  const functionPrefix = "/.netlify/functions/evolink-proxy";
  
  if (targetPath.startsWith(apiPrefix)) {
    targetPath = targetPath.substring(apiPrefix.length);
  } else if (targetPath.startsWith(functionPrefix)) {
    targetPath = targetPath.substring(functionPrefix.length);
  }

  // Fallback if path is empty
  if (!targetPath || targetPath === "/") {
    targetPath = event.queryStringParameters.path || "";
  }

  // Re-build query string parameters
  const queryParams = new URLSearchParams(event.queryStringParameters);
  queryParams.delete("path"); // clean up temp path param if any
  const queryString = queryParams.toString();
  
  const targetUrl = `${baseTarget}${targetPath}${queryString ? '?' + queryString : ''}`;
  console.log(`[Proxy] Forwarding to: ${targetUrl}`);

  // Set up headers
  const forwardHeaders = {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": event.headers["content-type"] || "application/json",
    "Accept": "application/json"
  };

  const requestOptions = {
    method: event.httpMethod,
    headers: forwardHeaders
  };

  if (event.httpMethod === "POST" || event.httpMethod === "PUT") {
    requestOptions.body = event.body;
  }

  try {
    const response = await fetch(targetUrl, requestOptions);
    const responseText = await response.text();
    
    // Parse response headers to preserve content-type
    const contentType = response.headers.get("content-type") || "application/json";

    return {
      statusCode: response.status,
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
      },
      body: responseText
    };
  } catch (error) {
    console.error("[Proxy Error] Request failed:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        error: "Failed to proxy request to Evolink API",
        message: error.message
      })
    };
  }
};
