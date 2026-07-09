import { useEffect, useState } from "react";
import api from "../api/api";
import StatsCards from "./StatsCards";
import EventTable from "./EventTable";

export default function Dashboard() {

  const [dashboard, setDashboard] = useState({
    people_now: 0,
    entries: 0,
    exits: 0,
    pending: 0,
    last_events: [],
  });

  async function loadDashboard() {
    try {
      const { data } = await api.get("/events/dashboard");
      setDashboard(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadDashboard();
    const timer = setInterval(loadDashboard, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        background: "#111827",
        minHeight: "100vh",
        color: "#fff",
        padding: 24,
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Projeto Olho Vivo</h1>
          <span style={{ color: "#9ca3af" }}>
            FILIAL_027 • CAM01
          </span>
        </div>

        <div
          style={{
            background: "#16a34a",
            padding: "8px 16px",
            borderRadius: 20,
            fontWeight: "bold",
          }}
        >
          IA ONLINE
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "68% 32%",
          gap: 20,
        }}
      >
        <div
          style={{
            background: "#1f2937",
            borderRadius: 12,
            padding: 10,
          }}
        >
          <video
            src="http://192.168.3.77:8000/static/videos/pessoas.mp4"
            autoPlay
            muted
            loop
            controls
            style={{
              width: "100%",
              borderRadius: 8,
            }}
          />
        </div>

        <div>
          <StatsCards stats={dashboard} />
          <div style={{ height: 20 }} />
          <EventTable events={dashboard.last_events} />
        </div>
      </div>
    </div>
  );
}