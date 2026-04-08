import { useOrders } from "@/hooks/useOrders";
import { useAuth } from "@/hooks/useAuth";
import { UserPanel } from "@/components/UserPanel";
import { WorkerPanel } from "@/components/WorkerPanel";
import { AdminPanel } from "@/components/AdminPanel";
import { MessageBanner } from "@/components/MessageBanner";
import { LoginPage } from "@/components/LoginPage";

const ROLE_LABELS = {
  user: "Пользователь",
  worker: "Branch Worker",
  admin: "Администратор",
};

export default function Index() {
  const { currentUser, logout } = useAuth();
  const { orders, source, message, createOrder, transitionOrder } = useOrders();

  if (!currentUser) return <LoginPage />;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">C2C Branch Delivery</h1>
            <p className="text-xs text-muted-foreground">Resilient Logistics System</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md">
              Loaded from {source} · {orders.length} orders
            </span>
            <div className="flex items-center gap-2 border-l border-border pl-3">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{currentUser.displayName}</p>
                <p className="text-xs text-muted-foreground">{ROLE_LABELS[currentUser.role]}</p>
              </div>
              <button
                onClick={logout}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <MessageBanner message={message} />

        {currentUser.role === "user" && (
          <UserPanel orders={orders} onCreateOrder={createOrder} currentUserName={currentUser.displayName} />
        )}
        {currentUser.role === "worker" && (
          <WorkerPanel orders={orders} onTransition={transitionOrder} workerBranch={currentUser.branch || ""} />
        )}
        {currentUser.role === "admin" && (
          <AdminPanel orders={orders} />
        )}
      </div>
    </div>
  );
}
