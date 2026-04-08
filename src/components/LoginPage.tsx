import { useState } from "react";
import { authenticate, USERS_DB } from "@/data/users";
import { useAuth } from "@/hooks/useAuth";

export function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = authenticate(username, password);
    if (user) {
      login(user);
      setError("");
    } else {
      setError("Неверный логин или пароль");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">C2C Branch Delivery</h1>
          <p className="text-sm text-muted-foreground mt-1">Войдите в систему</p>
        </div>

        <form onSubmit={handleLogin} className="bg-card border border-border rounded-lg p-6 space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive border border-destructive/20 px-3 py-2 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Логин</label>
            <input
              className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Введите логин"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Пароль</label>
            <input
              type="password"
              className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Войти
          </button>
        </form>

        <div className="mt-6 bg-muted rounded-lg p-4">
          <p className="text-xs font-medium text-muted-foreground mb-2">Тестовые аккаунты:</p>
          <div className="space-y-1">
            {USERS_DB.map((u) => (
              <div key={u.username} className="flex justify-between text-xs">
                <span className="text-foreground font-mono">{u.username} / {u.password}</span>
                <span className="text-muted-foreground capitalize">{u.role === "worker" ? "Branch Worker" : u.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
