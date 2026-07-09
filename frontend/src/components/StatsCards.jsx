function Card({ title, value, color }) {
  return (
    <div
      style={{
        background: "#23252d",
        borderLeft: `8px solid ${color}`,
        borderRadius: 10,
        padding: 20,
        color: "white",
        boxShadow: "0 0 10px rgba(0,0,0,.3)"
      }}
    >
      <div style={{ fontSize: 18 }}>{title}</div>

      <div
        style={{
          fontSize: 42,
          fontWeight: "bold",
          marginTop: 15
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
        marginBottom: 20
      }}
    >
      <Card title="Pessoas" value={stats.people_now} color="#00d26a" />
      <Card title="Entradas" value={stats.entries} color="#0094ff" />
      <Card title="Saídas" value={stats.exits} color="#ff4444" />
      <Card title="Pendentes" value={stats.pending} color="#ffb300" />
    </div>
  );
}