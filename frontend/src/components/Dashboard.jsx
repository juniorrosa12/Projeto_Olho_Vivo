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

    const imgTimer = setInterval(() => {

      const img = document.getElementById("camera");

      if (img) {

        img.src =
          `${window.location.protocol}//${window.location.hostname}:8000/static/output/latest.jpg?t=` +
          new Date().getTime();

      }

    }, 300);

    return () => {

      clearInterval(timer);

      clearInterval(imgTimer);

    };

  }, []);

  return (

    <div
      style={{
        background: "#111827",
        minHeight: "100vh",
        color: "white",
        padding: 25,
        fontFamily: "Arial",
      }}
    >

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >

        <div>

          <h1>Projeto Olho Vivo</h1>

          <span>FILIAL_027 • CAM01</span>

        </div>

        <div
          style={{
            background: "#16a34a",
            padding: "10px 18px",
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

        <div>

          <img
            id="camera"
            alt=""
            src={`${window.location.protocol}//${window.location.hostname}:8000/static/output/latest.jpg`}
            style={{
              width: "100%",
              borderRadius: 12,
              background: "#000",
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
