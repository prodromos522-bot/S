import type { PaymentMethod } from "./pricing";

const KEY = "servera-orders-v1";

export interface Order {
  number: string;
  date: string;
  name: string;
  email: string;
  address: string;
  payment: PaymentMethod;
  total: number;
  items: { id: string; brand: string; name: string; qty: number; price: number }[];
  /** PayPal capture id, present only when the order was paid online. */
  paypalCaptureId?: string;
}

export function loadOrders(): Order[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export function saveOrder(order: Order) {
  localStorage.setItem(KEY, JSON.stringify([order, ...loadOrders()]));
}

export function newOrderNumber() {
  return "SV" + Date.now().toString().slice(-8);
}
