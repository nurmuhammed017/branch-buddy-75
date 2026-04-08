import { useState } from "react";
import type { Order, CargoItem } from "@/types/order";
import { BRANCHES } from "@/types/order";
import { OrderTimeline } from "./OrderTimeline";

interface Props {
  orders: Order[];
  onCreateOrder: (data: { senderName: string; receiverName: string; fromBranch: string; toBranch: string; weight: number; cargoList: CargoItem[] }) => Order | null;
  currentUserName: string;
}

export function UserPanel({ orders, onCreateOrder, currentUserName }: Props) {
  const [receiverName, setReceiverName] = useState("");
  const [fromBranch, setFromBranch] = useState(BRANCHES[0]);
  const [toBranch, setToBranch] = useState(BRANCHES[1]);
  const [weight, setWeight] = useState("");
  const [cargoList, setCargoList] = useState<CargoItem[]>([{ categoryName: "", quantity: 1 }]);
  const [searchId, setSearchId] = useState("");

  const handleCreate = () => {
    if (!receiverName.trim()) return;
    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0) return;
    if (cargoList.length === 0) return;
    const result = onCreateOrder({
      senderName: currentUserName,
      receiverName: receiverName.trim(),
      fromBranch,
      toBranch,
      weight: w,
      cargoList,
    });
    if (result) {
      setReceiverName("");
      setWeight("");
      setCargoList([{ categoryName: "", quantity: 1 }]);
    }
  };

  const addCargoItem = () => setCargoList([...cargoList, { categoryName: "", quantity: 1 }]);
  const removeCargoItem = (i: number) => setCargoList(cargoList.filter((_, idx) => idx !== i));
  const updateCargoItem = (i: number, field: keyof CargoItem, value: string | number) => {
    setCargoList(cargoList.map((item, idx) => idx === i ? { ...item, [field]: value } : item));
  };

  const userOrders = orders.filter(
    (o) => o.senderName === currentUserName || o.receiverName === currentUserName
  );

  const searched = searchId.trim()
    ? userOrders.filter((o) => o.id.toLowerCase().includes(searchId.toLowerCase()))
    : userOrders;

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-5">
        <h3 className="text-lg font-semibold mb-4">Создать заказ</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            className="border border-input rounded-md px-3 py-2 text-sm bg-background text-muted-foreground cursor-not-allowed"
            value={currentUserName}
            disabled
          />
          <input
            className="border border-input rounded-md px-3 py-2 text-sm bg-background"
            placeholder="Имя получателя"
            value={receiverName}
            onChange={(e) => setReceiverName(e.target.value)}
          />
          <select className="border border-input rounded-md px-3 py-2 text-sm bg-background" value={fromBranch} onChange={(e) => setFromBranch(e.target.value)}>
            {BRANCHES.map((b) => <option key={b}>{b}</option>)}
          </select>
          <select className="border border-input rounded-md px-3 py-2 text-sm bg-background" value={toBranch} onChange={(e) => setToBranch(e.target.value)}>
            {BRANCHES.map((b) => <option key={b}>{b}</option>)}
          </select>
          <input
            className="border border-input rounded-md px-3 py-2 text-sm bg-background"
            placeholder="Вес (кг)"
            type="number"
            min="0.01"
            step="0.01"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>

        {/* Cargo List */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold">Список грузов</h4>
            <button onClick={addCargoItem} className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground px-2 py-1 rounded transition-colors">
              + Добавить
            </button>
          </div>
          <div className="space-y-2">
            {cargoList.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  className="border border-input rounded-md px-3 py-2 text-sm bg-background flex-1"
                  placeholder="Категория"
                  value={item.categoryName}
                  onChange={(e) => updateCargoItem(i, "categoryName", e.target.value)}
                />
                <input
                  className="border border-input rounded-md px-3 py-2 text-sm bg-background w-20"
                  type="number"
                  min="1"
                  placeholder="Кол-во"
                  value={item.quantity}
                  onChange={(e) => updateCargoItem(i, "quantity", parseInt(e.target.value) || 0)}
                />
                {cargoList.length > 1 && (
                  <button onClick={() => removeCargoItem(i)} className="text-destructive hover:text-destructive/80 text-sm font-bold px-1">
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <button onClick={handleCreate} className="mt-3 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors">
          Создать заказ
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Мои заказы</h3>
          <input
            className="border border-input rounded-md px-3 py-2 text-sm bg-background w-48"
            placeholder="Поиск по ID..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
        </div>
        {searched.length === 0 ? (
          <p className="text-muted-foreground text-sm">Заказов нет.</p>
        ) : (
          <div className="space-y-3">
            {searched.map((order) => {
              const isSender = order.senderName === currentUserName;
              return (
                <div key={order.id} className="border border-border rounded-md p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold">{order.id}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        isSender ? "bg-primary/10 text-primary" : "bg-green-500/10 text-green-600"
                      }`}>
                        {isSender ? "Отправитель" : "Получатель"}
                      </span>
                    </div>
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium">{order.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isSender ? `Кому: ${order.receiverName}` : `От: ${order.senderName}`}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 text-xs">
                    <span className="bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded font-medium">
                      📦 Отправка: {order.fromBranch}
                    </span>
                    <span className="text-muted-foreground">→</span>
                    <span className="bg-green-500/10 text-green-600 px-2 py-0.5 rounded font-medium">
                      📬 Приём: {order.toBranch}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                    <span>⚖ Вес: {order.weight} кг</span>
                    <span>📋 Грузы: {order.cargoList?.length || 0}</span>
                  </div>
                  {order.cargoList && order.cargoList.length > 0 && (
                    <div className="mt-2 bg-muted/50 rounded p-2">
                      <p className="text-[10px] text-muted-foreground font-medium mb-1">Список грузов:</p>
                      {order.cargoList.map((c, i) => (
                        <div key={i} className="text-xs flex justify-between">
                          <span>{c.categoryName}</span>
                          <span className="text-muted-foreground">× {c.quantity}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <OrderTimeline order={order} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
