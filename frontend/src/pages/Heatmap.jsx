import { useEffect, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";

const API = `${window.location.protocol}//${window.location.hostname}:8000`;

export default function Heatmap() {
  const [heatmap, setHeatmap] = useState("");
  const [camera, setCamera] = useState("");

  useEffect(() => {

    function refresh() {
      const t = Date.now();

      setHeatmap(`${API}/static/output/heatmap/latest.png?t=${t}`);
      setCamera(`${API}/static/output/latest.jpg?t=${t}`);
    }

    refresh();

    const timer = setInterval(refresh, 1000);

    return () => clearInterval(timer);

  }, []);

  return (
    <Box p={3}>

      <Typography variant="h4" mb={3}>
        Heatmap em Tempo Real
      </Typography>

      <Paper
        sx={{
          p:2,
          borderRadius:3,
          background:"#111"
        }}
      >

        <Box
          sx={{
            position:"relative",
            width:"100%",
            overflow:"hidden",
            borderRadius:2
          }}
        >

          <img
            src={camera}
            alt=""
            style={{
              width:"100%",
              display:"block"
            }}
          />

          <img
            src={heatmap}
            alt=""
            style={{
              position:"absolute",
              inset:0,
              width:"100%",
              opacity:.65,
              mixBlendMode:"screen"
            }}
          />

        </Box>

      </Paper>

    </Box>
  );
}
