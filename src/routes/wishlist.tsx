import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/shop/ProductCard";
import { useCart } from "@/lib/cart";
import { products } from "@/lib/products";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Αγαπημένα | SERVERA" },
      { name: "description", content: "Τα αγαπημένα σας προϊόντα στο SERVERA." },
      { property: "og:title", content: "Αγαπημένα | SERVERA" },
      { property: "og:description", content: "Τα αγαπημένα σας προϊόντα στο SERVERA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { wishlist } = useCart();
  const list = products.filter((p) => wishlist.includes(p.id));
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-extrabold tracking-tight">Αγαπημένα</h1>
      {list.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          Δεν έχετε αποθηκεύσει ακόμα προϊόντα. Πατήστε την καρδούλα σε ένα προϊόν για να το
          κρατήσετε εδώ.
          <div>
            <Link to="/" className="mt-4 inline-block font-semibold text-foreground underline">
              Συνεχίστε τις αγορές
            </Link>
          </div>
        </div>
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
