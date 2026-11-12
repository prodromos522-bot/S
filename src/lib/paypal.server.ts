// Talks to PayPal's own REST API directly (no Lovable connector involved), so
// payments keep working on any host as long as PAYPAL_CLIENT_ID/PAYPAL_CLIENT_SECRET
// are set. Set PAYPAL_ENV="live" once you're ready to take real money; it defaults
// to PayPal's sandbox so a missing/forgotten env var can't accidentally charge a
// real card.
const PAYPAL_API_BASE =
  process.env["PAYPAL_ENV"] === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

interface CachedToken {
  token: string;
  expiresAt: number;
}

let cachedToken: CachedToken | null = null;

async function getAccessToken(): Promise<string> {
  const clientId = process.env["PAYPAL_CLIENT_ID"];
  const clientSecret = process.env["PAYPAL_CLIENT_SECRET"];
  if (!clientId || !clientSecret) throw new Error("PayPal is not configured");

  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.token;

  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      // btoa, not Buffer: this also runs on the Cloudflare Workers runtime.
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) {
    const body = await res.text();
    console.error(`PayPal OAuth failed [${res.status}]: ${body}`);
    throw new Error("PayPal authentication failed");
  }
  const data = (await res.json()) as { access_token: string; expires_in: number };
  // Refresh a minute early so a request never races an expiring token.
  cachedToken = { token: data.access_token, expiresAt: Date.now() + (data.expires_in - 60) * 1000 };
  return cachedToken.token;
}

export async function paypal<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await getAccessToken();
  const res = await fetch(`${PAYPAL_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.text();
    console.error(`PayPal request failed [${res.status}] ${path}: ${body}`);
    throw new Error(`PayPal request failed [${res.status}]`);
  }
  return (await res.json()) as T;
}
