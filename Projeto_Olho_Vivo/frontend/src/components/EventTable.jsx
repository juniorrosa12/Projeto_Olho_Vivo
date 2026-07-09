export default function EventTable({ events }) {
  return (
    <table
      style={{
        width: "100%",
        background: "#23252d",
        borderCollapse: "collapse",
        color: "white",
        borderRadius: 10,
        overflow: "hidden",
      }}
    >
      <thead>
        <tr style={{ background: "#2f333d" }}>
          <th style={{ padding: 10 }}>Evento</th>
          <th style={{ padding: 10 }}>Track</th>
          <th style={{ padding: 10 }}>Data</th>
        </tr>
      </thead>

      <tbody>
        {events.map((e) => (
          <tr
            key={e.id}
            style={{
              background:
                e.event_type === "person_enter"
                  ? "#17381d"
                  : "#3b1d1d",
            }}
          >
            <td style={{ padding: 8 }}>{e.event_type}</td>
            <td style={{ padding: 8 }}>{e.track_id}</td>
            <td style={{ padding: 8 }}>
              {new Date(e.event_time).toLocaleString("pt-BR")}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}