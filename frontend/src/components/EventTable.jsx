export default function EventTable({ events }) {
  return (
    <div
      style={{
        marginTop: 20,
        background: "#1f2937",
        borderRadius: 12,
        padding: 15,
      }}
    >
      <h3
        style={{
          margin: 0,
          marginBottom: 15,
          color: "#fff",
        }}
      >
        Últimos Eventos
      </h3>

      <table
        style={{
          width: "100%",
          color: "#fff",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th>Evento</th>
            <th>ID</th>
            <th>Horário</th>
          </tr>
        </thead>

        <tbody>
          {events.map((e) => (
            <tr key={e.id}>
              <td>{e.event_type}</td>
              <td>{e.track_id}</td>
              <td>
                {new Date(e.event_time).toLocaleTimeString("pt-BR")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}