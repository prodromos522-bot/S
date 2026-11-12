import { Star } from "lucide-react";

export function Stars({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="flex items-center gap-1 text-xs text-muted-foreground">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={
              i <= Math.round(rating) ? "size-3 fill-star text-star" : "size-3 text-border"
            }
          />
        ))}
      </div>
      <span className="font-medium text-foreground">
        {rating.toLocaleString("el-GR", { minimumFractionDigits: 1 })}
      </span>
      <span>({reviews})</span>
    </div>
  );
}
