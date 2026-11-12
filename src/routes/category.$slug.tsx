import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { getCategory, productsInCategory } from "@/lib/products";

export const Route = createFileRoute("/category/$slug")({
  loader: ({ params }) => {
    const category = getCategory(params.slug);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.category.label} | SERVERA` : "Κατηγορία | SERVERA";
    const description = loaderData?.category.description ?? "Προϊόντα ομορφιάς στο SERVERA.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-7xl px-4 py-20 text-center">
      <p className="text-xl font-bold">Η κατηγορία δεν βρέθηκε</p>
      <Link to="/" className="mt-4 inline-block underline">
        Επιστροφή στην αρχική
      </Link>
    </div>
  ),
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const list = productsInCategory(category.slug);
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="mb-4 text-xs text-muted-foreground">
        <Link to="/" className="hover:underline">
          Αρχική
        </Link>{" "}
        / <span>{category.label}</span>
      </nav>
      <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{category.label}</h1>
      <p className="mb-6 mt-2 text-muted-foreground">{category.description}</p>
      <ProductGrid key={category.slug} products={list} />
    </div>
  );
}
