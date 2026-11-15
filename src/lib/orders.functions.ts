import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getProduct } from "./products";
import { computeTotals, type PaymentMethod } from "./pricing";
import { getSupabaseAdmin } from "./supabase.server";

const PAYMENT_METHODS = [
  "card",
  "paypal",
  "applepay",
  "googlepay",
  "klarna",
  "iris",
  "bank",
  "cod",
] as const;

const orderInput = z.object({
  number: z.string().min(1).max(20),
  name: z.string().min(1).max(200),
  email: z.string().email().max(200),
  phone: z.string().min(1).max(50),
  address: z.string().min(1).max(500),
  payment: z.enum(PAYMENT_METHODS),
  items: z
    .array(z.object({ id: z.string().min(1).max(100), qty: z.number().int().min(1).max(99) }))
    .min(1)
    .max(100),
  /** Present only when the order was actually paid online through PayPal. */
  paypalCaptureId: z.string().max(64).optional(),
});

/**
 * Persists the order in Supabase so it survives beyond the visitor's own
 * browser (the only place orders lived before). Prices are recomputed here
 * from the catalogue — same principle as the PayPal order creation — so a
 * stored order always reflects real catalogue prices, never whatever the
 * browser happened to send.
 */
export const saveOrderServer = createServerFn({ method: "POST" })
  .inputValidator((d) => orderInput.parse(d))
  .handler(async ({ data }) => {
    const items = data.items.map((i) => {
      const p = getProduct(i.id);
      if (!p) throw new Error("Unknown product");
      return { id: p.id, brand: p.brand, name: p.name, qty: i.qty, price: p.price };
    });
    const totals = computeTotals(
      items.map((i) => ({ price: i.price, qty: i.qty })),
      data.payment as PaymentMethod,
    );

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("orders").insert({
      number: data.number,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      payment: data.payment,
      total: totals.total,
      items,
      paypal_capture_id: data.paypalCaptureId ?? null,
    });
    if (error) {
      console.error("Failed to save order to Supabase:", error.message);
      throw new Error("Could not save the order");
    }
    return { ok: true as const };
  });
