import { useEffect, useMemo, useState } from "react";
import {
  Chip,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import axios from "axios";

const API = `${window.location.protocol}//${window.location.hostname}:8000`;

const cards = [
  {
    key: "people_now",
    label: "Pessoas Agora",
    color: "success",
  },
  {
    key: "entries",
    label: "Entradas",
    color: "info",
  },
  {
    key: "exits",
    label: "Saídas",
    color: "warning",
  },
  {
    key: "phones",
    label: "Celulares",
    color: "error",
  },
  {
    key: "pending",
    label: "Pendentes",
    color: "warning",
  },
  {
    key: "approved",
    label: "Aprovados",
    color: "success",
  },
  {
    key: "rejected",
    label: "Rejeitados",
    color: "error",
  },
];

export default function StatsGrid() {

  const [data, setData] = useState();

  async function load() {

    const r = await axios.get(`${API}/events/dashboard`);

    setData(r.data);

  }

  useEffect(() => {

    load();

    const timer = setInterval(load, 2000);

    return () => clearInterval(timer);

  }, []);

  const metrics = useMemo(() => {

    if (!data) return [];

    return cards.map(card => ({

      ...card,

      value: data[card.key] ?? 0

    }));

  }, [data]);

  if (!data) return null;

  return (

    <Grid container spacing={2} sx={{ mb:3 }}>

      {metrics.map(metric=>(

        <Grid item xs={12} sm={6} md={4} lg={3} key={metric.key}>

          <Paper
            elevation={4}
            sx={{
              p:3,
              borderRadius:3,
              height:"100%",
              transition:"0.2s",
              "&:hover":{
                transform:"translateY(-3px)"
              }
            }}
          >

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >

              <Typography
                variant="subtitle2"
                color="text.secondary"
              >

                {metric.label}

              </Typography>

              <Chip
                label="LIVE"
                color={metric.color}
                size="small"
              />

            </Stack>

            <Typography
              mt={2}
              variant="h3"
              fontWeight={700}
            >

              {metric.value}

            </Typography>

          </Paper>

        </Grid>

      ))}

    </Grid>

  );

}
