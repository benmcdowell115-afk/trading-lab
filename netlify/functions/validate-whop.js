/**
 * Netlify serverless function — validates a Whop license key.
 * The WHOP_API_KEY env var must be set in Netlify → Site Settings → Environment Variables.
 *
 * Whop dashboard → Developer → API Keys → copy the key.
 * Make sure your product type on Whop is set to "License Key" so buyers receive a key.
 */

exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers }
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ valid: false, error: 'Method not allowed' }) }
  }

  let key
  try {
    const body = JSON.parse(event.body ?? '{}')
    key = body.key?.trim()
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ valid: false, error: 'Invalid request body' }) }
  }

  if (!key) {
    return { statusCode: 400, headers, body: JSON.stringify({ valid: false, error: 'No license key provided' }) }
  }

  // Hardcoded test key for staging — remove this block before going live
  if (key === 'TRADINGLAB-TEST-2026') {
    return { statusCode: 200, headers, body: JSON.stringify({ valid: true, status: 'active' }) }
  }

  const apiKey = process.env.WHOP_API_KEY
  if (!apiKey) {
    return { statusCode: 200, headers, body: JSON.stringify({ valid: false, error: 'No license key found. Get access at our Whop page.' }) }
  }

  try {
    // Whop v5 API — validate a license key
    // Docs: https://dev.whop.com/api-reference/v5/license-keys/get-a-license-key
    const res = await fetch(`https://api.whop.com/v5/license_keys/${encodeURIComponent(key)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
      },
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('Whop API error:', res.status, text)
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ valid: false, error: 'License key not found or invalid' }),
      }
    }

    const data = await res.json()

    // status is 'active', 'inactive', 'expired', 'banned', etc.
    const valid = data.status === 'active'

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ valid, status: data.status }),
    }
  } catch (err) {
    console.error('Whop validation error:', err)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ valid: false, error: 'Could not reach Whop — try again' }),
    }
  }
}
