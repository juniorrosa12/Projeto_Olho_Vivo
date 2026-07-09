export default function EventTable({ events }) {
  return (
    <div
      style={{
        background: "#1f2937",
        borderRadius: 12,
        padding: 15,
        marginTop: 20,
      }}
    >
      <h3
        style={{
          marginTop: 0,
          marginBottom: 15,
        }}
      >
        Últimos Eventos
      </h3>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          color: "white",
        }}
      >
        <thead>
          <tr>
            <th style={{ padding: 10, textAlign: "left" }}>Evento</th>
            <th style={{ padding: 10, textAlign: "center" }}>Track</th>
            <th style={{ padding: 10, textAlign: "center" }}>Horário</th>
          </tr>
        </thead>

        <tbody>
          {events.map((e) => (
            <tr
              key={e.id}
              style={{
                borderTop: "1px solid #374151",
              }}
            >
              <td style={{ padding: 10 }}>
                {e.event_type}
              </td>

              <td
                style={{
                  padding: 10,
                  textAlign: "center",
                }}
              >
                {e.track_id}
              </td>

              <td
                style={{
                  padding: 10,
                  textAlign: "center",
                }}
              >
                {new Date(e.event_time).toLocaleTimeString("pt-BR")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}