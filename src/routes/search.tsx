import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { searchProducts } from "@/lib/products";

export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>): { q?: string | undefined } => ({
    q: typeof s["q"] === "string" ? s["q"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Αναζήτηση | SERVERA" },
      { name: "description", content: "Αναζητήστε αρώματα, καλλυντικά και brands στο SERVERA." },
      { property: "og:title", content: "Αναζήτηση | SERVERA" },
      {
        property: "og:description",
        content: "Αναζητήστε αρώματα, καλλυντικά και brands στο SERVERA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q = "" } = Route.useSearch();
  const results = searchProducts(q);
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-extrabold tracking-tight">
        {q ? <>Αποτελέσματα για «{q}»</> : "Αναζήτηση"}
      </h1>
      {results.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-muted-foreground">
            {q
              ? "Δεν βρέθηκαν προϊόντα. Δοκιμάστε άλλη λέξη."
              : "Γράψτε προϊόν ή brand στο πεδίο αναζήτησης."}
          </p>
          <Link
            to="/category/$slug"
            params={{ slug: "ekptoseis" }}
            className="mt-4 inline-block font-semibold underline"
          >
            Δείτε τις προσφορές
          </Link>
        </div>
      ) : (
        <div className="mt-6">
          <ProductGrid key={q} products={results} />
        </div>
      )}
    </div>
  );
}
