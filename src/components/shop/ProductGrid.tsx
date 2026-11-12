import { useMemo, useState } from "react";
import type { Product } from "@/lib/products";
import { ProductCard } from "./ProductCard";

const sorts = {
  popular: { label: "Δημοφιλέστερα", fn: (a: Product, b: Product) => b.reviews - a.reviews },
  cheap: { label: "Φθηνότερα", fn: (a: Product, b: Product) => a.price - b.price },
  expensive: { label: "Ακριβότερα", fn: (a: Product, b: Product) => b.price - a.price },
  rating: { label: "Καλύτερη βαθμολογία", fn: (a: Product, b: Product) => b.rating - a.rating },
} as const;

export function ProductGrid({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<keyof typeof sorts>("popular");
  const [onlySale, setOnlySale] = useState(false);
  const brandsList = useMemo(() => [...new Set(products.map((p) => p.brand))].sort(), [products]);
  const [brand, setBrand] = useState<string>("");
  const list = useMemo(
    () =>
      products
        .filter((p) => (!onlySale || p.oldPrice) && (!brand || p.brand === brand))
        .sort(sorts[sort].fn),
    [products, sort, onlySale, brand],
  );
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3 border-y py-3 text-sm">
        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          aria-label="Brand"
          className="h-9 rounded-sm border bg-background px-3"
        >
          <option value="">Όλα τα brands</option>
          {brandsList.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={onlySale}
            onChange={(e) => setOnlySale(e.target.checked)}
            className="size-4 accent-sale"
          />
          Μόνο προσφορές
        </label>
        <span className="text-muted-foreground">{list.length} προϊόντα</span>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as keyof typeof sorts)}
          aria-label="Ταξινόμηση"
          className="ml-auto h-9 rounded-sm border bg-background px-3"
        >
          {Object.entries(sorts).map(([k, v]) => (
            <option key={k} value={k}>
              {v.label}
            </option>
          ))}
        </select>
      </div>
      {list.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">
          Δεν βρέθηκαν προϊόντα με αυτά τα φίλτρα.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-5">
          {list.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </div>
  );
}
