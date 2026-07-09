function Card({ title, value, color }) {
  return (
    <div
      style={{
        background: "#1f2937",
        borderRadius: 12,
        padding: 20,
        borderTop: `5px solid ${color}`,
        boxShadow: "0 8px 20px rgba(0,0,0,.35)",
      }}
    >
      <div
        style={{
          color: "#9ca3af",
          fontSize: 14,
          marginBottom: 10,
          textTransform: "uppercase",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: 38,
          fontWeight: "bold",
          color: "#ffffff",
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default function StatsCards({ stats }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 15,
      }}
    >
      <Card
        title="Pessoas"
        value={stats.people_now}
        color="#22c55e"
      />

      <Card
        title="Entradas"
        value={stats.entries}
        color="#3b82f6"
      />

      <Card
        title="Saídas"
        value={stats.exits}
        color="#ef4444"
      />

      <Card
        title="Eventos"
        value={stats.pending}
        color="#f59e0b"
      />
    </div>
  );
}