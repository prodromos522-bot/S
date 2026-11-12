import { Banknote, Landmark } from "lucide-react";
import type { LogoId } from "@/lib/payments";
import { cn } from "@/lib/utils";

/* Brand marks keep their official colours on purpose. */
function Mark({ id }: { id: LogoId }) {
  switch (id) {
    case "visa":
      return (
        <svg viewBox="0 0 48 16" className="h-3.5 w-auto" aria-label="Visa">
          <text
            x="0"
            y="14"
            fontFamily="Arial Black, Arial"
            fontWeight="900"
            fontStyle="italic"
            fontSize="16"
            fill="#1a1f71"
          >
            VISA
          </text>
        </svg>
      );
    case "mastercard":
      return (
        <svg viewBox="0 0 32 20" className="h-5 w-auto" aria-label="Mastercard">
          <circle cx="11" cy="10" r="9" fill="#eb001b" />
          <circle cx="21" cy="10" r="9" fill="#f79e1b" />
          <path d="M16 2.6a9 9 0 0 1 0 14.8 9 9 0 0 1 0-14.8z" fill="#ff5f00" />
        </svg>
      );
    case "maestro":
      return (
        <svg viewBox="0 0 32 20" className="h-5 w-auto" aria-label="Maestro">
          <circle cx="11" cy="10" r="9" fill="#0099df" />
          <circle cx="21" cy="10" r="9" fill="#ed0006" />
          <path d="M16 2.6a9 9 0 0 1 0 14.8 9 9 0 0 1 0-14.8z" fill="#6c6bbd" />
        </svg>
      );
    case "amex":
      return (
        <svg viewBox="0 0 40 20" className="h-5 w-auto" aria-label="American Express">
          <rect width="40" height="20" rx="3" fill="#2e77bc" />
          <text
            x="20"
            y="14"
            textAnchor="middle"
            fontFamily="Arial"
            fontWeight="700"
            fontSize="10"
            fill="#fff"
          >
            AMEX
          </text>
        </svg>
      );
    case "paypal":
      return (
        <svg viewBox="0 0 60 16" className="h-4 w-auto" aria-label="PayPal">
          <text
            x="0"
            y="13"
            fontFamily="Verdana, Arial"
            fontWeight="700"
            fontStyle="italic"
            fontSize="14"
            fill="#003087"
          >
            Pay
          </text>
          <text
            x="29"
            y="13"
            fontFamily="Verdana, Arial"
            fontWeight="700"
            fontStyle="italic"
            fontSize="14"
            fill="#009cde"
          >
            Pal
          </text>
        </svg>
      );
    case "applepay":
      return (
        <svg viewBox="0 0 46 18" className="h-4 w-auto" aria-label="Apple Pay">
          <path
            d="M8.6 4.3c.5-.6.9-1.5.8-2.3-.8 0-1.7.5-2.2 1.2-.5.5-.9 1.4-.8 2.2.8.1 1.7-.4 2.2-1.1zm.8 1.2c-1.2-.1-2.3.7-2.8.7-.6 0-1.5-.7-2.4-.6-1.3 0-2.4.7-3.1 1.9-1.3 2.3-.3 5.6 1 7.4.6.9 1.3 1.9 2.3 1.9.9 0 1.2-.6 2.3-.6s1.4.6 2.3.6c1 0 1.6-.9 2.2-1.8.7-1 1-2 1-2.1 0 0-1.9-.7-1.9-2.9 0-1.8 1.5-2.7 1.6-2.8-.9-1.3-2.2-1.4-2.5-1.5z"
            fill="#000"
          />
          <text
            x="15"
            y="14"
            fontFamily="Helvetica, Arial"
            fontWeight="600"
            fontSize="13"
            fill="#000"
          >
            Pay
          </text>
        </svg>
      );
    case "googlepay":
      return (
        <svg viewBox="0 0 48 18" className="h-4 w-auto" aria-label="Google Pay">
          <text x="0" y="14" fontFamily="Arial" fontWeight="700" fontSize="14">
            <tspan fill="#4285f4">G</tspan>
          </text>
          <text x="13" y="14" fontFamily="Arial" fontWeight="500" fontSize="13" fill="#5f6368">
            Pay
          </text>
        </svg>
      );
    case "klarna":
      return (
        <svg viewBox="0 0 52 20" className="h-5 w-auto" aria-label="Klarna">
          <rect width="52" height="20" rx="5" fill="#ffb3c7" />
          <text
            x="26"
            y="14"
            textAnchor="middle"
            fontFamily="Arial"
            fontWeight="800"
            fontSize="11"
            fill="#17120f"
          >
            Klarna.
          </text>
        </svg>
      );
    case "iris":
      return (
        <svg viewBox="0 0 36 18" className="h-4 w-auto" aria-label="IRIS">
          <text x="0" y="14" fontFamily="Arial" fontWeight="800" fontSize="14" fill="#5b2a86">
            IRIS
          </text>
        </svg>
      );
    case "bank":
      return <Landmark className="size-4" aria-label="Τραπεζική κατάθεση" />;
    case "cod":
      return <Banknote className="size-4" aria-label="Αντικαταβολή" />;
  }
}

export function PaymentLogo({ id, className }: { id: LogoId; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-8 min-w-12 items-center justify-center rounded-sm border bg-card px-2",
        className,
      )}
    >
      <Mark id={id} />
    </span>
  );
}

export const allLogos: LogoId[] = [
  "visa",
  "mastercard",
  "maestro",
  "amex",
  "paypal",
  "applepay",
  "googlepay",
  "klarna",
  "iris",
];

export function PaymentLogoStrip({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {allLogos.map((id) => (
        <PaymentLogo key={id} id={id} />
      ))}
    </div>
  );
}
