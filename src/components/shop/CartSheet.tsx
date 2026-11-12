import { Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, Truck } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useCart } from "@/lib/cart";
import { FREE_SHIPPING_THRESHOLD, formatPrice } from "@/lib/pricing";

export function QtyControl({ id, qty }: { id: string; qty: number }) {
  const { setQty } = useCart();
  return (
    <div className="inline-flex items-center rounded-sm border">
      <button
        type="button"
        aria-label="Λιγότερα"
        onClick={() => setQty(id, qty - 1)}
        className="p-1.5 hover:bg-secondary"
      >
        <Minus className="size-3" />
      </button>
      <span className="w-7 text-center text-sm font-medium">{qty}</span>
      <button
        type="button"
        aria-label="Περισσότερα"
        onClick={() => setQty(id, qty + 1)}
        className="p-1.5 hover:bg-secondary"
      >
        <Plus className="size-3" />
      </button>
    </div>
  );
}

export function FreeShippingBar() {
  const { totals } = useCart();
  const pct = Math.min(100, (totals.subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  return (
    <div className="rounded-sm bg-surface p-3 text-sm">
      <div className="mb-2 flex items-center gap-2">
        <Truck className="size-4" />
        {totals.remainingForFree > 0 ? (
          <span>
            Σας λείπουν <b>{formatPrice(totals.remainingForFree)}</b> για δωρεάν αποστολή
          </span>
        ) : (
          <span className="font-semibold">Έχετε δωρεάν αποστολή!</span>
        )}
      </div>
      <Progress value={pct} className="h-1.5" />
    </div>
  );
}

export function CartSheet() {
  const { open, setOpen, items, remove, totals, count } = useCart();
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b p-5">
          <SheetTitle>Καλάθι ({count})</SheetTitle>
        </SheetHeader>
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <p className="text-lg font-semibold">Το καλάθι σας είναι άδειο</p>
            <p className="text-sm text-muted-foreground">
              Ανακαλύψτε τις προσφορές μας και βρείτε κάτι που θα αγαπήσετε.
            </p>
            <Button asChild onClick={() => setOpen(false)}>
              <Link to="/category/$slug" params={{ slug: "ekptoseis" }}>
                Δείτε τις προσφορές
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="p-5 pb-0">
              <FreeShippingBar />
            </div>
            <ul className="flex-1 divide-y overflow-y-auto px-5">
              {items.map(({ product: p, qty }) => (
                <li key={p.id} className="flex gap-3 py-4">
                  <img
                    src={p.image}
                    alt=""
                    className="size-20 shrink-0 rounded-sm border object-contain p-1"
                  />
                  <div className="flex flex-1 flex-col gap-1">
                    <p className="text-xs font-bold uppercase">{p.brand}</p>
                    <p className="text-sm leading-snug">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.size}</p>
                    <div className="mt-1 flex items-center justify-between">
                      <QtyControl id={p.id} qty={qty} />
                      <span className="text-sm font-bold">{formatPrice(p.price * qty)}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(p.id)}
                    aria-label="Αφαίρεση"
                    className="self-start p-1 text-muted-foreground hover:text-foreground"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
            <div className="space-y-2 border-t p-5 text-sm">
              <div className="flex justify-between">
                <span>Υποσύνολο</span>
                <span>{formatPrice(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Αποστολή</span>
                <span>{totals.shipping === 0 ? "Δωρεάν" : formatPrice(totals.shipping)}</span>
              </div>
              <div className="flex justify-between text-base font-bold">
                <span>Σύνολο</span>
                <span>{formatPrice(totals.subtotal + totals.shipping)}</span>
              </div>
              <Button asChild size="xl" className="mt-3 w-full" onClick={() => setOpen(false)}>
                <Link to="/checkout">Ολοκλήρωση αγοράς</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
