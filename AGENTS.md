<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.

<!-- LOVABLE:END -->

## Project rules

- Catalogue lives in `src/lib/products.ts`; cart/wishlist in `src/lib/cart.tsx` (localStorage) — keep shop data static, no DB needed for the catalogue itself.
- Money rules (shipping, fees, totals) only in `src/lib/pricing.ts`, covered by `pricing.test.ts` — keep UI from recomputing totals. Every server-side money path (PayPal order creation, Supabase order persistence) recomputes prices from the catalogue itself — never trusts a price sent by the browser.
- Real payment capture is wired through PayPal's REST API directly (`src/lib/paypal.server.ts`), independent of Lovable's connector gateway — works on any host once `PAYPAL_CLIENT_ID`/`PAYPAL_CLIENT_SECRET`/`VITE_PAYPAL_CLIENT_ID` are set.
- Orders are saved in the visitor's browser (`src/lib/orders.ts`, for the confirmation screen and "my orders" page) **and** centrally in Supabase (`src/lib/orders.functions.ts` → `saveOrderServer`), so they survive beyond that one browser. The Supabase write is server-only (service-role key, never exposed to the browser) and non-blocking: if Supabase isn't configured yet, or the write fails, the customer-facing flow still completes and the failure is only logged. See `supabase/schema.sql` for the table (RLS enabled, no policies — only the server's service-role key can read/write it) and `.env` for the two variables (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) needed to turn it on.
