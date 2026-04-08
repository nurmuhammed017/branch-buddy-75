export function MessageBanner({ message }: { message: { type: "success" | "error"; text: string } | null }) {
  if (!message) return null;
  return (
    <div
      className={`px-4 py-2 rounded-md text-sm font-medium mb-4 ${
        message.type === "success"
          ? "bg-success/10 text-success border border-success/20"
          : "bg-destructive/10 text-destructive border border-destructive/20"
      }`}
    >
      {message.text}
    </div>
  );
}
