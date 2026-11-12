import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { capturePaypalOrder, createPaypalOrder } from "@/lib/paypal.functions";

interface PaypalButtonsInstance {
  render: (el: HTMLElement) => Promise<void>;
  close: () => Promise<void>;
  isEligible: () => boolean;
}
interface PaypalNamespace {
  Buttons: (opts: Record<string, unknown>) => PaypalButtonsInstance;
  FUNDING: { PAYPAL: string; CARD: string };
}
declare global {
  interface Window {
    paypal?: PaypalNamespace;
  }
}

let sdkPromise: Promise<PaypalNamespace> | null = null;

function loadSdk(): Promise<PaypalNamespace> {
  if (window.paypal) return Promise.resolve(window.paypal);
  if (sdkPromise) return sdkPromise;
  const clientId = import.meta.env["VITE_PAYPAL_CLIENT_ID"] as string | undefined;
  if (!clientId) return Promise.reject(new Error("PayPal client id missing"));
  sdkPromise = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=EUR&intent=capture&components=buttons&locale=el_GR`;
    s.async = true;
    s.onload = () =>
      window.paypal ? resolve(window.paypal) : reject(new Error("PayPal failed to load"));
    s.onerror = () => {
      sdkPromise = null;
      reject(new Error("PayPal failed to load"));
    };
    document.head.appendChild(s);
  });
  return sdkPromise;
}

export function PaypalButton({
  funding,
  items,
  validate,
  onPaid,
}: {
  funding: "paypal" | "card";
  items: { id: string; qty: number }[];
  validate: () => boolean;
  onPaid: (captureId: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error" | "failed">("loading");
  const createOrder = useServerFn(createPaypalOrder);
  const captureOrder = useServerFn(capturePaypalOrder);
  // Keep latest values without re-rendering the PayPal buttons.
  const latest = useRef({ items, validate, onPaid });
  latest.current = { items, validate, onPaid };

  useEffect(() => {
    let buttons: PaypalButtonsInstance | null = null;
    let cancelled = false;
    setStatus("loading");
    loadSdk()
      .then((pp) => {
        if (cancelled || !ref.current) return;
        buttons = pp.Buttons({
          fundingSource: funding === "card" ? pp.FUNDING.CARD : pp.FUNDING.PAYPAL,
          style: { layout: "vertical", shape: "rect", label: "pay", height: 48 },
          onClick: (_: unknown, actions: { resolve: () => unknown; reject: () => unknown }) =>
            latest.current.validate() ? actions.resolve() : actions.reject(),
          createOrder: async () => {
            const { orderId } = await createOrder({ data: { items: latest.current.items } });
            return orderId;
          },
          onApprove: async (data: { orderID: string }) => {
            const res = await captureOrder({ data: { orderId: data.orderID } });
            if (res.ok) latest.current.onPaid(res.captureId);
            else setStatus("failed");
          },
          onError: () => setStatus("failed"),
        });
        if (!buttons.isEligible()) {
          setStatus("error");
          return;
        }
        ref.current.innerHTML = "";
        return buttons.render(ref.current).then(() => !cancelled && setStatus("ready"));
      })
      .catch(() => !cancelled && setStatus("error"));
    return () => {
      cancelled = true;
      buttons?.close().catch(() => {});
    };
  }, [funding, createOrder, captureOrder]);

  return (
    <div>
      {status === "loading" && <div className="h-12 animate-pulse rounded-sm bg-muted" />}
      {status === "error" && (
        <p className="text-sm text-destructive">
          Η πληρωμή δεν είναι διαθέσιμη αυτή τη στιγμή. Δοκιμάστε άλλο τρόπο πληρωμής.
        </p>
      )}
      {status === "failed" && (
        <p className="mb-2 text-sm text-destructive">
          Η πληρωμή δεν ολοκληρώθηκε. Δεν έγινε χρέωση — δοκιμάστε ξανά.
        </p>
      )}
      <div ref={ref} />
    </div>
  );
}
