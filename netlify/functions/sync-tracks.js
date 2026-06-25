// Netlify Serverless Function: netlify/functions/sync-tracks.js
const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  // Support CORS preflight OPTIONS request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
      },
      body: ""
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed"
    };
  }

  try {
    const tracks = JSON.parse(event.body);
    if (!Array.isArray(tracks)) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ error: "Invalid tracks format. Expected an array." })
      };
    }

    // Resolve cady_radio_tracks_seed.json path relative to the Netlify function location
    const seedPath = path.resolve(__dirname, '../../cady_radio_tracks_seed.json');

    // Security check: Only allow writing to disk in local development environments.
    // Deployed Netlify serverless containers have a read-only filesystem anyway.
    const isLocal = process.env.NETLIFY_DEV === 'true' || fs.existsSync(path.resolve(__dirname, '../../.git'));

    if (!isLocal) {
      console.warn("[Sync Blocked] Track syncing is disabled in production environments.");
      return {
        statusCode: 403,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({
          error: "Action Blocked",
          message: "Track syncing is only available in local development mode."
        })
      };
    }

    // Write the tracks array back to the JSON file
    fs.writeFileSync(seedPath, JSON.stringify(tracks, null, 2), 'utf8');
    console.log(`[Sync Success] Successfully synchronized ${tracks.length} tracks to local seed file.`);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        success: true,
        count: tracks.length,
        path: seedPath
      })
    };
  } catch (err) {
    console.error("[Sync Error] Failed to write tracks to disk:", err);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        error: "Server Error",
        message: err.message
      })
    };
  }
};
