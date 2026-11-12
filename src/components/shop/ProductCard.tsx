import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { discountPercent, type Product } from "@/lib/products";
import { formatPrice } from "@/lib/pricing";
import { Stars } from "./Stars";
import { cn } from "@/lib/utils";

export function Badges({ p }: { p: Product }) {
  const off = discountPercent(p);
  return (
    <div className="flex flex-wrap gap-1">
      {p.blackFriday && (
        <span className="rounded-sm bg-promo px-1.5 py-0.5 text-[10px] font-bold uppercase leading-tight text-promo-foreground">
          Black Friday
        </span>
      )}
      {off > 0 && (
        <span className="rounded-sm bg-sale px-1.5 py-0.5 text-[10px] font-bold leading-tight text-sale-foreground">
          προσφορά -{off}%
        </span>
      )}
      {p.isNew && (
        <span className="rounded-sm bg-new px-1.5 py-0.5 text-[10px] font-bold leading-tight text-new-foreground">
          Νέο
        </span>
      )}
      {p.freeShipping && (
        <span className="rounded-sm border px-1.5 py-0.5 text-[10px] font-semibold leading-tight">
          Δωρεάν αποστολή
        </span>
      )}
      {p.exclusive && (
        <span className="rounded-sm bg-secondary px-1.5 py-0.5 text-[10px] font-semibold leading-tight">
          Αποκλειστικά SERVERA
        </span>
      )}
    </div>
  );
}

export function ProductCard({ p, className }: { p: Product; className?: string }) {
  const { add, setOpen, wishlist, toggleWish } = useCart();
  const wished = wishlist.includes(p.id);
  return (
    <div className={cn("group relative flex flex-col bg-card", className)}>
      <button
        type="button"
        onClick={() => toggleWish(p.id)}
        aria-label={wished ? "Αφαίρεση από τα αγαπημένα" : "Προσθήκη στα αγαπημένα"}
        className="absolute right-2 top-2 z-10 rounded-full bg-background/80 p-1.5 transition hover:bg-background"
      >
        <Heart className={cn("size-4", wished ? "fill-sale text-sale" : "text-foreground")} />
      </button>
      <Link to="/product/$id" params={{ id: p.id }} className="flex flex-1 flex-col">
        <div className="relative aspect-square overflow-hidden bg-card">
          <img
            src={p.image}
            alt={`${p.brand} ${p.name}`}
            loading="lazy"
            width={816}
            height={816}
            className="h-full w-full object-contain p-4 transition duration-500 group-hover:scale-105"
          />
          <div className="absolute left-2 top-2 max-w-[75%]">
            <Badges p={p} />
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-1 px-1 pt-3">
          <p className="text-sm font-bold uppercase tracking-wide">{p.brand}</p>
          <p className="text-sm font-medium leading-snug">{p.name}</p>
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {p.desc} {p.size}
          </p>
          <Stars rating={p.rating} reviews={p.reviews} />
          <div className="mt-auto flex items-baseline gap-2 pt-2">
            <span className={cn("text-base font-bold", p.oldPrice && "text-sale")}>
              {formatPrice(p.price)}
            </span>
            {p.oldPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(p.oldPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
      <button
        type="button"
        onClick={() => {
          add(p.id);
          toast.success("Προστέθηκε στο καλάθι", {
            description: `${p.brand} ${p.name}`,
            action: { label: "Καλάθι", onClick: () => setOpen(true) },
          });
        }}
        className="mt-3 inline-flex h-9 items-center justify-center gap-2 rounded-sm border border-foreground text-xs font-semibold uppercase tracking-wide transition hover:bg-foreground hover:text-background"
      >
        <ShoppingBag className="size-4" /> Στο καλάθι
      </button>
    </div>
  );
}
