import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Gift, Heart, Phone, Search, ShoppingBag, Truck, User, Package } from "lucide-react";
import { useCart } from "@/lib/cart";
import { categories } from "@/lib/products";
import { formatPrice } from "@/lib/pricing";
import { cn } from "@/lib/utils";

const perks = [
  { icon: Truck, strong: "Δωρεάν αποστολή", text: "για αγορές αξίας άνω των 65 €" },
  { icon: Package, strong: "Το Discovery Box μου:", text: "5 δείγματα της επιλογής σας" },
  { icon: Gift, strong: "Υπέροχα δώρα", text: "με τις αγορές σας" },
];

export function SiteHeader() {
  const { count, setOpen, totals, wishlist } = useCart();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  return (
    <header className="sticky top-0 z-40 bg-background">
      <div className="overflow-hidden bg-ink text-ink-foreground">
        <div className="flex w-max animate-marquee gap-12 py-2 text-xs md:hidden">
          {[...perks, ...perks].map((p, i) => (
            <span key={i} className="flex items-center gap-2 whitespace-nowrap">
              <p.icon className="size-3.5" /> <b>{p.strong}</b> {p.text}
            </span>
          ))}
        </div>
        <div className="mx-auto hidden max-w-7xl items-center justify-between px-4 py-2 text-xs md:flex">
          <div className="flex gap-8">
            {perks.map((p) => (
              <span key={p.strong} className="flex items-center gap-2">
                <p.icon className="size-3.5" /> <b>{p.strong}</b> {p.text}
              </span>
            ))}
          </div>
          <span className="flex items-center gap-2">
            <Phone className="size-3.5" /> Καλέστε 211 234 1002
          </span>
        </div>
      </div>

      <div className="border-b">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 md:gap-8">
          <Link
            to="/"
            className="logo-wordmark shrink-0 text-xl md:text-2xl"
            aria-label="SERVERA αρχική"
          >
            SERVERA
          </Link>
          <form
            role="search"
            className="relative hidden flex-1 md:block"
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: "/search", search: { q: q.trim() } });
            }}
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Αναζητήστε κατηγορία, προϊόν, brand..."
              aria-label="Αναζήτηση"
              className="h-11 w-full rounded-full border border-input bg-surface pl-5 pr-12 text-sm outline-none transition focus:border-foreground focus:bg-background"
            />
            <button
              type="submit"
              aria-label="Αναζήτηση"
              className="absolute right-1.5 top-1.5 rounded-full bg-primary p-2 text-primary-foreground"
            >
              <Search className="size-4" />
            </button>
          </form>
          <nav className="ml-auto flex items-center gap-1 md:gap-3">
            <Link
              to="/account"
              className="flex flex-col items-center rounded-sm px-2 py-1 text-[11px] hover:bg-secondary"
            >
              <User className="size-5" />
              <span className="hidden md:block">Λογαριασμός</span>
            </Link>
            <Link
              to="/wishlist"
              className="relative flex flex-col items-center rounded-sm px-2 py-1 text-[11px] hover:bg-secondary"
            >
              <Heart className="size-5" />
              <span className="hidden md:block">Αγαπημένα</span>
              {wishlist.length > 0 && (
                <span className="absolute right-1 top-0 grid size-4 place-items-center rounded-full bg-sale text-[9px] font-bold text-sale-foreground">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="relative flex items-center gap-2 rounded-sm px-2 py-1 hover:bg-secondary"
            >
              <ShoppingBag className="size-5" />
              <span className="hidden flex-col items-start text-[11px] leading-tight md:flex">
                <span>Καλάθι</span>
                <b>{formatPrice(totals.subtotal)}</b>
              </span>
              {count > 0 && (
                <span className="absolute left-5 top-0 grid size-4 place-items-center rounded-full bg-sale text-[9px] font-bold text-sale-foreground">
                  {count}
                </span>
              )}
            </button>
          </nav>
        </div>
        <form
          role="search"
          className="relative px-4 pb-3 md:hidden"
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/search", search: { q: q.trim() } });
          }}
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Αναζητήστε προϊόν, brand..."
            aria-label="Αναζήτηση"
            className="h-10 w-full rounded-full border border-input bg-surface pl-4 pr-10 text-sm outline-none"
          />
          <Search className="absolute right-7 top-3 size-4" />
        </form>
      </div>

      <div className="border-b">
        <nav className="no-scrollbar mx-auto flex max-w-7xl gap-6 overflow-x-auto px-4 text-sm">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className={cn(
                "whitespace-nowrap border-b-2 border-transparent py-3 font-medium transition hover:border-foreground",
                c.highlight && "text-sale",
              )}
              activeProps={{ className: "border-foreground" }}
            >
              {c.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
