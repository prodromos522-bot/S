import { createFileRoute, Link } from "@tanstack/react-router";
import { Gift, RotateCcw, Sparkles, Package, Wand2, Palette } from "lucide-react";
import { HeroCarousel } from "@/components/shop/HeroCarousel";
import { ProductRail } from "@/components/shop/ProductRail";
import { brands, products } from "@/lib/products";
import heroXmas from "@/assets/hero-christmas.jpg";
import heroK from "@/assets/hero-kbeauty.jpg";
import heroBf from "@/assets/hero-black-friday.jpg";
import serum from "@/assets/p-serum.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SERVERA – Αρώματα & Καλλυντικά online" },
      {
        name: "description",
        content:
          "Αρώματα, μακιγιάζ, περιποίηση προσώπου και σώματος στο SERVERA. Προσφορές Black Friday και δωρεάν αποστολή άνω των 65 €.",
      },
      { property: "og:title", content: "SERVERA – Αρώματα & Καλλυντικά online" },
      {
        property: "og:description",
        content: "Προσφορές Black Friday σε αρώματα και καλλυντικά. Δωρεάν αποστολή άνω των 65 €.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const services = [
  {
    icon: Gift,
    title: "Συσκευασία δώρου",
    text: "Εσείς τα επιλέγετε, εμείς τα τυλίγουμε όμορφα για εσάς.",
    cta: "Τυλίξτε το",
    slug: "dora",
  },
  {
    icon: Sparkles,
    title: "Αφιέρωμα στα δώρα",
    text: "Θα σας καθοδηγήσουμε στην επιλογή του τέλειου χριστουγεννιάτικου δώρου.",
    cta: "Εξερευνήστε",
    slug: "dora",
  },
  {
    icon: RotateCcw,
    title: "Επιστροφή εντός 90 ημερών",
    text: "Χάρη στην παρατεταμένη προθεσμία, αποφασίζετε με την ησυχία σας.",
    cta: "Μάθετε περισσότερα",
    slug: "ekptoseis",
  },
];

const tools = [
  {
    icon: Wand2,
    title: "Virtual Try-On",
    text: "Δοκιμάστε προϊόντα online πάνω σας",
    slug: "makigiaz",
  },
  {
    icon: Package,
    title: "Το Discovery Box μου",
    text: "Επιλέξτε 5 δείγματα από 6,50 €",
    slug: "aromata",
  },
  {
    icon: Palette,
    title: "Shade Finder",
    text: "Βρείτε το make-up στην ίδια απόχρωση",
    slug: "makigiaz",
  },
];

const posts = [
  {
    img: heroBf,
    title: "Μακιγιάζ που διαρκεί όλη τη βραδιά: συμβουλές και δοκιμασμένα προϊόντα",
    time: "7΄",
  },
  { img: heroXmas, title: "Οδηγός δώρων: 20 ιδέες ομορφιάς για κάθε προϋπολογισμό", time: "12΄" },
  { img: heroK, title: "K-Beauty ρουτίνα σε 5 βήματα για λαμπερή επιδερμίδα", time: "9΄" },
  { img: serum, title: "Οι καλύτεροι οροί με ρετινόλη: η συντακτική ομάδα διαλέγει", time: "15΄" },
];

function Index() {
  const onSale = products.filter((p) => p.oldPrice);
  const fresh = products.filter((p) => p.isNew);
  const best = products.filter((p) => p.bestseller);
  return (
    <>
      <HeroCarousel />

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="no-scrollbar flex items-center justify-between gap-8 overflow-x-auto border-y py-5">
          {brands.map((b) => (
            <Link
              key={b}
              to="/search"
              search={{ q: b }}
              className="whitespace-nowrap text-lg font-extrabold uppercase tracking-[0.15em] text-muted-foreground transition hover:text-foreground"
            >
              {b}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6">
        <h2 className="mb-5 text-2xl font-bold tracking-tight md:text-3xl">
          Υπηρεσίες που κάνουν τις αγορές σας πιο εύκολες
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {services.map((s) => (
            <Link
              key={s.title}
              to="/category/$slug"
              params={{ slug: s.slug }}
              className="group flex gap-4 rounded-sm bg-surface p-6 transition hover:bg-accent"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-background">
                <s.icon className="size-5" />
              </span>
              <div>
                <p className="font-bold">{s.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
                <p className="mt-3 text-sm font-semibold underline underline-offset-4">{s.cta}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <ProductRail
        eyebrow="Μικρές χαρές που θα εκτιμήσει και το πορτοφόλι σας"
        title="Σε προσφορά αυτή την εβδομάδα"
        products={onSale}
        linkTo="ekptoseis"
      />

      <section className="mx-auto max-w-7xl px-4 py-6">
        <p className="text-sm text-muted-foreground">
          Ο πιο γρήγορος δρόμος για τα προϊόντα που σας ταιριάζουν
        </p>
        <h2 className="mb-5 text-2xl font-bold tracking-tight md:text-3xl">
          Θα σας βοηθήσουμε να επιλέξετε
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {tools.map((t) => (
            <Link
              key={t.title}
              to="/category/$slug"
              params={{ slug: t.slug }}
              className="flex items-center gap-4 rounded-sm border p-5 transition hover:border-foreground"
            >
              <span className="grid size-14 place-items-center rounded-full bg-sale-soft text-sale">
                <t.icon className="size-6" />
              </span>
              <div>
                <p className="text-sm text-muted-foreground">{t.text}</p>
                <p className="text-lg font-bold">{t.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <ProductRail
        eyebrow="Νέες αφίξεις που μόλις έκαναν την εμφάνισή τους"
        title="Νέα στο SERVERA"
        products={fresh}
      />

      <section className="mx-auto max-w-7xl px-4 py-6">
        <Link
          to="/category/$slug"
          params={{ slug: "black-friday" }}
          className="grid overflow-hidden rounded-sm bg-ink text-ink-foreground md:grid-cols-2"
        >
          <img
            src={heroBf}
            alt=""
            loading="lazy"
            width={1600}
            height={640}
            className="h-64 w-full object-cover md:h-full"
          />
          <div className="flex flex-col justify-center gap-3 p-8 md:p-12">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-promo-foreground">
              Black Friday
            </p>
            <p className="text-3xl font-extrabold leading-tight">
              Επωφεληθείτε από μια μεγάλη έκπτωση και απολαύστε υπέροχα δώρα
            </p>
            <p className="opacity-80">
              Με τον κωδικό <b>bfsale</b> σε επιλεγμένα αρώματα.
            </p>
            <span className="mt-2 inline-flex w-fit rounded-sm bg-background px-8 py-3 text-sm font-bold uppercase text-foreground">
              Αγορά τώρα
            </span>
          </div>
        </Link>
      </section>

      <ProductRail
        eyebrow="Δείτε τι είναι δημοφιλές αυτή τη στιγμή"
        title="Τα bestseller μας"
        products={best}
      />

      <section className="mx-auto max-w-7xl px-4 py-10">
        <p className="text-sm text-muted-foreground">
          Το SERVERA γράφει για όλα όσα αξίζουν την προσοχή σας
        </p>
        <h2 className="mb-5 text-2xl font-bold tracking-tight md:text-3xl">Beauty Blog</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {posts.map((p) => (
            <article key={p.title} className="group">
              <div className="aspect-[4/3] overflow-hidden rounded-sm bg-surface">
                <img
                  src={p.img}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Χρόνος ανάγνωσης {p.time}</p>
              <h3 className="mt-1 font-semibold leading-snug">{p.title}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-10 text-center">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          Το online κατάστημα ομορφιάς που σας ταιριάζει
        </h2>
        <p className="mt-4 text-muted-foreground">
          Στο SERVERA θα βρείτε όλα όσα χρειάζεστε για να περιποιηθείτε τον εαυτό σας ή να χαρίσετε
          στους αγαπημένους σας κάτι ξεχωριστό. Ανακαλύψτε προϊόντα περιποίησης προσώπου, σώματος
          και μαλλιών, μακιγιάζ καθώς και αρώματα από περισσότερα από 1.800 brands. Κι αν αλλάξετε
          γνώμη; Επιστρέψτε το προϊόν σας μέσα σε 90 ημέρες.
        </p>
      </section>
    </>
  );
}
