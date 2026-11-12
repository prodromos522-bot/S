import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/products";
import { ProductCard } from "./ProductCard";

export function ProductRail({
  eyebrow,
  title,
  products,
  linkTo,
}: {
  eyebrow?: string;
  title: string;
  products: Product[];
  linkTo?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) =>
    ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: "smooth" });
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          {eyebrow && <p className="text-sm text-muted-foreground">{eyebrow}</p>}
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          {linkTo && (
            <Link
              to="/category/$slug"
              params={{ slug: linkTo }}
              className="mr-2 text-sm font-semibold underline underline-offset-4"
            >
              Δείτε τα όλα
            </Link>
          )}
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Προηγούμενα"
            className="rounded-full border p-2 hover:bg-secondary"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Επόμενα"
            className="rounded-full border p-2 hover:bg-secondary"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
      <div ref={ref} className="no-scrollbar flex snap-x gap-5 overflow-x-auto pb-2">
        {products.map((p) => (
          <ProductCard
            key={p.id}
            p={p}
            className="w-[44%] shrink-0 snap-start sm:w-[30%] md:w-[22%] lg:w-[18%]"
          />
        ))}
      </div>
    </section>
  );
}
