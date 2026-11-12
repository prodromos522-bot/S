import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Heart, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badges } from "@/components/shop/ProductCard";
import { ProductRail } from "@/components/shop/ProductRail";
import { Stars } from "@/components/shop/Stars";
import { PaymentLogoStrip } from "@/components/shop/PaymentLogos";
import { useCart } from "@/lib/cart";
import { getProduct, products } from "@/lib/products";
import { formatPrice } from "@/lib/pricing";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    const title = p ? `${p.brand} ${p.name} | SERVERA` : "Προϊόν | SERVERA";
    const description = p
      ? `${p.brand} ${p.name} – ${p.desc} ${p.size}. ${formatPrice(p.price)}`
      : "Προϊόν ομορφιάς στο SERVERA.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-7xl px-4 py-20 text-center">
      <p className="text-xl font-bold">Το προϊόν δεν βρέθηκε</p>
      <Link to="/" className="mt-4 inline-block underline">
        Επιστροφή στην αρχική
      </Link>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product: p } = Route.useLoaderData();
  const { add, setOpen, wishlist, toggleWish } = useCart();
  const [qty, setQty] = useState(1);
  const wished = wishlist.includes(p.id);
  const related = products
    .filter((x) => x.id !== p.id && x.categories.some((c) => p.categories.includes(c)))
    .slice(0, 10);
  return (
    <>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-8 md:grid-cols-2">
        <div className="relative aspect-square rounded-sm border bg-card">
          <img
            src={p.image}
            alt={`${p.brand} ${p.name}`}
            width={816}
            height={816}
            className="h-full w-full object-contain p-10"
          />
          <div className="absolute left-4 top-4">
            <Badges p={p} />
          </div>
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-wide">{p.brand}</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight">{p.name}</h1>
          <p className="mt-2 text-muted-foreground">{p.desc}</p>
          <div className="mt-3">
            <Stars rating={p.rating} reviews={p.reviews} />
          </div>
          <p className="mt-5 inline-block rounded-sm border border-foreground px-3 py-1.5 text-sm font-semibold">
            {p.size}
          </p>
          <div className="mt-6 flex items-baseline gap-3">
            <span className={cn("text-3xl font-extrabold", p.oldPrice && "text-sale")}>
              {formatPrice(p.price)}
            </span>
            {p.oldPrice && (
              <span className="text-muted-foreground line-through">{formatPrice(p.oldPrice)}</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Συμπεριλαμβάνεται ΦΠΑ</p>
          <div className="mt-6 flex gap-3">
            <select
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              aria-label="Ποσότητα"
              className="h-12 rounded-sm border bg-background px-3"
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <Button
              size="xl"
              variant="sale"
              className="flex-1"
              onClick={() => {
                add(p.id, qty);
                toast.success("Προστέθηκε στο καλάθι", { description: `${p.brand} ${p.name}` });
                setOpen(true);
              }}
            >
              Προσθήκη στο καλάθι
            </Button>
            <Button
              size="xl"
              variant="outline"
              aria-label="Αγαπημένα"
              onClick={() => toggleWish(p.id)}
            >
              <Heart className={cn(wished && "fill-sale text-sale")} />
            </Button>
          </div>
          <ul className="mt-8 space-y-3 border-t pt-6 text-sm">
            <li className="flex items-center gap-3">
              <Truck className="size-4" /> Παράδοση σε 1–3 εργάσιμες. Δωρεάν αποστολή άνω των 65 €.
            </li>
            <li className="flex items-center gap-3">
              <RotateCcw className="size-4" /> Επιστροφή εντός 90 ημερών
            </li>
            <li className="flex items-center gap-3">
              <ShieldCheck className="size-4" /> 100% γνήσια προϊόντα
            </li>
          </ul>
          <div className="mt-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Πληρώστε με
            </p>
            <PaymentLogoStrip />
          </div>
        </div>
      </div>
      {related.length > 0 && (
        <ProductRail title="Μπορεί να σας αρέσουν επίσης" products={related} />
      )}
    </>
  );
}
