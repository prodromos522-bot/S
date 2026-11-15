import { useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FreeShippingBar } from "@/components/shop/CartSheet";
import { PaymentLogo } from "@/components/shop/PaymentLogos";
import { PaypalButton } from "@/components/shop/PaypalButton";
import { useCart } from "@/lib/cart";
import { newOrderNumber, saveOrder, type Order } from "@/lib/orders";
import { saveOrderServer } from "@/lib/orders.functions";
import { paymentOptions } from "@/lib/payments";
import { computeTotals, formatPrice, type PaymentMethod } from "@/lib/pricing";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Ολοκλήρωση αγοράς | SERVERA" },
      {
        name: "description",
        content:
          "Ολοκληρώστε την παραγγελία σας στο SERVERA με κάρτα, PayPal, Apple Pay, Google Pay, Klarna ή αντικαταβολή.",
      },
      { property: "og:title", content: "Ολοκλήρωση αγοράς | SERVERA" },
      { property: "og:description", content: "Ασφαλής ολοκλήρωση παραγγελίας στο SERVERA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

const field =
  "h-11 w-full rounded-sm border border-input bg-background px-3 text-sm outline-none focus:border-foreground";

function CheckoutPage() {
  const { items, clear } = useCart();
  const [payment, setPayment] = useState<PaymentMethod>("card");
  const [done, setDone] = useState<{ number: string; email: string; total: number } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const totals = computeTotals(
    items.map((i) => ({ price: i.product.price, qty: i.qty })),
    payment,
  );
  const onlinePayment = paymentOptions.find((o) => o.id === payment)?.online ?? false;

  function completeOrder(captureId?: string) {
    const form = formRef.current;
    if (!form) return;
    const f = new FormData(form);
    const number = newOrderNumber();
    const order: Order = {
      number,
      date: new Date().toISOString(),
      name: String(f.get("name")),
      email: String(f.get("email")),
      address: `${f.get("address")}, ${f.get("zip")} ${f.get("city")}`,
      payment,
      total: totals.total,
      items: items.map((i) => ({
        id: i.product.id,
        brand: i.product.brand,
        name: i.product.name,
        qty: i.qty,
        price: i.product.price,
      })),
      ...(captureId ? { paypalCaptureId: captureId } : {}),
    };
    saveOrder(order);
    setDone({ number, email: order.email, total: order.total });
    clear();
    window.scrollTo({ top: 0 });

    // Persist centrally too (Supabase), so the order isn't only in this
    // visitor's own browser. The payment itself is already done by this
    // point (captured by PayPal, or "pay on delivery/at the bank" for the
    // other methods), so a failure here must not block the confirmation
    // screen — it's logged for us to notice, not shown to the customer.
    saveOrderServer({
      data: {
        number: order.number,
        name: order.name,
        email: order.email,
        phone: String(f.get("phone")),
        address: order.address,
        payment: order.payment,
        items: items.map((i) => ({ id: i.product.id, qty: i.qty })),
        ...(captureId ? { paypalCaptureId: captureId } : {}),
      },
    }).catch((err: unknown) => {
      console.error("Order", order.number, "was not saved to the backend:", err);
    });
  }

  if (done) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <CheckCircle2 className="mx-auto size-14 text-new-foreground" />
        <h1 className="mt-4 text-3xl font-extrabold">Ευχαριστούμε για την παραγγελία!</h1>
        <p className="mt-3 text-muted-foreground">
          Αριθμός παραγγελίας <b className="text-foreground">{done.number}</b>. Σύνολο{" "}
          {formatPrice(done.total)}. Θα σας ενημερώσουμε στο {done.email}.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild variant="outline">
            <Link to="/account">Οι παραγγελίες μου</Link>
          </Button>
          <Button asChild>
            <Link to="/">Συνέχεια αγορών</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Το καλάθι σας είναι άδειο</h1>
        <Button asChild className="mt-6">
          <Link to="/">Συνέχεια αγορών</Link>
        </Button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      className="mx-auto grid max-w-7xl gap-10 px-4 py-8 lg:grid-cols-[1fr_380px]"
      onSubmit={(e) => {
        e.preventDefault();
        // Online methods (card/PayPal) complete through the PayPal buttons' onApprove
        // callback instead, once the payment is actually captured.
        if (!onlinePayment) completeOrder();
      }}
    >
      <div className="space-y-10">
        <h1 className="text-3xl font-extrabold tracking-tight">Ολοκλήρωση αγοράς</h1>
        <section>
          <h2 className="mb-4 text-lg font-bold">1. Στοιχεία αποστολής</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              name="name"
              required
              placeholder="Ονοματεπώνυμο"
              aria-label="Ονοματεπώνυμο"
              className={field}
            />
            <input
              name="phone"
              required
              type="tel"
              placeholder="Τηλέφωνο"
              aria-label="Τηλέφωνο"
              className={field}
            />
            <input
              name="email"
              required
              type="email"
              placeholder="Email"
              aria-label="Email"
              className={cn(field, "sm:col-span-2")}
            />
            <input
              name="address"
              required
              placeholder="Οδός και αριθμός"
              aria-label="Διεύθυνση"
              className={cn(field, "sm:col-span-2")}
            />
            <input name="city" required placeholder="Πόλη" aria-label="Πόλη" className={field} />
            <input
              name="zip"
              required
              pattern="[0-9 ]{5,6}"
              placeholder="Τ.Κ."
              aria-label="Ταχυδρομικός κώδικας"
              className={field}
            />
          </div>
        </section>
        <section>
          <h2 className="mb-4 text-lg font-bold">2. Τρόπος πληρωμής</h2>
          <div className="space-y-2" role="radiogroup" aria-label="Τρόπος πληρωμής">
            {paymentOptions.map((o) => (
              <label
                key={o.id}
                className={cn(
                  "flex cursor-pointer items-center gap-4 rounded-sm border p-4 transition",
                  payment === o.id ? "border-foreground bg-surface" : "hover:border-foreground/40",
                )}
              >
                <input
                  type="radio"
                  name="payment"
                  value={o.id}
                  checked={payment === o.id}
                  onChange={() => setPayment(o.id)}
                  className="size-4 accent-foreground"
                />
                <span className="flex-1">
                  <span className="block text-sm font-semibold">{o.label}</span>
                  <span className="block text-xs text-muted-foreground">{o.note}</span>
                </span>
                <span className="hidden gap-1 sm:flex">
                  {o.logos.map((l) => (
                    <PaymentLogo key={l} id={l} />
                  ))}
                </span>
              </label>
            ))}
          </div>
          {payment === "bank" && (
            <p className="mt-4 rounded-sm bg-surface p-4 text-sm">
              Θα λάβετε τα στοιχεία του τραπεζικού λογαριασμού στο email σας μετά την παραγγελία.
            </p>
          )}
        </section>
      </div>

      <aside className="h-fit space-y-4 rounded-sm border p-5 lg:sticky lg:top-40">
        <h2 className="text-lg font-bold">Η παραγγελία σας</h2>
        <ul className="divide-y text-sm">
          {items.map(({ product: p, qty }) => (
            <li key={p.id} className="flex items-center gap-3 py-3">
              <img src={p.image} alt="" className="size-12 rounded-sm border object-contain p-1" />
              <span className="flex-1">
                {qty}× <b>{p.brand}</b> {p.name}
              </span>
              <span className="font-semibold">{formatPrice(p.price * qty)}</span>
            </li>
          ))}
        </ul>
        <FreeShippingBar />
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Υποσύνολο</span>
            <span>{formatPrice(totals.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Αποστολή</span>
            <span>{totals.shipping === 0 ? "Δωρεάν" : formatPrice(totals.shipping)}</span>
          </div>
          {totals.codFee > 0 && (
            <div className="flex justify-between">
              <span>Αντικαταβολή</span>
              <span>{formatPrice(totals.codFee)}</span>
            </div>
          )}
          <div className="flex justify-between border-t pt-3 text-lg font-extrabold">
            <span>Σύνολο</span>
            <span>{formatPrice(totals.total)}</span>
          </div>
        </div>
        {onlinePayment ? (
          <PaypalButton
            key={payment}
            funding={payment === "card" ? "card" : "paypal"}
            items={items.map((i) => ({ id: i.product.id, qty: i.qty }))}
            validate={() => formRef.current?.reportValidity() ?? false}
            onPaid={(captureId) => completeOrder(captureId)}
          />
        ) : (
          <Button type="submit" size="xl" variant="sale" className="w-full">
            <Lock /> Ολοκλήρωση παραγγελίας
          </Button>
        )}
        <p className="text-center text-xs text-muted-foreground">
          Ασφαλής πληρωμή · Επιστροφή εντός 90 ημερών
        </p>
      </aside>
    </form>
  );
}
