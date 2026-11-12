# SERVERA roadmap

- [x] Notino-style beauty shop homepage named SERVERA (Greek)
- [x] Working: cart, search, categories, product pages, checkout form
- [x] Payment methods at checkout: card (Visa/Mastercard/Amex), PayPal, Apple Pay, Google Pay, Klarna, IRIS, bank transfer, cash on delivery
- [x] Publish the site (servera-shop.lovable.app)
- [x] Checkout wired to real PayPal checkout (card + PayPal buttons), charging directly through PayPal's own API — no Lovable connector involved
- [ ] (needs user) Create a PayPal REST app at developer.paypal.com and set `VITE_PAYPAL_CLIENT_ID` / `PAYPAL_CLIENT_ID` / `PAYPAL_CLIENT_SECRET` (start in sandbox, switch `PAYPAL_ENV` to "live" when ready)
- [ ] (needs user) Apple Pay, Google Pay, Klarna, IRIS are still "soon" — not wired to any provider yet
- [ ] Orders are still only saved in the visitor's own browser (no backend order storage yet)
