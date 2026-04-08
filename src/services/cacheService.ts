import type { Order } from "@/types/order";
import { storageService } from "./storageService";

let cache: Order[] | null = null;
let lastSource: "Cache" | "Storage" = "Storage";

export const cacheService = {
  getOrders(): { orders: Order[]; source: "Cache" | "Storage" } {
    if (cache !== null) {
      lastSource = "Cache";
      return { orders: cache, source: "Cache" };
    }
    const orders = storageService.getOrders();
    cache = orders;
    lastSource = "Storage";
    return { orders, source: "Storage" };
  },

  updateCache(orders: Order[]) {
    cache = orders;
    storageService.saveOrders(orders);
  },

  invalidate() {
    cache = null;
  },

  getLastSource() {
    return lastSource;
  },
};
