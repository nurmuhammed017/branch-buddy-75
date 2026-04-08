export type UserRole = "user" | "worker" | "admin";

export interface AppUser {
  username: string;
  password: string;
  role: UserRole;
  displayName: string;
  branch?: string;
}

export const USERS_DB: AppUser[] = [
  { username: "user1", password: "user123", role: "user", displayName: "Иван Петров" },
  { username: "user2", password: "user123", role: "user", displayName: "Мария Иванова" },
  { username: "workerA", password: "worker123", role: "worker", displayName: "Работник Branch A", branch: "Branch A" },
  { username: "workerB", password: "worker123", role: "worker", displayName: "Работник Branch B", branch: "Branch B" },
  { username: "workerC", password: "worker123", role: "worker", displayName: "Работник Branch C", branch: "Branch C" },
  { username: "workerD", password: "worker123", role: "worker", displayName: "Работник Branch D", branch: "Branch D" },
  { username: "workerE", password: "worker123", role: "worker", displayName: "Работник Branch E", branch: "Branch E" },
  { username: "admin1", password: "admin123", role: "admin", displayName: "Администратор" },
];

export function authenticate(username: string, password: string): AppUser | null {
  return USERS_DB.find(u => u.username === username && u.password === password) || null;
}
