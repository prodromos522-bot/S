export const FREE_SHIPPING_THRESHOLD = 65;
export const SHIPPING_COST = 3.9;
export const CASH_ON_DELIVERY_FEE = 2;

export type PaymentMethod =
  "card" | "paypal" | "applepay" | "googlepay" | "klarna" | "iris" | "bank" | "cod";

export interface Line {
  price: number;
  qty: number;
}

export function subtotalOf(lines: Line[]): number {
  return round(lines.reduce((sum, l) => sum + l.price * l.qty, 0));
}

export function shippingFor(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
}

export function computeTotals(lines: Line[], payment: PaymentMethod = "card") {
  const subtotal = subtotalOf(lines);
  const shipping = shippingFor(subtotal);
  const codFee = payment === "cod" && subtotal > 0 ? CASH_ON_DELIVERY_FEE : 0;
  const total = round(subtotal + shipping + codFee);
  const remainingForFree =
    subtotal > FREE_SHIPPING_THRESHOLD ? 0 : round(FREE_SHIPPING_THRESHOLD - subtotal + 0.01);
  return { subtotal, shipping, codFee, total, remainingForFree };
}

function round(n: number) {
  return Math.round(n * 100) / 100;
}

export function formatPrice(n: number): string {
  return n.toLocaleString("el-GR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}
