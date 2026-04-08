import { useState } from "react";
import type { Order, OrderStatus } from "@/types/order";
import { STATUSES } from "@/types/order";
import { OrderTimeline } from "./OrderTimeline";

interface Props {
  orders: Order[];
  onTransition: (orderId: string, targetStatus: OrderStatus) => boolean;
  workerBranch: string;
}

const SENDER_ACTIONS: { label: string; target: OrderStatus }[] = [
  { label: "Accept", target: "Accepted" },
  { label: "Ship", target: "Shipped" },
];

const RECEIVER_ACTIONS: { label: string; target: OrderStatus }[] = [
  { label: "Arrived", target: "Arrived" },
  { label: "Store", target: "Stored" },
  { label: "Deliver", target: "Delivered" },
];

export function WorkerPanel({ orders, onTransition, workerBranch }: Props) {
  const [orderId, setOrderId] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleLookup = () => {
    const id = orderId.trim().toUpperCase();
    const found = orders.find((o) => o.id === id) || null;
    setSelectedOrder(found);
  };

  const handleAction = (target: OrderStatus) => {
    const id = orderId.trim().toUpperCase();
    if (!id) return;
    onTransition(id, target);
    setSelectedOrder(orders.find((o) => o.id === id) || null);
  };

  // Determine role for this order relative to worker's branch
  const isSenderBranch = selectedOrder?.fromBranch === workerBranch;
  const isReceiverBranch = selectedOrder?.toBranch === workerBranch;

  const availableActions = selectedOrder
    ? [
        ...(isSenderBranch ? SENDER_ACTIONS : []),
        ...(isReceiverBranch ? RECEIVER_ACTIONS : []),
      ].filter((a) => {
        const currentIdx = STATUSES.indexOf(selectedOrder.status);
        const targetIdx = STATUSES.indexOf(a.target);
        return targetIdx === currentIdx + 1;
      })
    : [];

  // Orders relevant to this branch
  const branchOrders = orders.filter(
    (o) => o.fromBranch === workerBranch || o.toBranch === workerBranch
  );

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Панель работника</h3>
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-medium">
            🏢 {workerBranch}
          </span>
        </div>

        <div className="flex gap-2">
          <input
            className="border border-input rounded-md px-3 py-2 text-sm bg-background flex-1 font-mono"
            placeholder="Введите ID заказа (напр. ORD-123456)"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLookup()}
          />
          <button onClick={handleLookup} className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md text-sm font-medium transition-colors">
            Найти
          </button>
        </div>

        {selectedOrder && (
          <div className="mt-4 space-y-3">
            <div className="border border-border rounded-md p-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-muted-foreground">ID:</span> <span className="font-mono font-bold">{selectedOrder.id}</span></div>
                <div><span className="text-muted-foreground">Статус:</span> <span className="font-medium">{selectedOrder.status}</span></div>
                <div><span className="text-muted-foreground">Отправитель:</span> {selectedOrder.senderName}</div>
                <div><span className="text-muted-foreground">Получатель:</span> {selectedOrder.receiverName}</div>
                <div><span className="text-muted-foreground">Вес:</span> {selectedOrder.weight} кг</div>
                <div><span className="text-muted-foreground">Грузы:</span> {selectedOrder.cargoList?.length || 0} поз.</div>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className={`px-2 py-0.5 rounded font-medium ${isSenderBranch ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                  📦 {selectedOrder.fromBranch} {isSenderBranch && "(вы)"}
                </span>
                <span className="text-muted-foreground">→</span>
                <span className={`px-2 py-0.5 rounded font-medium ${isReceiverBranch ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground"}`}>
                  📬 {selectedOrder.toBranch} {isReceiverBranch && "(вы)"}
                </span>
              </div>
              {selectedOrder.cargoList && selectedOrder.cargoList.length > 0 && (
                <div className="mt-2 bg-muted/50 rounded p-2">
                  <p className="text-[10px] text-muted-foreground font-medium mb-1">Список грузов:</p>
                  {selectedOrder.cargoList.map((c, i) => (
                    <div key={i} className="text-xs flex justify-between">
                      <span>{c.categoryName}</span>
                      <span className="text-muted-foreground">× {c.quantity}</span>
                    </div>
                  ))}
                </div>
              )}

              {!isSenderBranch && !isReceiverBranch && (
                <p className="text-xs text-destructive mt-2 font-medium">⚠ Этот заказ не относится к вашему филиалу</p>
              )}
            </div>

            {availableActions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {availableActions.map((a) => (
                  <button
                    key={a.target}
                    onClick={() => handleAction(a.target)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            )}

            <OrderTimeline order={selectedOrder} />
          </div>
        )}
      </div>

      {/* Branch orders list */}
      <div className="bg-card border border-border rounded-lg p-5">
        <h3 className="text-lg font-semibold mb-3">Заказы филиала ({branchOrders.length})</h3>
        {branchOrders.length === 0 ? (
          <p className="text-sm text-muted-foreground">Нет заказов</p>
        ) : (
          <div className="space-y-2">
            {branchOrders.map((o) => (
              <div
                key={o.id}
                className="flex items-center justify-between border border-border rounded-md p-2 text-sm cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => { setOrderId(o.id); setSelectedOrder(o); }}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs">{o.id}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                    o.fromBranch === workerBranch ? "bg-primary/10 text-primary" : "bg-green-500/10 text-green-600"
                  }`}>
                    {o.fromBranch === workerBranch ? "Отправка" : "Приём"}
                  </span>
                </div>
                <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{o.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
