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
        background: "#181a20",
        minHeight: "100vh",
        color: "white",
        padding: 20,
        fontFamily: "Arial",
      }}
    >

      <h1
        style={{
          textAlign: "center",
          marginBottom: 20,
        }}
      >
        PROJETO OLHO VIVO
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "60% 40%",
          gap: 20,
        }}
      >

        <video
          src="http://192.168.3.77:8000/static/pessoas.mp4"
          autoPlay
          muted
          loop
          controls
          style={{
            width: "100%",
            borderRadius: 10,
            background: "#000",
          }}
        />

        <div>

          <StatsCards stats={dashboard} />

          <EventTable
            events={dashboard.last_events}
          />

        </div>

      </div>

    </div>

  );

}