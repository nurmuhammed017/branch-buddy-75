import { useState } from "react";
import type { Order, OrderStatus } from "@/types/order";
import { STATUSES } from "@/types/order";
import { OrderTimeline } from "./OrderTimeline";
import { storageService } from "@/services/storageService";

interface Props {
  orders: Order[];
}

export function AdminPanel({ orders }: Props) {
  const [searchId, setSearchId] = useState("");
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "All">("All");
  const [showLogs, setShowLogs] = useState(false);

  const logs = storageService.getLogs();

  const filtered = orders.filter((o) => {
    const matchId = !searchId.trim() || o.id.toLowerCase().includes(searchId.toLowerCase());
    const matchStatus = filterStatus === "All" || o.status === filterStatus;
    return matchId && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-5">
        <h3 className="text-lg font-semibold mb-4">Admin Dashboard</h3>
        <div className="flex flex-wrap gap-3 mb-4">
          <input
            className="border border-input rounded-md px-3 py-2 text-sm bg-background w-56 font-mono"
            placeholder="Search Order ID..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <select
            className="border border-input rounded-md px-3 py-2 text-sm bg-background"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as OrderStatus | "All")}
          >
            <option value="All">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button
            onClick={() => setShowLogs(!showLogs)}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            {showLogs ? "Hide Logs" : "View Logs"}
          </button>
        </div>

        <div className="text-sm text-muted-foreground mb-2">
          {filtered.length} order{filtered.length !== 1 ? "s" : ""} found
        </div>

        {filtered.length === 0 ? (
          <p className="text-muted-foreground text-sm">No orders match the criteria.</p>
        ) : (
          <div className="space-y-3">
            {filtered.map((order) => (
              <div key={order.id} className="border border-border rounded-md p-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold">{order.id}</span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{order.status}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {order.senderName} → {order.receiverName} | {order.fromBranch} → {order.toBranch}
                </p>
                <OrderTimeline order={order} />
              </div>
            ))}
          </div>
        )}
      </div>

      {showLogs && (
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-lg font-semibold mb-3">System Logs</h3>
          {logs.length === 0 ? (
            <p className="text-muted-foreground text-sm">No logs yet.</p>
          ) : (
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {[...logs].reverse().map((log, i) => (
                <p key={i} className="text-xs font-mono text-muted-foreground">
                  {log.message}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
