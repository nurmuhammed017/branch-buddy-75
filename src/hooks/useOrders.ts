import { useState, useCallback, useEffect } from "react";
import type { Order, OrderStatus } from "@/types/order";
import { STATUSES } from "@/types/order";
import { cacheService } from "@/services/cacheService";
import { storageService } from "@/services/storageService";

function generateId() {
  return "ORD-" + Math.floor(100000 + Math.random() * 900000);
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [source, setSource] = useState<"Cache" | "Storage">("Storage");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadOrders = useCallback(() => {
    const result = cacheService.getOrders();
    setOrders(result.orders);
    setSource(result.source);
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const createOrder = useCallback(
    (data: { senderName: string; receiverName: string; fromBranch: string; toBranch: string; weight: number; cargoList: { categoryName: string; quantity: number }[] }) => {
      if (data.fromBranch === data.toBranch) {
        showMessage("error", "From and To branch cannot be the same");
        return null;
      }
      if (data.weight <= 0) {
        showMessage("error", "Weight must be greater than 0");
        return null;
      }
      if (data.cargoList.length === 0) {
        showMessage("error", "At least one cargo item is required");
        return null;
      }
      if (data.cargoList.some(c => c.quantity <= 0 || !c.categoryName.trim())) {
        showMessage("error", "All cargo items must have a name and quantity > 0");
        return null;
      }
      const now = new Date().toISOString();
      const order: Order = {
        id: generateId(),
        ...data,
        status: "Created",
        timestamps: { Created: now },
        createdAt: now,
      };
      const updated = [...orders, order];
      setOrders(updated);
      cacheService.updateCache(updated);
      storageService.addLog({
        action: "Created",
        orderId: order.id,
        timestamp: now,
        message: `Order ${order.id} created at ${new Date(now).toLocaleString()}`,
      });
      showMessage("success", `Order ${order.id} created successfully`);
      return order;
    },
    [orders]
  );

  const transitionOrder = useCallback(
    (orderId: string, targetStatus: OrderStatus) => {
      const order = orders.find((o) => o.id === orderId);
      if (!order) {
        showMessage("error", `Order ${orderId} not found`);
        return false;
      }
      if (order.status === "Delivered") {
        showMessage("error", `Order ${orderId} is already Delivered and cannot be modified`);
        return false;
      }
      const currentIdx = STATUSES.indexOf(order.status);
      const targetIdx = STATUSES.indexOf(targetStatus);
      if (targetIdx !== currentIdx + 1) {
        showMessage(
          "error",
          `Illegal transition: Cannot move from "${order.status}" to "${targetStatus}"`
        );
        return false;
      }
      const now = new Date().toISOString();
      const updated = orders.map((o) =>
        o.id === orderId
          ? { ...o, status: targetStatus, timestamps: { ...o.timestamps, [targetStatus]: now } }
          : o
      );
      setOrders(updated);
      cacheService.updateCache(updated);
      storageService.addLog({
        action: targetStatus,
        orderId,
        timestamp: now,
        message: `Order ${orderId} moved from ${order.status} to ${targetStatus} at ${new Date(now).toLocaleString()}`,
      });
      showMessage("success", `Order ${orderId} → ${targetStatus}`);
      return true;
    },
    [orders]
  );

  return { orders, source, message, createOrder, transitionOrder, loadOrders };
}
