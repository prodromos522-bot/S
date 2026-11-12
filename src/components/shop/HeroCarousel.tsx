import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import heroBf from "@/assets/hero-black-friday.jpg";
import heroXmas from "@/assets/hero-christmas.jpg";
import heroK from "@/assets/hero-kbeauty.jpg";

const slides = [
  {
    img: heroBf,
    dark: true,
    kicker: "Black Friday",
    title: "Έως -40% σε αρώματα & καλλυντικά",
    text: "Επιπλέον -20% με τον κωδικό bfsale σε επιλεγμένα brands.",
    cta: "Αγοράστε",
    slug: "black-friday",
  },
  {
    img: heroXmas,
    dark: false,
    kicker: "Δώρα Χριστουγέννων",
    title: "Τα πιο όμορφα δώρα της χρονιάς",
    text: "Σετ δώρου, ημερολόγια και δωρεάν συσκευασία δώρου.",
    cta: "Εξερευνήστε",
    slug: "dora",
  },
  {
    img: heroK,
    dark: false,
    kicker: "K-Beauty",
    title: "Λάμψη αλά κορεάτικα",
    text: "Οροί, μάσκες και κρέμες από τα αγαπημένα κορεάτικα brands.",
    cta: "Ανακαλύψτε",
    slug: "k-beauty",
  },
];

export function HeroCarousel() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, []);
  const s = slides[i] ?? slides[0]!;
  return (
    <section className="mx-auto max-w-7xl px-4 pt-6">
      <div className="relative overflow-hidden rounded-sm">
        {slides.map((sl, idx) => (
          <img
            key={sl.slug}
            src={sl.img}
            alt=""
            width={1600}
            height={640}
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
              idx === i ? "opacity-100" : "opacity-0",
            )}
          />
        ))}
        <div className={cn("absolute inset-0", s.dark ? "bg-hero-fade" : "bg-hero-fade-light")} />
        <div
          className={cn(
            "relative flex min-h-[340px] flex-col justify-center gap-4 p-8 md:min-h-[440px] md:max-w-xl md:p-14",
            s.dark ? "text-ink-foreground" : "text-foreground",
          )}
        >
          <p
            className={cn(
              "text-sm font-bold uppercase tracking-[0.2em]",
              s.dark ? "text-promo-foreground" : "text-sale",
            )}
          >
            {s.kicker}
          </p>
          <h1 className="text-3xl font-extrabold leading-tight md:text-5xl">{s.title}</h1>
          <p className="text-base opacity-90 md:text-lg">{s.text}</p>
          <div>
            <Button asChild size="xl" variant={s.dark ? "inverse" : "default"}>
              <Link to="/category/$slug" params={{ slug: s.slug }}>
                {s.cta}
              </Link>
            </Button>
          </div>
        </div>
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          <button
            type="button"
            aria-label="Προηγούμενο"
            onClick={() => setI((i - 1 + slides.length) % slides.length)}
            className="rounded-full bg-background/90 p-2"
          >
            <ChevronLeft className="size-4" />
          </button>
          {slides.map((sl, idx) => (
            <button
              key={sl.slug}
              type="button"
              aria-label={`Διαφάνεια ${idx + 1}`}
              onClick={() => setI(idx)}
              className={cn(
                "h-1.5 rounded-full bg-background transition-all",
                idx === i ? "w-6" : "w-1.5 opacity-60",
              )}
            />
          ))}
          <button
            type="button"
            aria-label="Επόμενο"
            onClick={() => setI((i + 1) % slides.length)}
            className="rounded-full bg-background/90 p-2"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
