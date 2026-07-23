import { useEffect, useState } from "react";
import { Paper, Stack, Typography } from "@mui/material";
import axios from "axios";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const API = `${window.location.protocol}//${window.location.hostname}:8000`;

export default function Timeline() {
  const [data, setData] = useState([]);

  async function load() {
    const r = await axios.get(`${API}/statistics/hour`);
    setData(
      r.data.map((item) => ({
        hora: String(item.hour).padStart(2, "0"),
        entradas: item.entries,
        saidas: item.exits,
      }))
    );
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" mb={2}>
        <Typography variant="h6" fontWeight={700}>
          Fluxo de pessoas por hora
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Atualização em tempo real
        </Typography>
      </Stack>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid stroke="#e5e7eb" />
          <XAxis dataKey="hora" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="entradas" stroke="#16a34a" strokeWidth={3} />
          <Line type="monotone" dataKey="saidas" stroke="#dc2626" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
}

