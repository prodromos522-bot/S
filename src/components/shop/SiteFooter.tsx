import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { PaymentLogoStrip } from "./PaymentLogos";

const columns: { title: string; links: { label: string; slug: string }[] }[] = [
  {
    title: "Δώρα",
    links: [
      { label: "Δώρα για γυναίκες", slug: "dora" },
      { label: "Δώρα για άντρες", slug: "andres" },
      { label: "Δώρα για παιδιά", slug: "mitera-paidi" },
      { label: "Οδηγός δώρων", slug: "dora" },
    ],
  },
  {
    title: "Αρώματα",
    links: [
      { label: "Γυναικεία αρώματα", slug: "aromata" },
      { label: "Ανδρικά αρώματα", slug: "andres" },
      { label: "Niche αρώματα", slug: "niche" },
      { label: "Ανατολίτικα αρώματα", slug: "anatolitika" },
    ],
  },
  {
    title: "Περιποίηση",
    links: [
      { label: "Επιδερμίδα προσώπου", slug: "prosopo" },
      { label: "K-Beauty", slug: "k-beauty" },
      { label: "Σώμα", slug: "soma" },
      { label: "Μαλλιά", slug: "mallia" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-5">
        <div className="md:col-span-2">
          <Link to="/" className="logo-wordmark text-2xl">
            SERVERA
          </Link>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Το online κατάστημα ομορφιάς σας. Αρώματα, μακιγιάζ και περιποίηση από περισσότερα από
            1.800 brands, με επιστροφή εντός 90 ημερών.
          </p>
          <div className="mt-5 flex gap-3">
            {[Facebook, Instagram, Youtube].map((Icon, i) => (
              <span
                key={i}
                className="grid size-9 place-items-center rounded-full border bg-background"
              >
                <Icon className="size-4" />
              </span>
            ))}
          </div>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <p className="mb-3 text-sm font-bold">{col.title}</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    to="/category/$slug"
                    params={{ slug: l.slug }}
                    className="hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Τρόποι πληρωμής
            </p>
            <PaymentLogoStrip />
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} SERVERA. Με επιφύλαξη παντός δικαιώματος.
          </p>
        </div>
      </div>
    </footer>
  );
}
