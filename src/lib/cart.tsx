import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getProduct, type Product } from "./products";
import { computeTotals } from "./pricing";

const STORAGE_KEY = "servera-cart-v1";

interface CartItem {
  id: string;
  qty: number;
}

interface CartContextValue {
  items: { product: Product; qty: number }[];
  count: number;
  add: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  totals: ReturnType<typeof computeTotals>;
  wishlist: string[];
  toggleWish: (id: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [raw, setRaw] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      if (Array.isArray(saved.items)) setRaw(saved.items);
      if (Array.isArray(saved.wishlist)) setWishlist(saved.wishlist);
    } catch {
      /* ignore corrupted storage */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: raw, wishlist }));
  }, [raw, wishlist, loaded]);

  const add = useCallback((id: string, qty = 1) => {
    setRaw((prev) => {
      const found = prev.find((i) => i.id === id);
      if (found)
        return prev.map((i) => (i.id === id ? { ...i, qty: Math.min(99, i.qty + qty) } : i));
      return [...prev, { id, qty }];
    });
  }, []);
  const setQty = useCallback((id: string, qty: number) => {
    setRaw((prev) =>
      qty <= 0
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) => (i.id === id ? { ...i, qty: Math.min(99, qty) } : i)),
    );
  }, []);
  const remove = useCallback((id: string) => setRaw((prev) => prev.filter((i) => i.id !== id)), []);
  const clear = useCallback(() => setRaw([]), []);
  const toggleWish = useCallback(
    (id: string) =>
      setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
    [],
  );

  const value = useMemo<CartContextValue>(() => {
    const items = raw
      .map((i) => ({ product: getProduct(i.id), qty: i.qty }))
      .filter((i): i is { product: Product; qty: number } => !!i.product);
    const totals = computeTotals(items.map((i) => ({ price: i.product.price, qty: i.qty })));
    return {
      items,
      count: items.reduce((s, i) => s + i.qty, 0),
      add,
      setQty,
      remove,
      clear,
      open,
      setOpen,
      totals,
      wishlist,
      toggleWish,
    };
  }, [raw, open, wishlist, add, setQty, remove, clear, toggleWish]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
