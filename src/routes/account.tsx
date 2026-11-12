import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { loadOrders, type Order } from "@/lib/orders";
import { paymentOptions } from "@/lib/payments";
import { formatPrice } from "@/lib/pricing";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Οι παραγγελίες μου | SERVERA" },
      { name: "description", content: "Δείτε τις παραγγελίες σας στο SERVERA." },
      { property: "og:title", content: "Οι παραγγελίες μου | SERVERA" },
      { property: "og:description", content: "Δείτε τις παραγγελίες σας στο SERVERA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => setOrders(loadOrders()), []);
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-extrabold tracking-tight">Οι παραγγελίες μου</h1>
      {orders.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          Δεν έχετε κάνει ακόμα παραγγελία.{" "}
          <Link to="/" className="font-semibold text-foreground underline">
            Ξεκινήστε τις αγορές
          </Link>
        </p>
      ) : (
        <ul className="space-y-4">
          {orders.map((o) => (
            <li key={o.number} className="rounded-sm border p-5">
              <div className="flex flex-wrap justify-between gap-2">
                <p className="font-bold">Παραγγελία {o.number}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(o.date).toLocaleString("el-GR")}
                </p>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {paymentOptions.find((p) => p.id === o.payment)?.label} · {o.address}
              </p>
              <ul className="mt-3 space-y-1 text-sm">
                {o.items.map((i) => (
                  <li key={i.id} className="flex justify-between">
                    <span>
                      {i.qty}× {i.brand} {i.name}
                    </span>
                    <span>{formatPrice(i.price * i.qty)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 border-t pt-3 text-right font-bold">
                Σύνολο {formatPrice(o.total)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
