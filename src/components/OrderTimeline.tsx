import { STATUSES, type Order } from "@/types/order";

export function OrderTimeline({ order }: { order: Order }) {
  const currentIdx = STATUSES.indexOf(order.status);

  return (
    <div className="flex items-center gap-1 flex-wrap mt-2">
      {STATUSES.map((s, i) => {
        const done = i <= currentIdx;
        const ts = order.timestamps[s];
        return (
          <div key={s} className="flex items-center gap-1">
            {i > 0 && (
              <div className={`w-4 h-0.5 ${i <= currentIdx ? "bg-primary" : "bg-border"}`} />
            )}
            <div className="flex flex-col items-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </div>
              <span className={`text-[10px] mt-0.5 ${done ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                {s}
              </span>
              {ts && <span className="text-[9px] text-muted-foreground">{new Date(ts).toLocaleTimeString()}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
