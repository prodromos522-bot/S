import type { PaymentMethod } from "./pricing";

export interface PaymentOption {
  id: PaymentMethod;
  label: string;
  note: string;
  logos: LogoId[];
  /** Not connected to a payment provider yet: shown but not selectable. */
  soon?: boolean;
  /** Paid online through the connected PayPal account. */
  online?: boolean;
}

export type LogoId =
  | "visa"
  | "mastercard"
  | "amex"
  | "maestro"
  | "paypal"
  | "applepay"
  | "googlepay"
  | "klarna"
  | "iris"
  | "bank"
  | "cod";

export const paymentOptions: PaymentOption[] = [
  {
    id: "card",
    label: "Χρεωστική / πιστωτική κάρτα",
    note: "Visa, Mastercard, Maestro, American Express – ασφαλής πληρωμή μέσω PayPal, χωρίς λογαριασμό",
    logos: ["visa", "mastercard", "maestro", "amex"],
    online: true,
  },
  {
    id: "paypal",
    label: "PayPal",
    note: "Πληρώστε με τον λογαριασμό σας PayPal",
    logos: ["paypal"],
    online: true,
  },
  {
    id: "applepay",
    label: "Apple Pay",
    note: "Γρήγορη πληρωμή από iPhone, iPad ή Mac",
    logos: ["applepay"],
    soon: true,
  },
  {
    id: "googlepay",
    label: "Google Pay",
    note: "Γρήγορη πληρωμή από Android ή Chrome",
    logos: ["googlepay"],
    soon: true,
  },
  {
    id: "klarna",
    label: "Klarna – 3 άτοκες δόσεις",
    note: "Πληρώστε σε 3 δόσεις χωρίς τόκο",
    logos: ["klarna"],
    soon: true,
  },
  {
    id: "iris",
    label: "IRIS Payments",
    note: "Άμεση πληρωμή από την τράπεζά σας",
    logos: ["iris"],
    soon: true,
  },
  {
    id: "bank",
    label: "Τραπεζική κατάθεση",
    note: "Η παραγγελία αποστέλλεται μόλις λάβουμε την πληρωμή",
    logos: ["bank"],
  },
  { id: "cod", label: "Αντικαταβολή", note: "Πληρωμή κατά την παραλαβή (+2,00 €)", logos: ["cod"] },
];
