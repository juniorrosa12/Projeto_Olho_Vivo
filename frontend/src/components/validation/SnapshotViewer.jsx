import { Box, Paper, Typography } from "@mui/material";

export default function SnapshotViewer({ src, alt = "snapshot do evento" }) {
  if (!src) {
    return null;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
        <Typography variant="subtitle1" fontWeight={700}>
          Snapshot
        </Typography>
      </Box>
      <Box sx={{ p: 2, display: "flex", justifyContent: "center", bgcolor: "grey.900" }}>
        <Box
          component="img"
          src={src}
          alt={alt}
          sx={{
            width: "100%",
            maxWidth: 960,
            height: "auto",
            objectFit: "contain",
            borderRadius: 2,
          }}
        />
      </Box>
    </Paper>
  );
}
