import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getProduct } from "./products";
import { computeTotals } from "./pricing";
import { paypal } from "./paypal.server";

const cartSchema = z.object({
  items: z
    .array(z.object({ id: z.string().min(1).max(100), qty: z.number().int().min(1).max(99) }))
    .min(1)
    .max(100),
});

/** Prices come from the catalogue on the server, never from the browser. */
export const createPaypalOrder = createServerFn({ method: "POST" })
  .inputValidator((d) => cartSchema.parse(d))
  .handler(async ({ data }) => {
    const lines = data.items.map((i) => {
      const p = getProduct(i.id);
      if (!p) throw new Error("Unknown product");
      return { price: p.price, qty: i.qty };
    });
    const totals = computeTotals(lines, "paypal");
    const order = await paypal<{ id: string }>("/v2/checkout/orders", {
      method: "POST",
      headers: { "PayPal-Request-Id": crypto.randomUUID() },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            description: "Παραγγελία SERVERA",
            amount: { currency_code: "EUR", value: totals.total.toFixed(2) },
          },
        ],
        application_context: {
          brand_name: "SERVERA",
          shipping_preference: "NO_SHIPPING",
          locale: "el-GR",
        },
      }),
    });
    return { orderId: order.id };
  });

export const capturePaypalOrder = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ orderId: z.string().regex(/^[A-Z0-9]{8,32}$/) }).parse(d))
  .handler(async ({ data }) => {
    const res = await paypal<{
      status: string;
      purchase_units?: {
        payments?: { captures?: { id: string; status: string; amount: { value: string } }[] };
      }[];
    }>(`/v2/checkout/orders/${data.orderId}/capture`, {
      method: "POST",
      headers: { "PayPal-Request-Id": `capture-${data.orderId}` },
    });
    const capture = res.purchase_units?.[0]?.payments?.captures?.[0];
    if (res.status !== "COMPLETED" || !capture || capture.status !== "COMPLETED") {
      return { ok: false as const };
    }
    return { ok: true as const, captureId: capture.id, amount: Number(capture.amount.value) };
  });
