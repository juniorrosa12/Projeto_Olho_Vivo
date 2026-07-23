import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  TextField,
  Stack,
  Button,
} from "@mui/material";

const API = `${window.location.protocol}//${window.location.hostname}:8000`;

export default function Events() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch(`${API}/events`);
        const j = await r.json();
        setEvents(Array.isArray(j) ? j : []);
      } catch {
        setEvents([]);
      }
    };

    load();

    const timer = setInterval(load, 2000);

    return () => clearInterval(timer);
  }, []);

  const filtered = events.filter((e) =>
    JSON.stringify(e).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box p={3}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">
          Eventos
        </Typography>

        <Button variant="contained">
          Atualizar
        </Button>
      </Stack>

      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          label="Pesquisar evento"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Paper>

      <Paper sx={{ overflow: "auto" }}>
        <Table>

          <TableHead>

            <TableRow>
              <TableCell>Data/Hora</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Câmera</TableCell>
              <TableCell>Filial</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>

          </TableHead>

          <TableBody>

            {filtered.map((e, i) => (
              <TableRow key={i} hover>

                <TableCell>
                  {e.timestamp || "-"}
                </TableCell>

                <TableCell>
                  {e.type || "-"}
                </TableCell>

                <TableCell>
                  {e.camera || "CAM01"}
                </TableCell>

                <TableCell>
                  {e.branch || "FILIAL_027"}
                </TableCell>

                <TableCell>

                  <Chip
                    color="success"
                    label={e.status || "Registrado"}
                  />

                </TableCell>

              </TableRow>
            ))}

          </TableBody>

        </Table>
      </Paper>
    </Box>
  );
}
