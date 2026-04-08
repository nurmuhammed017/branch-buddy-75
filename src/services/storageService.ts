import type { Order, LogEntry } from "@/types/order";

const ORDERS_KEY = "c2c_orders";
const LOGS_KEY = "c2c_logs";

export const storageService = {
  getOrders(): Order[] {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  },
  saveOrders(orders: Order[]) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  },
  getLogs(): LogEntry[] {
    const raw = localStorage.getItem(LOGS_KEY);
    return raw ? JSON.parse(raw) : [];
  },
  saveLogs(logs: LogEntry[]) {
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  },
  addLog(entry: LogEntry) {
    const logs = this.getLogs();
    logs.push(entry);
    this.saveLogs(logs);
  },
};
