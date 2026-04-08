export const STATUSES = ["Created", "Accepted", "Shipped", "Arrived", "Stored", "Delivered"] as const;
export type OrderStatus = (typeof STATUSES)[number];

export const STATUS_ACTIONS: Record<string, OrderStatus> = {
  Accept: "Accepted",
  Ship: "Shipped",
  Arrive: "Arrived",
  Store: "Stored",
  Deliver: "Delivered",
};

export interface OrderTimestamps {
  Created?: string;
  Accepted?: string;
  Shipped?: string;
  Arrived?: string;
  Stored?: string;
  Delivered?: string;
}

export interface CargoItem {
  categoryName: string;
  quantity: number;
}

export interface Order {
  id: string;
  senderName: string;
  receiverName: string;
  fromBranch: string;
  toBranch: string;
  weight: number;
  cargoList: CargoItem[];
  status: OrderStatus;
  timestamps: OrderTimestamps;
  createdAt: string;
}

export interface LogEntry {
  action: string;
  orderId: string;
  timestamp: string;
  message: string;
}

export const BRANCHES = ["Branch A", "Branch B", "Branch C", "Branch D", "Branch E"];
